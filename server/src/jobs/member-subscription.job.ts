import UserModel from "../modules/user/user.model.js";
import MemberAssignmentModel from "../modules/member/member-assignment/member-assignment.model.js";
import MemberPaymentModel from "../modules/member/member-payment/member-payment.model.js";
import MembershipPlanModel from "../modules/membership-plan/membership-plan.model.js";
import { generateId } from "../shared/utils/id-generator.js";

export interface SubscriptionRenewalDetail {
  userId: string;
  assignmentId: string;
  action: "EXPIRED" | "MARKED_OVERDUE" | "RENEWAL_GENERATED";
  details?: string;
}

export interface SubscriptionRenewalSummary {
  executionDate: string;
  totalEvaluated: number;
  expiredAssignmentsCount: number;
  overduePaymentsCount: number;
  renewalsCreatedCount: number;
  details: SubscriptionRenewalDetail[];
}

/**
 * Evaluates whether a membership assignment end date has arrived or passed as of targetDate.
 */
export function isSubscriptionExpiredOnDate(
  endDateInput: Date | string,
  targetDateInput: Date = new Date(),
): boolean {
  const endDate = new Date(endDateInput);
  if (isNaN(endDate.getTime())) return false;
  const targetDate = new Date(targetDateInput);

  // Set times to midnight for date-only comparison
  const endD = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
  );
  const targetD = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );

  return endD <= targetD;
}

/**
 * Calculates end date based on start date and duration in months.
 */
export function calculateSubscriptionEndDate(
  startDate: Date,
  durationMonths: number,
): Date {
  const end = new Date(startDate);
  end.setMonth(end.getMonth() + durationMonths);
  return end;
}

/**
 * Processes daily midnight subscription renewal and dues evaluation.
 * Runs at 12:00 AM (0 0 * * *) or deterministic testing when invoked with targetDate.
 */
export async function processDailySubscriptionRenewalsAndDues(
  targetDateInput: Date = new Date(),
): Promise<SubscriptionRenewalSummary> {
  const targetDate = new Date(targetDateInput);
  const targetDayMidnight = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    23,
    59,
    59,
    999,
  );

  const summary: SubscriptionRenewalSummary = {
    executionDate: targetDate.toISOString().slice(0, 10),
    totalEvaluated: 0,
    expiredAssignmentsCount: 0,
    overduePaymentsCount: 0,
    renewalsCreatedCount: 0,
    details: [],
  };

  // 1. Find all active assignments
  const activeAssignments = await MemberAssignmentModel.find({
    status: "ACTIVE",
  });

  summary.totalEvaluated = activeAssignments.length;

  for (const assignment of activeAssignments) {
    const isExpired = isSubscriptionExpiredOnDate(
      assignment.endDate,
      targetDate,
    );

    if (isExpired) {
      // Transition assignment to EXPIRED
      assignment.status = "EXPIRED";
      await assignment.save();
      summary.expiredAssignmentsCount++;
      summary.details.push({
        userId: assignment.userId,
        assignmentId: assignment.assignmentId,
        action: "EXPIRED",
        details: `Assignment ended on ${assignment.endDate.toISOString().slice(0, 10)}`,
      });

      // Update associated payment to OVERDUE if amountDue > 0
      const payment = await MemberPaymentModel.findOne({
        assignmentId: assignment.assignmentId,
      });

      if (
        payment &&
        payment.amountDue > 0 &&
        payment.paymentStatus !== "OVERDUE"
      ) {
        payment.paymentStatus = "OVERDUE";
        await payment.save();
        summary.overduePaymentsCount++;
        summary.details.push({
          userId: assignment.userId,
          assignmentId: assignment.assignmentId,
          action: "MARKED_OVERDUE",
          details: `Payment ${payment.paymentId} marked OVERDUE with due ₹${payment.amountDue}`,
        });
      }

      // Check if member is eligible for renewal / renewal due generation
      if (assignment.membershipPlanId) {
        const memberUser = await UserModel.findOne({
          userId: assignment.userId,
          role: "member",
        });

        // Only renew for active members
        if (memberUser && memberUser.isActive !== false) {
          // Check if a newer assignment already exists for this member
          const hasNewerAssignment = await MemberAssignmentModel.findOne({
            userId: assignment.userId,
            startDate: { $gte: assignment.endDate },
          });

          if (!hasNewerAssignment) {
            // Find plan details
            const plan = await MembershipPlanModel.findOne({
              membershipPlanId: assignment.membershipPlanId,
            });

            if (plan) {
              const newAssignmentId = await generateId("assignment");
              const newStartDate = new Date(assignment.endDate);
              const newEndDate = calculateSubscriptionEndDate(
                newStartDate,
                plan.durationMonths,
              );

              await MemberAssignmentModel.create([
                {
                  assignmentId: newAssignmentId,
                  userId: assignment.userId,
                  membershipPlanId: plan.membershipPlanId,
                  dietPlanId: assignment.dietPlanId || null,
                  workoutPlanId: assignment.workoutPlanId || null,
                  trainerId: assignment.trainerId || null,
                  startDate: newStartDate,
                  endDate: newEndDate,
                  status: "ACTIVE",
                },
              ]);

              const newPaymentId = await generateId("payment");
              await MemberPaymentModel.create([
                {
                  paymentId: newPaymentId,
                  userId: assignment.userId,
                  assignmentId: newAssignmentId,
                  totalAmount: plan.price,
                  amountPaid: 0,
                  amountDue: plan.price,
                  dueDate: newStartDate,
                  paymentStatus: "PENDING",
                },
              ]);

              summary.renewalsCreatedCount++;
              summary.details.push({
                userId: assignment.userId,
                assignmentId: newAssignmentId,
                action: "RENEWAL_GENERATED",
                details: `Renewed plan ${plan.planName} (₹${plan.price}) from ${newStartDate.toISOString().slice(0, 10)} to ${newEndDate.toISOString().slice(0, 10)}`,
              });
            }
          }
        }
      }
    }
  }

  // 2. Also check any standalone pending/partial payments whose dueDate <= targetDate
  const overduePayments = await MemberPaymentModel.find({
    paymentStatus: { $in: ["PENDING", "PARTIAL"] },
    amountDue: { $gt: 0 },
    dueDate: { $lte: targetDayMidnight },
  });

  for (const pay of overduePayments) {
    pay.paymentStatus = "OVERDUE";
    await pay.save();
    summary.overduePaymentsCount++;
    summary.details.push({
      userId: pay.userId,
      assignmentId: pay.assignmentId,
      action: "MARKED_OVERDUE",
      details: `Payment ${pay.paymentId} matured past due date ${pay.dueDate.toISOString().slice(0, 10)}`,
    });
  }

  return summary;
}
