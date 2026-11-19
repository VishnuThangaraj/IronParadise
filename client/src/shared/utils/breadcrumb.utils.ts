export interface BreadcrumbItem {
  label: string;
  path?: string;
  isCurrent?: boolean;
}

export const getPortalTitle = (role?: string): string => {
  const normalized = role?.toLowerCase();
  if (normalized === "trainer") return "Trainer Portal";
  if (normalized === "member") return "Member Portal";
  return "Admin Panel";
};

/**
 * Resolves a route pathname to a list of structured breadcrumbs.
 */
export const generateBreadcrumbs = (
  pathname: string,
  _userRole?: string,
): BreadcrumbItem[] => {
  const cleanPath = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";

  // Root / Dashboard
  if (cleanPath === "/" || cleanPath === "/dashboard") {
    return [{ label: "Dashboard", isCurrent: true }];
  }

  // Attendance
  if (cleanPath === "/attendance") {
    return [{ label: "Attendance", isCurrent: true }];
  }

  // Events
  if (cleanPath === "/events") {
    return [{ label: "Events", isCurrent: true }];
  }

  // Messages
  if (cleanPath === "/message") {
    return [{ label: "Messages", isCurrent: true }];
  }

  // Enquiries
  if (cleanPath === "/enquiry") {
    return [{ label: "Enquiries", isCurrent: true }];
  }

  // Payments / Paylist
  if (cleanPath === "/payment") {
    return [
      { label: "Payments", path: "/payment" },
      { label: "Membership Paylist", isCurrent: true },
    ];
  }

  // Member Management & Self-Service
  if (cleanPath.startsWith("/member")) {
    // Self-Service Routes (Member Role)
    if (cleanPath === "/member/my-attendance") {
      return [{ label: "My Attendance", isCurrent: true }];
    }
    if (cleanPath === "/member/my-trainer") {
      return [{ label: "My Trainer", isCurrent: true }];
    }
    if (cleanPath === "/member/my-plans") {
      return [{ label: "My Fitness Plans", isCurrent: true }];
    }
    if (cleanPath === "/member/my-membership") {
      return [{ label: "My Membership", isCurrent: true }];
    }

    const memberParentPath = "/member/list";

    if (cleanPath === "/member/list") {
      return [
        { label: "Members", path: memberParentPath },
        { label: "Members List", isCurrent: true },
      ];
    }
    if (cleanPath === "/member/add") {
      return [
        { label: "Members", path: memberParentPath },
        { label: "Add New Member", isCurrent: true },
      ];
    }
    if (cleanPath.startsWith("/member/edit/")) {
      const id = cleanPath.replace("/member/edit/", "");
      return [
        { label: "Members", path: memberParentPath },
        { label: id ? `Edit Member (${id})` : "Edit Member", isCurrent: true },
      ];
    }
    // Details: /member/:memberId
    const memberId = cleanPath.replace("/member/", "");
    if (memberId) {
      return [
        { label: "Members", path: memberParentPath },
        { label: `Member Details (${memberId})`, isCurrent: true },
      ];
    }
  }

  // Trainer Management & Self-Service
  if (cleanPath.startsWith("/trainer")) {
    if (cleanPath === "/trainer/my-members") {
      return [{ label: "My Members", isCurrent: true }];
    }
    if (cleanPath === "/trainer/members-attendance") {
      return [{ label: "Member Attendance", isCurrent: true }];
    }

    const trainerParentPath = "/trainer/list";

    if (cleanPath === "/trainer/list") {
      return [
        { label: "Trainers", path: trainerParentPath },
        { label: "Trainers List", isCurrent: true },
      ];
    }
    if (cleanPath === "/trainer/payroll") {
      return [
        { label: "Trainers", path: trainerParentPath },
        { label: "Trainers Payroll", isCurrent: true },
      ];
    }
    if (cleanPath === "/trainer/add") {
      return [
        { label: "Trainers", path: trainerParentPath },
        { label: "Add New Trainer", isCurrent: true },
      ];
    }
    if (cleanPath.startsWith("/trainer/edit/")) {
      const id = cleanPath.replace("/trainer/edit/", "");
      return [
        { label: "Trainers", path: trainerParentPath },
        { label: id ? `Edit Trainer (${id})` : "Edit Trainer", isCurrent: true },
      ];
    }
    // Details: /trainer/:userId
    const trainerId = cleanPath.replace("/trainer/", "");
    if (trainerId) {
      return [
        { label: "Trainers", path: trainerParentPath },
        { label: `Trainer Details (${trainerId})`, isCurrent: true },
      ];
    }
  }

  // Fitness Plans (Diet & Workout)
  if (cleanPath.startsWith("/plan/diet")) {
    const dietParentPath = "/plan/diet/list";
    if (cleanPath === "/plan/diet/list") {
      return [
        { label: "Fitness Plans" },
        { label: "Diet Plans", path: dietParentPath },
        { label: "Diet Plans List", isCurrent: true },
      ];
    }
    if (cleanPath === "/plan/diet/add") {
      return [
        { label: "Fitness Plans" },
        { label: "Diet Plans", path: dietParentPath },
        { label: "Add Diet Plan", isCurrent: true },
      ];
    }
    if (cleanPath.startsWith("/plan/diet/edit/")) {
      const id = cleanPath.replace("/plan/diet/edit/", "");
      return [
        { label: "Fitness Plans" },
        { label: "Diet Plans", path: dietParentPath },
        { label: id ? `Edit Diet Plan (${id})` : "Edit Diet Plan", isCurrent: true },
      ];
    }
    const planId = cleanPath.replace("/plan/diet/", "");
    if (planId) {
      return [
        { label: "Fitness Plans" },
        { label: "Diet Plans", path: dietParentPath },
        { label: `Diet Plan Details (${planId})`, isCurrent: true },
      ];
    }
  }

  if (cleanPath.startsWith("/plan/workout")) {
    const workoutParentPath = "/plan/workout/list";
    if (cleanPath === "/plan/workout/list") {
      return [
        { label: "Fitness Plans" },
        { label: "Workout Plans", path: workoutParentPath },
        { label: "Workout Plans List", isCurrent: true },
      ];
    }
    if (cleanPath === "/plan/workout/add") {
      return [
        { label: "Fitness Plans" },
        { label: "Workout Plans", path: workoutParentPath },
        { label: "Add Workout Plan", isCurrent: true },
      ];
    }
    if (cleanPath.startsWith("/plan/workout/edit/")) {
      const id = cleanPath.replace("/plan/workout/edit/", "");
      return [
        { label: "Fitness Plans" },
        { label: "Workout Plans", path: workoutParentPath },
        { label: id ? `Edit Workout Plan (${id})` : "Edit Workout Plan", isCurrent: true },
      ];
    }
    const planId = cleanPath.replace("/plan/workout/", "");
    if (planId) {
      return [
        { label: "Fitness Plans" },
        { label: "Workout Plans", path: workoutParentPath },
        { label: `Workout Plan Details (${planId})`, isCurrent: true },
      ];
    }
  }

  // Membership Plans
  if (cleanPath.startsWith("/membership")) {
    const membershipParentPath = "/membership/list";
    if (cleanPath === "/membership/list") {
      return [
        { label: "Membership Plans", path: membershipParentPath },
        { label: "Plans List", isCurrent: true },
      ];
    }
    if (cleanPath === "/membership/add") {
      return [
        { label: "Membership Plans", path: membershipParentPath },
        { label: "Add New Plan", isCurrent: true },
      ];
    }
    if (cleanPath.startsWith("/membership/edit/")) {
      const id = cleanPath.replace("/membership/edit/", "");
      return [
        { label: "Membership Plans", path: membershipParentPath },
        { label: id ? `Edit Plan (${id})` : "Edit Plan", isCurrent: true },
      ];
    }
    const planId = cleanPath.replace("/membership/", "");
    if (planId) {
      return [
        { label: "Membership Plans", path: membershipParentPath },
        { label: `Plan Details (${planId})`, isCurrent: true },
      ];
    }
  }

  // Fallback for any unknown / dynamic routes
  const segments = cleanPath.split("/").filter(Boolean);
  if (segments.length === 0) {
    return [{ label: "Dashboard", isCurrent: true }];
  }

  let cumulativePath = "";
  return segments.map((seg, idx) => {
    cumulativePath += `/${seg}`;
    const isLast = idx === segments.length - 1;
    // Format human-readable name: "my-plans" -> "My Plans"
    const formatted = seg
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      label: formatted,
      path: isLast ? undefined : cumulativePath,
      isCurrent: isLast,
    };
  });
};
