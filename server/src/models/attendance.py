from typing import Optional, List, Literal
from datetime import datetime

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field


class AttendanceSession(BaseModel):
    checkIn: Optional[str] = None
    checkOut: Optional[str] = None


class Attendance(Document):
    user: PydanticObjectId

    # Restrict allowed values
    userType: Literal["User", "Member"]

    date: datetime

    # Avoid mutable default issue
    sessions: List[AttendanceSession] = Field(default_factory=list)

    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "attendances"
