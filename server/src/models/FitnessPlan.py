from pydantic import Field
from typing import Optional
from datetime import datetime
from pymongo import IndexModel, ASCENDING
from beanie import Document, Link, before_event, Insert, Save

from src.utils.getNextID import getNextID
from src.schemas.fitnessPlanSchemas import FitnessMetricsSchema, DietPlanSchema, WorkoutPlanSchema
from src.models.Member import Member

class FitnessPlan(Document):
    planId: Optional[str] = Field(default=None)
    memberId: str = Field(..., description="Reference member or user ID")
    member: Optional[Link[Member]] = None
    fitness_metrics: FitnessMetricsSchema
    diet_plan: DietPlanSchema
    workout_plan: WorkoutPlanSchema
    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "fitness_plans"
        indexes = [
            IndexModel([("planId", ASCENDING)], unique=True),
            IndexModel([("memberId", ASCENDING)]),
        ]

    @before_event(Insert)
    async def prepare_fitness_plan(self):
        self.planId = await getNextID('fitness_plan')

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()
