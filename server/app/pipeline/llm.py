import uuid
from openai import OpenAI
from typing import List, Dict
from pathlib import Path
from google import genai
from google.genai import types
import wave
from app.core.config import settings
import re


def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
   with wave.open(filename, "wb") as wf:
      wf.setnchannels(channels)
      wf.setsampwidth(sample_width)
      wf.setframerate(rate)
      wf.writeframes(pcm)




class LLMGenerationError(Exception):
    """Custom exception for LLM generation errors"""
    pass

class PromptSession:
    def __init__(self, history: List[Dict[str, str]] = None):
        self.history: List[Dict[str, str]] = history or []

    def add_prompt(self, prompt: str):
        self.history.append({"role": "user", "content": prompt})

    def add_response(self, response: str):
        self.history.append({"role": "assistant", "content": response})

    def get_chat_history(self):
        preamble = [
            {
                "role": "system",
                "content": (
                    "You are a Manim code generator that ALWAYS generates Python code for mathematical visualizations. "
                    "Your ONLY job is to create Manim animations - never provide text explanations or theoretical discussions.\n\n"

                    "CRITICAL RULES:\n"
                    "- ALWAYS generate Manim code, regardless of how the user phrases their request\n"
                    "- If user asks to 'explain' a concept, generate code that visually explains it\n"
                    "- If user asks about theory, generate code that demonstrates the theory\n"
                    "- If user asks questions, generate code that answers through animation\n"
                    "- Never write explanatory text about mathematical concepts\n"
                    "- Never say 'I cannot generate code for this'\n\n"

                    "SIZING AND LAYOUT REQUIREMENTS:\n"
                    "- ALWAYS ensure all objects fit within the screen boundaries\n"
                    "- Use appropriate scaling for all shapes, text, and mathematical objects\n"
                    "- Center objects using ORIGIN or positioning methods like .move_to(ORIGIN)\n"
                    "- For multiple objects, use proper spacing with methods like .arrange(), .next_to(), or manual positioning\n"
                    "- Prevent overlaps by using adequate spacing between objects (minimum 1 unit apart)\n"
                    "- Scale large objects down using .scale() method (typical range: 0.5 to 1.5)\n"
                    "- For text, use reasonable font sizes and position them clearly\n"
                    "- For axes and graphs, use appropriate ranges that fit the screen\n"
                    "- Group related objects using VGroup() and position groups as units\n"
                    "- Use config.frame_width and config.frame_height awareness (typically 14.22 x 8 units)\n\n"

                    "LAYOUT BEST PRACTICES:\n"
                    "- Single objects: Center at ORIGIN\n"
                    "- Multiple objects: Use .arrange(RIGHT/DOWN/etc, buff=1.0) for spacing\n"
                    "- Text labels: Position using .next_to(object, direction, buff=0.3)\n"
                    "- Axes: Use reasonable x_range and y_range (e.g., [-5, 5] max)\n"
                    "- Shapes: Default size is often too large, scale to 0.7-1.2 range\n"
                    "- Complex scenes: Divide screen into logical sections\n\n"

                    "OUTPUT FORMAT:\n"
                    "1. Return valid Python 3 Manim code wrapped in triple backticks (```python)\n"
                    "2. Class name must always be 'Main'\n"
                    "3. Include a brief summary of what the animation shows in triple backticks (```text)\n"
                    "4. Do not explain the code itself or provide mathematical theory\n\n"

                    "EXAMPLES OF REQUEST INTERPRETATION:\n"
                    "- 'Explain integration' → Generate code showing area under curve calculation\n"
                    "- 'What is a derivative?' → Generate code showing tangent line and slope\n"
                    "- 'How does matrix multiplication work?' → Generate code visualizing matrix operations\n"
                    "- 'Tell me about limits' → Generate code showing function approaching a limit\n"
                    "- 'What is the Pythagorean theorem?' → Generate code showing triangle with squares on sides\n\n"

                    "Always think: 'How can I show this concept visually using Manim with proper sizing and layout?' then generate the appropriate code."
                )
            },
            {
                "role": "user",
                "content": "Draw a red triangle and rotate it 90 degrees"
            },
            {
                "role": "assistant",
                "content": (
                    "```python\n"
                    "from manim import *\n\n"
                    "class Main(Scene):\n"
                    "    def construct(self):\n"
                    "        triangle = Triangle(color=RED).scale(1.5).move_to(ORIGIN)\n"
                    "        self.play(Create(triangle))\n"
                    "        self.play(Rotate(triangle, angle=PI/2))\n"
                    "        self.wait()\n"
                    "```\n"
                    "```text\n"
                    "This code creates a properly sized red triangle centered on screen and rotates it 90 degrees clockwise.\n"
                    "```"
                )
            },
            {
                "role": "user",
                "content": "Transform a circle to a square"
            },
            {
                "role": "assistant",
                "content": (
                    "```python\n"
                    "from manim import *\n\n"
                    "class Main(Scene):\n"
                    "    def construct(self):\n"
                    "        circle = Circle(color=BLUE, radius=1.5).move_to(ORIGIN)\n"
                    "        square = Square(color=BLUE, side_length=3).move_to(ORIGIN)\n"
                    "        self.play(Create(circle))\n"
                    "        self.wait(1)\n"
                    "        self.play(Transform(circle, square))\n"
                    "        self.wait(2)\n"
                    "```\n"
                    "```text\n"
                    "This code transforms a properly sized blue circle into a blue square, both centered on screen.\n"
                    "```"
                )
            },
            {
                "role": "user",
                "content": "Explain integration"
            },
            {
                "role": "assistant",
                "content": (
                    "```python\n"
                    "from manim import *\n\n"
                    "class Main(Scene):\n"
                    "    def construct(self):\n"
                    "        axes = Axes(\n"
                    "            x_range=[-0.5, 3, 1], \n"
                    "            y_range=[-0.5, 4, 1],\n"
                    "            x_length=6,\n"
                    "            y_length=4\n"
                    "        ).move_to(ORIGIN)\n"
                    "        \n"
                    "        func = axes.plot(lambda x: x**2, color=BLUE, x_range=[0, 2])\n"
                    "        area = axes.get_area(func, x_range=[0, 2], color=YELLOW, opacity=0.5)\n"
                    "        \n"
                    "        title = Text('Integration: Area Under Curve', font_size=24).to_edge(UP, buff=0.5)\n"
                    "        \n"
                    "        self.play(Create(title))\n"
                    "        self.play(Create(axes))\n"
                    "        self.play(Create(func))\n"
                    "        self.play(FadeIn(area))\n"
                    "        \n"
                    "        # Show Riemann rectangles with proper sizing\n"
                    "        rectangles = axes.get_riemann_rectangles(\n"
                    "            func, x_range=[0, 2], dx=0.4, color=RED, opacity=0.3\n"
                    "        )\n"
                    "        self.play(Create(rectangles))\n"
                    "        self.wait(2)\n"
                    "```\n"
                    "```text\n"
                    "This code visualizes integration as the area under a curve with proper screen layout, showing both the exact area and Riemann rectangle approximation.\n"
                    "```"
                )
            }
        ]
        return preamble + self.history


