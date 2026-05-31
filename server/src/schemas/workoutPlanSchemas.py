from typing import Optional
from pydantic import BaseModel, Field

from src.models.WorkoutPlan import DayWorkout


class WorkoutPlanRequest(BaseModel):
    name: str
    goal: str
    description: str
    monday: Optional[DayWorkout] = Field(default_factory=DayWorkout)
    tuesday: Optional[DayWorkout] = Field(default_factory=DayWorkout)
    wednesday: Optional[DayWorkout] = Field(default_factory=DayWorkout)
    thursday: Optional[DayWorkout] = Field(default_factory=DayWorkout)
    friday: Optional[DayWorkout] = Field(default_factory=DayWorkout)
    saturday: Optional[DayWorkout] = Field(default_factory=DayWorkout)
    sunday: Optional[DayWorkout] = Field(default_factory=DayWorkout)