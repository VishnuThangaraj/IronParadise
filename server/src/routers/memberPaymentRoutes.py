from fastapi import APIRouter, Request, status

from src.schemas.memberPaymentSchemas import MemberPaymentRequest, BulkMemberPaymentRequest
from src.controllers.authController import get_loggedin_admin
from src.controllers.memberPaymentController import (
    add_member_payment,
    update_member_payment,
    remove_member_payment,
    bulk_invoice_members
)

router = APIRouter(prefix="/member-payment", tags=["Member Payment"])

@router.post("/{id}/add", status_code=status.HTTP_201_CREATED)
async def add_payment(request: Request, id: str, data: MemberPaymentRequest):
    await get_loggedin_admin(request)
    return await add_member_payment(id, data.model_dump())

@router.put("/{id}/update/{payment_id}", status_code=status.HTTP_200_OK)
async def update_payment(request: Request, id: str, payment_id: str, data: MemberPaymentRequest):
    await get_loggedin_admin(request)
    return await update_member_payment(id, payment_id, data.model_dump(exclude_unset=True))

@router.delete("/{id}/remove/{payment_id}", status_code=status.HTTP_200_OK)
async def remove_payment(request: Request, id: str, payment_id: str):
    await get_loggedin_admin(request)
    return await remove_member_payment(id, payment_id)

@router.post("/bulk-invoice", status_code=status.HTTP_201_CREATED)
async def bulk_invoice(request: Request, data: BulkMemberPaymentRequest):
    await get_loggedin_admin(request)
    return await bulk_invoice_members(data.model_dump())
