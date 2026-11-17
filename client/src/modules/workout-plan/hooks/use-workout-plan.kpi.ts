import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LuDumbbell,
  LuCircleCheck,
  LuCalendar,
  LuSparkles,
} from "react-icons/lu";
import type { KPICardProps } from "@/shared/components/ui/kpi";
import {
  selectWorkoutPlans,
  selectWorkoutPlanLoading,
} from "../redux/workout-plan.selector";
import type { WorkoutPlan, DayWorkout } from "../types/workout-plan.types";

export interface UseWorkoutPlanKPIOptions {
  plans?: WorkoutPlan[];
  loading?: boolean;
}

const DAYS: (keyof Pick<
  WorkoutPlan,
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"
>)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const getPlanTrainingDaysPerWeek = (plan: WorkoutPlan): number => {
  let trainingDays = 0;
  for (const day of DAYS) {
    const dayData: DayWorkout | undefined = plan[day];
    if (!dayData) continue;
    const hasExercises =
      Array.isArray(dayData.exercises) && dayData.exercises.length > 0;
    const focusLower = (dayData.focus || "").toLowerCase();
    const isRest =
      focusLower.includes("rest") ||
      focusLower.includes("recovery") ||
      focusLower.includes("off");

    if (hasExercises && !isRest) {
      trainingDays++;
    } else if (hasExercises) {
      trainingDays++;
    }
  }
  return trainingDays;
};

const useWorkoutPlanKPI = (options: UseWorkoutPlanKPIOptions = {}) => {
  const reduxPlans = useSelector(selectWorkoutPlans);
  const reduxLoading = useSelector(selectWorkoutPlanLoading);

  const plans = options.plans ?? reduxPlans;
  const loading = options.loading ?? reduxLoading;

  const totalPlans = plans.length;
  const activePlans = useMemo(
    () => plans.filter((plan) => plan.isActive),
    [plans],
  );
  const activePlansCount = activePlans.length;

  const thisMonthPlansCount = useMemo(() => {
    const now = new Date();
    return plans.filter((plan) => {
      if (!plan.createdAt) return false;
      const createdDate = new Date(plan.createdAt);
      return (
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [plans]);

  const activeRate =
    totalPlans > 0 ? Math.round((activePlansCount / totalPlans) * 100) : 0;

  const { avgTrainingDays, minTrainingDays, maxTrainingDays } = useMemo(() => {
    const targetPlans = activePlansCount > 0 ? activePlans : plans;
    const trainingDaysList = targetPlans
      .map(getPlanTrainingDaysPerWeek)
      .filter((days) => days > 0);

    const avg =
      trainingDaysList.length > 0
        ? Math.round(
            (trainingDaysList.reduce((sum, days) => sum + days, 0) /
              trainingDaysList.length) *
              10,
          ) / 10
        : 0;

    const min =
      trainingDaysList.length > 0 ? Math.min(...trainingDaysList) : 0;
    const max =
      trainingDaysList.length > 0 ? Math.max(...trainingDaysList) : 0;

    return {
      avgTrainingDays: avg,
      minTrainingDays: min,
      maxTrainingDays: max,
    };
  }, [plans, activePlans, activePlansCount]);

  const topGoal = useMemo(() => {
    const targetPlans = activePlansCount > 0 ? activePlans : plans;
    if (targetPlans.length === 0) return null;

    const goalCounts: Record<string, number> = {};
    for (const plan of targetPlans) {
      const goal = plan.goal?.trim();
      if (goal) {
        goalCounts[goal] = (goalCounts[goal] || 0) + 1;
      }
    }

    const sortedGoals = Object.entries(goalCounts).sort((a, b) => b[1] - a[1]);
    if (sortedGoals.length === 0) return null;

    return {
      name: sortedGoals[0][0],
      count: sortedGoals[0][1],
    };
  }, [plans, activePlans, activePlansCount]);

  const kpiData: KPICardProps[] = useMemo(() => {
    const isLoading = loading && totalPlans === 0;

    return [
      {
        id: "total-workout-plans",
        title: "Total Workout Plans",
        value: isLoading ? "..." : String(totalPlans),
        subtitle: "Training routines",
        change:
          thisMonthPlansCount > 0
            ? `+${thisMonthPlansCount} this month`
            : `${totalPlans} total ${totalPlans === 1 ? "routine" : "routines"}`,
        trend: thisMonthPlansCount > 0 ? "up" : "neutral",
        icon: LuDumbbell,
        color: "blue",
      },
      {
        id: "active-workout-plans",
        title: "Active Routines",
        value: isLoading ? "..." : String(activePlansCount),
        subtitle: "Currently available",
        change: `${activeRate}% active rate`,
        trend: activeRate >= 50 ? "up" : activeRate > 0 ? "neutral" : "down",
        icon: LuCircleCheck,
        color: "green",
      },
      {
        id: "avg-training-frequency",
        title: "Avg. Training Days",
        value:
          isLoading
            ? "..."
            : avgTrainingDays > 0
              ? `${avgTrainingDays} Days / Wk`
              : "N/A",
        subtitle: "Weekly split frequency",
        change:
          (activePlansCount > 0 ? activePlans : plans).length > 0 &&
          maxTrainingDays > 0
            ? `${minTrainingDays} - ${maxTrainingDays} days range`
            : "No routine data",
        trend: "neutral",
        icon: LuCalendar,
        color: "orange",
      },
      {
        id: "top-workout-goal",
        title: "Top Goal",
        value: isLoading ? "..." : (topGoal?.name ?? "None"),
        subtitle: topGoal
          ? `${topGoal.count} ${topGoal.count === 1 ? "routine" : "routines"}`
          : "No active plans",
        change: topGoal ? "Primary training focus" : "No goal data",
        trend: "neutral",
        icon: LuSparkles,
        color: "purple",
      },
    ];
  }, [
    loading,
    totalPlans,
    thisMonthPlansCount,
    activePlansCount,
    activeRate,
    avgTrainingDays,
    minTrainingDays,
    maxTrainingDays,
    topGoal,
    activePlans,
    plans,
  ]);

  return {
    plans,
    loading,
    totalPlans,
    activePlansCount,
    activeRate,
    avgTrainingDays,
    minTrainingDays,
    maxTrainingDays,
    topGoal,
    thisMonthPlansCount,
    kpiData,
  };
};

export default useWorkoutPlanKPI;
