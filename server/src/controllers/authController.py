from fastapi import HTTPException, status, Request
from pymongo.errors import DuplicateKeyError

from src.models.Admin import Admin
from src.utils.security import verify_password, create_access_token, decode_access_token
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

# Fetch Loggedin Admin using token
async def get_loggedin_admin(request: Request):
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided",
        )

    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    else:
        token = auth_header

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    admin = await Admin.find_one(Admin.email == email)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found",
        )

    return {
        "user": admin,
    }