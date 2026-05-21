from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from src.models.Admin import Admin
from src.utils.security import verify_password, create_access_token
from src.schemas.authSchemas import AdminRegisterRequest, AdminLoginRequest

# Register Admin
async def register_admin(data: AdminRegisterRequest):

    existing_admin = await Admin.find_one(
        Admin.email == data.email
    )

    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin with this email already exists",
        )

    try:
        admin = Admin(**data.model_dump())
        await admin.insert()

        return {
            "message": "Admin registered successfully",
            "admin": admin
        }

    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin already exists",
        )

# Login Admin
async def login_admin(data: AdminLoginRequest):
    admin = await Admin.find_one(Admin.email == data.email)

    if not admin:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Invalid credentials"
        )

    if not verify_password(data.password, admin.password):
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Invalid credentials"
        )

    token = create_access_token({"sub": admin.email, "role": admin.role})

    return {
        "message": "Admin logged in successfully",
        "token": token,
        "admin": admin,
    }

