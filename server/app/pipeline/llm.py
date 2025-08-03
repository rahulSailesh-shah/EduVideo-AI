import uuid
from openai import OpenAI
from typing import List, Dict
from pathlib import Path
from google import genai
from google.genai import types
import wave
from app.core.config import settings


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
                    "You are a Manim code generator. Given a prompt, return valid Python 3 code."
                    "wrapped in triple backticks (```python). Do not explain the code."
                    "The name of the class should be always Main."
                    "Summarize the generated code in one or two sentences explaining its functionality. Wrap the summary in triple backticks (```text)."
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
                    "        triangle = Triangle(color=RED)\n"
                    "        self.play(Create(triangle))\n"
                    "        self.play(Rotate(triangle, angle=PI/2))\n"
                    "        self.wait()\n"
                    "```"
                    "```text\n"
                    "This code creates a red triangle and rotates it 90 degrees.\n"
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
                    "        circle = Circle(color=BLUE)\n"
                    "        square = Square(color=BLUE)\n"
                    "        self.play(Create(circle))\n"
                    "        self.wait(1)\n"
                    "        self.play(Transform(circle, square))\n"
                    "        self.wait(2)\n"
                    "```"
                    "```text\n"
                    "This code transforms a blue circle into a blue square.\n"
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

    def generate_script_from_code(self, code: str) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                      "role": "system",
                      "content": (
                        "You are a video narration assistant for Manim-generated animations. "
                        "Given a Manim Python script, generate a clear, human-friendly narration script "
                        "You need not explain what is happening in the code/animation, but rather explain the concept. "
                        "For example, if the code is about a pythagorean theorem, you would explain the theorem in simple terms. "
                        "The narration should sound natural, informative, and engaging, as if explaining to a general audience. "
                        "Keep the narration concise and to the point, focused on the visual elements. Do not include any technical jargon or code-related terms. "
                        "Wrap the narration in triple backticks (```text)."
                      )
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
