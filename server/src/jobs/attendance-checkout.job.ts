import AttendanceModel from "../modules/attendance/attendance.model.js";

export interface AutoCheckoutResultItem {
  attendanceId: string;
  userId: string;
  role: string;
  checkIn: Date;
  checkOut: Date;
  durationMinutes: number;
  status: string;
}

export interface NightlyCheckoutSummary {
  executionDate: string;
  totalOpenSessionsFound: number;
  autoCheckedOutCount: number;
  details: AutoCheckoutResultItem[];
}

/**
 * Automatically checks out all open attendance sessions.
 * By default runs daily at 10:30 PM (22:30).
 * Accepts an optional executionDate for deterministic testing and manual triggers.
 */
export async function processNightlyAttendanceCheckouts(
  executionDateInput: Date = new Date(),
): Promise<NightlyCheckoutSummary> {
  const executionDate = new Date(executionDateInput);
  const executionDateStr = executionDate.toISOString().slice(0, 10);

  const summary: NightlyCheckoutSummary = {
    executionDate: executionDateStr,
    totalOpenSessionsFound: 0,
    autoCheckedOutCount: 0,
    details: [],
  };

  // 1. Query all attendance documents currently marked as checked_in with no checkOut
  const openSessions = await AttendanceModel.find({
    checkOut: null,
    status: "checked_in",
  }).sort({ checkIn: 1 });

  summary.totalOpenSessionsFound = openSessions.length;

  if (openSessions.length === 0) {
    console.log(
      `[ATTENDANCE CRON] No active open sessions found at 10:30 PM on ${executionDateStr}. All users checked out.`,
    );
    return summary;
  }

  // 2. Process each unclosed session
  for (const session of openSessions) {
    const checkInTime = new Date(session.checkIn);

    // Anchor check-out time to 10:30 PM (22:30:00) on the session's calendar date
    const sessionDay = session.date ? new Date(session.date) : new Date(checkInTime);
    const scheduledCheckout = new Date(sessionDay);
    scheduledCheckout.setHours(22, 30, 0, 0);

    // Guard: If checkIn happened at or after 10:30 PM, anchor to execution time or checkIn + 30 mins
    let finalCheckout = scheduledCheckout;
    if (finalCheckout.getTime() <= checkInTime.getTime()) {
      const fallbackTime = Math.max(executionDate.getTime(), checkInTime.getTime() + 30 * 60000);
      finalCheckout = new Date(fallbackTime);
    }

    const diffMs = finalCheckout.getTime() - checkInTime.getTime();
    const durationMinutes = diffMs > 0 ? Math.round(diffMs / (1000 * 60)) : 0;

    const systemTag = "[Auto check-out at 10:30 PM by system]";
    const updatedNotes = session.notes && session.notes.trim()
      ? `${session.notes.trim()} | ${systemTag}`
      : systemTag;

    session.checkOut = finalCheckout;
    session.status = "checked_out";
    session.durationMinutes = durationMinutes;
    session.notes = updatedNotes;

    await session.save();

    summary.autoCheckedOutCount += 1;
    summary.details.push({
      attendanceId: session.attendanceId,
      userId: session.userId,
      role: session.role,
      checkIn: checkInTime,
      checkOut: finalCheckout,
      durationMinutes,
      status: session.status,
    });
  }

  console.log(
    `[ATTENDANCE CRON] Successfully auto checked-out ${summary.autoCheckedOutCount} open attendance session(s) at 10:30 PM on ${executionDateStr}.`,
  );

  return summary;
}
