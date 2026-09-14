import mongoose, { type HydratedDocument } from "mongoose";

import MemberPaymentReceiptModel, {
  type MemberPaymentReceipt,
} from "./member-payment-receipt.model.js";
import MemberPaymentModel from "../member-payment/member-payment.model.js";
import type {
  CreateMemberPaymentReceiptInput,
  UpdateMemberPaymentReceiptInput,
} from "./member-payment-receipt.validator.js";
import AppError from "../../../shared/errors/AppError.js";
import { generatePaymentId } from "../../../shared/utils/id-generator.js";

export type CreateMemberPaymentReceiptData = CreateMemberPaymentReceiptInput;
export type UpdateMemberPaymentReceiptData = UpdateMemberPaymentReceiptInput;

class MemberPaymentReceiptService {
  // create member payment receipt
  public async createMemberPaymentReceipt(
    data: CreateMemberPaymentReceiptData,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberPaymentReceipt>> {
    const paymentIdClean = data.paymentId.trim().toUpperCase();
    const userIdClean = data.userId.trim().toUpperCase();

    const receiptNumber = data.receiptNumber
      ? data.receiptNumber.trim().toUpperCase()
      : await generatePaymentId("memberReceipt");

    const existing = await MemberPaymentReceiptModel.findOne({
      receiptNumber,
    }).session(session || null);

    if (existing) {
      throw new AppError("Receipt number already exists", 409);
    }

    // Verify corresponding MemberPayment exists
    const memberPayment = await MemberPaymentModel.findOne({
      paymentId: paymentIdClean,
    }).session(session || null);

    if (!memberPayment) {
      throw new AppError("Member payment record not found", 404);
    }

    const createOptions = session ? { session } : {};
    const [memberPaymentReceipt] = await MemberPaymentReceiptModel.create(
      [
        {
          receiptNumber,
          paymentId: paymentIdClean,
          userId: userIdClean,
          amountPaid: data.amountPaid,
          paymentDate: data.paymentDate || new Date(),
          paymentMethod: data.paymentMethod,
          ...(data.referenceNumber
            ? { referenceNumber: data.referenceNumber.trim() }
            : {}),
          ...(data.remarks ? { remarks: data.remarks.trim() } : {}),
        },
      ],
      createOptions,
    );

    if (!memberPaymentReceipt) {
      throw new AppError(
        "Couldn't create member payment receipt record",
        500,
      );
    }

    // Update parent member payment summary
    const newAmountPaid = (memberPayment.amountPaid || 0) + data.amountPaid;
    const newAmountDue = Math.max(
      0,
      memberPayment.totalAmount - newAmountPaid,
    );

    let newStatus: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" =
      memberPayment.paymentStatus;
    if (newAmountDue <= 0) {
      newStatus = "PAID";
    } else if (newAmountPaid > 0) {
      newStatus = "PARTIAL";
    }

    await MemberPaymentModel.findByIdAndUpdate(
      memberPayment._id,
      {
        $set: {
          amountPaid: newAmountPaid,
          amountDue: newAmountDue,
          paymentStatus: newStatus,
        },
      },
      createOptions,
    );

    return memberPaymentReceipt;
  }

  // fetch all member payment receipts
  public async getAllMemberPaymentReceipts(filter?: {
    paymentId?: string;
    userId?: string;
  }): Promise<HydratedDocument<MemberPaymentReceipt>[]> {
    const query: Record<string, any> = {};

    if (filter?.paymentId) {
      query.paymentId = filter.paymentId.trim().toUpperCase();
    }
    if (filter?.userId) {
      query.userId = filter.userId.trim().toUpperCase();
    }

    return (await MemberPaymentReceiptModel.find(query as any).sort({
      paymentDate: -1,
      createdAt: -1,
    })) as any;
  }

  // fetch member payment receipt by receiptNumber or _id
  public async getMemberPaymentReceiptById(
    identifier: string,
  ): Promise<HydratedDocument<MemberPaymentReceipt>> {
    const cleanId = identifier.trim().toUpperCase();

    const memberPaymentReceipt = await MemberPaymentReceiptModel.findOne({
      $or: [
        { receiptNumber: cleanId },
        ...(mongoose.Types.ObjectId.isValid(identifier)
          ? [{ _id: identifier }]
          : []),
      ],
    });

    if (!memberPaymentReceipt) {
      throw new AppError("Member payment receipt not found", 404);
    }

    return memberPaymentReceipt;
  }

  // fetch member payment receipts by paymentId
  public async getMemberPaymentReceiptsByPaymentId(
    paymentId: string,
  ): Promise<HydratedDocument<MemberPaymentReceipt>[]> {
    const paymentIdClean = paymentId.trim().toUpperCase();
    return (await MemberPaymentReceiptModel.find({
      paymentId: paymentIdClean,
    } as any).sort({
      paymentDate: -1,
      createdAt: -1,
    })) as any;
  }

  // fetch member payment receipts by userId
  public async getMemberPaymentReceiptsByUserId(
    userId: string,
  ): Promise<HydratedDocument<MemberPaymentReceipt>[]> {
    const userIdClean = userId.trim().toUpperCase();
    return (await MemberPaymentReceiptModel.find({
      userId: userIdClean,
    } as any).sort({
      paymentDate: -1,
      createdAt: -1,
    })) as any;
  }

  // update member payment receipt
  public async updateMemberPaymentReceipt(
    identifier: string,
    data: UpdateMemberPaymentReceiptData,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberPaymentReceipt>> {
    const existingReceipt = await this.getMemberPaymentReceiptById(identifier);

    const updateData: Record<string, any> = { ...data };
    if (updateData.receiptNumber) {
      updateData.receiptNumber =
        updateData.receiptNumber.trim().toUpperCase();
    }
    if (updateData.paymentId) {
      updateData.paymentId = updateData.paymentId.trim().toUpperCase();
    }
    if (updateData.userId) {
      updateData.userId = updateData.userId.trim().toUpperCase();
    }
    if (updateData.referenceNumber !== undefined) {
      updateData.referenceNumber = updateData.referenceNumber.trim();
    }
    if (updateData.remarks !== undefined) {
      updateData.remarks = updateData.remarks.trim();
    }

    const updateOptions = {
      returnDocument: "after" as const,
      runValidators: true,
      ...(session ? { session } : {}),
    };

    const updatedReceipt = await MemberPaymentReceiptModel.findByIdAndUpdate(
      existingReceipt._id,
      { $set: updateData },
      updateOptions,
    );

    if (!updatedReceipt) {
      throw new AppError("Failed to update member payment receipt", 500);
    }

    return updatedReceipt;
  }

  // delete member payment receipt
  public async deleteMemberPaymentReceipt(
    identifier: string,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberPaymentReceipt>> {
    const existingReceipt = await this.getMemberPaymentReceiptById(identifier);
    const deleteOptions = session ? { session } : {};

    const deletedReceipt = await MemberPaymentReceiptModel.findByIdAndDelete(
      existingReceipt._id,
      deleteOptions,
    );

    if (!deletedReceipt) {
      throw new AppError("Member payment receipt not found", 404);
    }

    return deletedReceipt;
  }
}

export default new MemberPaymentReceiptService();
