export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const CALENDAR_WEEK_DAYS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
] as const;

export interface VisibilityConfig {
  dot: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  borderAccent: string;
  label: string;
}

export const VISIBILITY_CONFIG: Record<string, VisibilityConfig> = {
  all: {
    dot: "bg-emerald-500",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    badgeBorder: "border-emerald-200 dark:border-emerald-800/60",
    borderAccent: "bg-emerald-500",
    label: "Public",
  },
  member: {
    dot: "bg-sky-500",
    badgeBg: "bg-sky-50 dark:bg-sky-950/40",
    badgeText: "text-sky-600 dark:text-sky-400",
    badgeBorder: "border-sky-200 dark:border-sky-800/60",
    borderAccent: "bg-sky-500",
    label: "Members",
  },
  trainer: {
    dot: "bg-indigo-500",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeText: "text-indigo-600 dark:text-indigo-400",
    badgeBorder: "border-indigo-200 dark:border-indigo-800/60",
    borderAccent: "bg-indigo-500",
    label: "Trainers",
  },
  private: {
    dot: "bg-rose-500",
    badgeBg: "bg-rose-50 dark:bg-rose-950/40",
    badgeText: "text-rose-600 dark:text-rose-400",
    badgeBorder: "border-rose-200 dark:border-rose-800/60",
    borderAccent: "bg-rose-500",
    label: "Private",
  },
};

export interface CalendarDay {
  dayNumber: number;
  date: Date;
  dateString: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
  isToday: boolean;
}

/**
 * Returns formatted "YYYY-MM-DD" string from date or string
 */
export const toDateKey = (dateInput: Date | string): string => {
  if (!dateInput) return "";
  if (typeof dateInput === "string") {
    const trimmed = dateInput.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Checks if two dates represent the exact same day
 */
export const isSameDay = (
  date1: Date | string,
  date2: Date | string,
): boolean => {
  return toDateKey(date1) === toDateKey(date2);
};

/**
 * Generates the full 35 or 42 grid cells for the monthly calendar
 */
export const generateCalendarGrid = (
  year: number,
  month: number, // 1-12
): CalendarDay[] => {
  const todayKey = toDateKey(new Date());

  // 1st day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayOfWeek = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  // Total days in current month
  const daysInCurrentMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  // Total days in previous month
  const daysInPrevMonth = new Date(Date.UTC(year, month - 1, 0)).getUTCDate();

  const days: CalendarDay[] = [];

  // 1. Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = daysInPrevMonth - i;
    const prevDate = new Date(Date.UTC(year, month - 2, dayNumber));
    const dateString = toDateKey(prevDate);
    days.push({
      dayNumber,
      date: prevDate,
      dateString,
      isCurrentMonth: false,
      isToday: dateString === todayKey,
    });
  }

  // 2. Current month days
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const curDate = new Date(Date.UTC(year, month - 1, i));
    const dateString = toDateKey(curDate);
    days.push({
      dayNumber: i,
      date: curDate,
      dateString,
      isCurrentMonth: true,
      isToday: dateString === todayKey,
    });
  }

  // 3. Next month leading days (fill to 35 or 42 cells)
  const totalSlots = days.length > 35 ? 42 : 35;
  const remainingSlots = totalSlots - days.length;
  for (let i = 1; i <= remainingSlots; i++) {
    const nextDate = new Date(Date.UTC(year, month, i));
    const dateString = toDateKey(nextDate);
    days.push({
      dayNumber: i,
      date: nextDate,
      dateString,
      isCurrentMonth: false,
      isToday: dateString === todayKey,
    });
  }

  return days;
};
