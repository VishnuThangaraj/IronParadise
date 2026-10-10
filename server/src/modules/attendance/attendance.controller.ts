import type { Request, Response, NextFunction } from "express";

import AttendanceService from "./attendance.service.js";
import { sendResponse } from "../../shared/utils/response.js";

class AttendanceController {
  // Fast Check-In (Kiosk / User punch-in)
  public async checkIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const attendance = await AttendanceService.checkIn(req.body);
      sendResponse(res, 201, "Check-in recorded successfully", attendance);
    } catch (error) {
      next(error);
    }
  }

  // Fast Check-Out (Kiosk / User punch-out)
  public async checkOut(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const attendance = await AttendanceService.checkOut(req.body);
      sendResponse(res, 200, "Check-out recorded successfully", attendance);
    } catch (error) {
      next(error);
    }
  }

  // Kiosk Toggle (automatic check-in / check-out based on current state)
  public async toggleAttendance(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await AttendanceService.toggleAttendance(req.body);
      const message =
        result.action === "checked_in"
          ? "Welcome! Check-in recorded successfully"
          : "Goodbye! Check-out recorded successfully";
      sendResponse(res, 200, message, result);
    } catch (error) {
      next(error);
    }
  }

  // Admin Manual Create
  public async createAttendance(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const attendance = await AttendanceService.createAttendance(req.body);
      sendResponse(res, 201, "Attendance entry created successfully", attendance);
    } catch (error) {
      next(error);
    }
  }

  // Fetch all Attendance records with filters
  public async fetchAllAttendance(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const records = await AttendanceService.getAllAttendance(req.query as any);
      sendResponse(res, 200, "Attendance records fetched successfully", records);
    } catch (error) {
      next(error);
    }
  }

  // Daily KPI statistics
  public async getAttendanceStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { date } = req.query;
      const stats = await AttendanceService.getAttendanceStats(date as string);
      sendResponse(res, 200, "Attendance statistics fetched successfully", stats);
    } catch (error) {
      next(error);
    }
  }

  // Fetch single record by ID
  public async getAttendanceById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const attendance = await AttendanceService.getAttendanceById(id as string);
      sendResponse(res, 200, "Attendance record fetched successfully", attendance);
    } catch (error) {
      next(error);
    }
  }

  // Fetch user attendance history
  public async getAttendanceByUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? Number(req.query.limit) : 30;
      const records = await AttendanceService.getAttendanceByUser(
        userId as string,
        limit,
      );
      sendResponse(res, 200, "User attendance history fetched successfully", records);
    } catch (error) {
      next(error);
    }
  }

  // Kiosk search active members & trainers
  public async searchUsersForKiosk(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const q = (req.query.q || req.query.search || "") as string;
      const users = await AttendanceService.searchUsersForKiosk(q);
      sendResponse(res, 200, "Users retrieved successfully", users);
    } catch (error) {
      next(error);
    }
  }

  // Update attendance record
  public async updateAttendance(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const attendance = await AttendanceService.updateAttendance(
        id as string,
        req.body,
      );
      sendResponse(res, 200, "Attendance record updated successfully", attendance);
    } catch (error) {
      next(error);
    }
  }

  // Delete attendance record
  public async deleteAttendance(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const attendance = await AttendanceService.deleteAttendance(id as string);
      sendResponse(res, 200, "Attendance record deleted successfully", attendance);
    } catch (error) {
      next(error);
    }
  }
}

export default new AttendanceController();
