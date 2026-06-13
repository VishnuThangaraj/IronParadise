from fastapi import APIRouter, Request, status

from src.models.WorkoutPlan import WorkoutPlan
from src.schemas.workoutPlanSchemas import WorkoutPlanRequest
from src.controllers.authController import get_loggedin_admin
from src.controllers.workoutPlanController import (
    create_workout_plan,
    fetch_all_workout_plans,
    fetch_workout_plan_by_id,
    update_workout_plan,
    delete_workout_plan,
)

router = APIRouter(prefix="/workoutplan", tags=["Workout Plan"])

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create(request: Request, data: WorkoutPlanRequest):
    await get_loggedin_admin(request)
    return await create_workout_plan(data)

@router.get("/all", response_model=list[WorkoutPlan], status_code=status.HTTP_200_OK)
async def get_all_workout_plans(request: Request):
    await get_loggedin_admin(request)
    return await fetch_all_workout_plans()

@router.get("/{id}", response_model=WorkoutPlan, status_code=status.HTTP_200_OK)
async def get_workout_plan_by_id(request: Request, id: str):
    await get_loggedin_admin(request)
    return await fetch_workout_plan_by_id(id)

@router.put("/update/{id}", status_code=status.HTTP_200_OK)
async def update(request: Request, id: str, data: WorkoutPlanRequest):
    await get_loggedin_admin(request)
    return await update_workout_plan(id, data)

@router.delete("/delete/{id}", status_code=status.HTTP_200_OK)
async def delete(request: Request, id: str):
    await get_loggedin_admin(request)
    return await delete_workout_plan(id)
