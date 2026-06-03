from typing import Optional
from pydantic import BaseModel

class DailyMeasurementRequest(BaseModel):
    memberId: str
    date: str # YYYY-MM-DD
    height: Optional[float] = None
    weight: Optional[float] = None
    bmi: Optional[float] = None
    bodyFat: Optional[float] = None
    chest: Optional[float] = None
    arms: Optional[float] = None
    waist: Optional[float] = None
    thighs: Optional[float] = None
