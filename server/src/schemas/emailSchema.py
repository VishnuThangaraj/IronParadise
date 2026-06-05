from pydantic import BaseModel, EmailStr

class EmailRequest(BaseModel):
    to: EmailStr
    subject: str
    body: str

class TrainerWelcomeRequest(BaseModel):
    name: str
    email: EmailStr
    mobile: str
    specialization: str
    shift_time: str