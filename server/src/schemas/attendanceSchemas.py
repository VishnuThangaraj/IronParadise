from pydantic import BaseModel, Field
from typing import Literal


class AttendanceActionRequest(BaseModel):
    userId: str = Field(..., description="ID of the Member or Trainer")
    userType: Literal["member", "trainer"] = Field(..., description="Type of the user checking in/out")
