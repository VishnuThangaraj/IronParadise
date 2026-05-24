from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from src.models.DietPlan import DietPlan
from src.schemas.dietPlanSchemas import DietPlanRequest

#Create new Diet Plan
async def create_diet_plan(data: DietPlanRequest):
    existing_dietPlan = await DietPlan.find_one(
        DietPlan.name == data.name
    )

    if existing_dietPlan:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Diet Plan with this name already exists",
        )

    try:
        newDietPlan = DietPlan(**data.model_dump())
        await newDietPlan.insert()

        return {
            "message": "Diet Plan registered successfully",
            "dietPlan": newDietPlan
        }
    
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Diet Plan with this name or ID already exists",
        )

#Fetch all Diet Plans
async def fetch_all_diet_plans():
    try:
        diet_plans = await DietPlan.find().to_list(length=None)
        return diet_plans
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve diet plans",
        )