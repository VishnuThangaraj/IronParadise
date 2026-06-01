from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from pymongo import IndexModel, ASCENDING
from beanie import Document, before_event, Insert, Save

from src.utils.getNextID import getNextID

class Trainer(Document):
    trainerID: Optional[str] = Field(default=None)
    
    name: str
    email: str
    mobile: str
    address: str
    gender: str
    specialization: str
    experience: int
    shiftTime: str
    salary: float
    dob: Optional[datetime] = None
    joinDate: Optional[datetime] = Field(default_factory=datetime.utcnow)
    isWorking: Optional[bool] = True
    
    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Settings:
        name = 'trainers'
        indexes = [IndexModel([('trainerID', ASCENDING)], unique=True)]

    @before_event(Insert)
    async def prepare_trainer(self):
        self.trainerID = await getNextID('trainer')

    @before_event(Save)
    async def update_timestamps(self):
        self.updatedAt = datetime.utcnow()