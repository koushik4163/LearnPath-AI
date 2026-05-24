from fastapi import APIRouter, Depends, HTTPException
from app.core.security import verify_firebase_token
from app.database import supabase

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/me")
async def get_my_progress(
    token_data: dict = Depends(verify_firebase_token),
):
    uid = token_data["uid"]

    prog_result = supabase.table("progress") \
        .select("*") \
        .eq("user_id", uid) \
        .execute()

    if not prog_result.data:
        raise HTTPException(status_code=404, detail="Progress not found")

    quiz_result = supabase.table("quiz_results") \
        .select("score, total, percent, taken_at") \
        .eq("user_id", uid) \
        .order("taken_at", desc=False) \
        .limit(20) \
        .execute()

    data = prog_result.data[0]
    data["quiz_history"] = quiz_result.data or []
    return data