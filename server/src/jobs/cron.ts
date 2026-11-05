import cron, { type ScheduledTask } from "node-cron";
import { processDailyTrainerSalaryAccruals } from "./trainer-salary.job.js";
import { processNightlyAttendanceCheckouts } from "./attendance-checkout.job.js";
import { processDailySubscriptionRenewalsAndDues } from "./member-subscription.job.js";
import { executeCronJob, type CronJobDefinition } from "./cron-runner.js";
import {
  runMissedCronJobsOnStartup,
  type StartupRecoverySummary,
} from "./cron-recovery.js";

const activeTasks: Map<string, ScheduledTask> = new Map();
const DEFAULT_TIMEZONE = "Asia/Kolkata";

export const REGISTERED_CRON_JOBS: CronJobDefinition[] = [
  {
    name: "Trainer Salary Due Accrual",
    schedule: "0 0 * * *", // Everyday exactly at 12:00 AM
    timezone: DEFAULT_TIMEZONE,
    handler: async (targetDate?: Date) => {
      console.log(
        `[CRON] [${new Date().toISOString()}] Starting Trainer Salary Due Accrual job...`,
      );
      const summary = await processDailyTrainerSalaryAccruals(targetDate);
      console.log(
        `[CRON] [${new Date().toISOString()}] Completed Trainer Salary Due Accrual job.`,
      );
      return summary as unknown as Record<string, unknown>;
    },
  },
  {
    name: "Member Subscription Renewal & Due Accrual",
    schedule: "0 0 * * *", // Everyday exactly at 12:00 AM
    timezone: DEFAULT_TIMEZONE,
    handler: async (targetDate?: Date) => {
      console.log(
        `[CRON] [${new Date().toISOString()}] Starting Member Subscription Renewal & Due Accrual job...`,
      );
      const summary =
        await processDailySubscriptionRenewalsAndDues(targetDate);
      console.log(
        `[CRON] [${new Date().toISOString()}] Completed Member Subscription Renewal & Due Accrual job.`,
      );
      return summary as unknown as Record<string, unknown>;
    },
  },
  {
    name: "Attendance Nightly Auto Check-Out",
    schedule: "30 22 * * *", // Everyday exactly at 10:30 PM
    timezone: DEFAULT_TIMEZONE,
    handler: async (executionDate?: Date) => {
      console.log(
        `[CRON] [${new Date().toISOString()}] Starting Attendance Nightly Auto Check-Out job...`,
      );
      const summary = await processNightlyAttendanceCheckouts(executionDate);
      console.log(
        `[CRON] [${new Date().toISOString()}] Completed Attendance Nightly Auto Check-Out job.`,
      );
      return summary as unknown as Record<string, unknown>;
    },
  },
];

/**
 * Checks for missed scheduled runs during server downtime and executes them.
 */
export async function runMissedCronJobs(
  now?: Date,
): Promise<StartupRecoverySummary> {
  return await runMissedCronJobsOnStartup({
    jobs: REGISTERED_CRON_JOBS,
    now: now || new Date(),
    catchUpUninitialized: true,
  });
}

/**
 * Initializes and schedules all background cron jobs with persistent tracking.
 */
export function initCronJobs(): void {
  stopCronJobs();

  for (const job of REGISTERED_CRON_JOBS) {
    try {
      const task = cron.schedule(
        job.schedule,
        async () => {
          try {
            await executeCronJob(job, "SCHEDULE");
          } catch (error: unknown) {
            const msg =
              error instanceof Error ? error.message : String(error);
            console.error(`[CRON ERROR] Job '${job.name}' failed: ${msg}`);
          }
        },
        {
          timezone: job.timezone || DEFAULT_TIMEZONE,
        },
      );

      activeTasks.set(job.name, task);
      console.log(
        `[CRON] Scheduled '${job.name}' with expression '${job.schedule}' (Timezone: ${job.timezone || DEFAULT_TIMEZONE})`,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(
        `[CRON ERROR] Failed to schedule cron job '${job.name}': ${msg}`,
      );
    }
  }

  console.log(
    `[CRON] Successfully initialized ${activeTasks.size} cron jobs.`,
  );
}

/**
 * Stops and clears all active scheduled tasks.
 */
export function stopCronJobs(): void {
  for (const [name, task] of activeTasks.entries()) {
    try {
      task.stop();
      console.log(`[CRON] Stopped job '${name}'`);
    } catch (err) {
      console.error(`[CRON ERROR] Error stopping job '${name}':`, err);
    }
  }
  activeTasks.clear();
}

/**
 * Helper to inspect active jobs count and names (used in health/tests).
 */
export function getActiveCronJobs(): string[] {
  return Array.from(activeTasks.keys());
}

/**
 * Helper to get list of registered cron job definitions.
 */
export function getRegisteredCronJobs(): CronJobDefinition[] {
  return REGISTERED_CRON_JOBS;
}
