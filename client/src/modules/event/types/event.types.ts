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
  month?: number;
  year?: number;
  activeOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface BirthdayUser {
  userId: string;
  fullName: string;
  role: "member" | "trainer";
  dob: string;
  birthdayDate: string;
  day: number;
  age?: number;
  profileImage?: string;
  gender?: string;
  phone?: string;
  email?: string;
  title: string;
}

export interface MonthEventsData {
  events: Event[];
  birthdays: BirthdayUser[];
  month: number;
  year: number;
  totalEvents: number;
  totalBirthdays: number;
}

export interface MonthEventsResponse {
  success: boolean;
  message: string;
  data: MonthEventsData;
}

export interface BirthdaysResponse {
  success: boolean;
  message: string;
  data: BirthdayUser[];
}

export interface EventResponse {
  success: boolean;
  message: string;
  data: Event[] | MonthEventsData;
}

export interface SingleEventResponse {
  success: boolean;
  message: string;
  data: Event;
}
