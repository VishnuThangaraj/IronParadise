import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllAttendance } from "../api/attendance.api";
import type { AttendanceRecord } from "../types/attendance.types";

export interface DayAttendanceSummary {
  total: number;
  members: number;
  trainers: number;
  records: AttendanceRecord[];
}

export const attendanceMonthlyKeys = {
  all: ["attendance-monthly"] as const,
  range: (startDate: string, endDate: string) =>
    [...attendanceMonthlyKeys.all, { startDate, endDate }] as const,
};

export const formatLocalDateKey = (dateInput: Date | string): string => {
  if (!dateInput) return "";
  if (typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
    return dateInput.trim();
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useAttendanceMonthly = (startDate: string, endDate: string) => {
  const query = useQuery<AttendanceRecord[], Error>({
    queryKey: attendanceMonthlyKeys.range(startDate, endDate),
    queryFn: () => fetchAllAttendance({ startDate, endDate }),
    enabled: Boolean(startDate && endDate),
    staleTime: 30000,
  });

  const records = useMemo(() => query.data ?? [], [query.data]);

  const dayAttendanceMap = useMemo(() => {
    const map: Record<string, DayAttendanceSummary> = {};

    for (const record of records) {
      const key = formatLocalDateKey(record.date || record.checkIn);
      if (!key) continue;
      if (!map[key]) {
        map[key] = { total: 0, members: 0, trainers: 0, records: [] };
      }
      map[key].total += 1;
      if (record.role === "trainer") {
        map[key].trainers += 1;
      } else {
        map[key].members += 1;
      }
      map[key].records.push(record);
    }
    return map;
  }, [records]);

  return {
    ...query,
    records,
    dayAttendanceMap,
  };
};

export default useAttendanceMonthly;
