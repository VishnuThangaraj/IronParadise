from fastapi import APIRouter, Request, status

from src.schemas.memberPlanSchemas import MemberPlansRequest
from src.controllers.authController import get_loggedin_admin
from src.controllers.memberPlanController import (
    assign_member_plans,
    fetch_member_plans,
    fetch_all_member_plans,
    remove_member_plans
)

router = APIRouter(prefix='/member-plans', tags=['MemberPlans'])

@router.post('/assign', status_code=status.HTTP_200_OK)
async def assign_plans(request: Request, data: MemberPlansRequest):
    await get_loggedin_admin(request)
    return await assign_member_plans(data)

@router.get('/all', status_code=status.HTTP_200_OK)
async def get_all_member_plans(request: Request):
    await get_loggedin_admin(request)
    return await fetch_all_member_plans()

@router.get('/{member_id}', status_code=status.HTTP_200_OK)
async def get_plans_by_member_id(request: Request, member_id: str):
    await get_loggedin_admin(request)
    return await fetch_member_plans(member_id)

@router.delete('/remove/{member_id}', status_code=status.HTTP_200_OK)
async def remove_plans_by_member_id(request: Request, member_id: str):
    await get_loggedin_admin(request)
    return await remove_member_plans(member_id)
