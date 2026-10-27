import { useMemo } from "react";
import {
  LuIndianRupee,
  LuClock,
  LuCircleCheck,
  LuTriangleAlert,
} from "react-icons/lu";
import type { KPICardProps } from "@/shared/components/ui/kpi";
import type { MemberPaymentItem } from "../types/member-payment.types";

export interface UseMemberPaymentKPIOptions {
  payments?: MemberPaymentItem[];
  loading?: boolean;
}

export const useMemberPaymentKPI = (
  options: UseMemberPaymentKPIOptions = {},
) => {
  const { payments = [], loading = false } = options;

  const totalMembers = payments.length;

  const activeSubscriptions = useMemo(
    () =>
      payments.filter((p) => p.assignment?.status === "ACTIVE").length,
    [payments],
  );

  const {
    totalRevenue,
    totalDue,
    paidCount,
    pendingCount,
    partialCount,
    overdueCount,
  } = useMemo(() => {
    let rev = 0;
    let due = 0;
    let paid = 0;
    let pending = 0;
    let partial = 0;
    let overdue = 0;

    for (const p of payments) {
      rev += Number(p.amountPaid) || 0;
      due += Number(p.amountDue) || 0;

      const status = (p.paymentStatus || "PENDING").toUpperCase();
      if (status === "PAID") {
        paid++;
      } else if (status === "PARTIAL") {
        partial++;
      } else if (status === "OVERDUE") {
        overdue++;
      } else {
        pending++;
      }
    }

    return {
      totalRevenue: rev,
      totalDue: due,
      paidCount: paid,
      pendingCount: pending,
      partialCount: partial,
      overdueCount: overdue,
    };
  }, [payments]);

  const kpiData: KPICardProps[] = useMemo(() => {
    const isLoading = loading && totalMembers === 0;

    return [
      {
        id: "total-revenue",
        title: "Total Fee Revenue",
        value: isLoading ? "..." : `₹${totalRevenue.toLocaleString("en-IN")}`,
        subtitle: `${paidCount} Fully Paid accounts`,
        change: `${totalMembers} Total Members`,
        trend: "neutral",
        icon: LuIndianRupee,
        color: "emerald",
      },
      {
        id: "outstanding-dues",
        title: "Outstanding Dues",
        value: isLoading ? "..." : `₹${totalDue.toLocaleString("en-IN")}`,
        subtitle: `${pendingCount + partialCount} accounts pending`,
        change:
          totalDue > 0
            ? `${pendingCount + partialCount} with balance`
            : "All accounts clear",
        trend: totalDue === 0 ? "up" : "down",
        icon: LuClock,
        color: "amber",
      },
      {
        id: "overdue-subscriptions",
        title: "Overdue Accounts",
        value: isLoading ? "..." : overdueCount,
        subtitle: "Past plan due date",
        change:
          overdueCount > 0 ? "Action required" : "Zero overdue accounts",
        trend: overdueCount > 0 ? "down" : "up",
        icon: LuTriangleAlert,
        color: overdueCount > 0 ? "rose" : "indigo",
      },
      {
        id: "active-subscriptions",
        title: "Active Subscriptions",
        value: isLoading ? "..." : activeSubscriptions,
        subtitle: "Currently enrolled",
        change: `${totalMembers} registered total`,
        trend: "neutral",
        icon: LuCircleCheck,
        color: "indigo",
      },
    ];
  }, [
    loading,
    totalRevenue,
    paidCount,
    totalDue,
    pendingCount,
    partialCount,
    overdueCount,
    activeSubscriptions,
    totalMembers,
  ]);

  return {
    kpiData,
    totalMembers,
    activeSubscriptions,
    totalRevenue,
    totalDue,
    paidCount,
    pendingCount,
    partialCount,
    overdueCount,
  };
};

export default useMemberPaymentKPI;
