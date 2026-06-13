from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from pymongo import IndexModel, ASCENDING
from beanie import Document, Link, before_event, Insert, Save

from src.models.Member import Member

class DailyMeasurement(BaseModel):
    date: str # YYYY-MM-DD format
    height: Optional[float] = None
    weight: Optional[float] = None
    bmi: Optional[float] = None
    bodyFat: Optional[float] = None
    chest: Optional[float] = None
    arms: Optional[float] = None
    waist: Optional[float] = None
    thighs: Optional[float] = None

class MemberMeasurement(Document):
    memberId: str
    member: Optional[Link[Member]] = None
    measurements: List[DailyMeasurement] = Field(default_factory=list)
    
    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "member_measurements"
        indexes = [
            IndexModel([("memberId", ASCENDING)], unique=True)
        ]

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()

