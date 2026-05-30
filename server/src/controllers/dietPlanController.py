import os
import json
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

#Fetch single Diet Plan by ID
async def fetch_diet_plan_by_id(id: str):
    diet_plan = await DietPlan.find_one(DietPlan.planId == id)
    if not diet_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diet Plan not found",
        )
    return diet_plan

#Update Diet Plan
async def update_diet_plan(id: str, data: DietPlanRequest):
    diet_plan = await DietPlan.find_one(DietPlan.planId == id)
    if not diet_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diet Plan not found",
        )
    
    if data.name != diet_plan.name:
        existing_dietPlan = await DietPlan.find_one(
            DietPlan.name == data.name,
            DietPlan.planId != id
        )
        if existing_dietPlan:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Diet Plan with this name already exists",
            )
            
    update_data = data.model_dump(exclude_unset=False)
    for key, value in update_data.items():
        setattr(diet_plan, key, value)
        
    try:
        await diet_plan.save()
        return {
            "message": "Diet Plan updated successfully",
            "dietPlan": diet_plan
        }
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Diet Plan with this name or ID already exists",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update diet plan: {str(e)}",
        )

#Delete Diet Plan
async def delete_diet_plan(id: str):
    diet_plan = await DietPlan.find_one(DietPlan.planId == id)
    if not diet_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diet Plan not found",
        )
        
    try:
        await diet_plan.delete()
        return {
            "message": "Diet Plan deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete diet plan: {str(e)}",
        )


# Populate Diet Plan
async def populate_diet_plan():    
    file_path = os.path.join(os.path.dirname(__file__), "..", "data", "dietplan.json")
    with open(file_path, "r") as f:
        diet_plans = json.load(f)

    for diet_plan in diet_plans:
        existing_dietPlan = await DietPlan.find_one(DietPlan.name == diet_plan["name"])
        if existing_dietPlan:
            continue
        newDietPlan = DietPlan(**diet_plan)
        await newDietPlan.insert()

    return {
        "message": "Diet Plan populated successfully"
    }   