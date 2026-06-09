from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from pymongo import IndexModel, ASCENDING
from beanie import Document, before_event, Insert, Save

from src.utils.getNextID import getNextID

class WorkoutExercise(BaseModel):
    name: str
    sets: Optional[int] = None
    reps: Optional[str] = None
    rest: Optional[str] = None
    notes: Optional[str] = None

class DayWorkout(BaseModel):
    focus: Optional[str] = None
    exercises: List[WorkoutExercise] = []

class WorkoutPlan(Document):
    planId: Optional[str] = Field(default=None)
    name: str
    goal: str
    description: str

    monday: DayWorkout = Field(default_factory=DayWorkout)
    tuesday: DayWorkout = Field(default_factory=DayWorkout)
    wednesday: DayWorkout = Field(default_factory=DayWorkout)
    thursday: DayWorkout = Field(default_factory=DayWorkout)
    friday: DayWorkout = Field(default_factory=DayWorkout)
    saturday: DayWorkout = Field(default_factory=DayWorkout)
    sunday: DayWorkout = Field(default_factory=DayWorkout)

    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "workout_plans"
        indexes = [IndexModel([("planId", ASCENDING)], unique=True)]

    @before_event(Insert)
    async def prepare_workout_plan(self):
        if not self.planId:
            self.planId = await getNextID('workout_plan')

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()