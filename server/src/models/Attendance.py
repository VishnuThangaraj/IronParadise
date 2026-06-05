from typing import List, Optional
from datetime import datetime
from beanie import Document, before_event, Save
from pydantic import BaseModel, Field
from pymongo import IndexModel, ASCENDING


class AttendanceRecord(BaseModel):
    checkIn: datetime = Field(default_factory=datetime.utcnow)
    checkOut: Optional[datetime] = None


class Attendance(Document):
    userId: str  # References memberId or trainerID
    userType: str  # 'member' or 'trainer'
    userName: str  # Cached for display optimization
    date: datetime  # UTC midnight representing the day
    status: str = "checked-in"  # "checked-in" or "checked-out"
    records: List[AttendanceRecord] = Field(default_factory=list)
    totalMinutes: float = 0.0

    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "attendance"
        indexes = [
            IndexModel(
                [("userId", ASCENDING), ("date", ASCENDING)],
                unique=True
            ),
            IndexModel([("date", ASCENDING)]),
            IndexModel([("userType", ASCENDING)]),
        ]

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()