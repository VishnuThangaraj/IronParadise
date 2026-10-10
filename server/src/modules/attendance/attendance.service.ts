import type { HydratedDocument } from "mongoose";

import AttendanceModel, { type Attendance } from "./attendance.model.js";
import UserModel from "../user/user.model.js";
import AppError from "../../shared/errors/AppError.js";
import { generateId } from "../../shared/utils/id-generator.js";
import type {
  CheckInInput,
  CheckOutInput,
  CreateAttendanceInput,
  UpdateAttendanceInput,
  AttendanceQueryInput,
} from "./attendance.validator.js";

export interface AttendanceWithUser extends Omit<Attendance, "userId"> {
  userId: string;
  user?: {
    fullName: string;
    email: string;
    phone?: string;
    role: string;
    profileImage?: string;
  } | null;
}

export interface AttendanceStats {
  totalToday: number;
  activeNow: number;
  membersToday: number;
  trainersToday: number;
  avgDurationMinutes: number;
  date: string;
}

class AttendanceService {
  /**
   * Helper to resolve start and end of a given calendar day (in UTC/local).
   */
  private getDayRange(dateInput?: Date | string): { start: Date; end: Date } {
    const d = dateInput ? new Date(dateInput) : new Date();
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);

    const end = new Date(d);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  /**
   * Fast Check-In (e.g., Kiosk or manual punch-in).
   */
  public async checkIn(data: CheckInInput): Promise<HydratedDocument<Attendance>> {
    const normalizedUserId = data.userId.trim().toUpperCase();

    // Verify user exists and is active
    const user = await UserModel.findOne({ userId: normalizedUserId });
    if (!user) {
      throw new AppError(`User with ID '${normalizedUserId}' not found`, 404);
    }
    if (!user.isActive) {
      throw new AppError(`User '${user.fullName}' is currently inactive`, 403);
    }

    // Determine role (infer from user if not explicitly provided)
    const role: "trainer" | "member" =
      data.role || (user.role === "trainer" ? "trainer" : "member");

    const checkInTime = data.checkIn ? new Date(data.checkIn) : new Date();
    const attendanceDate = data.date ? new Date(data.date) : checkInTime;

    // Check if user already has an active session (checked in without check-out)
    const activeSession = await AttendanceModel.findOne({
      userId: normalizedUserId,
      checkOut: null,
      status: "checked_in",
    });

    if (activeSession) {
      throw new AppError(
        `User '${user.fullName}' is already checked in since ${new Date(
          activeSession.checkIn,
        ).toLocaleTimeString()}. Please check out first.`,
        400,
      );
    }

    const attendanceId = await generateId("attendance");

    const attendance = await AttendanceModel.create({
      attendanceId,
      userId: normalizedUserId,
      role,
      date: attendanceDate,
      checkIn: checkInTime,
      checkOut: null,
      status: "checked_in",
      entryMethod: data.entryMethod || "kiosk",
      notes: data.notes || "",
    });

    return attendance;
  }

  /**
   * Fast Check-Out (records exit timestamp and calculates duration).
   */
  public async checkOut(data: CheckOutInput): Promise<HydratedDocument<Attendance>> {
    let query: Record<string, any> = {};

    if (data.attendanceId) {
      query.attendanceId = data.attendanceId.trim().toUpperCase();
    } else if (data.userId) {
      query = {
        userId: data.userId.trim().toUpperCase(),
        checkOut: null,
        status: "checked_in",
      };
    } else {
      throw new AppError("Either userId or attendanceId is required for check-out", 400);
    }

    // Find active attendance record
    const attendance = await AttendanceModel.findOne(query).sort({ checkIn: -1 });
    if (!attendance) {
      throw new AppError("No active check-in record found to check out from", 404);
    }

    const checkOutTime = data.checkOut ? new Date(data.checkOut) : new Date();
    attendance.checkOut = checkOutTime;
    attendance.status = "checked_out";

    // Duration calculation in minutes
    const diffMs = checkOutTime.getTime() - new Date(attendance.checkIn).getTime();
    attendance.durationMinutes = diffMs > 0 ? Math.round(diffMs / (1000 * 60)) : 0;

    if (data.notes) {
      attendance.notes = attendance.notes
        ? `${attendance.notes} | ${data.notes.trim()}`
        : data.notes.trim();
    }

    await attendance.save();
    return attendance;
  }

  /**
   * Kiosk Toggle (automatically checks out if currently checked in; otherwise checks in).
   */
  public async toggleAttendance(
    data: CheckInInput,
  ): Promise<{ action: "checked_in" | "checked_out"; attendance: HydratedDocument<Attendance> }> {
    const normalizedUserId = data.userId.trim().toUpperCase();

    const activeSession = await AttendanceModel.findOne({
      userId: normalizedUserId,
      checkOut: null,
      status: "checked_in",
    }).sort({ checkIn: -1 });

    if (activeSession) {
      const updated = await this.checkOut({
        attendanceId: activeSession.attendanceId,
        notes: data.notes,
      });
      return { action: "checked_out", attendance: updated };
    }

    const newAttendance = await this.checkIn(data);
    return { action: "checked_in", attendance: newAttendance };
  }

