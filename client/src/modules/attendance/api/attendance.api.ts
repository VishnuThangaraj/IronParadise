import api from "@/shared/service/api";
import type {
  KioskUser,
  KioskSearchResponse,
  ToggleAttendanceResponse,
  AttendanceActionResponse,
  AttendanceRecord,
  AttendanceStats,
  AttendanceStatsResponse,
  AttendanceQueryParams,
  AttendanceListResponse,
} from "../types/attendance.types";

export const searchKioskUsers = async (
  searchTerm: string,
): Promise<KioskUser[]> => {
  if (!searchTerm.trim()) return [];
  const response = await api.get<KioskSearchResponse>(
    "/api/attendance/search-users",
    {
      params: { q: searchTerm.trim() },
    },
  );
  return response.data.data;
};

export const checkInUser = async (payload: {
  userId: string;
  entryMethod?: string;
  notes?: string;
}): Promise<AttendanceRecord> => {
  const response = await api.post<AttendanceActionResponse>(
    "/api/attendance/check-in",
    payload,
  );
  return response.data.data;
};

export const checkOutUser = async (payload: {
  userId?: string;
  attendanceId?: string;
  entryMethod?: string;
  notes?: string;
}): Promise<AttendanceRecord> => {
  const response = await api.post<AttendanceActionResponse>(
    "/api/attendance/check-out",
    payload,
  );
  return response.data.data;
};

export const toggleAttendance = async (payload: {
  userId: string;
  entryMethod?: string;
  notes?: string;
}): Promise<ToggleAttendanceResponse["data"]> => {
  const response = await api.post<ToggleAttendanceResponse>(
    "/api/attendance/toggle",
    payload,
  );
  return response.data.data;
};

export const getDailyAttendanceStats = async (
  date?: string,
): Promise<AttendanceStats> => {
  const response = await api.get<AttendanceStatsResponse>(
    "/api/attendance/stats",
    {
      params: date ? { date } : undefined,
    },
  );
  return response.data.data;
};

export const getAttendanceStats = getDailyAttendanceStats;

export const fetchAllAttendance = async (
  params?: AttendanceQueryParams,
): Promise<AttendanceRecord[]> => {
  const response = await api.get<AttendanceListResponse>("/api/attendance", {
    params,
  });
  return response.data.data;
};

export const getAttendanceById = async (
  id: string,
): Promise<AttendanceRecord> => {
  const response = await api.get<AttendanceActionResponse>(
    `/api/attendance/${id}`,
  );
  return response.data.data;
};

export const getUserAttendance = async (
  userId: string,
  limit = 30,
): Promise<AttendanceRecord[]> => {
  const response = await api.get<AttendanceListResponse>(
    `/api/attendance/user/${userId}`,
    {
      params: { limit },
    },
  );
  return response.data.data;
};
