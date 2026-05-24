from pydantic import BaseModel, Field
from typing import Optional
from src.models.DietPlan import DayDiet

class DietPlanRequest(BaseModel):
    name: str
    goal: str
    description: str
    monday: Optional[DayDiet] = Field(default_factory=DayDiet)
    tuesday: Optional[DayDiet] = Field(default_factory=DayDiet)
    wednesday: Optional[DayDiet] = Field(default_factory=DayDiet)
    thursday: Optional[DayDiet] = Field(default_factory=DayDiet)
    friday: Optional[DayDiet] = Field(default_factory=DayDiet)
    saturday: Optional[DayDiet] = Field(default_factory=DayDiet)
    sunday: Optional[DayDiet] = Field(default_factory=DayDiet)

