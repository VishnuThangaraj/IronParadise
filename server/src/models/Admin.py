from pydantic import Field
from typing import Optional
from datetime import datetime
from pymongo import IndexModel, ASCENDING
from beanie import Document, before_event, Insert, Save

from src.utils.security import hash_password
from src.utils.getNextID import getNextID

class Admin(Document):
    username: Optional[str] = None
    name:str
    email:str
    password:str= Field(exclude=True)
    role: Optional[str] = Field(default="admin")
    phone: Optional[str] = None
    status: Optional[str] = Field(default="Active")
    lastSession: Optional[datetime] = None

    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "admins"
        indexes = [IndexModel([("email", ASCENDING)], unique=True),
        IndexModel([("username", ASCENDING)], unique=True)]

    @before_event(Insert)
    async def prepare_admin(self):
        self.username = await getNextID('admin')
        self.password = hash_password(self.password)

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()