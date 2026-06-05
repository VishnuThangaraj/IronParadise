from fastapi import APIRouter, Request, status, Query
from typing import Optional

from src.schemas.attendanceSchemas import AttendanceActionRequest
from src.controllers.attendanceController import (
    check_in,
    check_out,
    fetch_user_status,
    fetch_kiosk_users
)

router = APIRouter(prefix="/kiosk", tags=["Kiosk"])

@router.get("/users", status_code=status.HTTP_200_OK)
async def get_kiosk_users(request: Request):
    # No auth check for public kiosk
    return await fetch_kiosk_users()

@router.post("/check-in", status_code=status.HTTP_201_CREATED)
async def kiosk_check_in(request: Request, data: AttendanceActionRequest):
    # No auth check
    return await check_in(data)

@router.post("/check-out", status_code=status.HTTP_200_OK)
async def kiosk_check_out(request: Request, data: AttendanceActionRequest):
    # No auth check
    return await check_out(data)

@router.get("/status/{userId}", status_code=status.HTTP_200_OK)
async def get_kiosk_user_status(request: Request, userId: str):
    # No auth check
    return await fetch_user_status(userId)
