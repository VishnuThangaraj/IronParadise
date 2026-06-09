from pydantic import Field
from typing import Optional
from datetime import datetime
from pymongo import IndexModel, ASCENDING
from beanie import Document, before_event, Insert, Save

from src.utils.getNextID import getNextID

class MembershipPlan(Document):
    membershipId: Optional[str] = Field(default=None)
    name: str
    duration: str
    amount: int
    description: str
    status: str
    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "membership_plans"
        indexes = [IndexModel([('membershipId', ASCENDING)], unique=True)]

    @before_event(Insert)
    async def prepare_membership_plan(self):
        self.membershipId = await getNextID('membership_plan')

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()