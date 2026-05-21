from fastapi import APIRouter
from src.schemas.authSchemas import AdminRegisterRequest, AdminLoginRequest
from src.controllers.authController import register_admin,login_admin

router = APIRouter(prefix="/auth")

@router.post("/admin/register")
async def register(user: AdminRegisterRequest):
    return await register_admin(user)

@router.post("/admin/login")
async def login(credentials: AdminLoginRequest):
    return await login_admin(credentials)