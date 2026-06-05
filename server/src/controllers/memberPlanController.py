from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from src.models.MemberPlans import MemberPlans
from src.schemas.memberPlanSchemas import MemberPlansRequest

async def assign_member_plans(data: MemberPlansRequest):
    try:
        # Check if already exists for this member
        existing_plan = await MemberPlans.find_one(MemberPlans.memberId == data.memberId)
        
        if existing_plan:
            # Update existing
            update_data = data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(existing_plan, key, value)
            await existing_plan.save()
            return {
                "message": "Member plans updated successfully",
                "member_plans": existing_plan
            }
        else:
            # Create new
            new_plan = MemberPlans(**data.model_dump())
            await new_plan.insert()
            return {
                "message": "Member plans assigned successfully",
                "member_plans": new_plan
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process member plans: {str(e)}",
        )

async def fetch_member_plans(member_id: str):
    plan = await MemberPlans.find_one(MemberPlans.memberId == member_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plans not found for this member"
        )
    return plan

async def fetch_all_member_plans():
    try:
        plans = await MemberPlans.find().to_list(length=None)
        return plans
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve member plans"
        )

async def remove_member_plans(member_id: str):
    plan = await MemberPlans.find_one(MemberPlans.memberId == member_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plans not found for this member"
        )
    
    try:
        await plan.delete()
        return {
            "message": "Member plans removed successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to remove member plans: {str(e)}"
        )
