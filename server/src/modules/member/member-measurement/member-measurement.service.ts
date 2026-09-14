import mongoose, { type HydratedDocument } from "mongoose";

import MemberMeasurementModel, {
  type MemberMeasurement,
} from "./member-measurement.model.js";
import type {
  CreateMemberMeasurementInput,
  UpdateMemberMeasurementInput,
} from "./member-measurement.validator.js";
import AppError from "../../../shared/errors/AppError.js";

export type CreateMemberMeasurementData = CreateMemberMeasurementInput;
export type UpdateMemberMeasurementData = UpdateMemberMeasurementInput;

class MemberMeasurementService {
  // helper to calculate BMI from height and weight
  private calculateBmi(height: number, weight: number): number {
    const heightInMeters = height > 3 ? height / 100 : height;
    if (heightInMeters <= 0) return 0;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(2));
  }

  // create member measurement
  public async createMemberMeasurement(
    data: CreateMemberMeasurementData,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberMeasurement>> {
    const userIdClean = data.userId.trim().toUpperCase();
    const bmi =
      data.bmi !== undefined
        ? data.bmi
        : this.calculateBmi(data.height, data.weight);

    const createOptions = session ? { session } : {};
    const [measurement] = await MemberMeasurementModel.create(
      [
        {
          userId: userIdClean,
          ...(data.recordedDate ? { recordedDate: data.recordedDate } : {}),
          height: data.height,
          weight: data.weight,
          bmi,
          ...(data.bodyFat !== undefined ? { bodyFat: data.bodyFat } : {}),
          ...(data.muscleMass !== undefined
            ? { muscleMass: data.muscleMass }
            : {}),
          ...(data.notes ? { notes: data.notes.trim() } : {}),
        },
      ],
      createOptions,
    );

    if (!measurement) {
      throw new AppError("Couldn't create member measurement record", 500);
    }

    return measurement;
  }

  // fetch all member measurements
  public async getAllMemberMeasurements(
    userId?: string,
  ): Promise<HydratedDocument<MemberMeasurement>[]> {
    const query = userId ? { userId: userId.trim().toUpperCase() } : {};
    return await MemberMeasurementModel.find(query).sort({
      recordedDate: -1,
      createdAt: -1,
    });
  }

  // fetch member measurement by id
  public async getMemberMeasurementById(
    id: string,
  ): Promise<HydratedDocument<MemberMeasurement>> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Member measurement not found", 404);
    }

    const measurement = await MemberMeasurementModel.findById(id);

    if (!measurement) {
      throw new AppError("Member measurement not found", 404);
    }

    return measurement;
  }

  // fetch all measurements for a specific user
  public async getMeasurementsByUserId(
    userId: string,
  ): Promise<HydratedDocument<MemberMeasurement>[]> {
    const userIdClean = userId.trim().toUpperCase();
    return await MemberMeasurementModel.find({ userId: userIdClean }).sort({
      recordedDate: -1,
      createdAt: -1,
    });
  }

  // fetch latest measurement for a specific user
  public async getLatestMeasurementByUserId(
    userId: string,
  ): Promise<HydratedDocument<MemberMeasurement> | null> {
    const userIdClean = userId.trim().toUpperCase();
    return await MemberMeasurementModel.findOne({ userId: userIdClean }).sort({
      recordedDate: -1,
      createdAt: -1,
    });
  }

  // update member measurement
  public async updateMemberMeasurement(
    id: string,
    data: UpdateMemberMeasurementData,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberMeasurement>> {
    const existing = await this.getMemberMeasurementById(id);

    const updateData: Record<string, any> = { ...data };
    if (updateData.userId) {
      updateData.userId = updateData.userId.trim().toUpperCase();
    }
    if (updateData.notes !== undefined) {
      updateData.notes = updateData.notes.trim();
    }

    // Recalculate BMI if height or weight changed and bmi wasn't explicitly provided
    if (
      updateData.bmi === undefined &&
      (data.height !== undefined || data.weight !== undefined)
    ) {
      const effectiveHeight = data.height ?? existing.height;
      const effectiveWeight = data.weight ?? existing.weight;
      updateData.bmi = this.calculateBmi(effectiveHeight, effectiveWeight);
    }

    const updateOptions = {
      returnDocument: "after" as const,
      runValidators: true,
      ...(session ? { session } : {}),
    };

    const updated = await MemberMeasurementModel.findByIdAndUpdate(
      existing._id,
      { $set: updateData },
      updateOptions,
    );

    if (!updated) {
      throw new AppError("Failed to update member measurement", 500);
    }

    return updated;
  }

  // delete member measurement
  public async deleteMemberMeasurement(
    id: string,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberMeasurement>> {
    const existing = await this.getMemberMeasurementById(id);
    const deleteOptions = session ? { session } : {};

    const deleted = await MemberMeasurementModel.findByIdAndDelete(
      existing._id,
      deleteOptions,
    );

    if (!deleted) {
      throw new AppError("Member measurement not found", 404);
    }

    return deleted;
  }
}

export default new MemberMeasurementService();