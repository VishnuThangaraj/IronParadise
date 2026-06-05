from fastapi import HTTPException, status
from datetime import datetime

from src.models.Member import Member
from src.models.MemberPayment import MemberPayment
from src.models.MemberPlans import MemberPlans
from src.models.MembershipPlan import MembershipPlan
from src.utils.getNextID import getNextID

def recalculate_member_pending_amount(member: Member):
    """Recalculates the member's total pending payment balance from their payment history."""
    member.totalPendingAmount = sum(max(0.0, p.totalAmount - p.paidAmount) for p in member.paymentHistory)

async def add_member_payment(id: str, data: dict):
    member = await Member.find_one(Member.memberId == id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found",
        )
    
    data['paymentID'] = await getNextID("member_payment")
    data['memberId'] = member.memberId
    
    # Avoid duplicate payments for the same month/plan
    plan_name = data.get('planName')
    if any(p.planName == plan_name for p in member.paymentHistory):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment record for '{plan_name}' already exists for this member."
        )
    
    # Auto-calculate pendingAmount and status
    total = float(data.get('totalAmount', 0.0))
    paid = float(data.get('paidAmount', 0.0))
    data['pendingAmount'] = max(0.0, total - paid)
    
    if paid >= total:
        data['status'] = "Paid"
    elif paid == 0.0:
        data['status'] = "Unpaid"
    else:
        data['status'] = "Partially Paid"
    
    new_payment = MemberPayment(**data)
    member.paymentHistory.append(new_payment)
    recalculate_member_pending_amount(member)
    
    try:
        await member.save()
        return {
            "message": "Payment record added successfully",
            "member": member
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add payment record: {str(e)}",
        )

async def update_member_payment(id: str, payment_id: str, data: dict):
    member = await Member.find_one(Member.memberId == id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found",
        )
    
    payment_record = next((p for p in member.paymentHistory if p.paymentID == payment_id), None)
    if not payment_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment record not found",
        )
    
    # Check for duplicate planName if it's being updated
    new_plan_name = data.get("planName")
    if new_plan_name and new_plan_name != payment_record.planName:
        if any(p.planName == new_plan_name for p in member.paymentHistory):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Payment record for '{new_plan_name}' already exists for this member."
            )
            
    for key, value in data.items():
        if hasattr(payment_record, key) and value is not None:
            setattr(payment_record, key, value)
            
    # Auto-calculate pendingAmount and status on the updated record
    payment_record.pendingAmount = max(0.0, payment_record.totalAmount - payment_record.paidAmount)
    if payment_record.paidAmount >= payment_record.totalAmount:
        payment_record.status = "Paid"
    elif payment_record.paidAmount == 0.0:
        payment_record.status = "Unpaid"
    else:
        payment_record.status = "Partially Paid"
            
    member.updatedAt = datetime.utcnow()
    recalculate_member_pending_amount(member)

    try:
        await member.save()
        return {
            "message": "Payment record updated successfully",
            "member": member
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update payment record: {str(e)}",
        )

async def remove_member_payment(id: str, payment_id: str):
    member = await Member.find_one(Member.memberId == id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found",
        )
    
    initial_length = len(member.paymentHistory)
    member.paymentHistory = [p for p in member.paymentHistory if p.paymentID != payment_id]
    
    if len(member.paymentHistory) == initial_length:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment record not found",
        )
        
    recalculate_member_pending_amount(member)

    try:
        await member.save()
        return {
            "message": "Payment record removed successfully",
            "member": member
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to remove payment record: {str(e)}",
        )

async def bulk_invoice_members(data: dict):
    """Invoices all active members who have an assigned membership plan."""
    from src.utils.getNextID import getNextID
    
    month = data.get("month") # e.g. "June 2026"
    payment_date_str = data.get("paymentDate")
    if payment_date_str:
        if isinstance(payment_date_str, str):
            payment_date = datetime.fromisoformat(payment_date_str.replace("Z", "+00:00"))
        else:
            payment_date = payment_date_str
    else:
        payment_date = datetime.utcnow()
        
    payment_method = data.get("paymentMethod") or "UPI"
    remarks = data.get("remarks") or f"Bulk monthly bill for {month}"
    
    # Fetch all active members
    members = await Member.find(Member.isActive == True).to_list(length=None)
    
    processed_count = 0
    skipped_count = 0
    
    for member in members:
        # Check if already has a record for this month/planName
        # Find active plan for this member
        member_plans = await MemberPlans.find_one(MemberPlans.memberId == member.memberId)
        if not member_plans or not member_plans.membershipId:
            skipped_count += 1
            continue
            
        m_plan = await MembershipPlan.find_one(MembershipPlan.membershipId == member_plans.membershipId)
        if not m_plan:
            skipped_count += 1
            continue
            
        # Avoid creating duplicate invoices for the same month and same membership
        invoice_name = f"{m_plan.name} - {month}"
        if any(p.planName == invoice_name for p in member.paymentHistory):
            skipped_count += 1
            continue
            
        payment_id = await getNextID("member_payment")
        payment_record = MemberPayment(
            paymentID=payment_id,
            memberId=member.memberId,
            planName=invoice_name,
            totalAmount=m_plan.amount,
            paidAmount=0.0, # Unpaid initially
            pendingAmount=m_plan.amount,
            paymentDate=payment_date,
            paymentMethod=payment_method,
            status="Unpaid",
            remarks=remarks
        )
        
        member.paymentHistory.append(payment_record)
        recalculate_member_pending_amount(member)
        await member.save()
        processed_count += 1
        
    return {
        "message": f"Bulk invoicing processed. Invoiced: {processed_count}, Skipped (no active plan or duplicate): {skipped_count}",
        "processed": processed_count,
        "skipped": skipped_count
    }
