import {
  CronJobStateModel,
} from "./cron-job.model.js";
import { isCronExecutionMissed } from "./cron-evaluator.js";
import {
  executeCronJob,
  type CronJobDefinition,
  type ExecutionResult,
} from "./cron-runner.js";

export interface RecoveryJobResult {
  jobName: string;
  action: "CATCHUP_EXECUTED" | "SKIPPED_ALREADY_COMPLETED" | "SKIPPED_LOCKED" | "FAILED";
  missedReason?: string | undefined;
  lastCompletedAt?: Date | null | undefined;
  lastScheduledRun?: Date | undefined;
  durationMs?: number | undefined;
  error?: string | undefined;
}

export interface StartupRecoverySummary {
  executionDate: string;
  totalJobsChecked: number;
  catchUpExecutedCount: number;
  alreadyUpToDateCount: number;
  failedCount: number;
  details: RecoveryJobResult[];
}

export interface StartupRecoveryOptions {
  jobs: CronJobDefinition[];
  now?: Date;
  catchUpUninitialized?: boolean;
}

/**
 * Checks all registered cron jobs on server startup, identifies any scheduled
 * executions that were missed during server downtime, and runs them sequentially
 * before recurring schedules are activated.
 */
export async function runMissedCronJobsOnStartup(
  options: StartupRecoveryOptions,
): Promise<StartupRecoverySummary> {
  const { jobs, now = new Date(), catchUpUninitialized = true } = options;
  const executionDateStr = now.toISOString();

  console.log(
    `[CRON RECOVERY] [${executionDateStr}] Evaluating ${jobs.length} cron jobs for missed executions during downtime...`,
  );

  const summary: StartupRecoverySummary = {
    executionDate: executionDateStr,
    totalJobsChecked: jobs.length,
    catchUpExecutedCount: 0,
    alreadyUpToDateCount: 0,
    failedCount: 0,
    details: [],
  };

  for (const job of jobs) {
    try {
      const state = await CronJobStateModel.findOne({ jobName: job.name });
      const timezone = job.timezone || "Asia/Kolkata";

      const check = isCronExecutionMissed({
        schedule: job.schedule,
        lastCompletedAt: state?.lastCompletedAt,
        now,
        timezone,
        catchUpUninitialized:
          job.catchUpUninitialized ?? catchUpUninitialized,
      });

      if (!check.missed) {
        console.log(
          `[CRON RECOVERY] '${job.name}' is up-to-date (Last completed: ${state?.lastCompletedAt ? state.lastCompletedAt.toISOString() : "N/A"}). Skipping.`,
        );
        summary.alreadyUpToDateCount++;
        summary.details.push({
          jobName: job.name,
          action: "SKIPPED_ALREADY_COMPLETED",
          lastCompletedAt: state?.lastCompletedAt ?? null,
          lastScheduledRun: check.lastScheduledRun,
        });
        continue;
      }

      console.log(
        `[CRON RECOVERY] Missed execution detected for '${job.name}' (Reason: ${check.reason}, Missed intervals: ${check.missedIntervalsCount ?? 1}, Latest scheduled run: ${check.lastScheduledRun.toISOString()}). Initiating catch-up...`,
      );

      const execResult: ExecutionResult = await executeCronJob(
        job,
        "STARTUP_CATCHUP",
        check.lastScheduledRun,
        15 * 60 * 1000,
        now,
      );

      if (execResult.executed && execResult.success) {
        summary.catchUpExecutedCount++;
        summary.details.push({
          jobName: job.name,
          action: "CATCHUP_EXECUTED",
          missedReason: check.reason,
          lastScheduledRun: check.lastScheduledRun,
          durationMs: execResult.durationMs,
        });
      } else if (execResult.skippedReason === "LOCKED") {
        summary.details.push({
          jobName: job.name,
          action: "SKIPPED_LOCKED",
          missedReason: check.reason,
        });
      } else {
        summary.failedCount++;
        summary.details.push({
          jobName: job.name,
          action: "FAILED",
          missedReason: check.reason,
          error: execResult.error,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(
        `[CRON RECOVERY ERROR] Unhandled error evaluating '${job.name}': ${msg}`,
      );
      summary.failedCount++;
      summary.details.push({
        jobName: job.name,
        action: "FAILED",
        error: msg,
      });
    }
  }

  console.log(
    `[CRON RECOVERY] Completed startup check: ${summary.catchUpExecutedCount} caught up, ${summary.alreadyUpToDateCount} up-to-date, ${summary.failedCount} failed.`,
  );

  return summary;
}
