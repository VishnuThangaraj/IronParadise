from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class MemberRequest(BaseModel):
    name: str
    email: str
    mobile: str
    address: str
    gender: str
    dob: Optional[datetime] = None
    joinDate: Optional[datetime] = Field(default_factory=datetime.utcnow)
    isActive: Optional[bool] = True
