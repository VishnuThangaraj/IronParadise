from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

from src.models.Trainer import Trainer

class TrainerRequest(BaseModel):
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