class LLMService:
    def __init__(self, api_key: str, base_url: str = settings.llm_base_url, model: str = "gemini-2.5-flash"):
        self.api_key = api_key
        self.base_url = base_url
        self.model = model
        self.client = OpenAI(api_key=api_key, base_url=base_url)
        self.gemini_client = genai.Client(api_key=api_key)

    def estimate_video_duration(self, code: str) -> float:
        duration = 0.0

        # Find all wait() calls
        wait_pattern = r'self\.wait\((\d*\.?\d*)\)'
        waits = re.findall(wait_pattern, code)
        for wait_time in waits:
            if wait_time:
                duration += float(wait_time)
            else:
                duration += 1.0  # Default wait time

        # Find all animations with run_time
        runtime_pattern = r'run_time=(\d*\.?\d*)'
        runtimes = re.findall(runtime_pattern, code)
        for runtime in runtimes:
            duration += float(runtime)

        # Count animations without explicit run_time (default 1 second each)
        animation_patterns = [
            r'self\.play\([^)]+\)',
            r'Create\(',
            r'Write\(',
            r'FadeIn\(',
            r'FadeOut\(',
            r'Transform\(',
        ]

        total_animations = 0
        for pattern in animation_patterns:
            # Count non-overlapping matches
            matches = len(re.findall(pattern, code))
            total_animations += matches

        # Subtract animations that already have run_time specified
        animations_with_runtime = len(runtimes)
        default_animations = total_animations - animations_with_runtime
        duration += default_animations * 0.5
        # Add buffer for complex scenes
        if 'MathTex' in code or 'Text' in code:
            duration += 2.0

        return max(duration, 10.0)  # Minimum 10 seconds

    def generate_speech_from_text(self, text: str):
        response = self.gemini_client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name='Kore',
                        )
                    )
                ),
            )
        )

        data = response.candidates[0].content.parts[0].inline_data.data

        file_name =  f"out_{uuid.uuid4().hex[:8]}.wav"
        Path('audios').mkdir(parents=True, exist_ok=True)
        wave_file(f"audios/{file_name}", data)

        return file_name

    def generate_script_from_code(self, code: str, mode: str = "compact") -> str:
        try:
            if mode not in ["compact", "detailed"]:
                raise ValueError("Mode must be either 'compact' or 'detailed'")

            system_content = self._get_system_prompt(mode, code)

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": system_content
                    },
                    {
                        "role": "user",
                        "content": code
                    }
                ],
                temperature=0.3,
            )

            if not response.choices:
                raise LLMGenerationError("No response from model")

            assistant_reply = response.choices[0].message.content
            if not assistant_reply:
                raise LLMGenerationError("Empty response from model")

            return assistant_reply

        except Exception as e:
            raise LLMGenerationError(f"Failed to generate script: {str(e)}") from e

    def _get_system_prompt(self, mode: str, code: str) -> str:
        """Generate appropriate system prompt based on user selection."""

        base_instructions = (
            "You are a video narration assistant for Manim-generated animations. "
            "Given a Manim Python script, generate a clear, human-friendly narration script "
            "that explains the concept being demonstrated, not the code itself. "
            "The narration should sound natural, informative, and engaging, as if explaining to a general audience. "
            "Focus on the mathematical or scientific concept, not technical implementation details. "
            "Avoid code-related jargon and keep the language accessible. "
            "Wrap the narration in triple backticks (```text)."
        )

        if mode == "compact":
            target_duration = self.estimate_video_duration(code)
            words_per_minute = 110
            target_words = int((target_duration / 60) * words_per_minute)

            return (
                f"{base_instructions} "
                f"TIMING CONSTRAINT: Write approximately {target_words} words to match a {target_duration:.1f} second video. "
                "Keep the explanation concise and well-paced to align with the visual progression. "
                "Prioritize the most essential points that can be effectively communicated within the time limit. "
                "Ensure smooth transitions between concepts to maintain engagement throughout the duration."
            )

        elif mode == "detailed":
            return (
                f"{base_instructions} "
                "DEPTH REQUIREMENT: Provide a comprehensive explanation of the concept. "
                "Include step-by-step reasoning, and practical applications where appropriate. "
                "Take time to explain underlying principles and help viewers develop a thorough understanding. "
                "Use examples and analogies to make complex concepts more relatable. "
                "Structure the explanation logically, building from basic concepts to more advanced ideas."
            )

    def generate_manim_code(self, prompt: str, session: PromptSession) -> str:
        try:
            session.add_prompt(prompt)

            response = self.client.chat.completions.create(
                model=self.model,
                messages=session.get_chat_history(),
                temperature=0.3,
            )

            if not response.choices:
                raise LLMGenerationError("No response from model")

            assistant_reply = response.choices[0].message.content
            if not assistant_reply:
                raise LLMGenerationError("Empty response from model")

            session.add_response(assistant_reply)
            return assistant_reply

        except Exception as e:
            raise LLMGenerationError(f"Failed to generate code: {str(e)}") from e
