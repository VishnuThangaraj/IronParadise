import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getEvents } from "../api/event.api";
import { eventKeys } from "../event.keys";
import { EventQueryParams, EventResponse } from "../types/event.types";

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

export const useEvents = useEventFetch;
export default useEventFetch;
