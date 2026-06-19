from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field, field_validator
from beanie import PydanticObjectId

class FitnessPlanGenerationRequest(BaseModel):
    memberId: str = Field(..., description="The ID of the member requesting the plan")
    age: int = Field(..., ge=1, le=120, description="Age of the user in years")
    gender: str = Field(..., description="Gender: 'male' or 'female'")
    weight: float = Field(..., ge=10.0, le=500.0, description="Weight in kg")
    height: float = Field(..., ge=50.0, le=300.0, description="Height in cm")
    activity_level: str = Field(
        ..., 
        description="Activity level: 'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'"
    )
    goal: str = Field(
        ..., 
        description="Goal: 'lose_weight', 'gain_muscle', 'maintain'"
    )
    dietary_preference: str = Field(
        ..., 
        description="Dietary preference: e.g. 'none', 'vegan', 'vegetarian', 'keto', 'paleo', 'pescatarian'"
    )

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, val: str) -> str:
        clean_val = val.lower().strip()
        if clean_val not in ["male", "female", "m", "f"]:
            raise ValueError("Gender must be 'male' or 'female'")
        return clean_val

    @field_validator("activity_level")
    @classmethod
    def validate_activity_level(cls, val: str) -> str:
        clean_val = val.lower().strip().replace(" ", "_")
        allowed = ["sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"]
        if clean_val not in allowed:
            raise ValueError(f"Activity level must be one of: {allowed}")
        return clean_val

    @field_validator("goal")
    @classmethod
    def validate_goal(cls, val: str) -> str:
        clean_val = val.lower().strip().replace(" ", "_")
        allowed = ["lose_weight", "gain_muscle", "maintain"]
        if clean_val not in allowed:
            raise ValueError(f"Goal must be one of: {allowed}")
        return clean_val


class FitnessMetricsSchema(BaseModel):
    bmi: float = Field(..., description="Calculated Body Mass Index")
    bmr: float = Field(..., description="Calculated Basal Metabolic Rate in kcal")
    tdee: float = Field(..., description="Calculated Total Daily Energy Expenditure in kcal")
    calories: float = Field(..., description="Daily target calories in kcal")
    protein_g: float = Field(..., description="Daily target protein in grams")
    carbs_g: float = Field(..., description="Daily target carbohydrates in grams")
    fat_g: float = Field(..., description="Daily target fats in grams")


# --- Schemas for AI-Generated Plan Parsing ---

class MealPlanItem(BaseModel):
    meal_name: str = Field(..., description="Name of the meal, e.g. 'Breakfast', 'Mid-day Snack'")
    timing: str = Field(..., description="Recommended timing, e.g., '8:00 AM' or 'Post-workout'")
    description: str = Field(..., description="Detailed explanation of the foods/drinks included")
    protein_g: float = Field(..., description="Approximate protein in grams for this meal")
    carbs_g: float = Field(..., description="Approximate carbohydrates in grams for this meal")
    fat_g: float = Field(..., description="Approximate fats in grams for this meal")
    calories: float = Field(..., description="Approximate calories in kcal for this meal")


class DietPlanSchema(BaseModel):
    dietary_preference: Optional[str] = Field(default="none", description="The diet type, matching request")
    daily_meals: List[MealPlanItem] = Field(..., description="List of meals for a representative day")
    grocery_list: List[str] = Field(..., description="Recommended grocery items to purchase")
    coaching_tips: List[str] = Field(..., description="Nutrition coaching advice aligned with calculations")


class ExerciseItem(BaseModel):
    exercise_name: str = Field(..., description="Name of the exercise")
    sets: int = Field(..., ge=1, description="Number of sets")
    reps: str = Field(..., description="Number of reps or duration, e.g. '10-12', '15', '30s'")
    rest_seconds: int = Field(..., ge=0, description="Rest period between sets in seconds")
    notes: str = Field("", description="Execution cues or instructions")


class DayWorkout(BaseModel):
    day: str = Field(..., description="Day of the week, e.g., 'Monday', 'Tuesday'")
    focus: str = Field(..., description="Focus area or split name, e.g. 'Upper Body', 'Active Recovery'")
    exercises: List[ExerciseItem] = Field(default=[], description="List of exercises. Keep empty if a Rest Day")


class WorkoutPlanSchema(BaseModel):
    routine_name: str = Field(..., description="Overall routine name, e.g. 'Hypertrophy 4-Day Split'")
    weekly_schedule: List[DayWorkout] = Field(..., description="List of daily schedules for the week")
    general_tips: List[str] = Field(..., description="General workout execution or recovery advice")


# --- Complete Plan persistence and API output ---

class FitnessPlanResponse(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id", description="The MongoDB identifier")
    memberId: str = Field(..., description="The member ID this plan belongs to")
    member: Optional[Any] = None
    fitness_metrics: FitnessMetricsSchema = Field(..., description="Calculated engine metrics")
    diet_plan: DietPlanSchema = Field(..., description="The AI-generated and validated diet plan")
    workout_plan: WorkoutPlanSchema = Field(..., description="The AI-generated and validated workout plan")
    
    # Optional original parameters for frontend regeneration pre-population
    age: Optional[int] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    dietary_preference: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")

    class Config:
        populate_by_name = True
