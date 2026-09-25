import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getEventById } from "../api/event.api";
import { eventKeys } from "../event.keys";
import { SingleEventResponse } from "../types/event.types";

export const useEvent = (
  eventId: string,
  options?: Omit<
    UseQueryOptions<SingleEventResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => getEventById(eventId),
    enabled: Boolean(eventId),
    ...options,
  });
};

export default useEvent;
