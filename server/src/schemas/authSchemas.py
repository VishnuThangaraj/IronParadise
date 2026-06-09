from pydantic import BaseModel, EmailStr

from typing import Optional

class AdminRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str

class AdminProfileUpdateRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class AdminPasswordChangeRequest(BaseModel):
    current: str
    new: str