  /**
   * Admin manual create attendance record.
   */
  public async createAttendance(
    data: CreateAttendanceInput,
  ): Promise<HydratedDocument<Attendance>> {
    const normalizedUserId = data.userId.trim().toUpperCase();

    // Verify user exists
    const user = await UserModel.findOne({ userId: normalizedUserId });
    if (!user) {
      throw new AppError(`User with ID '${normalizedUserId}' does not exist`, 404);
    }

    const attendanceId =
      data.attendanceId?.trim().toUpperCase() ||
      (await generateId("attendance"));

    const checkIn = data.checkIn ? new Date(data.checkIn) : new Date();
    const checkOut = data.checkOut ? new Date(data.checkOut) : null;
    const date = data.date ? new Date(data.date) : checkIn;

    let durationMinutes = data.durationMinutes ?? 0;
    if (!durationMinutes && checkIn && checkOut) {
      const diffMs = checkOut.getTime() - checkIn.getTime();
      durationMinutes = diffMs > 0 ? Math.round(diffMs / (1000 * 60)) : 0;
    }

    const attendance = await AttendanceModel.create({
      attendanceId,
      userId: normalizedUserId,
      role: data.role || (user.role === "trainer" ? "trainer" : "member"),
      date,
      checkIn,
      checkOut,
      durationMinutes,
      status: data.status || (checkOut ? "present" : "checked_in"),
      entryMethod: data.entryMethod || "manual",
      notes: data.notes || "",
    });

    return attendance;
  }

  /**
   * Get all attendance records with optional filters and attached user profiles.
   */
  public async getAllAttendance(
    filter?: AttendanceQueryInput,
  ): Promise<Array<Record<string, any>>> {
    const query: Record<string, any> = {};

    if (filter?.userId) {
      query.userId = filter.userId.trim().toUpperCase();
    }

    if (filter?.role) {
      query.role = filter.role.toLowerCase();
    }

    if (filter?.status) {
      query.status = filter.status.toLowerCase();
    }

    if (filter?.entryMethod) {
      query.entryMethod = filter.entryMethod.toLowerCase();
    }

    // Specific Date filter
    if (filter?.date) {
      const { start, end } = this.getDayRange(filter.date);
      query.date = { $gte: start, $lte: end };
    } else if (filter?.startDate || filter?.endDate) {
      // Date range filter
      query.date = {};
      if (filter.startDate) {
        query.date.$gte = new Date(filter.startDate);
      }
      if (filter.endDate) {
        const { end } = this.getDayRange(filter.endDate);
        query.date.$lte = end;
      }
    }

    // Search filter across attendanceId, userId, or notes
    if (filter?.search) {
      const escaped = filter.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      query.$or = [{ attendanceId: regex }, { userId: regex }, { notes: regex }];
    }

    const records = await AttendanceModel.find(query).sort({
      checkIn: -1,
      createdAt: -1,
    });

    // Populate user profile details for each record
    const userIds = [...new Set(records.map((r) => r.userId))];
    const users = await UserModel.find(
      { userId: { $in: userIds } },
      "userId fullName email phone role profileImage",
    );

    const userMap = new Map<string, any>();
    for (const u of users) {
      userMap.set(u.userId, u);
    }

    return records.map((record) => {
      const doc = record.toObject();
      const user = userMap.get(record.userId);
      return {
        ...doc,
        user: user
          ? {
              fullName: user.fullName,
              email: user.email,
              phone: user.phone,
              role: user.role,
              profileImage: user.profileImage,
            }
          : null,
      };
    });
  }

  /**
   * Get single attendance by custom attendanceId or MongoDB _id.
   */
  public async getAttendanceById(id: string): Promise<Record<string, any>> {
    const trimmed = id.trim();
    const attendance = await AttendanceModel.findOne({
      $or: [{ attendanceId: trimmed.toUpperCase() }, { _id: trimmed.match(/^[0-9a-fA-F]{24}$/) ? trimmed : null }],
    });

    if (!attendance) {
      throw new AppError(`Attendance record '${trimmed}' not found`, 404);
    }

    const user = await UserModel.findOne(
      { userId: attendance.userId },
      "userId fullName email phone role profileImage",
    );

    return {
      ...attendance.toObject(),
      user: user
        ? {
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profileImage: user.profileImage,
          }
        : null,
    };
  }

