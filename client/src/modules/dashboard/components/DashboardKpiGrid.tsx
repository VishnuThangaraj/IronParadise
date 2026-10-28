import { useNavigate } from "react-router-dom";
import {
  LuUsers,
  LuDumbbell,
  LuCalendarCheck2,
  LuWallet,
  LuMessageSquare,
  LuPartyPopper,
} from "react-icons/lu";
import KPICard from "@/shared/components/ui/kpi/KPICard";
import type { DashboardKPIs } from "../types/dashboard.types";

interface DashboardKpiGridProps {
  kpis: DashboardKPIs;
  className?: string;
}

export const DashboardKpiGrid = ({
  kpis,
  className = "",
}: DashboardKpiGridProps) => {
  const navigate = useNavigate();

  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val.toLocaleString()}`;
  };

  const cards = [
    {
      id: "kpi-members",
      title: "Active Members",
      value: kpis.activeMembers.toLocaleString(),
      subtitle: `${kpis.totalMembers} total (${kpis.newMembersThisMonth} new this month)`,
      change: `${kpis.memberGrowthRate >= 0 ? "+" : ""}${kpis.memberGrowthRate}% MoM`,
      trend: (kpis.memberGrowthRate >= 0 ? "up" : "down") as "up" | "down",
      icon: LuUsers,
      color: "indigo" as const,
      onClick: () => navigate("/member/list"),
    },
    {
      id: "kpi-trainers",
      title: "Active Trainers",
      value: kpis.activeTrainers.toLocaleString(),
      subtitle: `${kpis.totalTrainers} total coaching staff`,
      change: "Certified Staff",
      trend: "neutral" as const,
      icon: LuDumbbell,
      color: "violet" as const,
      onClick: () => navigate("/trainer/list"),
    },
    {
      id: "kpi-attendance",
      title: "Today's Attendance",
      value: kpis.todayAttendance.toLocaleString(),
      subtitle: `${kpis.currentlyCheckedIn} on floor right now`,
      change: "Live Kiosk",
      trend: "up" as const,
      icon: LuCalendarCheck2,
      color: "emerald" as const,
      onClick: () => navigate("/attendance"),
    },
    {
      id: "kpi-revenue",
      title: "Revenue Collected",
      value: formatCurrency(kpis.totalRevenueCollected),
      subtitle: `Due: ${formatCurrency(kpis.totalPendingDues)}`,
      change: kpis.totalOverdue > 0 ? `${formatCurrency(kpis.totalOverdue)} overdue` : "Dues current",
      trend: (kpis.totalOverdue > 0 ? "down" : "up") as "up" | "down",
      icon: LuWallet,
      color: "amber" as const,
      onClick: () => navigate("/member/payments"),
    },
    {
      id: "kpi-enquiries",
      title: "Pending Inquiries",
      value: kpis.pendingEnquiries.toLocaleString(),
      subtitle: "Prospective leads & questions",
      change: kpis.pendingEnquiries > 0 ? "Action required" : "All cleared",
      trend: (kpis.pendingEnquiries > 0 ? "down" : "neutral") as "down" | "neutral",
      icon: LuMessageSquare,
      color: "cyan" as const,
      onClick: () => navigate("/enquiry"),
    },
    {
      id: "kpi-events",
      title: "Active Events",
      value: kpis.activeEvents.toLocaleString(),
      subtitle: "Workshops, challenges & meets",
      change: "Community Hub",
      trend: "neutral" as const,
      icon: LuPartyPopper,
      color: "rose" as const,
      onClick: () => navigate("/events"),
    },
  ];

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 w-full ${className}`}
    >
      {cards.map((card) => (
        <KPICard
          key={card.id}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
          change={card.change}
          trend={card.trend}
          icon={card.icon}
          color={card.color}
          onClick={card.onClick}
          className="cursor-pointer"
        />
      ))}
    </div>
  );
};

export default DashboardKpiGrid;
