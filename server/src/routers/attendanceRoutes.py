from fastapi import APIRouter, Request, status, Query
from typing import Optional

from src.schemas.attendanceSchemas import AttendanceActionRequest
from src.controllers.authController import get_loggedin_admin
from src.controllers.attendanceController import (
    check_in,
    check_out,
    fetch_user_status,
    fetch_attendance_logs,
    fetch_attendance_summary,
    populate_attendance,
)

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/check-in", status_code=status.HTTP_201_CREATED)
async def attendance_check_in(request: Request, data: AttendanceActionRequest):
    await get_loggedin_admin(request)
    return await check_in(data)


@router.post("/check-out", status_code=status.HTTP_200_OK)
async def attendance_check_out(request: Request, data: AttendanceActionRequest):
    await get_loggedin_admin(request)
    return await check_out(data)


@router.get("/status/{userId}", status_code=status.HTTP_200_OK)
async def get_user_status(request: Request, userId: str):
    await get_loggedin_admin(request)
    return await fetch_user_status(userId)


@router.get("/logs", status_code=status.HTTP_200_OK)
async def get_attendance_logs(
    request: Request,
    date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format"),
    month: Optional[str] = Query(None, description="Month in YYYY-MM format"),
    userType: Optional[str] = Query(None, description="Filter by userType ('member' or 'trainer')"),
    userId: Optional[str] = Query(None, description="Filter by specific userId"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    await get_loggedin_admin(request)
    return await fetch_attendance_logs(
        date=date, month=month, userType=userType, userId=userId, skip=skip, limit=limit
    )

@router.get("/summary", status_code=status.HTTP_200_OK)
async def get_attendance_summary(request: Request):
    await get_loggedin_admin(request)
    return await fetch_attendance_summary()


@router.get("/populate", status_code=status.HTTP_201_CREATED)
async def populate(request: Request):
    await get_loggedin_admin(request)
    return await populate_attendance()
