import { MemberQueryParams } from "./types/member.types";

export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  list: (params?: MemberQueryParams) =>
    params ? ([...memberKeys.lists(), params] as const) : ([...memberKeys.lists()] as const),
  details: () => [...memberKeys.all, "detail"] as const,
  detail: (id: string) => [...memberKeys.details(), id] as const,
};
