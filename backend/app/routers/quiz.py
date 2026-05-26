from fastapi import APIRouter, Depends, HTTPException
from app.core.security import verify_firebase_token
from app.database import supabase
from app.schemas.schemas import QuizSubmitRequest
from app.services.ai_service import generate_quiz
from app.services.rag_service import search_chunks, format_context
import datetime

router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.get("/generate")
async def generate_daily_quiz(
    token_data: dict = Depends(verify_firebase_token),
):
    uid = token_data["uid"]

    roadmap_result = supabase.table("roadmaps") \
        .select("goal, current_skills") \
        .eq("user_id", uid) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()

    if not roadmap_result.data:
        raise HTTPException(status_code=404, detail="No roadmap found")

    roadmap = roadmap_result.data[0]
    goal = roadmap.get("goal", "")
    skills = roadmap.get("current_skills") or []

    tasks_result = supabase.table("tasks") \
        .select("title") \
        .eq("user_id", uid) \
        .order("date", desc=True) \
        .limit(5) \
        .execute()

    recent_topics = [t["title"] for t in (tasks_result.data or [])]

    # RAG — search relevant chunks for quiz grounding
    search_query = " ".join(recent_topics) if recent_topics else goal
    try:
        docs = search_chunks(
            search_query,
            match_count=5,
            threshold=0.2,
            category="roadmap",
        )
        # Fallback to general content if no roadmap chunks found
        if not docs:
            docs = search_chunks(search_query, match_count=5, threshold=0.2)
        rag_context = format_context(docs)
    except Exception as e:
        print(f"RAG search warning: {e}")
        rag_context = ""

    try:
        return generate_quiz(
            goal,
            skills,
            recent_topics,
            rag_context=rag_context,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Quiz generation failed: {str(exc)}",
        )


@router.post("/submit")
async def submit_quiz(
    body: QuizSubmitRequest,
    token_data: dict = Depends(verify_firebase_token),
):
    uid = token_data["uid"]
    percent = round((body.score / body.total) * 100) if body.total else 0
    taken_at = datetime.datetime.utcnow().isoformat()

    result = supabase.table("quiz_results").insert({
        "user_id": uid,
        "score": body.score,
        "total": body.total,
        "percent": percent,
        "taken_at": taken_at,
    }).execute()

    return result.data[0] if result.data else {
        "score": body.score,
        "total": body.total,
        "percent": percent,
        "taken_at": taken_at,
    }