from pydantic import BaseModel

class MembershipPlanRequest(BaseModel):
    name: str
    duration: str
    amount: int
    description: str
    status: str
