from fastapi import APIRouter, Depends, HTTPException
from app.core.security import verify_firebase_token
from app.database import supabase
from app.services.rag_service import search_chunks, format_context
from pydantic import BaseModel, Field
from groq import Groq
import datetime
import os

router = APIRouter(prefix="/chat", tags=["chat"])
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = Field(default_factory=list)


# ── Intent detection ──────────────────────────────────────
'''
GREETINGS = {
    def _sanitize_history(history: list[ChatMessage]) -> list[dict]:
        cleaned: list[dict] = []
        for msg in history:
            role = msg.role if msg.role in {"user", "assistant"} else None
            if not role:
                continue
            content = (msg.content or "").strip()
            if not content:
                continue
            cleaned.append({"role": role, "content": content})
        return cleaned


    def _format_chat_log_block(logs: list[dict]) -> str:
        if not logs:
            return "No prior chat logs."

        lines: list[str] = []
        for log in logs:
            user_msg = (log.get("user_message") or "").strip()
            ai_reply = (log.get("ai_reply") or "").strip()
            if user_msg:
                lines.append(f"User: {user_msg}")
            if ai_reply:
                lines.append(f"Tutor: {ai_reply}")

        return "\n".join(lines) if lines else "No prior chat logs."


    def _logs_to_messages(logs: list[dict]) -> list[dict]:
        messages: list[dict] = []
        for log in logs:
            user_msg = (log.get("user_message") or "").strip()
            ai_reply = (log.get("ai_reply") or "").strip()
            if user_msg:
                messages.append({"role": "user", "content": user_msg})
            if ai_reply:
                messages.append({"role": "assistant", "content": ai_reply})
        return messages


    def _extract_last_followup(messages: list[dict]) -> str:
        for msg in reversed(messages):
            if msg.get("role") == "assistant" and "?" in msg.get("content", ""):
                lines = msg["content"].strip().split("\n")
                for line in reversed(lines):
                    if "?" in line:
                        return line.strip()
        return ""


    def _build_system_prompt(
        goal: str,
        skills_str: str,
        current_week: int,
        current_week_theme: str,
        quiz_summary: str,
        tasks_block: str,
        followup_block: str,
        chat_log_block: str,
        rag_block: str,
    ) -> str:
        return f"""You are LearnPath - an elite 1-on-1 tutor. Direct, precise, zero filler. Every answer is tied to this student's specific goal and tasks.

    STUDENT PROFILE
    Goal: {goal}
    Skills: {skills_str}
    Week {current_week}: "{current_week_theme}"
    Quiz: {quiz_summary}
    Today's tasks:
    {tasks_block}
    {followup_block}
    Recent chat logs:
    {chat_log_block}
    {rag_block}

    RULES
    1. Anchor every answer to the goal "{goal}" and name at least one of today's tasks. If there are no tasks today, anchor to the current week theme instead.
    2. Teach intuition first, then precision - never lead with a definition.
    3. Show the WRONG approach before the right one for common mistakes.
    4. Always include a real runnable code block for technical topics; for non-technical topics, use concrete examples instead.
    5. End with exactly ONE sharp follow-up question - never "does that make sense?"
    6. Adapt to quiz performance: weak = analogies + micro-steps; strong = go deeper.
    7. Never say "Great question", "Certainly", "Sure!", or any filler opener.
    8. Max 350 words total.
    9. Use recent chat logs to maintain continuity. If a new message conflicts, ask for clarification.
    10. Use a structured format with labeled sections on separate lines. Use blank lines between sections.

    STRUCTURED FORMAT
    Big picture:
    - 1-2 sentences.

    Wrong approach:
    - 1-2 bullets.

    Right approach:
    - 2-4 bullets.

    Code:
    ```language
    // runnable example
    ```

    Next steps:
    - 1-3 bullets tied to today's tasks.

    Check:
    - Exactly one question.

    If the message is purely non-technical, replace the Code section with Example and keep the same structure.
    """
1. Answer the question in plain conversational sentences — no headers, no sections
2. Use a code block if the concept needs one
3. One sharp follow-up question at the end to check understanding
4. Max 200 words

EXAMPLE:
User: "what is a closure"
Response:
A closure is a function that remembers variables from the scope it was defined in, even after that scope is gone.

```python
def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

counter = make_counter()
counter()  # 1
counter()  # 2
```

`count` stays alive because `increment` closes over it. Without closures, `count` would be gone once `make_counter` returns.

What would happen if you called `make_counter()` twice — would both counters share the same count?

EXAMPLE:
User: "what is pandas"
Response:
Pandas is a Python library for working with structured data — think Excel but in code. It gives you two main structures: Series (a single column) and DataFrame (a table).

```python
import pandas as pd
df = pd.DataFrame({{'name': ['Alice', 'Bob'], 'age': [25, 30]}})
print(df)
```

Most data science work starts with loading a CSV into a DataFrame and exploring it with `.head()`, `.info()`, and `.describe()`.

What's the first thing you'd want to do after loading a dataset into a DataFrame?"""

    if intent == "debug":
        return f"""You are a debugging assistant. Diagnose and fix the problem directly.

{profile}
{shared_rules}

HOW TO RESPOND:
1. State the most likely cause in one sentence
2. Show the fix with a code block
3. One sentence explaining why it works
4. One follow-up question if needed
5. Max 200 words

EXAMPLE:
User: "my fetch isn't working"
Response:
Most likely missing `await` — without it you get a Promise object, not the actual data.

```python
# wrong
data = fetch('/api/users')

# right  
data = await fetch('/api/users')
response = await data.json()
```

`fetch` is async — every call needs `await` or the value is just a pending Promise.

What does your console show — undefined, a Promise object, or an actual error message?"""

    # general fallback
    return f"""You are a tutor. Answer exactly what was asked, nothing more.

{profile}
{shared_rules}

HOW TO RESPOND:
1. Answer directly in plain sentences
2. Use a code block if relevant
3. Max 150 words
4. If vague: ask ONE clarifying question, no answer yet
5. If off-topic: one sentence answer then "Want to get back to {current_week_theme}?"

EXAMPLE:
User: "what courses can I learn after data science"
Response:
After data science, the natural next steps are machine learning engineering (deploying models at scale), data engineering (building pipelines with Spark/Airflow), or MLOps (automating the ML lifecycle). If you want to specialize, go into NLP or computer vision. If you want broader impact, move toward AI product management or analytics engineering with dbt.

Which direction interests you more — building models or getting them into production?"""
````

### What changed

The old prompts still had `## headers` and `### sections` in the format instructions which LLaMA copied. Now every intent gets **plain conversational examples** showing exactly what the output should look like — no headers, no wrong/right way, just direct answers like ChatGPT. LLaMA copies format from examples far more reliably than from written rules.
'''

