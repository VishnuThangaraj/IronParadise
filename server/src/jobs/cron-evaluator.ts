import { CronExpressionParser } from "cron-parser";

export interface MissedExecutionCheckResult {
  missed: boolean;
  lastScheduledRun: Date;
  reason:
    | "INITIAL_RUN"
    | "SCHEDULED_RUN_MISSED"
    | "ALREADY_COMPLETED"
    | "INVALID_SCHEDULE";
  missedIntervalsCount?: number;
}

export interface MissedCheckOptions {
  schedule: string;
  lastCompletedAt?: Date | null | undefined;
  now?: Date | undefined;
  timezone?: string | undefined;
  catchUpUninitialized?: boolean | undefined;
}

/**
 * Returns the most recent scheduled execution timestamp that should have occurred
 * on or before `referenceDate`.
 */
export function getMostRecentScheduledDate(
  schedule: string,
  referenceDate: Date = new Date(),
  timezone: string = "Asia/Kolkata",
): Date {
  // Adding 1000ms ensures that if referenceDate matches the exact scheduled second,
  // that moment is included in the evaluation.
  const evalDate = new Date(referenceDate.getTime() + 1000);
  const expr = CronExpressionParser.parse(schedule, {
    currentDate: evalDate,
    tz: timezone,
  });
  return expr.prev().toDate();
}

/**
 * Returns the next scheduled execution timestamp after `referenceDate`.
 */
export function getNextScheduledDate(
  schedule: string,
  referenceDate: Date = new Date(),
  timezone: string = "Asia/Kolkata",
): Date {
  const expr = CronExpressionParser.parse(schedule, {
    currentDate: referenceDate,
    tz: timezone,
  });
  return expr.next().toDate();
}

/**
 * Determines whether a scheduled cron execution was missed based on when it was
 * last completed versus the latest scheduled execution time.
 */
export function isCronExecutionMissed(
  options: MissedCheckOptions,
): MissedExecutionCheckResult {
  const {
    schedule,
    lastCompletedAt,
    now = new Date(),
    timezone = "Asia/Kolkata",
    catchUpUninitialized = true,
  } = options;

  let lastScheduledRun: Date;
  try {
    lastScheduledRun = getMostRecentScheduledDate(schedule, now, timezone);
  } catch (err) {
    console.error(
      `[CRON EVALUATOR] Invalid cron expression or timezone: '${schedule}' (${timezone}):`,
      err,
    );
    return {
      missed: false,
      lastScheduledRun: new Date(0),
      reason: "INVALID_SCHEDULE",
    };
  }

  // 1. If never run before, check if catch-up is enabled for uninitialized jobs
  if (!lastCompletedAt) {
    return {
      missed: catchUpUninitialized,
      lastScheduledRun,
      reason: catchUpUninitialized ? "INITIAL_RUN" : "ALREADY_COMPLETED",
      missedIntervalsCount: catchUpUninitialized ? 1 : 0,
    };
  }

  const lastCompletedTime = new Date(lastCompletedAt).getTime();
  const scheduledTime = lastScheduledRun.getTime();

  // 2. If lastCompletedAt is strictly prior to the most recent scheduled time,
  // then the scheduled job was missed while the server was offline.
  if (lastCompletedTime < scheduledTime) {
    // Optionally count how many intervals were missed
    let missedIntervalsCount = 1;
    try {
      const expr = CronExpressionParser.parse(schedule, {
        currentDate: new Date(lastCompletedTime + 1000),
        tz: timezone,
      });
      let count = 0;
      while (count < 100) {
        const nextTick = expr.next().toDate().getTime();
        if (nextTick <= now.getTime()) {
          count++;
        } else {
          break;
        }
      }
      if (count > 0) missedIntervalsCount = count;
    } catch {
      // Non-critical, fallback to 1
    }

    return {
      missed: true,
      lastScheduledRun,
      reason: "SCHEDULED_RUN_MISSED",
      missedIntervalsCount,
    };
  }

  // 3. Otherwise, the job has already been completed for the current interval
  return {
    missed: false,
    lastScheduledRun,
    reason: "ALREADY_COMPLETED",
    missedIntervalsCount: 0,
  };
}
