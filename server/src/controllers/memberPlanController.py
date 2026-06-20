from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from src.models.MemberPlans import MemberPlans
from src.schemas.memberPlanSchemas import MemberPlansRequest
from src.models.Member import Member
from src.models.MembershipPlan import MembershipPlan
from src.models.Trainer import Trainer
from src.models.DietPlan import DietPlan
from src.models.WorkoutPlan import WorkoutPlan

async def assign_member_plans(data: MemberPlansRequest):
    try:
        # Resolve relationship documents
        member_doc = await Member.find_one(Member.memberId == data.memberId)
        membership_doc = await MembershipPlan.find_one(MembershipPlan.membershipId == data.membershipId) if data.membershipId else None
        trainer_doc = await Trainer.find_one(Trainer.trainerID == data.trainerId) if data.trainerId else None
        diet_doc = await DietPlan.find_one(DietPlan.planId == data.dietPlanId) if data.dietPlanId else None
        workout_doc = await WorkoutPlan.find_one(WorkoutPlan.planId == data.workoutPlanId) if data.workoutPlanId else None

        # Check if already exists for this member
        existing_plan = await MemberPlans.find_one(MemberPlans.memberId == data.memberId)
        
        if existing_plan:
            # Update existing
            update_data = data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(existing_plan, key, value)
            
            existing_plan.member = member_doc
            existing_plan.membership = membership_doc
            existing_plan.trainer = trainer_doc
            existing_plan.dietPlan = diet_doc
            existing_plan.workoutPlan = workout_doc
            if data.dietPlanId or data.workoutPlanId:
                existing_plan.activePlanType = "manual"

            await existing_plan.save()
            return {
                "message": "Member plans updated successfully",
                "member_plans": existing_plan
            }
        else:
            # Create new
            new_plan = MemberPlans(
                **data.model_dump(),
                member=member_doc,
                membership=membership_doc,
                trainer=trainer_doc,
                dietPlan=diet_doc,
                workoutPlan=workout_doc,
                activePlanType="manual" if (data.dietPlanId or data.workoutPlanId) else "manual"
            )
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
    plan = await MemberPlans.find_one(MemberPlans.memberId == member_id, fetch_links=True)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plans not found for this member"
        )
    return plan

async def fetch_all_member_plans():
    try:
        plans = await MemberPlans.find(fetch_links=True).to_list(length=None)
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
