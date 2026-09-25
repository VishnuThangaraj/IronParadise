import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { deleteEvent, deleteEventPermanently } from "../api/event.api";
import { eventKeys } from "../event.keys";
import { SingleEventResponse } from "../types/event.types";

export interface DeleteEventVariables {
  id: string;
  permanent?: boolean;
}

export const useEventDelete = (
  options?: UseMutationOptions<
    SingleEventResponse,
    Error,
    DeleteEventVariables | string
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (variables: DeleteEventVariables | string) => {
      const id = typeof variables === "string" ? variables : variables.id;
      const isPermanent =
        typeof variables === "string" ? false : Boolean(variables.permanent);

      return isPermanent ? deleteEventPermanently(id) : deleteEvent(id);
    },
    onSuccess: (...args) => {
      const [, variables] = args;
      const id = typeof variables === "string" ? variables : variables.id;
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteEvent = useEventDelete;
export default useEventDelete;
