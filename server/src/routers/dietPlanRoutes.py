from fastapi import APIRouter, Request

from src.schemas.dietPlanSchemas import DietPlanRequest
from src.models.DietPlan import DietPlan
from src.controllers.dietPlanController import (
    create_diet_plan,
    fetch_all_diet_plans,
    update_diet_plan,
    delete_diet_plan,
)
from src.controllers.authController import get_loggedin_admin

router = APIRouter(prefix="/dietplan")

@router.post("/create")
async def create(request: Request, data: DietPlanRequest):
    await get_loggedin_admin(request)
    return await create_diet_plan(data)

@router.get("/all", response_model=list[DietPlan])
async def get_all_diet_plans(request: Request):
    await get_loggedin_admin(request)
    return await fetch_all_diet_plans()

@router.put("/update/{id}")
async def update(request: Request, id: str, data: DietPlanRequest):
    await get_loggedin_admin(request)
    return await update_diet_plan(id, data)

@router.delete("/delete/{id}")
async def delete(request: Request, id: str):
    await get_loggedin_admin(request)
    return await delete_diet_plan(id)

