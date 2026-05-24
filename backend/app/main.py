from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, roadmap, tasks, quiz, progress

app = FastAPI(
    title="LearnPath AI API",
    description="AI-powered personalized learning roadmap backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(roadmap.router)
app.include_router(tasks.router)
app.include_router(quiz.router)
app.include_router(progress.router)


@app.get("/")
async def root():
    return {"message": "LearnPath AI API is running 🚀"}


@app.get("/health")
async def health():
    return {"status": "ok"}

from app.routers import auth, roadmap, tasks, quiz, progress, chat  # add chat

# Add this line with the other routers:
app.include_router(chat.router)