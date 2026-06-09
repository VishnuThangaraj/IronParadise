from pydantic import Field
from datetime import datetime
from typing import Optional
from pymongo import IndexModel, ASCENDING
from beanie import Document, before_event, Insert, Save

class Counter(Document):
    id: str
    seq: int = Field(default=1)

    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "counters"

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()