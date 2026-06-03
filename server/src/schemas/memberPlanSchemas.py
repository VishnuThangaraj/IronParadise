from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class MemberPlansRequest(BaseModel):
    memberId: str
    membershipId: Optional[str] = None
    dietPlanId: Optional[str] = None
    workoutPlanId: Optional[str] = None
    trainerId: Optional[str] = None
    membershipStartDate: Optional[datetime] = None
    membershipEndDate: Optional[datetime] = None
