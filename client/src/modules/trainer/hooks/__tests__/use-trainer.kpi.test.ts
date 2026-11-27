import { computeTrainerKPIStats } from "../use-trainer.kpi";
import type { Trainer } from "../../types/trainer.types";

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
};

const makeTrainer = (overrides: Partial<Trainer> = {}): Trainer => ({
  _id: "id-1",
  userId: "TRN-001",
  fullName: "Test Trainer",
  profileImage: "",
  gender: "male",
  email: "trainer@example.com",
  phone: "9999999999",
  permissions: ["trainers"],
  role: "trainer",
  emergencyContact: null,
  isActive: true,
  createdAt: "2026-10-01T00:00:00.000Z",
  updatedAt: "2026-10-01T00:00:00.000Z",
  joinDate: "2026-10-01T00:00:00.000Z",
  experienceYears: 4,
  specialization: ["Strength"],
  qualification: "ACE",
  shiftTime: { start: "06:00", end: "14:00" },
  employmentStatus: "active",
  salary: 30000,
  ...overrides,
});

console.log("Running Trainer KPI Computation Tests...\n");

const refDate = new Date("2026-11-27T12:00:00.000Z");

// 1. Empty list
const emptyStats = computeTrainerKPIStats([], refDate);
assert(emptyStats.totalTrainers === 0, "Empty totalTrainers should be 0");
assert(emptyStats.activeTrainers === 0, "Empty activeTrainers should be 0");
assert(emptyStats.activeRate === 0, "Empty activeRate should be 0");
assert(emptyStats.thisMonthTrainers === 0, "Empty thisMonthTrainers should be 0");
assert(emptyStats.avgExperience === 0, "Empty avgExperience should be 0");
assert(emptyStats.minExperience === 0, "Empty minExperience should be 0");
assert(emptyStats.maxExperience === 0, "Empty maxExperience should be 0");
assert(emptyStats.avgSalary === 0, "Empty avgSalary should be 0");
assert(emptyStats.minSalary === 0, "Empty minSalary should be 0");
assert(emptyStats.maxSalary === 0, "Empty maxSalary should be 0");
console.log("✔ Empty trainer list handled cleanly");

// 2. Single active trainer joined this month
const singleStats = computeTrainerKPIStats(
  [
    makeTrainer({
      joinDate: "2026-11-05T00:00:00.000Z",
      experienceYears: 5,
      salary: 45000,
    }),
  ],
  refDate,
);
assert(singleStats.totalTrainers === 1, "Single totalTrainers");
assert(singleStats.activeTrainers === 1, "Single activeTrainers");
assert(singleStats.activeRate === 100, "Single activeRate");
assert(singleStats.thisMonthTrainers === 1, "Single thisMonthTrainers");
assert(singleStats.avgExperience === 5, "Single avgExperience");
assert(singleStats.minExperience === 5, "Single minExperience");
assert(singleStats.maxExperience === 5, "Single maxExperience");
assert(singleStats.avgSalary === 45000, "Single avgSalary");
assert(singleStats.minSalary === 45000, "Single minSalary");
assert(singleStats.maxSalary === 45000, "Single maxSalary");
console.log("✔ Single trainer calculation passed");

// 3. Mixed statuses (active, on_leave, inactive, terminated)
const mixedStats = computeTrainerKPIStats(
  [
    makeTrainer({
      userId: "TRN-001",
      isActive: true,
      employmentStatus: "active",
      joinDate: "2026-11-10T00:00:00.000Z",
      experienceYears: 2,
      salary: 20000,
    }),
    makeTrainer({
      userId: "TRN-002",
      isActive: true,
      employmentStatus: "on_leave",
      joinDate: "2026-09-15T00:00:00.000Z",
      experienceYears: 6,
      salary: 40000,
    }),
    makeTrainer({
      userId: "TRN-003",
      isActive: true,
      employmentStatus: "terminated",
      joinDate: "2026-08-01T00:00:00.000Z",
      experienceYears: 8,
      salary: 50000,
    }),
    makeTrainer({
      userId: "TRN-004",
      isActive: false,
      employmentStatus: "inactive",
      joinDate: "",
      createdAt: "2026-11-20T00:00:00.000Z",
      experienceYears: 4,
      salary: 30000,
    }),
  ],
  refDate,
);
assert(mixedStats.totalTrainers === 4, "Mixed totalTrainers");
assert(mixedStats.activeTrainers === 2, "Mixed activeTrainers (excludes terminated & inactive)");
assert(mixedStats.activeRate === 50, "Mixed activeRate");
assert(mixedStats.thisMonthTrainers === 2, "Mixed thisMonthTrainers (joinDate + createdAt fallback)");
assert(mixedStats.avgExperience === 5, "Mixed avgExperience");
assert(mixedStats.minExperience === 2, "Mixed minExperience");
assert(mixedStats.maxExperience === 8, "Mixed maxExperience");
assert(mixedStats.avgSalary === 35000, "Mixed avgSalary");
assert(mixedStats.minSalary === 20000, "Mixed minSalary");
assert(mixedStats.maxSalary === 50000, "Mixed maxSalary");
console.log("✔ Mixed status & date fallback calculation passed");

// 4. Edge cases: invalid/negative numeric fields & invalid dates
const edgeStats = computeTrainerKPIStats(
  [
    makeTrainer({
      experienceYears: -3,
      salary: Number.NaN,
      joinDate: "not-a-date",
      createdAt: "not-a-date",
    }),
  ],
  refDate,
);
assert(edgeStats.avgExperience === 0, "Negative experience clamped to 0");
assert(edgeStats.avgSalary === 0, "NaN salary defaulted to 0");
assert(edgeStats.thisMonthTrainers === 0, "Invalid date ignored");
console.log("✔ Invalid/negative field edge cases passed");

console.log("\nALL 4 TRAINER KPI TEST SUITES PASSED SUCCESSFULLY!");
