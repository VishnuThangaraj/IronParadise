from fastapi import APIRouter, Request, status

from src.models.Member import Member
from src.schemas.memberSchemas import MemberRequest
from src.controllers.authController import get_loggedin_admin
from src.controllers.memberController import (
    create_member,
    fetch_all_members,
    fetch_member_by_id,
    update_member,
    delete_member
)   

router = APIRouter(prefix='/member', tags=['Member'])

@router.post('/create', status_code=status.HTTP_201_CREATED)
async def register_member(request: Request, data: MemberRequest):
    await get_loggedin_admin(request)
    return await create_member(data)

@router.get('/all', status_code=status.HTTP_200_OK)
async def get_all_members(request: Request):
    await get_loggedin_admin(request)
    return await fetch_all_members()

@router.get('/{id}', status_code=status.HTTP_200_OK)
async def get_member_by_id(request: Request, id: str):
    await get_loggedin_admin(request)
    return await fetch_member_by_id(id)

@router.put('/update/{id}', status_code=status.HTTP_200_OK)
async def update_member_by_id(request: Request, id: str, data: MemberRequest):
    await get_loggedin_admin(request)
    return await update_member(id, data)

@router.delete('/delete/{id}', status_code=status.HTTP_200_OK)
async def delete_member_by_id(request: Request, id: str):
    await get_loggedin_admin(request)
    return await delete_member(id)
