import { generateBreadcrumbs, getPortalTitle } from "../breadcrumb.utils";

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
};

console.log("Running Breadcrumb Resolution Tests...\n");

// 1. Portal Titles
assert(getPortalTitle("admin") === "Admin Panel", "Admin portal title");
assert(getPortalTitle("trainer") === "Trainer Portal", "Trainer portal title");
assert(getPortalTitle("member") === "Member Portal", "Member portal title");
assert(getPortalTitle() === "Admin Panel", "Default portal title");
console.log("✔ Portal title mappings passed");

// 2. Dashboard
const dashboardCrumbs = generateBreadcrumbs("/dashboard");
assert(dashboardCrumbs.length === 1, "Dashboard count");
assert(dashboardCrumbs[0].label === "Dashboard", "Dashboard label");
assert(dashboardCrumbs[0].isCurrent === true, "Dashboard isCurrent");
console.log("✔ Dashboard route passed");

// 3. Member routes
const memberListCrumbs = generateBreadcrumbs("/member/list");
assert(memberListCrumbs.length === 2, "Member list count");
assert(memberListCrumbs[0].label === "Members" && memberListCrumbs[0].path === "/member/list", "Member list parent");
assert(memberListCrumbs[1].label === "Members List" && memberListCrumbs[1].isCurrent === true, "Member list leaf");

const memberEditCrumbs = generateBreadcrumbs("/member/edit/MBR-001");
assert(memberEditCrumbs.length === 2, "Member edit count");
assert(memberEditCrumbs[1].label === "Edit Member (MBR-001)", "Member edit leaf label");

const memberDetailCrumbs = generateBreadcrumbs("/member/MBR-001");
assert(memberDetailCrumbs.length === 2, "Member details count");
assert(memberDetailCrumbs[1].label === "Member Details (MBR-001)", "Member details leaf label");

const memberSelfCrumbs = generateBreadcrumbs("/member/my-plans", "member");
assert(memberSelfCrumbs.length === 1 && memberSelfCrumbs[0].label === "My Fitness Plans", "Member self-service");
console.log("✔ Member routes passed");

// 4. Trainer routes
const trainerPayrollCrumbs = generateBreadcrumbs("/trainer/payroll");
assert(trainerPayrollCrumbs[0].label === "Trainers" && trainerPayrollCrumbs[0].path === "/trainer/list", "Trainer payroll parent");
assert(trainerPayrollCrumbs[1].label === "Trainers Payroll" && trainerPayrollCrumbs[1].isCurrent === true, "Trainer payroll leaf");

const trainerEditCrumbs = generateBreadcrumbs("/trainer/edit/TRN-042");
assert(trainerEditCrumbs[1].label === "Edit Trainer (TRN-042)", "Trainer edit label");

const trainerSelfCrumbs = generateBreadcrumbs("/trainer/my-members", "trainer");
assert(trainerSelfCrumbs.length === 1 && trainerSelfCrumbs[0].label === "My Members", "Trainer self-service");
console.log("✔ Trainer routes passed");

// 5. Fitness plans (nested 3 levels)
const dietListCrumbs = generateBreadcrumbs("/plan/diet/list");
assert(dietListCrumbs.length === 3, "Diet list count");
assert(dietListCrumbs[0].label === "Fitness Plans", "Diet parent 1");
assert(dietListCrumbs[1].label === "Diet Plans" && dietListCrumbs[1].path === "/plan/diet/list", "Diet parent 2");
assert(dietListCrumbs[2].label === "Diet Plans List" && dietListCrumbs[2].isCurrent === true, "Diet leaf");

const workoutEditCrumbs = generateBreadcrumbs("/plan/workout/edit/PLN-009");
assert(workoutEditCrumbs.length === 3, "Workout edit count");
assert(workoutEditCrumbs[2].label === "Edit Workout Plan (PLN-009)", "Workout edit leaf");
console.log("✔ Fitness plan nested routes passed");

// 6. Fallback route parsing
const unknownCrumbs = generateBreadcrumbs("/custom-section/sub-feature");
assert(unknownCrumbs.length === 2, "Unknown route count");
assert(unknownCrumbs[0].label === "Custom Section" && unknownCrumbs[0].path === "/custom-section", "Unknown parent");
assert(unknownCrumbs[1].label === "Sub Feature" && unknownCrumbs[1].isCurrent === true, "Unknown leaf");
console.log("✔ Fallback route parser passed");

console.log("\nALL 6 BREADCRUMB TEST SUITES PASSED SUCCESSFULLY!");
