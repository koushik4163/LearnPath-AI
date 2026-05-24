from pydantic import BaseModel
from typing import List

class RoadmapGenerateRequest(BaseModel):
    goal: str
    current_skills: List[str]
    duration_weeks: int

class TaskToggle(BaseModel):
    is_completed: bool

class QuizSubmitRequest(BaseModel):
    score: int
    total: int