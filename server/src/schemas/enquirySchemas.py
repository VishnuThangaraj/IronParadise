from pydantic import BaseModel, EmailStr
from typing import Optional

class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    mobile: str
    userType: str # 'member', 'trainer', 'guest'
    subject: str
    message: str

class EnquiryUpdate(BaseModel):
    status: str # 'replied'

class EnquiryReply(BaseModel):
    replyMessage: str
