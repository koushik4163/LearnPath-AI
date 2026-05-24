from fastapi import APIRouter, Depends, HTTPException
from app.core.security import verify_firebase_token
from app.database import supabase
from pydantic import BaseModel
from groq import Groq
import os

router = APIRouter(prefix="/chat", tags=["chat"])
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    message: str

@router.post("/ask")
async def ask_tutor(
    body: ChatRequest,
    token_data: dict = Depends(verify_firebase_token),
):
    uid = token_data["uid"]

    # Get user's roadmap for context
    roadmap = supabase.table("roadmaps") \
        .select("goal, current_skills, current_week") \
        .eq("user_id", uid) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()

    context = ""
    if roadmap.data:
        rm = roadmap.data[0]
        context = f"The user is learning: {rm['goal']}. Current skills: {', '.join(rm.get('current_skills') or [])}. Currently on week {rm.get('current_week', 1)}."

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a friendly, expert AI learning tutor.
{context}
Help the user understand concepts related to their learning goal.
Keep answers concise (2-4 sentences). Be encouraging and clear.
If asked something unrelated to learning, gently redirect to their studies."""
                },
                {"role": "user", "content": body.message}
            ],
            temperature=0.7,
            max_tokens=300,
        )
        reply = response.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))