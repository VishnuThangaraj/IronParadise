from fastapi import APIRouter, Request, status
from src.schemas.authSchemas import (
    AdminRegisterRequest,
    AdminLoginRequest,
    AdminProfileUpdateRequest,
    AdminPasswordChangeRequest,
)
from src.controllers.authController import (
    register_admin,
    login_admin,
    get_loggedin_admin,
    update_admin_profile,
    update_admin_password,
)

router = APIRouter(prefix="/auth")

@router.post("/admin/register", status_code=status.HTTP_201_CREATED)
async def register(user: AdminRegisterRequest):
    return await register_admin(user)

@router.post("/admin/login", status_code=status.HTTP_200_OK)
async def login(credentials: AdminLoginRequest):
    return await login_admin(credentials)

@router.get("/admin/profile", status_code=status.HTTP_200_OK)
async def get_admin_profile(request: Request):
    return await get_loggedin_admin(request)

@router.put("/admin/profile", status_code=status.HTTP_200_OK)
async def update_profile(request: Request, data: AdminProfileUpdateRequest):
    return await update_admin_profile(request, data)

@router.put("/admin/password", status_code=status.HTTP_200_OK)
async def update_password(request: Request, data: AdminPasswordChangeRequest):
    return await update_admin_password(request, data)
