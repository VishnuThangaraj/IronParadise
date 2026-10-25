import { useMemo } from "react";
import {
  LuIndianRupee,
  LuCircleCheck,
  LuClock,
  LuTrendingUp,
} from "react-icons/lu";
import type { KPICardProps } from "@/shared/components/ui/kpi";
import type { Trainer } from "../types/trainer.types";

export interface UseTrainerPayrollKPIOptions {
  trainers?: Trainer[];
  loading?: boolean;
}

export const useTrainerPayrollKPI = (
  options: UseTrainerPayrollKPIOptions = {},
) => {
  const { trainers = [], loading = false } = options;

  const totalTrainers = trainers.length;

  const activeTrainers = useMemo(
    () =>
      trainers.filter(
        (t) => t.isActive && t.employmentStatus !== "terminated",
      ).length,
    [trainers],
  );

  const { totalSalary, minSalary, maxSalary, avgSalary } = useMemo(() => {
    if (trainers.length === 0) {
      return { totalSalary: 0, minSalary: 0, maxSalary: 0, avgSalary: 0 };
    }
    const salaries = trainers.map((t) => Number(t.salary) || 0);
    const sum = salaries.reduce((acc, curr) => acc + curr, 0);
    const min = Math.min(...salaries);
    const max = Math.max(...salaries);
    const avg = Math.round(sum / salaries.length);
    return { totalSalary: sum, minSalary: min, maxSalary: max, avgSalary: avg };
  }, [trainers]);

  const { totalPaid, totalDue, paidCount, pendingCount, partialCount } =
    useMemo(() => {
      let paidSum = 0;
      let dueSum = 0;
      let paid = 0;
      let pending = 0;
      let partial = 0;

      for (const t of trainers) {
        const salary = Number(t.salary) || 0;
        const status = (t.paymentStatus || "PENDING").toUpperCase();

        let tPaid = Number(t.amountPaid) || 0;
        let tDue =
          t.amountDue !== undefined ? Number(t.amountDue) : Math.max(0, salary - tPaid);

        if (status === "PAID") {
          tPaid = salary;
          tDue = 0;
          paid += 1;
        } else if (status === "PARTIAL") {
          partial += 1;
        } else {
          pending += 1;
        }

        paidSum += tPaid;
        dueSum += tDue;
      }

      return {
        totalPaid: paidSum,
        totalDue: dueSum,
        paidCount: paid,
        pendingCount: pending,
        partialCount: partial,
      };
    }, [trainers]);

  const paidRate =
    totalSalary > 0 ? Math.round((totalPaid / totalSalary) * 100) : 0;

  const kpiData: KPICardProps[] = useMemo(() => {
    const isLoading = loading && totalTrainers === 0;

    return [
      {
        id: "total-payroll",
        title: "Total Payroll",
        value: isLoading ? "..." : `₹${totalSalary.toLocaleString("en-IN")}`,
        subtitle: `Across ${totalTrainers} trainers`,
        change: `${activeTrainers} active on staff`,
        trend: "neutral",
        icon: LuIndianRupee,
        color: "blue",
      },
      {
        id: "disbursed-salaries",
        title: "Disbursed",
        value: isLoading ? "..." : `₹${totalPaid.toLocaleString("en-IN")}`,
        subtitle: `${paidCount} trainer${paidCount === 1 ? "" : "s"} fully paid`,
        change: `${paidRate}% payout completed`,
        trend: paidRate >= 70 ? "up" : paidRate > 0 ? "neutral" : "down",
        icon: LuCircleCheck,
        color: "emerald",
      },
      {
        id: "pending-payout",
        title: "Pending Payout",
        value: isLoading ? "..." : `₹${totalDue.toLocaleString("en-IN")}`,
        subtitle: `${pendingCount} awaiting disbursement`,
        change:
          pendingCount > 0
            ? `${pendingCount} pending`
            : "All salaries cleared",
        trend: totalDue === 0 ? "up" : "down",
        icon: LuClock,
        color: "amber",
      },
      {
        id: "avg-salary",
        title: "Avg. Salary",
        value: isLoading ? "..." : `₹${avgSalary.toLocaleString("en-IN")}`,
        subtitle: "Per trainer monthly",
        change:
          totalTrainers > 0
            ? `₹${minSalary.toLocaleString("en-IN")} - ₹${maxSalary.toLocaleString("en-IN")} range`
            : "No trainers",
        trend: "neutral",
        icon: LuTrendingUp,
        color: "indigo",
      },
    ];
  }, [
    loading,
    totalTrainers,
    totalSalary,
    activeTrainers,
    totalPaid,
    paidCount,
    paidRate,
    totalDue,
    pendingCount,
    avgSalary,
    minSalary,
    maxSalary,
  ]);

  return {
    trainers,
    loading,
    totalTrainers,
    activeTrainers,
    totalSalary,
    totalPaid,
    totalDue,
    paidCount,
    pendingCount,
    partialCount,
    paidRate,
    avgSalary,
    minSalary,
    maxSalary,
    kpiData,
  };
};

export default useTrainerPayrollKPI;
