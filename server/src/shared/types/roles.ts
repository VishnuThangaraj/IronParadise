export const ROLES = ["admin", "trainer", "member"] as const;

export type Role = (typeof ROLES)[number];
