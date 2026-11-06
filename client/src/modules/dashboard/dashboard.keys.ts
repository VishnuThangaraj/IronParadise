export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
  trainer: () => [...dashboardKeys.all, "trainer"] as const,
  member: () => [...dashboardKeys.all, "member"] as const,
};
