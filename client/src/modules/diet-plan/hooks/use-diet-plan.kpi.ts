import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LuUtensils,
  LuCircleCheck,
  LuFlame,
  LuSparkles,
} from "react-icons/lu";
import type { KPICardProps } from "@/shared/components/ui/kpi";
import {
  selectDietPlans,
  selectDietPlanLoading,
} from "../redux/diet-plan.selector";
import type { DietPlan, DayDiet, MealType } from "../types/diet-plan.types";

export interface UseDietPlanKPIOptions {
  plans?: DietPlan[];
  loading?: boolean;
}

const DAYS: (keyof Pick<
  DietPlan,
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

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snacks"];

const getPlanDailyAvgCalories = (plan: DietPlan): number => {
  let totalCalories = 0;
  let daysWithMeals = 0;

  for (const day of DAYS) {
    const dayData: DayDiet | undefined = plan[day];
    if (!dayData) continue;

    let dayCalories = 0;
    for (const meal of MEAL_TYPES) {
      const items = dayData[meal];
      if (Array.isArray(items)) {
        for (const item of items) {
          dayCalories += Number(item.calories) || 0;
        }
      }
    }

    if (dayCalories > 0) {
      daysWithMeals++;
      totalCalories += dayCalories;
    }
  }

  if (daysWithMeals === 0) return 0;
  return Math.round(totalCalories / daysWithMeals);
};

const useDietPlanKPI = (options: UseDietPlanKPIOptions = {}) => {
  const reduxPlans = useSelector(selectDietPlans);
  const reduxLoading = useSelector(selectDietPlanLoading);

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

  const { avgCalories, minCalories, maxCalories } = useMemo(() => {
    const targetPlans = activePlansCount > 0 ? activePlans : plans;
    const dailyCaloriesList = targetPlans
      .map(getPlanDailyAvgCalories)
      .filter((cal) => cal > 0);

    const avg =
      dailyCaloriesList.length > 0
        ? Math.round(
            dailyCaloriesList.reduce((sum, cal) => sum + cal, 0) /
              dailyCaloriesList.length,
          )
        : 0;

    const min = dailyCaloriesList.length > 0 ? Math.min(...dailyCaloriesList) : 0;
    const max = dailyCaloriesList.length > 0 ? Math.max(...dailyCaloriesList) : 0;

    return { avgCalories: avg, minCalories: min, maxCalories: max };
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
        id: "total-diet-plans",
        title: "Total Diet Plans",
        value: isLoading ? "..." : String(totalPlans),
        subtitle: "Nutritional programs",
        change:
          thisMonthPlansCount > 0
            ? `+${thisMonthPlansCount} this month`
            : `${totalPlans} total ${totalPlans === 1 ? "plan" : "plans"}`,
        trend: thisMonthPlansCount > 0 ? "up" : "neutral",
        icon: LuUtensils,
        color: "blue",
      },
      {
        id: "active-diet-plans",
        title: "Active Plans",
        value: isLoading ? "..." : String(activePlansCount),
        subtitle: "Currently offered",
        change: `${activeRate}% active rate`,
        trend: activeRate >= 50 ? "up" : activeRate > 0 ? "neutral" : "down",
        icon: LuCircleCheck,
        color: "green",
      },
      {
        id: "avg-daily-calories",
        title: "Avg. Daily Calories",
        value:
          isLoading
            ? "..."
            : avgCalories > 0
              ? `${avgCalories.toLocaleString("en-IN")} kcal`
              : "N/A",
        subtitle: "Target daily intake",
        change:
          (activePlansCount > 0 ? activePlans : plans).length > 0 && maxCalories > 0
            ? `${minCalories.toLocaleString("en-IN")} - ${maxCalories.toLocaleString("en-IN")} kcal range`
            : "No nutrition data",
        trend: "neutral",
        icon: LuFlame,
        color: "orange",
      },
      {
        id: "top-diet-goal",
        title: "Top Goal",
        value: isLoading ? "..." : (topGoal?.name ?? "None"),
        subtitle: topGoal
          ? `${topGoal.count} ${topGoal.count === 1 ? "plan" : "plans"}`
          : "No active plans",
        change: topGoal ? "Primary nutrition focus" : "No goal data",
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
    avgCalories,
    minCalories,
    maxCalories,
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
    avgCalories,
    minCalories,
    maxCalories,
    topGoal,
    thisMonthPlansCount,
    kpiData,
  };
};

export default useDietPlanKPI;
