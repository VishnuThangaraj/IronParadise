from pydantic import BaseModel, EmailStr
from typing import List

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

class BulkEmailRequest(BaseModel):
    recipients: List[EmailStr]
    subject: str
    body: str