GREETINGS = {
    "hello", "hi", "hey", "sup", "hii", "hiii", "hiiii",
    "hello!", "hi!", "hey!", "good morning", "good afternoon",
    "good evening", "howdy", "yo", "what's up", "whats up",
    "hola", "greetings", "heya", "hi there", "hello there",
}

ACKNOWLEDGEMENTS = {
    "ok", "okay", "ok!", "okay!", "thanks", "thank you",
    "cool", "got it", "makes sense", "understood", "nice",
    "great", "awesome", "alright", "sounds good", "noted",
    "perfect", "sure", "yep", "yeah", "nope", "no",
}


def _is_greeting(message: str) -> bool:
    cleaned = message.strip().lower().rstrip("!?. ")
    return cleaned in GREETINGS


def _is_acknowledgement(message: str) -> bool:
    cleaned = message.strip().lower().rstrip("!?. ")
    return cleaned in ACKNOWLEDGEMENTS


def _sanitize_history(history: list[ChatMessage]) -> list[dict]:
    cleaned: list[dict] = []
    for msg in history:
        role = msg.role if msg.role in {"user", "assistant"} else None
        if not role:
            continue
        content = (msg.content or "").strip()
        if not content:
            continue
        cleaned.append({"role": role, "content": content})
    return cleaned


def _format_chat_log_block(logs: list[dict]) -> str:
    if not logs:
        return "No prior chat logs."

    lines: list[str] = []
    for log in logs:
        user_msg = (log.get("user_message") or "").strip()
        ai_reply = (log.get("ai_reply") or "").strip()
        if user_msg:
            lines.append(f"User: {user_msg}")
        if ai_reply:
            lines.append(f"Tutor: {ai_reply}")

    return "\n".join(lines) if lines else "No prior chat logs."


