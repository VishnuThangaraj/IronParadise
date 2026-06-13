from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from src.models.MembershipPlan import MembershipPlan
from src.schemas.membershipPlanSchemas import MembershipPlanRequest

# Create new Membership Plan
async def create_membership_plan(data: MembershipPlanRequest):
    existing_plan = await MembershipPlan.find_one(
        MembershipPlan.name == data.name
    )

    if existing_plan:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Membership Plan with this name already exists",
        )

    try:
        newPlan = MembershipPlan(**data.model_dump())
        await newPlan.insert()

        return {
            "message": "Membership Plan registered successfully",
            "membershipPlan": newPlan
        }
    
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Membership Plan with this name or ID already exists",
        )

# Fetch all Membership Plans
async def fetch_all_membership_plans():
    try:
        plans = await MembershipPlan.find().to_list(length=None)
        return plans
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve membership plans",
        )

# Fetch single Membership Plan by ID
async def fetch_membership_plan_by_id(id: str):
    plan = await MembershipPlan.find_one(MembershipPlan.membershipId == id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Membership Plan not found",
        )
    return plan

# Update Membership Plan
async def update_membership_plan(id: str, data: MembershipPlanRequest):
    plan = await MembershipPlan.find_one(MembershipPlan.membershipId == id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Membership Plan not found",
        )
    
    if data.name != plan.name:
        existing_plan = await MembershipPlan.find_one(
            MembershipPlan.name == data.name,
            MembershipPlan.membershipId != id
        )
        if existing_plan:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Membership Plan with this name already exists",
            )
            
    update_data = data.model_dump(exclude_unset=False)
    for key, value in update_data.items():
        setattr(plan, key, value)
        
    try:
        await plan.save()
        return {
            "message": "Membership Plan updated successfully",
            "membershipPlan": plan
        }
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Membership Plan with this name or ID already exists",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update membership plan: {str(e)}",
        )

# Delete Membership Plan
async def delete_membership_plan(id: str):
    plan = await MembershipPlan.find_one(MembershipPlan.membershipId == id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Membership Plan not found",
        )
        
    try:
        await plan.delete()
        return {
            "message": "Membership Plan deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete membership plan: {str(e)}",
        )

