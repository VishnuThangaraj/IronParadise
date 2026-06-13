from fastapi import APIRouter, Request, status

from src.models.MembershipPlan import MembershipPlan
from src.schemas.membershipPlanSchemas import MembershipPlanRequest
from src.controllers.authController import get_loggedin_admin
from src.controllers.membershipPlanController import (
    create_membership_plan,
    fetch_all_membership_plans,
    fetch_membership_plan_by_id,
    update_membership_plan,
    delete_membership_plan,
)

router = APIRouter(prefix="/membership", tags=['Membership Plan'])

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create(request: Request, data: MembershipPlanRequest):
    await get_loggedin_admin(request)
    return await create_membership_plan(data)

@router.get("/all", response_model=list[MembershipPlan], status_code=status.HTTP_200_OK)
async def get_all_membership_plans(request: Request):
    await get_loggedin_admin(request)
    return await fetch_all_membership_plans()

@router.get("/{id}", response_model=MembershipPlan, status_code=status.HTTP_200_OK)
async def get_membership_plan_by_id(request: Request, id: str):
    await get_loggedin_admin(request)
    return await fetch_membership_plan_by_id(id)

@router.put("/update/{id}", status_code=status.HTTP_200_OK)
async def update(request: Request, id: str, data: MembershipPlanRequest):
    await get_loggedin_admin(request)
    return await update_membership_plan(id, data)

@router.delete("/delete/{id}", status_code=status.HTTP_200_OK)
async def delete(request: Request, id: str):
    await get_loggedin_admin(request)
    return await delete_membership_plan(id)
