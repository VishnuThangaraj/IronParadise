import type { Request, Response, NextFunction } from "express";

import TrainerService from "./trainer.service.js";
import TrainerPaymentReceiptService from "./trainer-payment-receipt/trainer-payment-receipt.service.js";
import TrainerPaymentService from "./trainer-payment/trainer-payment.service.js";
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
      const receipts =
        await TrainerPaymentReceiptService.getTrainerPaymentReceiptsByUserId(
          id as string,
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
}

export default new TrainerController();
