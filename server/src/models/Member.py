from typing import Optional, List
from datetime import datetime
from pymongo import IndexModel, ASCENDING
from src.utils.getNextID import getNextID
from beanie import Document, before_event, Insert, Save
from pydantic import Field

from src.models.MemberPayment import MemberPayment

class Member(Document):
    memberId: Optional[str] = Field(default=None)
    
    name: str
    email: str
    mobile: str
    address: str
    gender: str
    dob: Optional[datetime] = None
    joinDate: Optional[datetime] = Field(default_factory=datetime.utcnow)
    isActive: Optional[bool] = True
    paymentHistory: List[MemberPayment] = Field(default_factory=list)
    totalPendingAmount: float = Field(default=0.0)

    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = 'members'
        indexes = [IndexModel([('memberId', ASCENDING)], unique=True)]

    @before_event(Insert)
    async def prepare_member(self):
        self.memberId = await getNextID('member')

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()