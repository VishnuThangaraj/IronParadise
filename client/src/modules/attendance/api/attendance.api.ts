import api from "@/shared/service/api";
import type {
  KioskUser,
  KioskSearchResponse,
  ToggleAttendanceResponse,
  AttendanceActionResponse,
  AttendanceRecord,
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
  userId: string;
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

