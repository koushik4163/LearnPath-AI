from fastapi import APIRouter, Depends, HTTPException
from app.core.security import verify_firebase_token
from app.database import supabase
from app.schemas.schemas import TaskToggle
import datetime

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/today")
async def get_today_tasks(
    token_data: dict = Depends(verify_firebase_token),
):
    uid = token_data["uid"]
    today = datetime.date.today().isoformat()

    result = supabase.table("tasks") \
        .select("*") \
        .eq("user_id", uid) \
        .eq("date", today) \
        .order("day_number") \
        .execute()

    return result.data or []


@router.patch("/{task_id}/complete")
async def toggle_task(
    task_id: str,
    body: TaskToggle,
    token_data: dict = Depends(verify_firebase_token),
):
    uid = token_data["uid"]

    result = supabase.table("tasks") \
        .update({"is_completed": body.is_completed}) \
        .eq("id", task_id) \
        .eq("user_id", uid) \
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update progress when marking a task complete
    if body.is_completed:
        prog_result = supabase.table("progress") \
            .select("*") \
            .eq("user_id", uid) \
            .execute()

        if prog_result.data:
            prog = prog_result.data[0]
            today = datetime.date.today().isoformat()
            yesterday = (
                datetime.date.today() - datetime.timedelta(days=1)
            ).isoformat()

            # Update active days
            day_of_month = datetime.date.today().day
            active_days = prog.get("active_days") or []
            if day_of_month not in active_days:
                active_days = active_days + [day_of_month]

            # Calculate streak
            last_active = prog.get("last_active_date")
            streak = prog.get("current_streak", 0)

            if last_active == today:
                pass  # same day, no streak change
            elif last_active == yesterday:
                streak += 1
            else:
                streak = 1

            longest = max(prog.get("longest_streak", 0), streak)

            supabase.table("progress").update({
                "total_tasks_done": prog.get("total_tasks_done", 0) + 1,
                "active_days": active_days,
                "last_active_date": today,
                "current_streak": streak,
                "longest_streak": longest,
            }).eq("user_id", uid).execute()

    return result.data[0]