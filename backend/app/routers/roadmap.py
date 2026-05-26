from fastapi import APIRouter, Depends, HTTPException
from app.core.security import verify_firebase_token
from app.database import supabase
from app.services.ai_service import generate_roadmap
from app.services.rag_service import search_chunks, format_context, ingest_roadmap_chunks
from app.schemas.schemas import RoadmapGenerateRequest
import datetime
import traceback

router = APIRouter(prefix="/roadmap", tags=["roadmap"])


@router.post("/generate")
async def create_roadmap(
    body: RoadmapGenerateRequest,
    token_data: dict = Depends(verify_firebase_token),
):
    uid = token_data["uid"]

    # RAG — pull relevant content before generating roadmap
    # This grounds the AI with real resources and topics
    try:
        docs = search_chunks(
            query=f"{body.goal} {' '.join(body.current_skills)}",
            match_count=5,
            threshold=0.2,
        )
        rag_context = format_context(docs)
        print(f"RAG found {len(docs)} chunks for roadmap generation")
    except Exception as e:
        print(f"RAG search warning (non-fatal): {e}")
        rag_context = ""

    # Generate roadmap with RAG context
    try:
        plan = generate_roadmap(
            body.goal,
            body.current_skills,
            body.duration_weeks,
            rag_context=rag_context,
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    if not plan.get("weeks"):
        raise HTTPException(status_code=500, detail="AI returned invalid structure")

    # Save roadmap to Supabase
    try:
        result = supabase.table("roadmaps").insert({
            "user_id": uid,
            "goal": body.goal,
            "current_skills": body.current_skills,
            "duration_weeks": body.duration_weeks,
            "current_week": 1,
            "generated_plan": plan,
        }).execute()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Database save failed: {str(e)}")

    roadmap = result.data[0]
    roadmap_id = roadmap["id"]

    # Create Week 1 tasks
    try:
        _create_week_tasks(uid, roadmap_id, plan, week_number=1)
    except Exception as e:
        print(f"Warning: task creation failed: {e}")

    # Ingest roadmap into RAG for future chat/quiz grounding
    try:
        ingest_roadmap_chunks({
            "goal": body.goal,
            "generated_plan": plan,
        })
        print("RAG ingestion complete")
    except Exception as e:
        print(f"RAG ingestion warning (non-fatal): {e}")

    return roadmap


@router.get("/my")
async def get_my_roadmap(token_data: dict = Depends(verify_firebase_token)):
    uid = token_data["uid"]

    result = supabase.table("roadmaps") \
        .select("*") \
        .eq("user_id", uid) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="No roadmap found")

    return result.data[0]


@router.post("/unlock-next-week")
async def unlock_next_week(token_data: dict = Depends(verify_firebase_token)):
    uid = token_data["uid"]

    result = supabase.table("roadmaps") \
        .select("*") \
        .eq("user_id", uid) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="No roadmap found")

    roadmap = result.data[0]
    roadmap_id = roadmap["id"]
    current_week = roadmap.get("current_week", 1)
    duration_weeks = roadmap.get("duration_weeks", 4)
    plan = roadmap.get("generated_plan", {})

    if current_week >= duration_weeks:
        raise HTTPException(status_code=400, detail="Already on final week!")

    # Check all current week tasks are done
    existing_tasks = supabase.table("tasks") \
        .select("is_completed") \
        .eq("user_id", uid) \
        .eq("week_number", current_week) \
        .execute()

    tasks = existing_tasks.data or []
    if tasks and not all(t["is_completed"] for t in tasks):
        raise HTTPException(
            status_code=400,
            detail="Complete all current week tasks first!"
        )

    next_week = current_week + 1

    # Create next week tasks
    _create_week_tasks(uid, roadmap_id, plan, week_number=next_week)

    # Update current_week
    supabase.table("roadmaps") \
        .update({"current_week": next_week}) \
        .eq("id", roadmap_id) \
        .execute()

    return {"message": f"Week {next_week} unlocked!", "current_week": next_week}


def _create_week_tasks(uid: str, roadmap_id: str, plan: dict, week_number: int):
    """Helper to create tasks for a given week."""
    weeks = plan.get("weeks", [])
    if week_number > len(weeks):
        return

    week_data = weeks[week_number - 1]
    today = datetime.date.today()
    tasks = []

    for i, day in enumerate(week_data.get("days", [])):
        task_date = (today + datetime.timedelta(days=i)).isoformat()
        tasks.append({
            "user_id": uid,
            "roadmap_id": roadmap_id,
            "title": day.get("topic", ""),
            "description": day.get("description", ""),
            "resource_url": day.get("resource", ""),
            "week_number": week_number,
            "day_number": day.get("day", i + 1),
            "is_completed": False,
            "date": task_date,
        })

    if tasks:
        supabase.table("tasks").insert(tasks).execute()