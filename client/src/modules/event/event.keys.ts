import { EventQueryParams } from "./types/event.types";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (params?: EventQueryParams) =>
    params ? ([...eventKeys.lists(), params] as const) : ([...eventKeys.lists()] as const),
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
};
