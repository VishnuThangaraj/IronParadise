from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from src.models.WorkoutPlan import WorkoutPlan
from src.schemas.workoutPlanSchemas import WorkoutPlanRequest

#Create new Workout plan
async def create_workout_plan(data: WorkoutPlanRequest):
    existing_workoutPlan = await WorkoutPlan.find_one(
        WorkoutPlan.name == data.name
    )
    if existing_workoutPlan:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Workout Plan with this name already exists",
        )

    try:
        newWorkoutPlan = WorkoutPlan(**data.model_dump())
        await newWorkoutPlan.insert()
        return {
            "message": "Workout Plan created successfully",
            "workoutPlan": newWorkoutPlan
        }
    
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Workout Plan with this name or ID already exists",
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )

#Fetch all Workout plans
async def fetch_all_workout_plans():
    try:
        workoutPlans = await WorkoutPlan.find().to_list(length=None)
        return workoutPlans
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve workout plans: {str(e)}"
        )

#Fetch Workout plan by ID
async def fetch_workout_plan_by_id(id: str):
    workoutPlan = await WorkoutPlan.find_one(WorkoutPlan.planId == id)
    if not workoutPlan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout Plan not found",
        )
    return workoutPlan

#Update Workout plan
async def update_workout_plan(id: str, data: WorkoutPlanRequest):
    workoutPlan = await WorkoutPlan.find_one(WorkoutPlan.planId == id)
    if not workoutPlan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout Plan not found",
        )

    if data.name != workoutPlan.name:
        existing_workoutPlan = await WorkoutPlan.find_one(
            WorkoutPlan.name == data.name,
            WorkoutPlan.planId != id
        )
        if existing_workoutPlan:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Workout Plan with this name already exists",
            )
            
    update_data = data.model_dump(exclude_unset=False)
    for key, value in update_data.items():
        setattr(workoutPlan, key, value)
        
    try:
        await workoutPlan.save()
        return {
            "message": "Workout Plan updated successfully",
            "workoutPlan": workoutPlan
        }
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Workout Plan with this name or ID already exists",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update workout plan: {str(e)}"
        )

#Delete Workout plan
async def delete_workout_plan(id: str):
    workoutPlan = await WorkoutPlan.find_one(WorkoutPlan.planId == id)
    if not workoutPlan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout Plan not found",
        )
    
    try:
        await workoutPlan.delete()
        return {
            "message": "Workout Plan deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete workout plan: {str(e)}"
        )