def _logs_to_messages(logs: list[dict]) -> list[dict]:
    messages: list[dict] = []
    for log in logs:
        user_msg = (log.get("user_message") or "").strip()
        ai_reply = (log.get("ai_reply") or "").strip()
        if user_msg:
            messages.append({"role": "user", "content": user_msg})
        if ai_reply:
            messages.append({"role": "assistant", "content": ai_reply})
    return messages


def _extract_last_followup(messages: list[dict]) -> str:
    for msg in reversed(messages):
        if msg.get("role") == "assistant" and "?" in msg.get("content", ""):
            lines = msg["content"].strip().split("\n")
            for line in reversed(lines):
                if "?" in line:
                    return line.strip()
    return ""


def _format_tasks_block(tasks: list[dict]) -> str:
    if not tasks:
        return "No tasks scheduled for today."
    lines = []
    for task in tasks:
        status = "x" if task.get("is_completed") else " "
        title = task.get("title") or "Untitled task"
        description = (task.get("description") or "").strip()
        if description:
            lines.append(f"- [{status}] {title}: {description}")
        else:
            lines.append(f"- [{status}] {title}")
    return "\n".join(lines)


def _build_quiz_summary(results: list[dict]) -> str:
    if not results:
        return "No recent quizzes yet. Coaching note: start with fundamentals."
    percents = [r.get("percent", 0) for r in results if r.get("percent") is not None]
    if not percents:
        return "No recent quiz scores recorded."
    average = round(sum(percents) / len(percents))
    recent_str = ", ".join(f"{p}%" for p in percents[:5])
    if average < 60:
        note = "slow down, reinforce core concepts, use analogies before code"
    elif average < 80:
        note = "keep pace, target weak spots with extra practice"
    else:
        note = "move faster, increase difficulty, skip basics"
    return f"Recent scores: {recent_str}. Avg: {average}%. Coaching note: {note}."


def _build_system_prompt(
    goal: str,
    skills_str: str,
    current_week: int,
    current_week_theme: str,
    quiz_summary: str,
    tasks_block: str,
    followup_block: str,
    chat_log_block: str,
    rag_block: str,
) -> str:
    return f"""You are LearnPath - an elite 1-on-1 tutor. Direct, precise, zero filler. Every answer is tied to this student's specific goal and tasks.

STUDENT PROFILE
Goal: {goal}
Skills: {skills_str}
Week {current_week}: "{current_week_theme}"
Quiz: {quiz_summary}
Today's tasks:
{tasks_block}
{followup_block}
Recent chat logs:
{chat_log_block}
{rag_block}

RULES
1. Answer the question directly. Do not force a connection to the learning goal unless it is naturally relevant.
2. If the question is on-topic, you may reference the goal or a task only when it adds real value.
3. If the question is off-topic (e.g., people, politics, entertainment), answer briefly in 1-2 sentences and do NOT mention the learning goal.
4. Teach intuition first, then precision. Keep the main answer short and clear.
5. Only go deep when the user asks for details or the question clearly requires depth.
6. Include a runnable code block for technical questions when code is helpful.
7. End with exactly ONE sharp follow-up question (no filler like "does that make sense?"). For off-topic, the follow-up should be neutral (not about the learning goal).
8. Adapt to quiz performance: weak = simpler steps; strong = more depth.
9. Never say "Great question", "Certainly", "Sure!", or any filler opener.
10. Max 350 words total.
11. Use recent chat logs to maintain continuity. If a new message conflicts, ask for clarification.

RESPONSE FORMAT
- 1-3 short paragraphs or a short bullet list when it improves clarity.
- No mandatory section headers like "Wrong approach" or "Right approach".
- Avoid forced structure; prioritize clarity and brevity.

If the message is off-topic, keep the response to 1-2 sentences, then ask a neutral follow-up question.

OFF-TOPIC EXAMPLE
User: "who is Narendra Modi"
Response: "Narendra Modi is the Prime Minister of India, in office since 2014 and leading the Bharatiya Janata Party. What else would you like to know about him?"
"""

