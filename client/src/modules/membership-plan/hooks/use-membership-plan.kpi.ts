import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LuCrown,
  LuCircleCheck,
  LuIndianRupee,
  LuSparkles,
} from "react-icons/lu";
import type { KPICardProps } from "@/shared/components/ui/kpi";
import {
  selectMembershipPlans,
  selectMembershipPlanLoading,
} from "../redux/membership-plan.selector";
import type { MembershipPlan } from "../types/membership-plan.types";

export interface UseMembershipPlanKPIOptions {
  plans?: MembershipPlan[];
  loading?: boolean;
}

const useMembershipPlanKPI = (options: UseMembershipPlanKPIOptions = {}) => {
  const reduxPlans = useSelector(selectMembershipPlans);
  const reduxLoading = useSelector(selectMembershipPlanLoading);

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

  const { avgMonthlyCost, minMonthly, maxMonthly } = useMemo(() => {
    const targetPlans = activePlansCount > 0 ? activePlans : plans;
    const monthlyPrices = targetPlans.map((plan) =>
      plan.durationMonths > 0
        ? Math.round(plan.price / plan.durationMonths)
        : plan.price,
    );

    const avg =
      monthlyPrices.length > 0
        ? Math.round(
            monthlyPrices.reduce((sum, price) => sum + price, 0) /
              monthlyPrices.length,
          )
        : 0;

    const min = monthlyPrices.length > 0 ? Math.min(...monthlyPrices) : 0;
    const max = monthlyPrices.length > 0 ? Math.max(...monthlyPrices) : 0;

    return { avgMonthlyCost: avg, minMonthly: min, maxMonthly: max };
  }, [plans, activePlans, activePlansCount]);

  const popularPlan = useMemo(() => {
    if (plans.length === 0) return null;
    const pool = activePlans.length > 0 ? activePlans : plans;
    const annualPlan = pool.find((p) => p.durationMonths === 12);
    if (annualPlan) return annualPlan;
    return [...pool].sort(
      (a, b) =>
        (b.features?.length || 0) - (a.features?.length || 0) ||
        b.durationMonths - a.durationMonths,
    )[0];
  }, [plans, activePlans]);

  const kpiData: KPICardProps[] = useMemo(() => {
    const isLoading = loading && totalPlans === 0;

    return [
      {
        id: "total-plans",
        title: "Total Plans",
        value: isLoading ? "..." : String(totalPlans),
        subtitle: "Across all tiers",
        change:
          thisMonthPlansCount > 0
            ? `+${thisMonthPlansCount} this month`
            : `${totalPlans} total ${totalPlans === 1 ? "tier" : "tiers"}`,
        trend: thisMonthPlansCount > 0 ? "up" : "neutral",
        icon: LuCrown,
        color: "blue",
      },
      {
        id: "active-plans",
        title: "Active Plans",
        value: isLoading ? "..." : String(activePlansCount),
        subtitle: "Currently offered",
        change: `${activeRate}% active rate`,
        trend: activeRate >= 50 ? "up" : activeRate > 0 ? "neutral" : "down",
        icon: LuCircleCheck,
        color: "green",
      },
      {
        id: "avg-price",
        title: "Avg. Monthly Cost",
        value: isLoading ? "..." : `₹${avgMonthlyCost.toLocaleString("en-IN")}`,
        subtitle: "Per month across plans",
        change:
          (activePlansCount > 0 ? activePlans : plans).length > 0
            ? `₹${minMonthly.toLocaleString("en-IN")} - ₹${maxMonthly.toLocaleString("en-IN")} range`
            : "No plans",
        trend: "neutral",
        icon: LuIndianRupee,
        color: "orange",
      },
      {
        id: "popular-tier",
        title: "Most Popular",
        value: isLoading ? "..." : (popularPlan?.planName ?? "None"),
        subtitle: popularPlan
          ? `${popularPlan.durationMonths} ${
              popularPlan.durationMonths === 1 ? "Month" : "Months"
            } duration`
          : "No active plans",
        change: popularPlan
          ? `₹${Number(popularPlan.price).toLocaleString("en-IN")} • Top choice`
          : "No data",
        trend: "neutral",
        icon: LuSparkles,
        color: "red",
      },
    ];
  }, [
    loading,
    totalPlans,
    thisMonthPlansCount,
    activePlansCount,
    activeRate,
    avgMonthlyCost,
    activePlans,
    plans,
    minMonthly,
    maxMonthly,
    popularPlan,
  ]);

  return {
    plans,
    loading,
    totalPlans,
    activePlansCount,
    activeRate,
    avgMonthlyCost,
    minMonthly,
    maxMonthly,
    popularPlan,
    thisMonthPlansCount,
    kpiData,
  };
};

export default useMembershipPlanKPI;

