from pydantic import Field
from typing import Optional
from datetime import datetime
from pymongo import IndexModel, ASCENDING
from beanie import Document, before_event, Insert, Save

from src.utils.getNextID import getNextID

class MemberPlans(Document):
    memberPlanId: Optional[str] = Field(default=None)
    memberId: str
    membershipId: Optional[str] = None
    dietPlanId: Optional[str] = None
    workoutPlanId: Optional[str] = None
    trainerId: Optional[str] = None
    
    membershipStartDate: Optional[datetime] = None
    membershipEndDate: Optional[datetime] = None
    
    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "member_plans"
        indexes = [
            IndexModel([("memberPlanId", ASCENDING)], unique=True),
            IndexModel([("memberId", ASCENDING)], unique=True)
        ]

    @before_event(Insert)
    async def prepare_member_plans(self):
        self.memberPlanId = await getNextID('member_plan')

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()