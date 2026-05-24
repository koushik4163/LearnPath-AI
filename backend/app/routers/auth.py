from fastapi import APIRouter, Depends
from app.core.security import verify_firebase_token
from app.database import supabase

router = APIRouter(prefix="/auth", tags=["auth"])


def _get_or_create_user(token_data: dict):
    uid = token_data["uid"]

    result = supabase.table("users") \
        .select("*") \
        .eq("id", uid) \
        .execute()

    if not result.data:
        # Extract name from Firebase token (set during register)
        name = token_data.get("name", "") or token_data.get("email", "")
        email = token_data.get("email", "")

        supabase.table("users").upsert({
            "id": uid,
            "email": email,
            "name": name,
        }).execute()

        supabase.table("progress").upsert({
            "user_id": uid,
            "current_streak": 0,
            "longest_streak": 0,
            "total_tasks_done": 0,
            "active_days": [],
        }).execute()

        return {"id": uid, "email": email, "name": name}

    return result.data[0]


@router.post("/register")
async def register(token_data: dict = Depends(verify_firebase_token)):
    return _get_or_create_user(token_data)


@router.post("/login")
async def login(token_data: dict = Depends(verify_firebase_token)):
    return _get_or_create_user(token_data)


@router.get("/me")
async def get_me(token_data: dict = Depends(verify_firebase_token)):
    return _get_or_create_user(token_data)