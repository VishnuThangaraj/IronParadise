import mongoose, { type HydratedDocument } from "mongoose";

import MemberPaymentModel, {
  type MemberPayment,
} from "./member-payment.model.js";
import type {
  CreateMemberPaymentInput,
  UpdateMemberPaymentInput,
} from "./member-payment.validator.js";
import AppError from "../../../shared/errors/AppError.js";
import { generateId } from "../../../shared/utils/id-generator.js";

export type CreateMemberPaymentData = CreateMemberPaymentInput;
export type UpdateMemberPaymentData = UpdateMemberPaymentInput;

class MemberPaymentService {
  // create member payment
  public async createMemberPayment(
    data: CreateMemberPaymentData,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberPayment>> {
    const userIdClean = data.userId.trim().toUpperCase();
    const assignmentIdClean = data.assignmentId.trim().toUpperCase();

    const paymentId = data.paymentId
      ? data.paymentId.trim().toUpperCase()
      : await generateId("payment");

    const existingPayment = await MemberPaymentModel.findOne({
      paymentId,
    }).session(session || null);

    if (existingPayment) {
      throw new AppError("Payment already exists with this payment ID", 409);
    }

    const amountPaid = data.amountPaid ?? 0;
    const amountDue =
      data.amountDue !== undefined
        ? data.amountDue
        : Math.max(0, data.totalAmount - amountPaid);

    let paymentStatus = data.paymentStatus;
    if (!paymentStatus || paymentStatus === "PENDING") {
      if (amountDue <= 0 && data.totalAmount > 0) {
        paymentStatus = "PAID";
      } else if (amountPaid > 0) {
        paymentStatus = "PARTIAL";
      } else {
        paymentStatus = "PENDING";
      }
    }

    const createOptions = session ? { session } : {};
    const [memberPayment] = await MemberPaymentModel.create(
      [
        {
          paymentId,
          userId: userIdClean,
          assignmentId: assignmentIdClean,
          totalAmount: data.totalAmount,
          amountPaid,
          amountDue,
          dueDate: data.dueDate,
          paymentStatus,
        },
      ],
      createOptions,
    );

    if (!memberPayment) {
      throw new AppError("Couldn't create member payment record", 500);
    }

    return memberPayment;
  }

  // fetch all member payments
  public async getAllMemberPayments(filter?: {
    userId?: string;
    assignmentId?: string;
    paymentStatus?: string;
  }): Promise<HydratedDocument<MemberPayment>[]> {
    const query: Record<string, any> = {};

    if (filter?.userId) {
      query.userId = filter.userId.trim().toUpperCase();
    }
    if (filter?.assignmentId) {
      query.assignmentId = filter.assignmentId.trim().toUpperCase();
    }
    if (filter?.paymentStatus) {
      query.paymentStatus = filter.paymentStatus.trim().toUpperCase();
    }

    return (await MemberPaymentModel.find(query as any).sort({
      createdAt: -1,
    })) as any;
  }

  // fetch member payment by paymentId or _id
  public async getMemberPaymentById(
    identifier: string,
  ): Promise<HydratedDocument<MemberPayment>> {
    const cleanId = identifier.trim().toUpperCase();

    const memberPayment = await MemberPaymentModel.findOne({
      $or: [
        { paymentId: cleanId },
        ...(mongoose.Types.ObjectId.isValid(identifier)
          ? [{ _id: identifier }]
          : []),
      ],
    });

    if (!memberPayment) {
      throw new AppError("Member payment not found", 404);
    }

    return memberPayment;
  }

  // fetch all payments for a specific user
  public async getMemberPaymentsByUserId(
    userId: string,
  ): Promise<HydratedDocument<MemberPayment>[]> {
    const userIdClean = userId.trim().toUpperCase();
    return (await MemberPaymentModel.find({ userId: userIdClean } as any).sort({
      createdAt: -1,
    })) as any;
  }

  // fetch payment for a specific assignment
  public async getMemberPaymentByAssignmentId(
    assignmentId: string,
  ): Promise<HydratedDocument<MemberPayment> | null> {
    const cleanAssignmentId = assignmentId.trim().toUpperCase();
    return await MemberPaymentModel.findOne({
      assignmentId: cleanAssignmentId,
    });
  }

  // update member payment
  public async updateMemberPayment(
    identifier: string,
    data: UpdateMemberPaymentData,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberPayment>> {
    const existingPayment = await this.getMemberPaymentById(identifier);

    const updateData: Record<string, any> = { ...data };
    if (updateData.paymentId) {
      updateData.paymentId = updateData.paymentId.trim().toUpperCase();
    }
    if (updateData.userId) {
      updateData.userId = updateData.userId.trim().toUpperCase();
    }
    if (updateData.assignmentId) {
      updateData.assignmentId = updateData.assignmentId.trim().toUpperCase();
    }
    if (updateData.paymentStatus) {
      updateData.paymentStatus = updateData.paymentStatus.trim().toUpperCase();
    }

    // Recalculate amountDue if totalAmount or amountPaid changed and amountDue was not explicitly provided
    const effectiveTotal =
      updateData.totalAmount !== undefined
        ? updateData.totalAmount
        : existingPayment.totalAmount;
    const effectivePaid =
      updateData.amountPaid !== undefined
        ? updateData.amountPaid
        : existingPayment.amountPaid;

    if (
      updateData.amountDue === undefined &&
      (data.totalAmount !== undefined || data.amountPaid !== undefined)
    ) {
      updateData.amountDue = Math.max(0, effectiveTotal - effectivePaid);
    }

    // Auto update status if paymentStatus not explicitly provided
    if (
      !data.paymentStatus &&
      (data.totalAmount !== undefined || data.amountPaid !== undefined)
    ) {
      const effectiveDue = updateData.amountDue ?? existingPayment.amountDue;
      if (effectiveDue <= 0 && effectiveTotal > 0) {
        updateData.paymentStatus = "PAID";
      } else if (effectivePaid > 0) {
        updateData.paymentStatus = "PARTIAL";
      } else {
        updateData.paymentStatus = "PENDING";
      }
    }

    const updateOptions = {
      returnDocument: "after" as const,
      runValidators: true,
      ...(session ? { session } : {}),
    };

    const updatedPayment = await MemberPaymentModel.findByIdAndUpdate(
      existingPayment._id,
      { $set: updateData },
      updateOptions,
    );

    if (!updatedPayment) {
      throw new AppError("Failed to update member payment", 500);
    }

    return updatedPayment;
  }

  // delete member payment
  public async deleteMemberPayment(
    identifier: string,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberPayment>> {
    const existingPayment = await this.getMemberPaymentById(identifier);
    const deleteOptions = session ? { session } : {};

    const deletedPayment = await MemberPaymentModel.findByIdAndDelete(
      existingPayment._id,
      deleteOptions,
    );

    if (!deletedPayment) {
      throw new AppError("Member payment not found", 404);
    }

    return deletedPayment;
  }
}

export default new MemberPaymentService();