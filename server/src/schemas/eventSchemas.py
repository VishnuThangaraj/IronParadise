from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Literal

class EventsRequest(BaseModel):
    name: str = Field(..., min_length=1)
    description: Optional[str] = None
    date: datetime
    time: str
    location: Optional[str] = None
    visibility: Literal["private", "trainer", "members", "all"]
