from fastapi import APIRouter, Request, status

from src.schemas.memberMeasurementSchemas import DailyMeasurementRequest
from src.controllers.authController import get_loggedin_admin
from src.controllers.memberMeasurementController import (
    add_measurement,
    fetch_member_measurements,
    delete_daily_measurement,
    delete_all_measurements
)

router = APIRouter(prefix='/member-measurement', tags=['MemberMeasurement'])

@router.post('/add', status_code=status.HTTP_201_CREATED)
async def create_measurement(request: Request, data: DailyMeasurementRequest):
    await get_loggedin_admin(request)
    return await add_measurement(data)

@router.get('/{member_id}', status_code=status.HTTP_200_OK)
async def get_measurements(request: Request, member_id: str):
    await get_loggedin_admin(request)
    return await fetch_member_measurements(member_id)

@router.delete('/delete/{member_id}/{date}', status_code=status.HTTP_200_OK)
async def remove_daily_measurement(request: Request, member_id: str, date: str):
    await get_loggedin_admin(request)
    return await delete_daily_measurement(member_id, date)
    
@router.delete('/delete-all/{member_id}', status_code=status.HTTP_200_OK)
async def remove_all_measurements(request: Request, member_id: str):
    await get_loggedin_admin(request)
    return await delete_all_measurements(member_id)

