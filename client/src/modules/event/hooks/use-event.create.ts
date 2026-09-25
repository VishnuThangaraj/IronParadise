import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { createEvent } from "../api/event.api";
import { eventKeys } from "../event.keys";
import { EventFormData, SingleEventResponse } from "../types/event.types";

export const useEventCreate = (
  options?: UseMutationOptions<SingleEventResponse, Error, EventFormData>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: EventFormData) => createEvent(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
};

export const useCreateEvent = useEventCreate;
export default useEventCreate;
