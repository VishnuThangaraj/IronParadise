import mongoose, { type HydratedDocument } from "mongoose";

import TrainerPaymentModel, {
  type TrainerPayment,
} from "./trainer-payment.model.js";

import type {
  CreateTrainerPaymentInput,
  UpdateTrainerPaymentInput,
} from "./trainer-payment.validator.js";

import AppError from "../../../shared/errors/AppError.js";

class TrainerPaymentService {
  // create trainer payment
  public async createTrainerPayment(
    data: CreateTrainerPaymentInput,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<TrainerPayment>> {
    const userIdClean = data.userId.trim().toUpperCase();

    const existing = await TrainerPaymentModel.findOne({
      userId: userIdClean,
    }).session(session || null);

    if (existing) {
      throw new AppError("Trainer payment already exists for this user", 409);
    }

    const createOptions = session ? { session } : {};
    const [trainerPayment] = await TrainerPaymentModel.create(
      [
        {
          userId: userIdClean,
          salary: data.salary,
          ...(data.amountDue !== undefined
            ? { amountDue: data.amountDue }
            : {}),
          ...(data.amountPaid !== undefined
            ? { amountPaid: data.amountPaid }
            : {}),
          ...(data.paymentStatus ? { paymentStatus: data.paymentStatus } : {}),
          ...(data.lastAccruedMonth !== undefined
            ? { lastAccruedMonth: data.lastAccruedMonth }
            : {}),
        },
      ],
      createOptions,
    );

    if (!trainerPayment) {
      throw new AppError("Couldn't create trainer payment record", 500);
    }

    return trainerPayment;
  }

  // fetch all trainer payments
  public async getAllTrainerPayments(): Promise<
    HydratedDocument<TrainerPayment>[]
  > {
    return await TrainerPaymentModel.find().sort({ createdAt: -1 });
  }

  // fetch trainer payment by id
  public async getTrainerPaymentById(
    userId: string,
  ): Promise<HydratedDocument<TrainerPayment>> {
    const userIdClean = userId.trim().toUpperCase();

    const trainerPayment = await TrainerPaymentModel.findOne({
      $or: [
        { userId: userIdClean },
        ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: userId }] : []),
      ],
    });

    if (!trainerPayment) {
      throw new AppError("Trainer payment not found", 404);
    }

    return trainerPayment;
  }

  // update trainer payment
  public async updateTrainerPayment(
    userId: string,
    data: UpdateTrainerPaymentInput,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<TrainerPayment>> {
    const userIdClean = userId.trim().toUpperCase();

    const existingTrainerPayment = await TrainerPaymentModel.findOne({
      $or: [
        { userId: userIdClean },
        ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: userId }] : []),
      ],
    }).session(session || null);

    if (!existingTrainerPayment) {
      throw new AppError("Trainer payment not found", 404);
    }

    const updateData = { ...data };
    if (updateData.userId) {
      updateData.userId = updateData.userId.trim().toUpperCase();
    }

    const updateOptions = {
      returnDocument: "after" as const,
      runValidators: true,
      ...(session ? { session } : {}),
    };

    const updatedTrainerPayment = await TrainerPaymentModel.findByIdAndUpdate(
      existingTrainerPayment._id,
      { $set: updateData },
      updateOptions,
    );

    if (!updatedTrainerPayment) {
      throw new AppError("Failed to update trainer payment", 500);
    }

    return updatedTrainerPayment;
  }

  // delete trainer payment (completely from db)
  public async deleteTrainerPayment(
    userId: string,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<TrainerPayment>> {
    const userIdClean = userId.trim().toUpperCase();
    const deleteOptions = session ? { session } : {};
    const trainerPayment = await TrainerPaymentModel.findOneAndDelete(
      {
        $or: [
          { userId: userIdClean },
          ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: userId }] : []),
        ],
      },
      deleteOptions,
    );

    if (!trainerPayment) {
      throw new AppError("Trainer payment not found", 404);
    }

    return trainerPayment;
  }
}

export default new TrainerPaymentService();
