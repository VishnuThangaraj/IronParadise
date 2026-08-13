import mongoose, { type HydratedDocument } from "mongoose";

import TrainerPaymentReceiptModel, {
  type TrainerPaymentReceipt,
} from "./trainer-payment-receipt.model.js";
import TrainerPaymentModel from "../trainer-payment/trainer-payment.model.js";

import type {
  CreateTrainerPaymentReceiptInput,
  UpdateTrainerPaymentReceiptInput,
} from "./trainer-payment-receipt.validator.js";

import AppError from "../../../shared/errors/AppError.js";
import { generatePaymentId } from "../../../shared/utils/id-generator.js";

class TrainerPaymentReceiptService {
  // create trainer payment receipt
  public async createTrainerPaymentReceipt(
    data: CreateTrainerPaymentReceiptInput,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<TrainerPaymentReceipt>> {
    const userIdClean = data.userId.trim().toUpperCase();

    const receiptNumber = data.receiptNumber
      ? data.receiptNumber.trim().toUpperCase()
      : await generatePaymentId("trainerReceipt");

    const existing = await TrainerPaymentReceiptModel.findOne({
      receiptNumber,
    }).session(session || null);

    if (existing) {
      throw new AppError("Receipt number already exists", 409);
    }

    const createOptions = session ? { session } : {};
    const [trainerPaymentReceipt] = await TrainerPaymentReceiptModel.create(
      [
        {
          userId: userIdClean,
          receiptNumber,
          amount: data.amount,
          paymentDate: data.paymentDate || new Date(),
          paymentMethod: data.paymentMethod,
          ...(data.transactionId ? { transactionId: data.transactionId.trim() } : {}),
          salaryMonth: data.salaryMonth.trim(),
          ...(data.notes ? { notes: data.notes.trim() } : {}),
        },
      ],
      createOptions,
    );

    if (!trainerPaymentReceipt) {
      throw new AppError("Couldn't create trainer payment receipt record", 500);
    }

    // Update trainer payment summary if record exists
    const trainerPayment = await TrainerPaymentModel.findOne({
      userId: userIdClean,
    }).session(session || null);

    if (trainerPayment) {
      const newAmountPaid = (trainerPayment.amountPaid || 0) + data.amount;
      const newAmountDue = Math.max(
        0,
        (trainerPayment.amountDue || 0) - data.amount,
      );

      let newStatus: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" =
        trainerPayment.paymentStatus;
      if (newAmountDue <= 0) {
        newStatus = "PAID";
      } else if (newAmountPaid > 0) {
        newStatus = "PARTIAL";
      }

      await TrainerPaymentModel.findByIdAndUpdate(
        trainerPayment._id,
        {
          $set: {
            amountPaid: newAmountPaid,
            amountDue: newAmountDue,
            paymentStatus: newStatus,
          },
        },
        createOptions,
      );
    }

    return trainerPaymentReceipt;
  }

  // fetch all trainer payment receipts
  public async getAllTrainerPaymentReceipts(
    userId?: string,
  ): Promise<HydratedDocument<TrainerPaymentReceipt>[]> {
    const query = userId ? { userId: userId.trim().toUpperCase() } : {};
    return await TrainerPaymentReceiptModel.find(query).sort({
      paymentDate: -1,
      createdAt: -1,
    });
  }

  // fetch trainer payment receipt by id or receipt number
  public async getTrainerPaymentReceiptById(
    identifier: string,
  ): Promise<HydratedDocument<TrainerPaymentReceipt>> {
    const cleanId = identifier.trim().toUpperCase();

    const trainerPaymentReceipt = await TrainerPaymentReceiptModel.findOne({
      $or: [
        { receiptNumber: cleanId },
        { userId: cleanId },
        ...(mongoose.Types.ObjectId.isValid(identifier)
          ? [{ _id: identifier }]
          : []),
      ],
    });

    if (!trainerPaymentReceipt) {
      throw new AppError("Trainer payment receipt not found", 404);
    }

    return trainerPaymentReceipt;
  }

  // fetch trainer payment receipts by user id
  public async getTrainerPaymentReceiptsByUserId(
    userId: string,
  ): Promise<HydratedDocument<TrainerPaymentReceipt>[]> {
    const userIdClean = userId.trim().toUpperCase();
    return await TrainerPaymentReceiptModel.find({ userId: userIdClean }).sort({
      paymentDate: -1,
      createdAt: -1,
    });
  }

  // update trainer payment receipt
  public async updateTrainerPaymentReceipt(
    identifier: string,
    data: UpdateTrainerPaymentReceiptInput,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<TrainerPaymentReceipt>> {
    const existingReceipt =
      await this.getTrainerPaymentReceiptById(identifier);

    const updateData: Record<string, any> = { ...data };
    if (updateData.userId) {
      updateData.userId = updateData.userId.trim().toUpperCase();
    }
    if (updateData.receiptNumber) {
      updateData.receiptNumber = updateData.receiptNumber.trim().toUpperCase();
    }

    const updateOptions = {
      returnDocument: "after" as const,
      runValidators: true,
      ...(session ? { session } : {}),
    };

    const updatedReceipt = await TrainerPaymentReceiptModel.findByIdAndUpdate(
      existingReceipt._id,
      { $set: updateData },
      updateOptions,
    );

    if (!updatedReceipt) {
      throw new AppError("Failed to update trainer payment receipt", 500);
    }

    return updatedReceipt;
  }

  // delete trainer payment receipt
  public async deleteTrainerPaymentReceipt(
    identifier: string,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<TrainerPaymentReceipt>> {
    const cleanId = identifier.trim().toUpperCase();
    const deleteOptions = session ? { session } : {};

    const trainerPaymentReceipt =
      await TrainerPaymentReceiptModel.findOneAndDelete(
        {
          $or: [
            { receiptNumber: cleanId },
            ...(mongoose.Types.ObjectId.isValid(identifier)
              ? [{ _id: identifier }]
              : []),
          ],
        },
        deleteOptions,
      );

    if (!trainerPaymentReceipt) {
      throw new AppError("Trainer payment receipt not found", 404);
    }

    return trainerPaymentReceipt;
  }
}

export default new TrainerPaymentReceiptService();
