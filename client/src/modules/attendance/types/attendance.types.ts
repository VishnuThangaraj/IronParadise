export interface KioskUser {
  _id: string;
  userId: string;
  fullName: string;
  role: "member" | "trainer";
  phone?: string;
  profileImage?: string;
  isCheckedIn: boolean;
  todayAttendance?: {
    attendanceId: string;
    checkIn: string;
    checkOut?: string | null;
    status: string;
    durationMinutes?: number;
  } | null;
}

export interface AttendanceRecord {
  _id: string;
  attendanceId: string;
  userId: string;
  role: "trainer" | "member";
  date: string;
  checkIn: string;
  checkOut?: string | null;
  durationMinutes: number;
  status:
    | "present"
    | "absent"
    | "checked_in"
    | "checked_out"
    | "late"
    | "half_day";
  entryMethod: "kiosk" | "manual" | "qr" | "rfid" | "biometric";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    fullName: string;
    email: string;
    phone?: string;
    role: string;
    profileImage?: string;
  } | null;
}

export interface KioskSearchResponse {
  success: boolean;
  message: string;
  data: KioskUser[];
}

export interface ToggleAttendanceResponse {
  success: boolean;
  message: string;
  data: {
    action: "checked_in" | "checked_out";
    attendance: AttendanceRecord;
  };
}

export interface AttendanceActionResponse {
  success: boolean;
  message: string;
  data: AttendanceRecord;
}

export interface AttendanceStats {
  totalToday: number;
  activeNow: number;
  membersToday: number;
  trainersToday: number;
  avgDurationMinutes: number;
  date: string;
}

export interface AttendanceStatsResponse {
  success: boolean;
  message: string;
  data: AttendanceStats;
}

export interface AttendanceQueryParams {
  userId?: string;
  role?: "trainer" | "member";
  status?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  entryMethod?: string;
  search?: string;
}

export interface AttendanceListResponse {
  success: boolean;
  message: string;
  data: AttendanceRecord[];
}
