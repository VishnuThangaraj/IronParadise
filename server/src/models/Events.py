from pydantic import Field
from datetime import datetime
from typing import Optional
from pymongo import IndexModel, ASCENDING
from beanie import Document, before_event, Insert, Save

from src.utils.getNextID import getNextID

class Events(Document):
    eventID: Optional[str] = Field(default=None)
    name: str
    description: Optional[str] = None
    date: datetime
    time: str
    location: Optional[str] = None
    visibility: str # 'private', 'trainer', 'members', 'all'
    
    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "events"
        indexes = [IndexModel([('eventID', ASCENDING)], unique=True)]

    @before_event(Insert)
    async def prepare_event(self):
        self.eventID = await getNextID('events')

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()