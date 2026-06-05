import os
import json
from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError
from datetime import datetime
from typing import Optional

from src.models.Events import Events
from src.schemas.eventSchemas import EventsRequest

# Create new Event
async def create_event(data: EventsRequest):
    try:
        new_event = Events(**data.model_dump())
        await new_event.insert()
        return {
            "success": True,
            "message": "Event created successfully",
            "event": new_event
        }
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event with this ID already exists",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create event: {str(e)}",
        )

# Fetch all Events (with optional filter)
async def fetch_all_events(
    visibility: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
):
    try:
        query = []
        if visibility:
            query.append(Events.visibility == visibility)
        if start_date:
            query.append(Events.date >= start_date)
        if end_date:
            query.append(Events.date <= end_date)

        if query:
            events = await Events.find(*query).to_list(length=None)
        else:
            events = await Events.find().to_list(length=None)
        return events
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve events: {str(e)}",
        )

# Fetch single Event by ID
async def fetch_event_by_id(id: str):
    event = await Events.find_one(Events.eventID == id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    return event

# Update Event
async def update_event(id: str, data: EventsRequest):
    event = await Events.find_one(Events.eventID == id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    
    update_data = data.model_dump(exclude_unset=False)
    for key, value in update_data.items():
        setattr(event, key, value)
        
    try:
        await event.save()
        return {
            "success": True,
            "message": "Event updated successfully",
            "event": event
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update event: {str(e)}",
        )

# Delete Event
async def delete_event(id: str):
    event = await Events.find_one(Events.eventID == id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
        
    try:
        await event.delete()
        return {
            "success": True,
            "message": "Event deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete event: {str(e)}",
        )

# Populate Events
async def populate_events():
    file_path = os.path.join(os.path.dirname(__file__), "..", "data", "event.json")
    try:
        with open(file_path, "r") as f:
            events_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        events_data = []

    count = 0
    for event in events_data:
        # Avoid duplicating same event on same date
        event_date = datetime.fromisoformat(event["date"])
        existing_event = await Events.find_one(Events.name == event["name"], Events.date == event_date)
        if existing_event:
            continue
        
        event["date"] = event_date
        new_event = Events(**event)
        await new_event.insert()
        count += 1

    return {
        "success": True,
        "message": f"Events populated successfully. Added {count} new events."
    }
