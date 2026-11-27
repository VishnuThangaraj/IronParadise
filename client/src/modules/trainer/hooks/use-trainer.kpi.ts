import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LuUsers,
  LuUserCheck,
  LuAward,
  LuIndianRupee,
} from "react-icons/lu";
import type { KPICardProps } from "@/shared/components/ui/kpi";
import {
  selectTrainers,
  selectTrainerLoading,
} from "../redux/trainer.selector";
import type { Trainer } from "../types/trainer.types";

export interface UseTrainerKPIOptions {
  trainers?: Trainer[];
  loading?: boolean;
}

export interface TrainerKPIStats {
  totalTrainers: number;
  activeTrainers: number;
  activeRate: number;
  thisMonthTrainers: number;
  avgExperience: number;
  minExperience: number;
  maxExperience: number;
  avgSalary: number;
  minSalary: number;
  maxSalary: number;
}

/**
 * Computes aggregate KPI statistics for a list of trainers.
 */
export const computeTrainerKPIStats = (
  trainers: Trainer[],
  referenceDate: Date = new Date(),
): TrainerKPIStats => {
  const totalTrainers = trainers.length;

  if (totalTrainers === 0) {
    return {
      totalTrainers: 0,
      activeTrainers: 0,
      activeRate: 0,
      thisMonthTrainers: 0,
      avgExperience: 0,
      minExperience: 0,
      maxExperience: 0,
      avgSalary: 0,
      minSalary: 0,
      maxSalary: 0,
    };
  }

  let activeTrainers = 0;
  let thisMonthTrainers = 0;
  let experienceSum = 0;
  let minExperience = Infinity;
  let maxExperience = -Infinity;
  let salarySum = 0;
  let minSalary = Infinity;
  let maxSalary = -Infinity;

  const refMonth = referenceDate.getMonth();
  const refYear = referenceDate.getFullYear();

  for (const trainer of trainers) {
    if (trainer.isActive && trainer.employmentStatus !== "terminated") {
      activeTrainers += 1;
    }

    const dateSource = trainer.joinDate || trainer.createdAt;
    if (dateSource) {
      const parsedDate = new Date(dateSource);
      if (
        !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.getMonth() === refMonth &&
        parsedDate.getFullYear() === refYear
      ) {
        thisMonthTrainers += 1;
      }
    }

    const rawExp = Number(trainer.experienceYears);
    const exp = Number.isFinite(rawExp) && rawExp >= 0 ? rawExp : 0;
    experienceSum += exp;
    if (exp < minExperience) minExperience = exp;
    if (exp > maxExperience) maxExperience = exp;

    const rawSalary = Number(trainer.salary);
    const salary = Number.isFinite(rawSalary) && rawSalary >= 0 ? rawSalary : 0;
    salarySum += salary;
    if (salary < minSalary) minSalary = salary;
    if (salary > maxSalary) maxSalary = salary;
  }

  const activeRate = Math.round((activeTrainers / totalTrainers) * 100);
  const avgExperience = Number((experienceSum / totalTrainers).toFixed(1));
  const avgSalary = Math.round(salarySum / totalTrainers);

  return {
    totalTrainers,
    activeTrainers,
    activeRate,
    thisMonthTrainers,
    avgExperience,
    minExperience,
    maxExperience,
    avgSalary,
    minSalary,
    maxSalary,
  };
};

export const useTrainerKPI = (options: UseTrainerKPIOptions = {}) => {
  const reduxTrainers = useSelector(selectTrainers);
  const reduxLoading = useSelector(selectTrainerLoading);

  const trainers = options.trainers ?? reduxTrainers;
  const loading = options.loading ?? reduxLoading;

  const stats = useMemo(
    () => computeTrainerKPIStats(trainers),
    [trainers],
  );

  const kpiData: KPICardProps[] = useMemo(() => {
    const isLoading = loading && stats.totalTrainers === 0;

    return [
      {
        id: "total-trainers",
        title: "Total Trainers",
        value: isLoading ? "..." : String(stats.totalTrainers),
        subtitle: "Across all specialties",
        change:
          stats.thisMonthTrainers > 0
            ? `+${stats.thisMonthTrainers} this month`
            : `${stats.totalTrainers} ${stats.totalTrainers === 1 ? "trainer" : "trainers"} total`,
        trend: stats.thisMonthTrainers > 0 ? "up" : "neutral",
        icon: LuUsers,
        color: "blue",
      },
      {
        id: "active-trainers",
        title: "Active Trainers",
        value: isLoading ? "..." : String(stats.activeTrainers),
        subtitle: "Currently on staff",
        change: `${stats.activeRate}% active rate`,
        trend:
          stats.activeRate >= 70
            ? "up"
            : stats.activeRate > 0
              ? "neutral"
              : "down",
        icon: LuUserCheck,
        color: "emerald",
      },
      {
        id: "avg-experience",
        title: "Avg. Experience",
        value: isLoading
          ? "..."
          : `${stats.avgExperience} ${stats.avgExperience === 1 ? "yr" : "yrs"}`,
        subtitle: "Years of experience",
        change:
          stats.totalTrainers > 0
            ? `${stats.minExperience} - ${stats.maxExperience} yrs range`
            : "No trainers",
        trend: "neutral",
        icon: LuAward,
        color: "indigo",
      },
      {
        id: "avg-salary",
        title: "Avg. Monthly Salary",
        value: isLoading
          ? "..."
          : `₹${stats.avgSalary.toLocaleString("en-IN")}`,
        subtitle: "Per trainer monthly",
        change:
          stats.totalTrainers > 0
            ? `₹${stats.minSalary.toLocaleString("en-IN")} - ₹${stats.maxSalary.toLocaleString("en-IN")} range`
            : "No trainers",
        trend: "neutral",
        icon: LuIndianRupee,
        color: "amber",
      },
    ];
  }, [loading, stats]);

  return {
    trainers,
    loading,
    ...stats,
    kpiData,
  };
};

export default useTrainerKPI;
