from fastapi import APIRouter,Request
from src.schemas.authSchemas import AdminRegisterRequest, AdminLoginRequest
from src.controllers.authController import register_admin,login_admin,get_loggedin_admin

router = APIRouter(prefix="/auth")

@router.post("/admin/register")
async def register(user: AdminRegisterRequest):
    return await register_admin(user)

@router.post("/admin/login")
async def login(credentials: AdminLoginRequest):
    return await login_admin(credentials)

@router.get("/admin/profile")
async def get_admin_profile(request: Request):
    return await get_loggedin_admin(request)