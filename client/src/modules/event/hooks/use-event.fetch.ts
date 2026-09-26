import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  getBirthdaysByMonth,
  getEvents,
  getEventsByMonth,
} from "../api/event.api";
import { eventKeys } from "../event.keys";
import {
  BirthdaysResponse,
  EventQueryParams,
  EventResponse,
  MonthEventsResponse,
} from "../types/event.types";

export const useEventFetch = (
  params?: EventQueryParams,
  options?: Omit<UseQueryOptions<EventResponse, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => getEvents(params),
    ...options,
  });
};

export const useEventsByMonth = (
  params?: { month?: number; year?: number; activeOnly?: boolean },
  options?: Omit<
    UseQueryOptions<MonthEventsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: [...eventKeys.lists(), "month", params],
    queryFn: () => getEventsByMonth(params),
    ...options,
  });
};

export const useBirthdaysByMonth = (
  params?: { month?: number; year?: number; activeOnly?: boolean },
  options?: Omit<
    UseQueryOptions<BirthdaysResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: [...eventKeys.lists(), "birthdays", params],
    queryFn: () => getBirthdaysByMonth(params),
    ...options,
  });
};

export const useEvents = useEventFetch;
export default useEventFetch;
