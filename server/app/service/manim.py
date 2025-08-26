import subprocess
import uuid
import re
import os
import shutil
import base64
from pathlib import Path
from typing import Tuple
from contextlib import contextmanager


class ManimGenerationError(Exception):
    """Custom exception for Manim generation errors"""
    pass

class ManimService:
    def __init__(self, scripts_dir: Path, docker_image: str = "manimcommunity/manim"):
        self.scripts_dir = Path(scripts_dir)
        self.docker_image = docker_image
        self.scripts_dir.mkdir(parents=True, exist_ok=True)

    def extract_code_from_response(self, response_text: str) -> str:
        patterns = [
            r"```python(.*?)```",
            r"```(.*?)```",
        ]

        for pattern in patterns:
            match = re.search(pattern, response_text, re.DOTALL)
            if match:
                code = match.group(1).strip()
                if code and "class" in code and "Scene" in code:  # Basic validation
                    return code

        # If no code blocks found, try to extract class definition
        if "class" in response_text and "Scene" in response_text:
            return response_text.strip()

        raise ManimGenerationError("No valid Python/Manim code found in LLM response")

    def extract_scene_name(self, code: str) -> str:
        """Extract scene class name from Manim code"""
        pattern = r"class\s+(\w+)\s*\([^)]*Scene[^)]*\)"
        match = re.search(pattern, code)
        if match:
            return match.group(1)

        fallback_patterns = [
            r"class\s+(\w+)\s*\(",
            r"def\s+construct\s*\(",
        ]

        for pattern in fallback_patterns:
            match = re.search(pattern, code)
            if match and pattern == fallback_patterns[0]:
                return match.group(1)

        return "Main"

    @contextmanager
    def temporary_script(self, code: str):
        script_id = str(uuid.uuid4())[:8]
        script_filename = f"generated_code_{script_id}.py"
        script_path = self.scripts_dir / script_filename

        try:
            with open(script_path, "w", encoding="utf-8") as file:
                file.write(code)
            yield script_path, script_filename

        finally:
            # Cleanup script file
            if script_path.exists():
                try:
                    script_path.unlink()
                except Exception as e:
                    print(f"Warning: Failed to delete temporary script file {script_path}: {e}")

    def run_manim_docker(self, script_filename: str, scene_name: str, timeout: int = 300) -> subprocess.CompletedProcess:
        docker_command = [
            "docker", "run", "--rm",
            "-v", f"{self.scripts_dir}:/manim",
            self.docker_image,
            "manim", "-qm", script_filename, scene_name
        ]
        try:
            result = subprocess.run(
                docker_command,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=str(self.scripts_dir)
            )

            print(f"Docker command stdout: {result.stdout}")
            print(f"Docker command stderr: {result.stderr}")

            if result.returncode != 0:
                error_msg = f"Docker command failed with return code {result.returncode}"
                if result.stderr:
                    error_msg += f"\nStderr: {result.stderr}"
                if result.stdout:
                    error_msg += f"\nStdout: {result.stdout}"
                raise ManimGenerationError(error_msg)
            return result
        except subprocess.TimeoutExpired as e:
            raise ManimGenerationError(f"Docker command timed out after {timeout} seconds") from e
        except FileNotFoundError as e:
            raise ManimGenerationError("Docker is not installed or not in PATH") from e

    def find_generated_video(self, script_filename: str, scene_name: str) -> Path:
        base_name = script_filename.replace('.py', '')
        quality_dirs = ["720p30", "1080p60", "480p15", "1440p60", "2160p60"]

        for quality in quality_dirs:
            video_path = (self.scripts_dir / "media" / "videos" /
                         base_name / quality / f"{scene_name}.mp4")
            if video_path.exists():
                return video_path

        media_dir = self.scripts_dir / "media" / "videos" / base_name
        if media_dir.exists():
            available_files = list(media_dir.rglob("*.mp4"))
            print(f"Available video files in {media_dir}: {[str(f) for f in available_files]}")

        raise ManimGenerationError(f"Generated video not found for scene '{scene_name}'")

    def cleanup_media_files(self, script_filename: str) -> None:
        """Clean up generated media files"""
        try:
            base_name = script_filename.replace('.py', '')
            media_dir = self.scripts_dir / "media" / "videos" / base_name

            if media_dir.exists():
                shutil.rmtree(media_dir)
        except Exception as e:
            print(f"Warning: Failed to delete media directory {media_dir}: {e}")

    def generate_video(self, llm_code_response: str, timeout: int = 300) -> Tuple[str, bytes, float]:
        try:
            # Extract and validate code
            code = self.extract_code_from_response(llm_code_response)
            scene_name = self.extract_scene_name(code)

            with self.temporary_script(code) as (script_path, script_filename):
                try:
                    self.run_manim_docker(script_filename, scene_name, timeout)
                    video_path = self.find_generated_video(script_filename, scene_name)
                    file_size = video_path.stat().st_size
                    size_mb = file_size / (1024 * 1024)
                    if size_mb > 10.0:
                        raise ManimGenerationError(
                            f"Generated video is too large: {size_mb:.2f}MB > {10.0}MB"
                        )
                    with open(video_path, 'rb') as video_file:
                        video_bytes = video_file.read()
                        video_b64 = base64.b64encode(video_bytes).decode('utf-8')
                    result = subprocess.run([
                            'ffprobe', '-v', 'quiet', '-show_entries',
                            'format=duration', '-of', 'csv=p=0', str(video_path)
                        ], capture_output=True, text=True)
                    duration = float(result.stdout.strip())
                    return video_b64, video_bytes, duration
                finally:
                    self.cleanup_media_files(script_filename)

        except Exception as e:
            raise ManimGenerationError(f"Video generation failed: {str(e)}") from e
