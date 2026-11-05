import mongoose from "mongoose";
import env from "../../config/env.js";
import UserModel from "../../modules/user/user.model.js";
import TrainerDetailsModel from "../../modules/trainer/trainer-details/trainer-details.model.js";
import TrainerPaymentModel from "../../modules/trainer/trainer-payment/trainer-payment.model.js";
import MemberAssignmentModel from "../../modules/member/member-assignment/member-assignment.model.js";
import MemberPaymentModel from "../../modules/member/member-payment/member-payment.model.js";
import MembershipPlanModel from "../../modules/membership-plan/membership-plan.model.js";
import AttendanceModel from "../../modules/attendance/attendance.model.js";
import {
  CronJobStateModel,
  CronJobHistoryModel,
} from "../cron-job.model.js";
import { runMissedCronJobs } from "../cron.js";

async function runE2ETestSuite() {
  console.log("=================================================");
  console.log("   E2E REAL BUSINESS CRON CATCH-UP TEST SUITE    ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  await mongoose.connect(env.MONGO_URI);
  console.log("[E2E] Connected to MongoDB.\n");

  const TEST_PREFIX = "E2E_CRON_TEST_";
  const TEST_TRAINER_ID = `${TEST_PREFIX}TRAINER_01`;
  const TEST_MEMBER_ID = `${TEST_PREFIX}MEMBER_01`;
  const TEST_PLAN_ID = `${TEST_PREFIX}PLAN_01`;
  const TEST_ATTENDANCE_ID_1 = `${TEST_PREFIX}ATT_01`;
  const TEST_ATTENDANCE_ID_2 = `${TEST_PREFIX}ATT_02`;

  // 1. Clean previous test artifacts
  await UserModel.deleteMany({ userId: { $in: [TEST_TRAINER_ID, TEST_MEMBER_ID] } });
  await TrainerDetailsModel.deleteMany({ userId: TEST_TRAINER_ID });
  await TrainerPaymentModel.deleteMany({ userId: TEST_TRAINER_ID });
  await MembershipPlanModel.deleteMany({ membershipPlanId: TEST_PLAN_ID });
  await MemberAssignmentModel.deleteMany({ userId: TEST_MEMBER_ID });
  await MemberPaymentModel.deleteMany({ userId: TEST_MEMBER_ID });
  await AttendanceModel.deleteMany({
    attendanceId: { $in: [TEST_ATTENDANCE_ID_1, TEST_ATTENDANCE_ID_2] },
  });

  // Clear all cron job states to simulate fresh deployment
  await CronJobStateModel.deleteMany({});
  await CronJobHistoryModel.deleteMany({});

  // 2. Seed realistic business fixtures
  // Seed Trainer
  await UserModel.create({
    userId: TEST_TRAINER_ID,
    fullName: "E2E Test Trainer Arnold",
    email: "arnold.test@ironparadise.com",
    role: "trainer",
    gender: "male",
    isActive: true,
  });

  await TrainerDetailsModel.create({
    userId: TEST_TRAINER_ID,
    joinDate: new Date("2026-09-01"), // Joined 2 months ago (on 1st)
    employmentStatus: "active",
    specialization: ["Bodybuilding"],
    qualification: "Certified Strength Coach",
    shiftTime: {
      start: "06:00",
      end: "14:00",
    },
  });

  await TrainerPaymentModel.create({
    userId: TEST_TRAINER_ID,
    salary: 45000,
    amountDue: 0,
    amountPaid: 45000,
    paymentStatus: "PAID",
    lastAccruedMonth: "2026-10", // Last accrued in Oct
  });

  // Seed Membership Plan
  await MembershipPlanModel.create({
    membershipPlanId: TEST_PLAN_ID,
    planName: "E2E 1-Month Pro",
    durationMonths: 1,
    price: 3500,
    features: ["Full Gym Access", "Locker Room"],
    isActive: true,
  });

  // Seed Member
  await UserModel.create({
    userId: TEST_MEMBER_ID,
    fullName: "E2E Test Member Sylvester",
    email: "sylvester.test@ironparadise.com",
    role: "member",
    gender: "male",
    isActive: true,
  });

  // Assignment that expired yesterday (Nov 4)
  const expiredEndDate = new Date("2026-11-04T00:00:00.000Z");
  const assignmentStartDate = new Date("2026-10-04T00:00:00.000Z");
  const testAssignmentId = `${TEST_PREFIX}ASSIGN_01`;

  await MemberAssignmentModel.create({
    assignmentId: testAssignmentId,
    userId: TEST_MEMBER_ID,
    membershipPlanId: TEST_PLAN_ID,
    startDate: assignmentStartDate,
    endDate: expiredEndDate,
    status: "ACTIVE", // still active prior to cron run
  });

  const testPaymentId = `${TEST_PREFIX}PAY_01`;
  await MemberPaymentModel.create({
    paymentId: testPaymentId,
    userId: TEST_MEMBER_ID,
    assignmentId: testAssignmentId,
    totalAmount: 3500,
    amountPaid: 0,
    amountDue: 3500,
    dueDate: assignmentStartDate,
    paymentStatus: "PENDING",
  });

  // Seed Attendance: Session from yesterday at 6:00 PM without checkout
  const checkInYesterday = new Date("2026-11-04T12:30:00.000Z"); // 6:00 PM IST yesterday
  await AttendanceModel.create({
    attendanceId: TEST_ATTENDANCE_ID_1,
    userId: TEST_MEMBER_ID,
    role: "member",
    date: new Date("2026-11-04T00:00:00.000Z"),
    checkIn: checkInYesterday,
    checkOut: null,
    status: "checked_in",
    notes: "Evening workout session",
  });

  // --- Scenario 1: Server boots up at 8:00 AM on Nov 5 ---
  console.log("--- Scenario 1: Server boots up at 8:00 AM on Nov 5 ---");
  const serverBootNov5_8Am = new Date("2026-11-05T02:30:00.000Z"); // 8:00 AM IST
  const bootSummary1 = await runMissedCronJobs(serverBootNov5_8Am);

  assert(
    bootSummary1.catchUpExecutedCount === 3,
    "All 3 core cron jobs executed catch-up upon first boot (3/3)",
    `Executed count: ${bootSummary1.catchUpExecutedCount}`,
  );

  // 1. Verify Attendance Auto-Checkout executed
  const sessionAfterCatchup = await AttendanceModel.findOne({
    attendanceId: TEST_ATTENDANCE_ID_1,
  });
  assert(
    sessionAfterCatchup !== null &&
      sessionAfterCatchup.status === "checked_out" &&
      sessionAfterCatchup.checkOut !== null,
    "Open attendance session automatically checked out during catch-up",
  );
  assert(
    Boolean(sessionAfterCatchup?.notes?.includes("[Auto check-out at 10:30 PM by system]")),
    "Attendance auto check-out note appended without deleting original note",
  );

  // 2. Verify Trainer Salary Accrual executed
  const trainerPaymentAfter = await TrainerPaymentModel.findOne({
    userId: TEST_TRAINER_ID,
  });
  assert(
    trainerPaymentAfter !== null &&
      trainerPaymentAfter.amountDue === 45000 &&
      trainerPaymentAfter.lastAccruedMonth === "2026-11",
    "Trainer salary ₹45,000 accrued for cycle 2026-11",
    `Amount Due: ${trainerPaymentAfter?.amountDue}, Month: ${trainerPaymentAfter?.lastAccruedMonth}`,
  );

  // 3. Verify Member Subscription Expired and Renewed
  const oldAssignmentAfter = await MemberAssignmentModel.findOne({
    assignmentId: testAssignmentId,
  });
  assert(
    oldAssignmentAfter !== null && oldAssignmentAfter.status === "EXPIRED",
    "Expired member assignment marked EXPIRED",
  );

  const oldPaymentAfter = await MemberPaymentModel.findOne({
    paymentId: testPaymentId,
  });
  assert(
    oldPaymentAfter !== null && oldPaymentAfter.paymentStatus === "OVERDUE",
    "Pending dues marked OVERDUE upon assignment expiration",
  );

  const newAssignment = await MemberAssignmentModel.findOne({
    userId: TEST_MEMBER_ID,
    status: "ACTIVE",
  });
  assert(
    newAssignment !== null &&
      newAssignment.assignmentId !== testAssignmentId,
    "Renewal assignment automatically generated for active member",
  );

  // --- Scenario 2: Immediate Server Restart at 8:15 AM (Zero Duplicate Runs) ---
  console.log("\n--- Scenario 2: Immediate Server Restart at 8:15 AM (Zero Duplicate Runs) ---");
  const serverRestartNov5_815Am = new Date("2026-11-05T02:45:00.000Z"); // 8:15 AM IST (15 mins later)
  const restartSummary = await runMissedCronJobs(serverRestartNov5_815Am);

  assert(
    restartSummary.catchUpExecutedCount === 0,
    "Zero catch-up executions on immediate server restart",
    `Count: ${restartSummary.catchUpExecutedCount}`,
  );
  assert(
    restartSummary.alreadyUpToDateCount === 3,
    "All 3 jobs reported as SKIPPED_ALREADY_COMPLETED",
  );

  // Verify that trainer salary was NOT accrued twice
  const trainerPaymentReboot = await TrainerPaymentModel.findOne({
    userId: TEST_TRAINER_ID,
  });
  assert(
    trainerPaymentReboot !== null && trainerPaymentReboot.amountDue === 45000,
    "Trainer salary remained at ₹45,000 (NOT duplicated to ₹90,000)",
  );

  // Verify that no second duplicate renewal was created
  const totalActiveAssignments = await MemberAssignmentModel.countDocuments({
    userId: TEST_MEMBER_ID,
    status: "ACTIVE",
  });
  assert(
    totalActiveAssignments === 1,
    "Member active assignment count remained strictly 1 (No duplicate renewals)",
  );

  // --- Scenario 3: Persistent History and State Verification ---
  console.log("\n--- Scenario 3: Persistent History and State Verification ---");
  const allStates = await CronJobStateModel.find({});
  assert(allStates.length === 3, "All 3 cron jobs have persistent state in MongoDB");

  for (const st of allStates) {
    assert(
      st.status === "COMPLETED" &&
        st.lastCompletedAt !== null &&
        st.lockedAt === null,
      `State for '${st.jobName}' has status COMPLETED and lock released`,
    );
  }

  const allHistory = await CronJobHistoryModel.find({
    triggerType: "STARTUP_CATCHUP",
  });
  assert(
    allHistory.length === 3,
    "Audit history contains exactly 3 STARTUP_CATCHUP logs with execution metrics",
  );

  // Clean test fixtures
  await UserModel.deleteMany({ userId: { $in: [TEST_TRAINER_ID, TEST_MEMBER_ID] } });
  await TrainerDetailsModel.deleteMany({ userId: TEST_TRAINER_ID });
  await TrainerPaymentModel.deleteMany({ userId: TEST_TRAINER_ID });
  await MembershipPlanModel.deleteMany({ membershipPlanId: TEST_PLAN_ID });
  await MemberAssignmentModel.deleteMany({ userId: TEST_MEMBER_ID });
  await MemberPaymentModel.deleteMany({ userId: TEST_MEMBER_ID });
  await AttendanceModel.deleteMany({
    attendanceId: { $in: [TEST_ATTENDANCE_ID_1, TEST_ATTENDANCE_ID_2] },
  });
  await CronJobStateModel.deleteMany({});
  await CronJobHistoryModel.deleteMany({});

  await mongoose.disconnect();

  console.log("\n=================================================");
  console.log(
    `TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`,
  );
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runE2ETestSuite();
