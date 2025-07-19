from openai import OpenAI
from typing import List, Dict
import json


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
                    "You are a Manim code generator. Given a prompt, return ONLY valid Python 3 code "
                    "wrapped in triple backticks (```python). Do not explain the code."
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
                    "class RedTriangle(Scene):\n"
                    "    def construct(self):\n"
                    "        triangle = Triangle(color=RED)\n"
                    "        self.play(Create(triangle))\n"
                    "        self.play(Rotate(triangle, angle=PI/2))\n"
                    "        self.wait()\n"
                    "```"
                )
            },
        ]
        return preamble + self.history

    def to_json(self) -> str:
        """Convert session history to JSON string for database storage"""
        return json.dumps(self.history)

    @classmethod
    def from_json(cls, json_str: str) -> 'PromptSession':
        """Create PromptSession from JSON string from database"""
        if not json_str:
            return cls()
        try:
            history = json.loads(json_str)
            return cls(history)
        except (json.JSONDecodeError, TypeError):
            return cls()


def extract_code_from_response(response_text: str) -> str:
    import re
    match = re.search(r"```python(.*?)```", response_text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return "ERROR: No valid Python code found in response."


def generate_manim_code(prompt: str, session: PromptSession) -> str:
    session.add_prompt(prompt)
    client = OpenAI(
        api_key="AIzaSyCQ0I2o7BRU4I9wtWb4gQhZkdcR382bWE0",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )

    response = client.chat.completions.create(
        model="gemini-2.5-flash",
        messages=session.get_chat_history(),
        temperature=0.3,
    )

    assistant_reply = response.choices[0].message.content
    session.add_response(assistant_reply)

    return extract_code_from_response(assistant_reply)
