from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError
from beanie import PydanticObjectId

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

#Update Diet Plan
async def update_diet_plan(id: str, data: DietPlanRequest):
    try:
        doc_id = PydanticObjectId(id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID format",
        )
    
    diet_plan = await DietPlan.get(doc_id)
    if not diet_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diet Plan not found",
        )
    
    if data.name != diet_plan.name:
        existing_dietPlan = await DietPlan.find_one(
            DietPlan.name == data.name,
            DietPlan.id != doc_id
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
    try:
        doc_id = PydanticObjectId(id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID format",
        )
        
    diet_plan = await DietPlan.get(doc_id)
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


