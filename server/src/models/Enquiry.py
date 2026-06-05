from pydantic import Field
from datetime import datetime
from typing import Optional
from pymongo import IndexModel, ASCENDING
from beanie import Document, before_event, Insert, Save

from src.utils.getNextID import getNextID

class Enquiry(Document):
    enquiryId: Optional[str] = Field(default=None)
    
    name: str
    email: str
    mobile: str
    userType: str # 'member', 'trainer', 'guest'
    subject: str
    message: str
    status: str = Field(default="pending") # 'pending', 'replied'
    replyMessage: Optional[str] = Field(default=None)
    repliedAt: Optional[datetime] = Field(default=None)
    
    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = 'enquiries'
        indexes = [IndexModel([('enquiryId', ASCENDING)], unique=True)]

    @before_event(Insert)
    async def prepare_enquiry(self):
        self.enquiryId = await getNextID('enquiry')

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()