  /**
   * Get attendance history for a specific user.
   */
  public async getAttendanceByUser(
    userId: string,
    limit = 30,
  ): Promise<HydratedDocument<Attendance>[]> {
    const normalizedUserId = userId.trim().toUpperCase();
    return await AttendanceModel.find({ userId: normalizedUserId })
      .sort({ date: -1, checkIn: -1 })
      .limit(limit);
  }

  /**
   * Get daily KPI overview stats (e.g. today's counts, live checked-in members).
   */
  public async getAttendanceStats(
    dateInput?: Date | string,
  ): Promise<AttendanceStats> {
    const { start, end } = this.getDayRange(dateInput);

    const dayRecords = await AttendanceModel.find({
      date: { $gte: start, $lte: end },
    });

    const totalToday = dayRecords.length;
    const activeNow = dayRecords.filter(
      (r) => r.checkOut === null && r.status === "checked_in",
    ).length;
    const membersToday = dayRecords.filter((r) => r.role === "member").length;
    const trainersToday = dayRecords.filter((r) => r.role === "trainer").length;

    const completed = dayRecords.filter(
      (r) => r.durationMinutes && r.durationMinutes > 0,
    );
    const avgDurationMinutes =
      completed.length > 0
        ? Math.round(
            completed.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0) /
              completed.length,
          )
        : 0;

    return {
      totalToday,
      activeNow,
      membersToday,
      trainersToday,
      avgDurationMinutes,
      date: start.toISOString().split("T")[0] || "",
    };
  }

  /**
   * Update attendance record.
   */
  public async updateAttendance(
    id: string,
    data: UpdateAttendanceInput,
  ): Promise<HydratedDocument<Attendance>> {
    const trimmed = id.trim();
    const attendance = await AttendanceModel.findOne({
      $or: [{ attendanceId: trimmed.toUpperCase() }, { _id: trimmed.match(/^[0-9a-fA-F]{24}$/) ? trimmed : null }],
    });

    if (!attendance) {
      throw new AppError(`Attendance record '${trimmed}' not found`, 404);
    }

    if (data.date) attendance.date = new Date(data.date);
    if (data.checkIn) attendance.checkIn = new Date(data.checkIn);
    if (data.checkOut !== undefined) {
      attendance.checkOut = data.checkOut ? new Date(data.checkOut) : null;
    }
    if (data.status) attendance.status = data.status;
    if (data.entryMethod) attendance.entryMethod = data.entryMethod;
    if (data.notes !== undefined) attendance.notes = data.notes;

    if (data.durationMinutes !== undefined) {
      attendance.durationMinutes = data.durationMinutes;
    } else if (attendance.checkIn && attendance.checkOut) {
      const diffMs =
        new Date(attendance.checkOut).getTime() -
        new Date(attendance.checkIn).getTime();
      attendance.durationMinutes = diffMs > 0 ? Math.round(diffMs / (1000 * 60)) : 0;
    }

    await attendance.save();
    return attendance;
  }

  /**
   * Delete attendance record.
   */
  public async deleteAttendance(id: string): Promise<HydratedDocument<Attendance>> {
    const trimmed = id.trim();
    const attendance = await AttendanceModel.findOneAndDelete({
      $or: [{ attendanceId: trimmed.toUpperCase() }, { _id: trimmed.match(/^[0-9a-fA-F]{24}$/) ? trimmed : null }],
    });

    if (!attendance) {
      throw new AppError(`Attendance record '${trimmed}' not found`, 404);
    }

    return attendance;
  }

  /**
   * Search active members and trainers for Kiosk quick punch.
   */
  public async searchUsersForKiosk(
    searchTerm?: string,
  ): Promise<Array<Record<string, any>>> {
    if (!searchTerm || !searchTerm.trim()) {
      return [];
    }

    const trimmed = searchTerm.trim();
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const users = await UserModel.find({
      role: { $in: ["member", "trainer"] },
      isActive: true,
      $or: [{ fullName: regex }, { userId: regex }, { phone: regex }],
    })
      .select("userId fullName role phone profileImage")
      .limit(25)
      .lean();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userIds = users.map((u) => u.userId);
    const todayAttendances = await AttendanceModel.find({
      userId: { $in: userIds },
      date: { $gte: today },
    })
      .sort({ checkIn: -1 })
      .lean();

    const attendanceMap = new Map<string, any>();
    for (const att of todayAttendances) {
      if (!attendanceMap.has(att.userId)) {
        attendanceMap.set(att.userId, att);
      }
    }

    return users.map((user) => {
      const att = attendanceMap.get(user.userId);
      const isCheckedIn = att ? att.status === "checked_in" && !att.checkOut : false;
      return {
        ...user,
        todayAttendance: att || null,
        isCheckedIn,
      };
    });
  }
}

export default new AttendanceService();
