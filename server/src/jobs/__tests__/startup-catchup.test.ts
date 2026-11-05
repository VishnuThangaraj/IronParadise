import mongoose from "mongoose";
import env from "../../config/env.js";
import {
  CronJobStateModel,
  CronJobHistoryModel,
} from "../cron-job.model.js";
import { runMissedCronJobsOnStartup } from "../cron-recovery.js";
import type { CronJobDefinition } from "../cron-runner.js";

async function runIntegrationTestSuite() {
  console.log("=================================================");
  console.log("   STARTUP CATCH-UP & IDEMPOTENCY TEST SUITE     ");
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
  console.log("[TEST] Connected to MongoDB.");

  const JOB_A = "TEST_MIDNIGHT_SALARY_ACCRUAL";
  const JOB_B = "TEST_NIGHTLY_CHECKOUT";
  const JOB_FAIL = "TEST_FAILING_JOB";

  // Clean test artifacts
  await CronJobStateModel.deleteMany({
    jobName: { $in: [JOB_A, JOB_B, JOB_FAIL] },
  });
  await CronJobHistoryModel.deleteMany({
    jobName: { $in: [JOB_A, JOB_B, JOB_FAIL] },
  });

  let jobAExecCount = 0;
  let jobBExecCount = 0;

  const mockJobs: CronJobDefinition[] = [
    {
      name: JOB_A,
      schedule: "0 0 * * *", // 12:00 AM daily
      timezone: "Asia/Kolkata",
      handler: async () => {
        jobAExecCount++;
        return { processed: 5 };
      },
    },
    {
      name: JOB_B,
      schedule: "30 22 * * *", // 10:30 PM daily
      timezone: "Asia/Kolkata",
      handler: async () => {
        jobBExecCount++;
        return { checkedOut: 2 };
      },
    },
  ];

  // --- Suite 1: Initial Startup Catch-Up ---
  console.log("\n--- Suite 1: Initial Startup Catch-Up ---");
  const initTime = new Date("2026-11-05T04:30:00.000Z"); // 10:00 AM IST
  const initSummary = await runMissedCronJobsOnStartup({
    jobs: mockJobs,
    now: initTime,
    catchUpUninitialized: true,
  });

  assert(
    initSummary.catchUpExecutedCount === 2,
    "Initial startup executes catch-up for all uninitialized jobs (2/2)",
    `Got ${initSummary.catchUpExecutedCount}`,
  );
  assert(
    jobAExecCount === 1 && jobBExecCount === 1,
    "Job handlers called exactly once during initial catch-up",
  );

  const stateA = await CronJobStateModel.findOne({ jobName: JOB_A });
  assert(
    stateA !== null &&
      stateA.status === "COMPLETED" &&
      stateA.lastCompletedAt !== null,
    "Job state persisted with status COMPLETED and valid lastCompletedAt",
  );

  // --- Suite 2: Duplicate Prevention on Immediate Server Restart ---
  console.log("\n--- Suite 2: Duplicate Prevention on Immediate Server Restart ---");
  const restartTime1 = new Date("2026-11-05T04:45:00.000Z"); // 10:15 AM IST (15 mins later)
  const restartSummary1 = await runMissedCronJobsOnStartup({
    jobs: mockJobs,
    now: restartTime1,
  });

  assert(
    restartSummary1.catchUpExecutedCount === 0,
    "Immediate server restart triggers 0 catch-up executions",
    `Got ${restartSummary1.catchUpExecutedCount}`,
  );
  assert(
    restartSummary1.alreadyUpToDateCount === 2,
    "All jobs reported as SKIPPED_ALREADY_COMPLETED on repeated restart",
  );
  assert(
    jobAExecCount === 1 && jobBExecCount === 1,
    "Job handlers were NOT invoked again (Zero duplicate runs)",
  );

  // --- Suite 3: Simulated Downtime Crossing Midnight Schedule ---
  console.log("\n--- Suite 3: Simulated Downtime Crossing Midnight Schedule ---");
  // Simulate that the server was stopped for 24 hours until the next day at 9:00 AM
  const nextDay9Am = new Date("2026-11-06T03:30:00.000Z"); // Nov 6, 9:00 AM IST
  // Between Nov 5 10:15 AM and Nov 6 9:00 AM:
  // - Job B (10:30 PM) was missed on Nov 5 22:30 IST!
  // - Job A (midnight) was missed on Nov 6 00:00 IST!
  const nextDaySummary = await runMissedCronJobsOnStartup({
    jobs: mockJobs,
    now: nextDay9Am,
  });

  assert(
    nextDaySummary.catchUpExecutedCount === 2,
    "Catches up both jobs that were missed during server downtime across midnight and 10:30 PM",
    `Got ${nextDaySummary.catchUpExecutedCount}`,
  );
  assert(
    jobAExecCount === 2 && jobBExecCount === 2,
    "Handlers executed for catch-up after downtime",
  );

  // Immediate reboot on the second day at 9:15 AM
  const nextDay915Am = new Date("2026-11-06T03:45:00.000Z");
  const nextDayReboot = await runMissedCronJobsOnStartup({
    jobs: mockJobs,
    now: nextDay915Am,
  });
  assert(
    nextDayReboot.catchUpExecutedCount === 0 &&
      nextDayReboot.alreadyUpToDateCount === 2,
    "Subsequent reboot after catch-up correctly skips already executed jobs",
  );

  // --- Suite 4: Stale Lock Recovery After Abrupt Server Crash ---
  console.log("\n--- Suite 4: Stale Lock Recovery After Abrupt Server Crash ---");
  // Simulate a crash leaving status: 'RUNNING' with lockedAt 25 minutes ago
  const twentyFiveMinsAgo = new Date(Date.now() - 25 * 60 * 1000);
  await CronJobStateModel.findOneAndUpdate(
    { jobName: JOB_A },
    {
      $set: {
        status: "RUNNING",
        lockedAt: twentyFiveMinsAgo,
        lastCompletedAt: new Date("2026-11-04T00:00:00.000Z"), // older completed time
      },
    },
  );

  const staleLockRecoverySummary = await runMissedCronJobsOnStartup({
    jobs: [mockJobs[0]!],
    now: new Date(),
  });

  assert(
    staleLockRecoverySummary.catchUpExecutedCount === 1,
    "Stale lock older than timeout threshold is automatically reclaimed and executed",
  );
  const stateAfterStale = await CronJobStateModel.findOne({ jobName: JOB_A });
  assert(
    stateAfterStale !== null &&
      stateAfterStale.status === "COMPLETED" &&
      stateAfterStale.lockedAt === null,
    "State transitions back to COMPLETED with lock cleared after stale recovery",
  );

  // --- Suite 5: Failure Isolation in Multi-Job Execution ---
  console.log("\n--- Suite 5: Failure Isolation in Multi-Job Execution ---");
  const failingJob: CronJobDefinition = {
    name: JOB_FAIL,
    schedule: "0 0 * * *",
    timezone: "Asia/Kolkata",
    handler: async () => {
      throw new Error("Simulated database timeout or network failure");
    },
  };

  const mixedSummary = await runMissedCronJobsOnStartup({
    jobs: [failingJob, mockJobs[1]!],
    now: new Date(),
  });

  assert(
    mixedSummary.failedCount === 1,
    "Failing job records failure count without throwing unhandled exception",
  );
  const failState = await CronJobStateModel.findOne({ jobName: JOB_FAIL });
  assert(
    failState !== null &&
      failState.status === "FAILED" &&
      Boolean(failState.lastError?.includes("Simulated database timeout")),
    "Failure error message recorded in CronJobStateModel",
  );

  // Clean test artifacts
  await CronJobStateModel.deleteMany({
    jobName: { $in: [JOB_A, JOB_B, JOB_FAIL] },
  });
  await CronJobHistoryModel.deleteMany({
    jobName: { $in: [JOB_A, JOB_B, JOB_FAIL] },
  });

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

runIntegrationTestSuite();
