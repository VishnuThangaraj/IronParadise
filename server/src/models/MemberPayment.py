from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class MemberPayment(BaseModel):
    paymentID: Optional[str] = Field(default=None)
    memberId: str
    planName: str
    totalAmount: float
    paidAmount: float
    pendingAmount: float
    paymentDate: Optional[datetime] = None
    paymentMethod: Optional[str] = None
    status: str = "Paid"
    remarks: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
