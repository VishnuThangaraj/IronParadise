from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from pymongo import IndexModel, ASCENDING
from beanie import Document, before_event, Insert, Save

from src.utils.getNextID import getNextID

class MealItem(BaseModel):
    name: str 
    quantity: Optional[str] = None  
    calories: Optional[int] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None

class DayDiet(BaseModel):
    breakfast: List[MealItem] = []
    lunch: List[MealItem] = []
    dinner: List[MealItem] = []
    snacks: List[MealItem] = []

class DietPlan(Document):
    planId: Optional[str] = Field(default=None)
    name: str
    goal: str
    description: str

    monday: DayDiet = Field(default_factory=DayDiet)
    tuesday: DayDiet = Field(default_factory=DayDiet)
    wednesday: DayDiet = Field(default_factory=DayDiet)
    thursday: DayDiet = Field(default_factory=DayDiet)
    friday: DayDiet = Field(default_factory=DayDiet)
    saturday: DayDiet = Field(default_factory=DayDiet)
    sunday: DayDiet = Field(default_factory=DayDiet)

    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "diet_plans"
        indexes = [IndexModel([("planId", ASCENDING)], unique=True)]

    @before_event(Insert)
    async def prepare_diet_plan(self):
        self.planId = await getNextID('diet_plan')

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()
