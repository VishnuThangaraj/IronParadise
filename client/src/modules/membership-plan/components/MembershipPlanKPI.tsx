import {
  LuCrown,
  LuCircleCheck,
  LuIndianRupee,
  LuSparkles,
} from "react-icons/lu";
import { KPIGrid, type KPICardProps } from "@/shared/components/ui/kpi";

const membershipPlanKpiData: KPICardProps[] = [
  {
    id: "total-plans",
    title: "Total Plans",
    value: "12",
    subtitle: "Across all tiers",
    change: "+2 this month",
    trend: "up",
    icon: LuCrown,
    color: "blue",
  },
  {
    id: "active-plans",
    title: "Active Plans",
    value: "9",
    subtitle: "Currently offered",
    change: "75% active rate",
    trend: "up",
    icon: LuCircleCheck,
    color: "green",
  },
  {
    id: "avg-price",
    title: "Avg. Monthly Cost",
    value: "₹1,499",
    subtitle: "Per active member",
    change: "+5.4% vs last qtr",
    trend: "up",
    icon: LuIndianRupee,
    color: "orange",
  },
  {
    id: "popular-tier",
    title: "Most Popular",
    value: "Annual Pro",
    subtitle: "12 Months duration",
    change: "Top choice",
    trend: "neutral",
    icon: LuSparkles,
    color: "red",
  },
];

const MembershipPlanKPI = () => {
  return <KPIGrid items={membershipPlanKpiData} columns={4} />;
};

export default MembershipPlanKPI;
