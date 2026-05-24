from groq import Groq
import json
import re
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"


def clean_json(text: str) -> str:
    """Aggressively strip everything except the JSON."""
    text = text.strip()

    # Remove markdown fences
    if "```" in text:
        # Extract content between fences
        match = re.search(r'```(?:json)?\s*([\s\S]*?)```', text)
        if match:
            text = match.group(1).strip()

    # Find first { or [ and last } or ]
    first_brace = -1
    last_brace = -1

    for i, c in enumerate(text):
        if c in ('{', '['):
            first_brace = i
            break

    for i in range(len(text) - 1, -1, -1):
        if text[i] in ('}', ']'):
            last_brace = i
            break

    if first_brace != -1 and last_brace != -1:
        text = text[first_brace:last_brace + 1]

    return text.strip()


def generate_roadmap(goal: str, current_skills: list, duration_weeks: int) -> dict:
    """Call Groq LLaMA to generate a structured learning roadmap."""

    prompt = f"""You are an expert learning coach. Create a {duration_weeks}-week learning roadmap.

Goal: {goal}
Current skills: {', '.join(current_skills)}
Duration: {duration_weeks} weeks

You MUST return ONLY a raw JSON object. No markdown. No explanation. No code fences. Just the JSON.

Exact structure required:
{{
  "weeks": [
    {{
      "week": 1,
      "theme": "Foundation & Setup",
      "days": [
        {{
          "day": 1,
          "topic": "Topic name",
          "description": "What to learn and why.",
          "resource": "https://freecodecamp.org",
          "estimated_hours": 2
        }}
      ]
    }}
  ]
}}

Requirements:
- Each week must have exactly 5 days
- Resources must be real working URLs
- estimated_hours must be a number between 1 and 4
- Start simple, increase complexity each week
- Output ONLY the JSON. First character must be {{ and last must be }}"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a JSON generator. You output ONLY raw valid JSON. No markdown. No explanation. No code fences. Just JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
        max_tokens=8000,
    )

    raw = response.choices[0].message.content
    print("RAW ROADMAP RESPONSE:", raw[:200])  # debug log

    text = clean_json(raw)
    return json.loads(text)


def generate_quiz(goal: str, current_skills: list, recent_topics: list) -> list:
    """Call Groq LLaMA to generate 5 quiz questions."""

    topics_str = (
        ', '.join(recent_topics) if recent_topics
        else ', '.join(current_skills)
    )

    prompt = f"""Create exactly 5 multiple-choice quiz questions.

Goal: {goal}
Topics: {topics_str}

You MUST return ONLY a raw JSON array. No markdown. No explanation. No code fences. Just JSON.

Exact structure:
[
  {{
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Why this answer is correct."
  }}
]

Requirements:
- Return exactly 5 questions
- correct is 0-based index of the right answer
- All options must be plausible
- Output ONLY the JSON array. First character must be [ and last must be ]"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a JSON generator. You output ONLY raw valid JSON arrays. No markdown. No explanation. Just JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
        max_tokens=2000,
    )

    raw = response.choices[0].message.content
    print("RAW QUIZ RESPONSE:", raw[:200])  # debug log

    text = clean_json(raw)
    return json.loads(text)