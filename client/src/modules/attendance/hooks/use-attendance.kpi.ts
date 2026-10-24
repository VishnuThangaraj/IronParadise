import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LuActivity,
  LuLogIn,
  LuUsers,
  LuDumbbell,
  LuClock,
} from "react-icons/lu";
import type { KPICardProps } from "@/shared/components/ui/kpi";
import { getDailyAttendanceStats } from "../api/attendance.api";
import type { AttendanceStats } from "../types/attendance.types";

export interface UseAttendanceKPIOptions {
  date?: string;
  refetchInterval?: number;
  enabled?: boolean;
}

export const attendanceKPIKeys = {
  all: ["attendance-kpi"] as const,
  daily: (date?: string) =>
    [...attendanceKPIKeys.all, date ? { date } : "today"] as const,
};

const formatDuration = (minutes: number): string => {
  if (!minutes || minutes < 1) return "0 mins";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"}`;
  const hrs = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) return `${hrs} hr${hrs === 1 ? "" : "s"}`;
  return `${hrs} hr${hrs === 1 ? "" : "s"} ${remainingMins} min${remainingMins === 1 ? "" : "s"}`;
};

export const useAttendanceKPI = (options: UseAttendanceKPIOptions = {}) => {
  const { date, refetchInterval, enabled = true } = options;

  const {
    data: stats,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<AttendanceStats, Error>({
    queryKey: attendanceKPIKeys.daily(date),
    queryFn: () => getDailyAttendanceStats(date),
    refetchInterval,
    enabled,
  });

  const totalToday = stats?.totalToday ?? 0;
  const activeNow = stats?.activeNow ?? 0;
  const membersToday = stats?.membersToday ?? 0;
  const trainersToday = stats?.trainersToday ?? 0;
  const avgDurationMinutes = stats?.avgDurationMinutes ?? 0;

  const memberSharePercent =
    totalToday > 0 ? Math.round((membersToday / totalToday) * 100) : 0;

  const kpiData: KPICardProps[] = useMemo(() => {
    return [
      {
        id: "active-now",
        title: "In Gym Now",
        value: isLoading ? "..." : String(activeNow),
        subtitle: "Live floor occupancy",
        change: activeNow > 0 ? `${activeNow} active now` : "Floor empty",
        trend: activeNow > 0 ? "up" : "neutral",
        icon: LuActivity,
        color: "emerald",
      },
      {
        id: "total-today",
        title: "Total Check-Ins",
        value: isLoading ? "..." : String(totalToday),
        subtitle: "Recorded today",
        change:
          totalToday > 0
            ? `${totalToday} total ${totalToday === 1 ? "entry" : "entries"}`
            : "No entries yet",
        trend: totalToday > 0 ? "up" : "neutral",
        icon: LuLogIn,
        color: "blue",
      },
      {
        id: "members-today",
        title: "Members Today",
        value: isLoading ? "..." : String(membersToday),
        subtitle: "Member check-ins",
        change:
          totalToday > 0
            ? `${memberSharePercent}% of total check-ins`
            : "No member entries",
        trend: membersToday > 0 ? "up" : "neutral",
        icon: LuUsers,
        color: "indigo",
      },
      {
        id: "trainers-today",
        title: "Trainers On Duty",
        value: isLoading ? "..." : String(trainersToday),
        subtitle: "Coaches & fitness staff",
        change: `${trainersToday} staff present`,
        trend: trainersToday > 0 ? "up" : "neutral",
        icon: LuDumbbell,
        color: "amber",
      },
      {
        id: "avg-duration",
        title: "Avg. Workout Time",
        value: isLoading ? "..." : formatDuration(avgDurationMinutes),
        subtitle: "Per completed workout",
        change:
          avgDurationMinutes > 0
            ? `${avgDurationMinutes} mins average`
            : "No check-outs yet",
        trend: "neutral",
        icon: LuClock,
        color: "violet",
      },
    ];
  }, [
    isLoading,
    activeNow,
    totalToday,
    membersToday,
    memberSharePercent,
    trainersToday,
    avgDurationMinutes,
  ]);

  return {
    stats,
    isLoading,
    isFetching,
    error,
    refetch,
    totalToday,
    activeNow,
    membersToday,
    trainersToday,
    avgDurationMinutes,
    kpiData,
  };
};

export default useAttendanceKPI;
