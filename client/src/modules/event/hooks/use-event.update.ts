import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { updateEvent } from "../api/event.api";
import { eventKeys } from "../event.keys";
import { SingleEventResponse, UpdateEventRequest } from "../types/event.types";

export interface UpdateEventVariables {
  id: string;
  data: UpdateEventRequest;
}

export const useEventUpdate = (
  options?: UseMutationOptions<
    SingleEventResponse,
    Error,
    UpdateEventVariables
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: UpdateEventVariables) => updateEvent(id, data),
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({
        queryKey: eventKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateEvent = useEventUpdate;
export default useEventUpdate;
