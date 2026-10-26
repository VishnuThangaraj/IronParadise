import cron, { type ScheduledTask } from "node-cron";
import { processDailyTrainerSalaryAccruals } from "./trainer-salary.job.js";
import { processNightlyAttendanceCheckouts } from "./attendance-checkout.job.js";

interface CronJobDefinition {
  name: string;
  schedule: string;
  handler: () => Promise<void>;
  timezone?: string;
}

const activeTasks: Map<string, ScheduledTask> = new Map();
const DEFAULT_TIMEZONE = "Asia/Kolkata";

/**
 * Initializes and schedules all background cron jobs.
 */
export function initCronJobs(): void {
  stopCronJobs();

  const jobs: CronJobDefinition[] = [
    {
      name: "Trainer Salary Due Accrual",
      schedule: "0 0 * * *", // Everyday exactly at 12:00 AM
      timezone: DEFAULT_TIMEZONE,
      handler: async () => {
        console.log(
          `[CRON] [${new Date().toISOString()}] Starting Trainer Salary Due Accrual job...`,
        );
        await processDailyTrainerSalaryAccruals();
        console.log(
          `[CRON] [${new Date().toISOString()}] Completed Trainer Salary Due Accrual job.`,
        );
      },
    },
    {
      name: "Attendance Nightly Auto Check-Out",
      schedule: "30 22 * * *", // Everyday exactly at 10:30 PM
      timezone: DEFAULT_TIMEZONE,
      handler: async () => {
        console.log(
          `[CRON] [${new Date().toISOString()}] Starting Attendance Nightly Auto Check-Out job...`,
        );
        await processNightlyAttendanceCheckouts();
        console.log(
          `[CRON] [${new Date().toISOString()}] Completed Attendance Nightly Auto Check-Out job.`,
        );
      },
    },
  ];

  for (const job of jobs) {
    try {
      const task = cron.schedule(
        job.schedule,
        async () => {
          try {
            await job.handler();
          } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
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

  console.log(`[CRON] Successfully initialized ${activeTasks.size} cron jobs.`);
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
