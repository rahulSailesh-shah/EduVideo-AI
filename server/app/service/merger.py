import uuid
import boto3
import os
import tempfile
import cv2
import subprocess
from urllib.parse import urlparse
from botocore.exceptions import NoCredentialsError, ClientError
from app.core.config import settings

class VideoAudioMerger:
    @staticmethod
    def check_ffmpeg_installation():
        try:
            subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
            subprocess.run(['ffprobe', '-version'], capture_output=True, check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False

    @staticmethod
    def _parse_s3_url(s3_video_url):
        parsed_url = urlparse(s3_video_url)
        if '.s3.amazonaws.com' in parsed_url.netloc:
            bucket_name = parsed_url.netloc.split('.s3.amazonaws.com')[0]
            s3_key = parsed_url.path.lstrip('/')
        elif 's3.amazonaws.com' in parsed_url.netloc:
            path_parts = parsed_url.path.lstrip('/').split('/', 1)
            if len(path_parts) < 2:
                raise ValueError("Invalid S3 URL format")
            bucket_name = path_parts[0]
            s3_key = path_parts[1]
        else:
            raise ValueError("Invalid S3 URL format. Expected: https://bucket-name.s3.amazonaws.com/path/to/file")
        if not bucket_name or not s3_key:
            raise ValueError("Could not extract bucket name and key from S3 URL")
        return bucket_name, s3_key

    @staticmethod
    def _get_audio_duration(audio_file_path):
        """Get the duration of an audio file using ffprobe."""
        audio_info_cmd = [
            'ffprobe', '-v', 'quiet', '-print_format', 'json',
            '-show_entries', 'format=duration', audio_file_path
        ]
        try:
            result = subprocess.run(audio_info_cmd, capture_output=True, text=True, check=True)
            import json
            data = json.loads(result.stdout)
            return float(data['format']['duration'])
        except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError):
            raise Exception(f"Could not determine duration of audio file: {audio_file_path}")

    @classmethod
    def merge_video_with_audio(cls, s3_video_url, audio_file_path, output_path=None):
        if not os.path.exists(audio_file_path):
            raise FileNotFoundError(f"Audio file not found: {audio_file_path}")
        if not s3_video_url.startswith('https://'):
            raise ValueError("S3 URL must start with 'https://'")
        if not cls.check_ffmpeg_installation():
            raise FileNotFoundError("FFmpeg or FFprobe not found. Please install FFmpeg on your system.")

        bucket_name, s3_key = cls._parse_s3_url(s3_video_url)
        if output_path is None:
            output_path = f"video_{uuid.uuid4().hex[:8]}.mp4"

        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.s3_access_key_id,
            aws_secret_access_key=settings.s3_secret_access_key,
            region_name=settings.s3_region,
        )

        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
            temp_video_path = temp_video.name

        try:
            s3_client.download_file(bucket_name, s3_key, temp_video_path)

            cap = cv2.VideoCapture(temp_video_path)
            if not cap.isOpened():
                raise Exception("Failed to open downloaded video file")
            fps = cap.get(cv2.CAP_PROP_FPS)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            video_duration = total_frames / fps if fps > 0 else 0
            cap.release()

            audio_info_cmd = ['ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_streams', audio_file_path]
            try:
                subprocess.run(audio_info_cmd, capture_output=True, text=True, check=True)
            except subprocess.CalledProcessError:
                raise Exception(f"Invalid audio file: {audio_file_path}")

            audio_duration = cls._get_audio_duration(audio_file_path)

            final_duration = max(video_duration, audio_duration)

            if audio_duration > video_duration:
                ffmpeg_cmd = [
                    'ffmpeg',
                    '-i', temp_video_path,
                    '-i', audio_file_path,
                    '-filter_complex',
                    f'[0:v]tpad=stop_mode=clone:stop_duration={audio_duration - video_duration}[extended_video];'
                    f'[extended_video]fps={fps}[final_video]',
                    '-map', '[final_video]',
                    '-map', '1:a',
                    '-c:v', 'libx264',
                    '-c:a', 'aac',
                    '-b:a', '128k',
                    '-ar', '44100',
                    '-ac', '2',
                    '-t', str(audio_duration),
                    '-avoid_negative_ts', 'make_zero',
                    '-fflags', '+genpts',
                    '-y',
                    output_path
                ]
            else:
                ffmpeg_cmd = [
                    'ffmpeg',
                    '-i', temp_video_path,
                    '-i', audio_file_path,
                    '-c:v', 'copy',
                    '-c:a', 'aac',
                    '-b:a', '128k',
                    '-ar', '44100',
                    '-ac', '2',
                    '-filter_complex', '[1:a]apad[padded_audio]',
                    '-map', '0:v',
                    '-map', '[padded_audio]',
                    '-t', str(video_duration),
                    '-avoid_negative_ts', 'make_zero',
                    '-fflags', '+genpts',
                    '-y',
                    output_path
                ]

            result = subprocess.run(
                ffmpeg_cmd,
                capture_output=True,
                text=True,
                check=True
            )

            return output_path

        except NoCredentialsError:
            raise NoCredentialsError("AWS credentials not found. Please configure your credentials.")
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'NoSuchBucket':
                raise ClientError(f"S3 bucket '{bucket_name}' does not exist.", e.operation_name)
            elif error_code == 'NoSuchKey':
                raise ClientError(f"S3 object '{s3_key}' does not exist in bucket '{bucket_name}'.", e.operation_name)
            else:
                raise e
        except subprocess.CalledProcessError as e:
            raise Exception(f"FFmpeg error: {e.stderr}")
        except Exception as e:
            raise Exception(f"Error during video processing: {str(e)}")
        finally:
            if os.path.exists(temp_video_path):
                os.unlink(temp_video_path)