@router.post("/ask")
async def ask_tutor(
    body: ChatRequest,
    token_data: dict = Depends(verify_firebase_token),
):
    uid = token_data["uid"]

    # ── Hard intercepts — never reach LLM ────────────────────
    if _is_greeting(body.message):
        return {"reply": "Hey! 👋 What do you want to learn today?"}

    if _is_acknowledgement(body.message):
        return {"reply": "Got it. What's next?"}

    # ── Fetch roadmap ─────────────────────────────────────────
    roadmap = supabase.table("roadmaps") \
        .select("goal, current_skills, current_week, generated_plan") \
        .eq("user_id", uid) \
        .order("created_at", desc=True) \
        .limit(1).execute()

    goal = ""
    current_skills = []
    current_week = 1
    current_week_theme = ""
    skills_str = "none listed"

    if roadmap.data:
        rm = roadmap.data[0]
        goal = rm.get("goal", "")
        current_skills = rm.get("current_skills") or []
        current_week = rm.get("current_week", 1)
        plan = rm.get("generated_plan") or {}
        weeks = plan.get("weeks") or []
        if 1 <= current_week <= len(weeks):
            current_week_theme = weeks[current_week - 1].get("theme", "")
        skills_str = ", ".join(current_skills) if current_skills else "none listed"

    # ── Fetch today's tasks ───────────────────────────────────
    today = datetime.date.today().isoformat()
    tasks_result = supabase.table("tasks") \
        .select("title, description, is_completed, day_number") \
        .eq("user_id", uid) \
        .eq("date", today) \
        .order("day_number").execute()

    tasks = tasks_result.data or []
    tasks_block = _format_tasks_block(tasks)

    # ── Fetch quiz results ────────────────────────────────────
    quiz_result = supabase.table("quiz_results") \
        .select("percent, taken_at") \
        .eq("user_id", uid) \
        .order("taken_at", desc=True) \
        .limit(5).execute()

    quiz_summary = _build_quiz_summary(quiz_result.data or [])

    chat_logs_result = supabase.table("chat_logs") \
        .select("user_message, ai_reply, created_at") \
        .eq("user_id", uid) \
        .order("created_at", desc=True) \
        .limit(4) \
        .execute()

    chat_logs = list(reversed(chat_logs_result.data or []))
    chat_log_block = _format_chat_log_block(chat_logs)

    # ── RAG search ────────────────────────────────────────────
    task_titles = [t.get("title", "") for t in tasks if t.get("title")]
    query = f"{body.message}\nGoal: {goal}\nSkills: {skills_str}"
    if task_titles:
        query += f"\nTasks: {', '.join(task_titles)}"

    docs = search_chunks(query=query, match_count=6, threshold=0.20)
    rag_context = format_context(docs)

    history_messages = _sanitize_history(body.history)
    if not history_messages and chat_logs:
        history_messages = _logs_to_messages(chat_logs)

    history_messages = history_messages[-6:]
    last_followup = _extract_last_followup(history_messages)
    followup_block = "Follow-up pending: None"
    if last_followup:
        followup_block = (
            f"Follow-up pending: {last_followup}\n"
            "If the student answered it, acknowledge briefly. If they ignored it, move on."
        )

    rag_block = "Retrieved knowledge: none."
    if rag_context:
        rag_block = f"Retrieved knowledge (cite as [1], [2] if used):\n{rag_context}"

    # ── Build intent-specific system prompt ───────────────────
    system_prompt = _build_system_prompt(
        goal=goal,
        skills_str=skills_str,
        current_week=current_week,
        current_week_theme=current_week_theme,
        quiz_summary=quiz_summary,
        tasks_block=tasks_block,
        followup_block=followup_block,
        chat_log_block=chat_log_block,
        rag_block=rag_block,
    )

    # ── Build messages ────────────────────────────────────────
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history_messages)
    messages.append({"role": "user", "content": body.message})

    # ── Call LLM ──────────────────────────────────────────────
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.4,
            max_tokens=700,
        )
        reply = response.choices[0].message.content.strip()

        # ── Log to DB (non-blocking) ──────────────────────────
        try:
            supabase.table("chat_logs").insert({
                "user_id": uid,
                "user_message": body.message,
                "ai_reply": reply,
                "week": current_week,
                "goal": goal,
                "rag_chunks_used": len(docs),
            }).execute()
        except Exception:
            pass

        return {"reply": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))