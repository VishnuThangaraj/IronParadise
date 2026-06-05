from fastapi import APIRouter, Request, status, Query
from typing import Optional
from datetime import datetime

from src.schemas.eventSchemas import EventsRequest
from src.controllers.authController import get_loggedin_admin
from src.controllers.eventController import (
    create_event,
    fetch_all_events,
    fetch_event_by_id,
    update_event,
    delete_event,
    populate_events
)

router = APIRouter(prefix='/event', tags=['Event'])

@router.post('/create', status_code=status.HTTP_201_CREATED)
async def register_event(request: Request, data: EventsRequest):
    await get_loggedin_admin(request)
    return await create_event(data)

@router.get('/populate', status_code=status.HTTP_201_CREATED)
async def populate_events_route(request: Request):
    await get_loggedin_admin(request)
    return await populate_events()

@router.get('/all', status_code=status.HTTP_200_OK)
async def get_all_events(
    request: Request, 
    visibility: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None)
):
    await get_loggedin_admin(request)
    return await fetch_all_events(visibility, start_date, end_date)

@router.get('/{id}', status_code=status.HTTP_200_OK)
async def get_event_by_id(request: Request, id: str):
    await get_loggedin_admin(request)
    return await fetch_event_by_id(id)

@router.put('/update/{id}', status_code=status.HTTP_200_OK)
async def update_event_by_id(request: Request, id: str, data: EventsRequest):
    await get_loggedin_admin(request)
    return await update_event(id, data)

@router.delete('/delete/{id}', status_code=status.HTTP_200_OK)
async def delete_event_by_id(request: Request, id: str):
    await get_loggedin_admin(request)
    return await delete_event(id)
