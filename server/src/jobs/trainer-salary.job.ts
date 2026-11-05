import UserModel from "../modules/user/user.model.js";
import TrainerDetailsModel from "../modules/trainer/trainer-details/trainer-details.model.js";
import TrainerPaymentModel from "../modules/trainer/trainer-payment/trainer-payment.model.js";

export interface AccrualResultItem {
  userId: string;
  fullName: string;
  salary: number;
  previousAmountDue: number;
  newAmountDue: number;
  paymentStatus: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";
  cycleMonth: string;
}

export interface DailyAccrualSummary {
  executionDate: string;
  cycleMonth: string;
  totalActiveTrainers: number;
  eligibleTodayCount: number;
  accruedCount: number;
  skippedAlreadyAccruedCount: number;
  details: AccrualResultItem[];
}

/**
 * Calculates whether a trainer's monthly salary cycle matures on targetDate based on joinDate.
 * Handles standard day matching as well as month-end clamping (e.g. joined on 31st -> Feb 28/29, Apr 30).
 */
export function isTrainerSalaryDueOnDate(
  joinDateInput: Date | string,
  targetDateInput: Date = new Date(),
  allowCatchup: boolean = false,
): boolean {
  const joinDate = new Date(joinDateInput);
  if (isNaN(joinDate.getTime())) return false;

  const targetDate = new Date(targetDateInput);

  const joinYear = joinDate.getFullYear();
  const joinMonth = joinDate.getMonth();
  const joinDay = joinDate.getDate();

  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();
  const targetDay = targetDate.getDate();

  // Salary only matures after at least 1 month of tenure
  if (
    targetYear < joinYear ||
    (targetYear === joinYear && targetMonth <= joinMonth)
  ) {
    return false;
  }

  // Last day of target month (e.g., 28/29 for Feb, 30 for Apr/Jun/Sep/Nov, 31 for others)
  const lastDayOfTargetMonth = new Date(
    targetYear,
    targetMonth + 1,
    0,
  ).getDate();
  const isLastDayOfTargetMonth = targetDay === lastDayOfTargetMonth;

  // Direct calendar day match (e.g., joined on 15th, today is 15th)
  if (joinDay === targetDay) {
    return true;
  }

  // Month-end clamp: if trainer joined on 29th, 30th, or 31st and target month is shorter
  if (isLastDayOfTargetMonth && joinDay > lastDayOfTargetMonth) {
    return true;
  }

  // In catch-up mode, if the target day is after the join day in this cycle month
  if (allowCatchup && targetDay >= joinDay) {
    return true;
  }

  return false;
}

/**
 * Processes daily trainer salary due accrual.
 * Can be run by cron or manually invoked with an optional targetDate for deterministic testing.
 */
export async function processDailyTrainerSalaryAccruals(
  targetDateInput: Date = new Date(),
  allowCatchup: boolean = true,
): Promise<DailyAccrualSummary> {
  const targetDate = new Date(targetDateInput);
  const cycleMonth = `${targetDate.getFullYear()}-${String(
    targetDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  const summary: DailyAccrualSummary = {
    executionDate: targetDate.toISOString().slice(0, 10),
    cycleMonth,
    totalActiveTrainers: 0,
    eligibleTodayCount: 0,
    accruedCount: 0,
    skippedAlreadyAccruedCount: 0,
    details: [],
  };

  // 1. Fetch all active users with role 'trainer'
  const activeTrainerUsers = await UserModel.find({
    role: "trainer",
    isActive: true,
  }).select("userId fullName");

  if (activeTrainerUsers.length === 0) {
    return summary;
  }

  const activeUserIds = activeTrainerUsers.map((u) => u.userId);
  const userMap = new Map(activeTrainerUsers.map((u) => [u.userId, u.fullName]));

  // 2. Fetch trainer details where employmentStatus is 'active'
  const activeTrainerDetails = await TrainerDetailsModel.find({
    userId: { $in: activeUserIds },
    employmentStatus: "active",
  });

  summary.totalActiveTrainers = activeTrainerDetails.length;

  // 3. Evaluate eligibility and accrue salary
  for (const details of activeTrainerDetails) {
    const isDue = isTrainerSalaryDueOnDate(
      details.joinDate,
      targetDate,
      allowCatchup,
    );
    if (!isDue) {
      continue;
    }

    summary.eligibleTodayCount += 1;

    // Find payment record
    const payment = await TrainerPaymentModel.findOne({
      userId: details.userId,
    });

    if (!payment) {
      console.warn(
        `[TRAINER SALARY JOB] No payment record found for trainer '${details.userId}'. Skipping.`,
      );
      continue;
    }

    // Idempotency check: verify salary hasn't already accrued for this month cycle
    if (payment.lastAccruedMonth === cycleMonth) {
      summary.skippedAlreadyAccruedCount += 1;
      continue;
    }

    const salary = payment.salary || 0;
    const previousDue = payment.amountDue || 0;
    const newAmountDue = previousDue + salary;

    // Status: if trainer had an existing unpaid balance carried over, mark as OVERDUE, else PENDING
    const paymentStatus: "PENDING" | "OVERDUE" =
      previousDue > 0 ? "OVERDUE" : "PENDING";

    await TrainerPaymentModel.findByIdAndUpdate(payment._id, {
      $set: {
        amountDue: newAmountDue,
        amountPaid: 0, // Reset paid amount for the new cycle
        paymentStatus,
        lastAccruedMonth: cycleMonth,
      },
    });

    summary.accruedCount += 1;
    summary.details.push({
      userId: details.userId,
      fullName: userMap.get(details.userId) || details.userId,
      salary,
      previousAmountDue: previousDue,
      newAmountDue,
      paymentStatus,
      cycleMonth,
    });
  }

  console.log(
    `[TRAINER SALARY JOB] Processed ${summary.accruedCount} salary accruals for cycle ${cycleMonth} on ${summary.executionDate} (${summary.skippedAlreadyAccruedCount} skipped due to existing accrual).`,
  );

  return summary;
}
