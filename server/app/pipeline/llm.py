from openai import OpenAI
from typing import List, Dict

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
    def __init__(self, api_key: str, base_url: str = "https://generativelanguage.googleapis.com/v1beta/openai/", model: str = "gemini-2.5-flash"):
        self.api_key = api_key
        self.base_url = base_url
        self.model = model
        self.client = OpenAI(api_key=api_key, base_url=base_url)

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
