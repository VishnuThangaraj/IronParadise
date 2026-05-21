from pydantic import BaseModel, EmailStr

class AdminRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str
