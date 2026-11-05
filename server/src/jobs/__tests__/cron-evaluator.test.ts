import mongoose from "mongoose";
import env from "../../config/env.js";
import {
  getMostRecentScheduledDate,
  getNextScheduledDate,
  isCronExecutionMissed,
} from "../cron-evaluator.js";
import {
  CronJobStateModel,
  CronJobHistoryModel,
} from "../cron-job.model.js";

async function runTestSuite() {
  console.log("=================================================");
  console.log("   CRON EVALUATOR & STATE MODEL UNIT TEST SUITE  ");
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

  // --- Suite 1: CronScheduleEvaluator Timing Calculations ---
  console.log("\n--- Suite 1: CronScheduleEvaluator Timing Calculations ---");

  const midnightSchedule = "0 0 * * *"; // 12:00 AM daily
  const nightlyCheckoutSchedule = "30 22 * * *"; // 10:30 PM daily
  const tz = "Asia/Kolkata";

  // Case 1: Evaluated at 10:00 AM on 2026-11-05 (Asia/Kolkata)
  // Most recent midnight run should be 2026-11-05 00:00:00 Asia/Kolkata
  const now10Am = new Date("2026-11-05T04:30:00.000Z"); // 10:00 AM IST
  const mostRecentMidnight = getMostRecentScheduledDate(
    midnightSchedule,
    now10Am,
    tz,
  );
  const midnightIso = mostRecentMidnight.toISOString();
  // 00:00 IST is 18:30 UTC of previous day (2026-11-04T18:30:00.000Z)
  assert(
    midnightIso === "2026-11-04T18:30:00.000Z",
    "Calculates most recent midnight schedule correctly in Asia/Kolkata",
    `Got ${midnightIso}`,
  );

  // Next midnight should be 2026-11-06 00:00:00 IST (2026-11-05T18:30:00.000Z)
  const nextMidnight = getNextScheduledDate(midnightSchedule, now10Am, tz);
  assert(
    nextMidnight.toISOString() === "2026-11-05T18:30:00.000Z",
    "Calculates next scheduled midnight correctly",
  );

  // Case 2: Evaluated at 10:00 AM on 2026-11-05 for 10:30 PM schedule
  // 10:30 PM has NOT happened yet today, so most recent was yesterday at 10:30 PM (2026-11-04 22:30 IST)
  // 22:30 IST is 17:00 UTC (2026-11-04T17:00:00.000Z)
  const mostRecentCheckout = getMostRecentScheduledDate(
    nightlyCheckoutSchedule,
    now10Am,
    tz,
  );
  assert(
    mostRecentCheckout.toISOString() === "2026-11-04T17:00:00.000Z",
    "Calculates previous day 10:30 PM when current time is earlier than 10:30 PM",
    `Got ${mostRecentCheckout.toISOString()}`,
  );

  // Case 3: Evaluated at 11:00 PM on 2026-11-05 (after 10:30 PM)
  const now11Pm = new Date("2026-11-05T17:30:00.000Z"); // 11:00 PM IST
  const recentCheckoutAfter1030 = getMostRecentScheduledDate(
    nightlyCheckoutSchedule,
    now11Pm,
    tz,
  );
  assert(
    recentCheckoutAfter1030.toISOString() === "2026-11-05T17:00:00.000Z",
    "Calculates today's 10:30 PM when current time is after 10:30 PM",
  );

  // Case 4: Exact boundary match (evaluated at exactly 10:30:00 PM)
  const nowExact1030 = new Date("2026-11-05T17:00:00.000Z"); // 10:30 PM IST
  const exactCheckout = getMostRecentScheduledDate(
    nightlyCheckoutSchedule,
    nowExact1030,
    tz,
  );
  assert(
    exactCheckout.toISOString() === "2026-11-05T17:00:00.000Z",
    "Includes exact scheduled moment when evaluating on exact scheduled tick",
  );

  // --- Suite 2: Missed Execution Detection Logic ---
  console.log("\n--- Suite 2: Missed Execution Detection Logic ---");

  // 1. Initial run (uninitialized in DB)
  const checkInitialWithCatchup = isCronExecutionMissed({
    schedule: midnightSchedule,
    lastCompletedAt: null,
    now: now10Am,
    timezone: tz,
    catchUpUninitialized: true,
  });
  assert(
    checkInitialWithCatchup.missed === true &&
      checkInitialWithCatchup.reason === "INITIAL_RUN",
    "Uninitialized job triggers catch-up when catchUpUninitialized=true",
  );

  const checkInitialNoCatchup = isCronExecutionMissed({
    schedule: midnightSchedule,
    lastCompletedAt: null,
    now: now10Am,
    timezone: tz,
    catchUpUninitialized: false,
  });
  assert(
    checkInitialNoCatchup.missed === false &&
      checkInitialNoCatchup.reason === "ALREADY_COMPLETED",
    "Uninitialized job skips catch-up when catchUpUninitialized=false",
  );

  // 2. Missed run: Last completed yesterday (2026-11-04 00:01:00), now is today 10:00 AM
  const lastYesterday = new Date("2026-11-03T18:31:00.000Z"); // 2026-11-04 00:01 IST
  const checkMissed = isCronExecutionMissed({
    schedule: midnightSchedule,
    lastCompletedAt: lastYesterday,
    now: now10Am,
    timezone: tz,
  });
  assert(
    checkMissed.missed === true &&
      checkMissed.reason === "SCHEDULED_RUN_MISSED",
    "Detects missed execution when last completed is older than latest scheduled run",
  );

  // 3. Already completed: Last completed today at 00:02 AM, now is today 10:00 AM
  const lastTodayEarly = new Date("2026-11-04T18:32:00.000Z"); // 2026-11-05 00:02 IST
  const checkCompleted = isCronExecutionMissed({
    schedule: midnightSchedule,
    lastCompletedAt: lastTodayEarly,
    now: now10Am,
    timezone: tz,
  });
  assert(
    checkCompleted.missed === false &&
      checkCompleted.reason === "ALREADY_COMPLETED",
    "Identifies job as already completed when last completed >= latest scheduled run",
  );

  // 4. Repeated restart simulation:
  // Server starts at 10:00 AM -> catch-up executed at 10:01 AM -> server restarts at 10:15 AM
  const catchupExecutedAt = new Date("2026-11-05T04:31:00.000Z"); // 10:01 AM IST
  const restartAt1015 = new Date("2026-11-05T04:45:00.000Z"); // 10:15 AM IST
  const checkRepeatedRestart = isCronExecutionMissed({
    schedule: midnightSchedule,
    lastCompletedAt: catchupExecutedAt,
    now: restartAt1015,
    timezone: tz,
  });
  assert(
    checkRepeatedRestart.missed === false,
    "Second restart within same interval does not trigger duplicate execution",
  );

  // 5. Extended downtime interval counting:
  // Server stopped on Nov 2, restarts on Nov 5 -> 3 missed midnight intervals
  const lastNov2 = new Date("2026-11-01T18:30:00.000Z"); // 2026-11-02 00:00 IST
  const checkMultiInterval = isCronExecutionMissed({
    schedule: midnightSchedule,
    lastCompletedAt: lastNov2,
    now: now10Am,
    timezone: tz,
  });
  assert(
    checkMultiInterval.missed === true &&
      (checkMultiInterval.missedIntervalsCount ?? 0) === 3,
    "Accurately counts 3 missed daily intervals across extended server downtime",
    `Count: ${checkMultiInterval.missedIntervalsCount}`,
  );

  // 6. Invalid schedule tolerance
  const invalidCheck = isCronExecutionMissed({
    schedule: "invalid cron expr",
    lastCompletedAt: new Date(),
    now: now10Am,
    timezone: tz,
  });
  assert(
    invalidCheck.missed === false &&
      invalidCheck.reason === "INVALID_SCHEDULE",
    "Gracefully handles malformed cron expressions without unhandled exception",
  );

  // --- Suite 3: MongoDB Schema & Model Persistence ---
  console.log("\n--- Suite 3: MongoDB Schema & Model Persistence ---");

  try {
    await mongoose.connect(env.MONGO_URI);
    assert(true, "Connected to MongoDB test instance");

    // Clear test job state document
    const testJobName = "TEST_AUTOMATED_CRON_JOB";
    await CronJobStateModel.deleteMany({ jobName: testJobName });
    await CronJobHistoryModel.deleteMany({ jobName: testJobName });

    // 1. Create or upsert state record
    const createdState = await CronJobStateModel.findOneAndUpdate(
      { jobName: testJobName },
      {
        $setOnInsert: {
          jobName: testJobName,
          schedule: "0 0 * * *",
          timezone: "Asia/Kolkata",
          status: "IDLE",
        },
      },
      { upsert: true, returnDocument: "after" },
    );
    assert(
      createdState !== null &&
        createdState.jobName === testJobName &&
        createdState.status === "IDLE",
      "Successfully created and persisted CronJobStateModel document",
    );

    // 2. Simulate running state and lock acquisition
    const lockAcquired = await CronJobStateModel.findOneAndUpdate(
      {
        jobName: testJobName,
        status: { $in: ["IDLE", "COMPLETED", "FAILED"] },
      },
      {
        $set: {
          status: "RUNNING",
          lastStartedAt: new Date(),
          lockedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );
    assert(
      lockAcquired !== null && lockAcquired.status === "RUNNING",
      "Atomic lock acquired: status transitions to RUNNING",
    );

    // 3. Prevent duplicate concurrent lock
    const secondLockAttempt = await CronJobStateModel.findOneAndUpdate(
      {
        jobName: testJobName,
        status: { $in: ["IDLE", "COMPLETED", "FAILED"] },
      },
      {
        $set: {
          status: "RUNNING",
          lastStartedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );
    assert(
      secondLockAttempt === null,
      "Atomic lock prevents concurrent execution when status is already RUNNING",
    );

    // 4. Update completion and release lock
    const completedState = await CronJobStateModel.findOneAndUpdate(
      { jobName: testJobName },
      {
        $set: {
          status: "COMPLETED",
          lastCompletedAt: new Date(),
          lastExecutionDurationMs: 145,
          lastSummary: { itemsProcessed: 12 },
          lockedAt: null,
          lastError: null,
        },
      },
      { returnDocument: "after" },
    );
    assert(
      completedState !== null &&
        completedState.status === "COMPLETED" &&
        completedState.lockedAt === null &&
        completedState.lastExecutionDurationMs === 145,
      "Releases lock and updates execution metrics upon completion",
    );

    // 5. Record execution history
    const historyEntry = await CronJobHistoryModel.create({
      jobName: testJobName,
      triggerType: "STARTUP_CATCHUP",
      startedAt: new Date(Date.now() - 145),
      completedAt: new Date(),
      status: "COMPLETED",
      durationMs: 145,
      summary: { itemsProcessed: 12 },
    });
    assert(
      historyEntry._id !== undefined &&
        historyEntry.triggerType === "STARTUP_CATCHUP",
      "Successfully recorded execution history in CronJobHistoryModel",
    );

    // Clean up test documents
    await CronJobStateModel.deleteMany({ jobName: testJobName });
    await CronJobHistoryModel.deleteMany({ jobName: testJobName });
    await mongoose.disconnect();
  } catch (err: any) {
    assert(false, "MongoDB persistence test suite", err.message);
  }

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

runTestSuite();
