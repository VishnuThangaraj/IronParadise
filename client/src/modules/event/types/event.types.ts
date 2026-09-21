export type EventVisibility = "all" | "member" | "trainer" | "private";

export interface Event {
  _id: string;
  eventId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  visibility: EventVisibility;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export type EventFormData = Omit<
  Event,
  "_id" | "eventId" | "createdAt" | "updatedAt" | "__v" | "isActive"
> & {
  eventId?: string;
  isActive?: boolean;
};

export type UpdateEventRequest = Partial<EventFormData>;

export interface EventQueryParams {
  search?: string;
  visibility?: EventVisibility;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface EventResponse {
  success: boolean;
  message: string;
  data: Event[];
}

export interface SingleEventResponse {
  success: boolean;
  message: string;
  data: Event;
}
