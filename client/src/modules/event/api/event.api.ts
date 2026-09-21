import api from "@/shared/service/api";
import {
  EventFormData,
  EventQueryParams,
  EventResponse,
  SingleEventResponse,
  UpdateEventRequest,
} from "../types/event.types";

// Get all events with optional query params
export const getEvents = async (
  params?: EventQueryParams,
): Promise<EventResponse> => {
  const response = await api.get<EventResponse>("/api/event", {
    params,
  });
  return response.data;
};

// Get event by ID
export const getEventById = async (
  eventId: string,
): Promise<SingleEventResponse> => {
  const response = await api.get<SingleEventResponse>(
    `/api/event/${eventId}`,
  );
  return response.data;
};

// Alias for getEventById
export const getEvent = getEventById;

// Create event
export const createEvent = async (
  eventData: EventFormData,
): Promise<SingleEventResponse> => {
  const response = await api.post<SingleEventResponse>(
    "/api/event/",
    eventData,
  );
  return response.data;
};

// Update event
export const updateEvent = async (
  eventId: string,
  eventData: UpdateEventRequest,
): Promise<SingleEventResponse> => {
  const response = await api.patch<SingleEventResponse>(
    `/api/event/${eventId}`,
    eventData,
  );
  return response.data;
};

// Delete event (soft delete)
export const deleteEvent = async (
  eventId: string,
): Promise<SingleEventResponse> => {
  const response = await api.delete<SingleEventResponse>(
    `/api/event/${eventId}`,
  );
  return response.data;
};

// Delete event (permanent delete)
export const deleteEventPermanently = async (
  eventId: string,
): Promise<SingleEventResponse> => {
  const response = await api.delete<SingleEventResponse>(
    `/api/event/${eventId}/permanent`,
  );
  return response.data;
};

