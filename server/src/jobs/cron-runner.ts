import {
  CronJobStateModel,
  CronJobHistoryModel,
  type CronTriggerType,
} from "./cron-job.model.js";

export interface CronJobDefinition<T = unknown> {
  name: string;
  schedule: string;
  handler: (executionDate?: Date) => Promise<T>;
  timezone?: string;
  catchUpUninitialized?: boolean;
}

export interface ExecutionResult<T = unknown> {
  executed: boolean;
  success?: boolean | undefined;
  durationMs?: number | undefined;
  summary?: T | undefined;
  error?: string | undefined;
  skippedReason?: "LOCKED" | "ALREADY_COMPLETED" | undefined;
}

const DEFAULT_LOCK_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Executes a cron job with distributed locking, execution time tracking,
 * failure isolation, and persistent audit logging.
 */
export async function executeCronJob<T = unknown>(
  job: CronJobDefinition<T>,
  triggerType: CronTriggerType = "SCHEDULE",
  executionDate: Date = new Date(),
  lockTimeoutMs: number = DEFAULT_LOCK_TIMEOUT_MS,
  currentTime: Date = new Date(),
): Promise<ExecutionResult<T>> {
  const wallClockStart = Date.now();
  const startedAt = currentTime;
  const timezone = job.timezone || "Asia/Kolkata";
  const staleLockThreshold = new Date(startedAt.getTime() - lockTimeoutMs);

  // 1. Ensure state record exists
  await CronJobStateModel.findOneAndUpdate(
    { jobName: job.name },
    {
      $setOnInsert: {
        jobName: job.name,
        schedule: job.schedule,
        timezone,
        status: "IDLE",
        lastCompletedAt: null,
        lastStartedAt: null,
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  // 2. Atomically acquire lock (either not running, or lock is stale)
  const lockedState = await CronJobStateModel.findOneAndUpdate(
    {
      jobName: job.name,
      $or: [
        { status: { $in: ["IDLE", "COMPLETED", "FAILED"] } },
        { lockedAt: { $lt: staleLockThreshold } },
      ],
    },
    {
      $set: {
        status: "RUNNING",
        schedule: job.schedule,
        timezone,
        lastStartedAt: startedAt,
        lockedAt: startedAt,
      },
    },
    { returnDocument: "after" },
  );

  if (!lockedState) {
    console.warn(
      `[CRON RUNNER] [${job.name}] Skipping execution - already running or actively locked.`,
    );
    return {
      executed: false,
      skippedReason: "LOCKED",
    };
  }

  // 3. Execute the handler inside try-catch to guarantee lock release
  let executionError: Error | null = null;
  let summary: T | undefined = undefined;

  try {
    console.log(
      `[CRON RUNNER] [${job.name}] Starting execution (Trigger: ${triggerType}, Reference Date: ${executionDate.toISOString()})...`,
    );
    summary = await job.handler(executionDate);
  } catch (err: unknown) {
    executionError =
      err instanceof Error ? err : new Error(String(err));
    console.error(
      `[CRON RUNNER] [${job.name}] Execution failed: ${executionError.message}`,
    );
  }

  const durationMs = Math.max(1, Date.now() - wallClockStart);
  const completedAt = new Date(startedAt.getTime() + durationMs);
  const isSuccess = executionError === null;

  // 4. Update state and release lock
  try {
    await CronJobStateModel.findOneAndUpdate(
      { jobName: job.name },
      {
        $set: {
          status: isSuccess ? "COMPLETED" : "FAILED",
          lastCompletedAt: isSuccess ? completedAt : lockedState.lastCompletedAt,
          lastExecutionDurationMs: durationMs,
          lastError: isSuccess ? null : executionError?.message,
          lastSummary: (summary as Record<string, unknown>) ?? null,
          lockedAt: null,
        },
      },
      { returnDocument: "after" },
    );

    // 5. Record audit history entry
    await CronJobHistoryModel.create({
      jobName: job.name,
      triggerType,
      startedAt,
      completedAt,
      status: isSuccess ? "COMPLETED" : "FAILED",
      durationMs,
      summary: (summary as Record<string, unknown>) ?? null,
      error: executionError ? executionError.message : null,
    });
  } catch (dbErr: unknown) {
    console.error(
      `[CRON RUNNER] [${job.name}] Error saving final state / history to MongoDB:`,
      dbErr,
    );
  }

  if (isSuccess) {
    console.log(
      `[CRON RUNNER] [${job.name}] Completed successfully in ${durationMs}ms.`,
    );
    return {
      executed: true,
      success: true,
      durationMs,
      summary,
    };
  } else {
    return {
      executed: true,
      success: false,
      durationMs,
      error: executionError?.message,
    };
  }
}
