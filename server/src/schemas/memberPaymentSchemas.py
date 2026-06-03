from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class MemberPaymentRequest(BaseModel):
    planName: str
    totalAmount: float
    paidAmount: float
    pendingAmount: float
    paymentDate: Optional[datetime] = None
    paymentMethod: Optional[str] = None
    status: str = "Paid"
    remarks: Optional[str] = None

class BulkMemberPaymentRequest(BaseModel):
    month: str
    paymentDate: Optional[datetime] = None
    paymentMethod: Optional[str] = "UPI"
    remarks: Optional[str] = None
