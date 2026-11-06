import type { Request, Response, NextFunction } from "express";

import TrainerService from "./trainer.service.js";
import TrainerPaymentReceiptService from "./trainer-payment-receipt/trainer-payment-receipt.service.js";
import TrainerPaymentService from "./trainer-payment/trainer-payment.service.js";
import AppError from "../../shared/errors/AppError.js";
import { sendResponse } from "../../shared/utils/response.js";

class TrainerController {
  // create trainer
  public async createTrainer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const trainer = await TrainerService.createTrainer(req.body);
      sendResponse(res, 201, "Trainer created successfully", trainer);
    } catch (error) {
      next(error);
    }
  }

  // fetch all trainers
  public async getAllTrainers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const trainers = await TrainerService.getAllTrainers();
      sendResponse(res, 200, "Trainers fetched successfully", trainers);
    } catch (error) {
      next(error);
    }
  }

  // fetch trainer by id
  public async getTrainerById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const trainer = await TrainerService.getTrainerById(id as string);
      sendResponse(res, 200, "Trainer details fetched successfully", trainer);
    } catch (error) {
      next(error);
    }
  }

  // update trainer
  public async updateTrainer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updatedTrainer = await TrainerService.updateTrainer(
        id as string,
        req.body,
      );
      sendResponse(res, 200, "Trainer updated successfully", updatedTrainer);
    } catch (error) {
      next(error);
    }
  }

  // delete trainer (soft delete)
  public async deleteTrainer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deletedTrainer = await TrainerService.deleteTrainer(id as string);
      sendResponse(
        res,
        200,
        "Trainer deactivated successfully",
        deletedTrainer,
      );
    } catch (error) {
      next(error);
    }
  }

  // delete trainer (permanent delete)
  public async hardDeleteTrainer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deletedTrainer = await TrainerService.hardDeleteTrainer(
        id as string,
      );
      sendResponse(res, 200, "Trainer permanently deleted", deletedTrainer);
    } catch (error) {
      next(error);
    }
  }

  // Record trainer payment receipt
  public async recordPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const receipt =
        await TrainerPaymentReceiptService.createTrainerPaymentReceipt(req.body);
      sendResponse(res, 201, "Trainer payment recorded successfully", receipt);
    } catch (error) {
      next(error);
    }
  }

  // Fetch all payment receipts (optional ?userId=...)
  public async getPaymentReceipts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.query;
      const receipts =
        await TrainerPaymentReceiptService.getAllTrainerPaymentReceipts(
          userId as string | undefined,
        );
      sendResponse(res, 200, "Payment receipts fetched successfully", receipts);
    } catch (error) {
      next(error);
    }
  }

  // Fetch all trainer payment records
  public async getAllPayments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payments = await TrainerPaymentService.getAllTrainerPayments();
      sendResponse(res, 200, "Trainer payments fetched successfully", payments);
    } catch (error) {
      next(error);
    }
  }

  // Fetch payment receipts for a specific trainer
  public async getTrainerReceipts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const targetUserId = (id as string).trim().toUpperCase();
      const currentRole = req.user?.role;
      const currentUserId = req.user?.userId?.trim()?.toUpperCase();

      if (currentRole === "trainer" && currentUserId !== targetUserId) {
        throw new AppError(
          "Access denied: You can only view your own receipts",
          403,
        );
      }

      if (currentRole === "member") {
        throw new AppError("Access denied", 403);
      }

      const receipts =
        await TrainerPaymentReceiptService.getTrainerPaymentReceiptsByUserId(
          targetUserId,
        );
      sendResponse(
        res,
        200,
        "Trainer payment receipts fetched successfully",
        receipts,
      );
    } catch (error) {
      next(error);
    }
  }

  // Fetch members assigned to logged-in trainer
  public async getAssignedMembers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const trainerId = req.user?.userId;
      if (!trainerId) {
        return sendResponse(res, 401, "Authentication required");
      }
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;

      const result = await TrainerService.getAssignedMembers(trainerId, {
        search,
        status,
      });

      sendResponse(
        res,
        200,
        "Assigned members retrieved successfully",
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  // Fetch attendance records of members assigned to logged-in trainer
  public async getAssignedMembersAttendance(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const trainerId = req.user?.userId;
      if (!trainerId) {
        return sendResponse(res, 401, "Authentication required");
      }
      const memberId = req.query.memberId as string | undefined;
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const status = req.query.status as string | undefined;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const result = await TrainerService.getAssignedMembersAttendance(
        trainerId,
        {
          memberId,
          startDate,
          endDate,
          status,
          page,
          limit,
        },
      );

      sendResponse(
        res,
        200,
        "Assigned members attendance retrieved successfully",
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  // Fetch logged-in trainer's personal payroll and payment vouchers
  public async getMyPayroll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const trainerId = req.user?.userId;
      if (!trainerId) {
        return sendResponse(res, 401, "Authentication required");
      }

      const result = await TrainerService.getMyPayroll(trainerId);
      sendResponse(
        res,
        200,
        "Trainer payroll data retrieved successfully",
        result,
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new TrainerController();
