import mongoose, { type HydratedDocument } from "mongoose";

import TrainerDetailsModel, {
  type TrainerDetails,
} from "./trainer-details.model.js";

import type {
  CreateTrainerDetailsInput,
  UpdateTrainerDetailsInput,
} from "./trainer-details.validator.js";

import AppError from "../../../shared/errors/AppError.js";

class TrainerDetailsService {
  // create trainer details
  public async createTrainerDetails(
    data: CreateTrainerDetailsInput,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<TrainerDetails>> {
    const userIdClean = data.userId.trim().toUpperCase();

    const existing = await TrainerDetailsModel.findOne({
      userId: userIdClean,
    }).session(session || null);

    if (existing) {
      throw new AppError("Trainer details already exist for this trainer", 409);
    }

    const createOptions = session ? { session } : {};
    const [trainerDetails] = await TrainerDetailsModel.create(
      [
        {
          userId: userIdClean,
          qualification: data.qualification.trim(),
          shiftTime: data.shiftTime,
          ...(data.joinDate ? { joinDate: data.joinDate } : {}),
          ...(data.experienceYears !== undefined
            ? { experienceYears: data.experienceYears }
            : {}),
          ...(data.specialization
            ? { specialization: data.specialization }
            : {}),
          ...(data.employmentStatus
            ? { employmentStatus: data.employmentStatus }
            : {}),
        },
      ],
      createOptions,
    );

    if (!trainerDetails) {
      throw new AppError("Couldn't create trainer details record", 500);
    }

    return trainerDetails;
  }

  // fetch all trainer details
  public async getAllTrainerDetails(): Promise<
    HydratedDocument<TrainerDetails>[]
  > {
    return await TrainerDetailsModel.find().sort({ createdAt: -1 });
  }

  // fetch trainer details by id
  public async getTrainerDetailsById(
    userId: string,
  ): Promise<HydratedDocument<TrainerDetails>> {
    const trainerDetails = await TrainerDetailsModel.findOne({
      $or: [
        { userId },
        ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: userId }] : []),
      ],
    });

    if (!trainerDetails) {
      throw new AppError("Trainer details not found", 404);
    }

    return trainerDetails;
  }

  // update trainer details
  public async updateTrainerDetails(
    userId: string,
    data: UpdateTrainerDetailsInput,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<TrainerDetails>> {
    const existingTrainerDetails = await TrainerDetailsModel.findOne({
      $or: [
        { userId },
        ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: userId }] : []),
      ],
    }).session(session || null);

    if (!existingTrainerDetails) {
      throw new AppError("Trainer details not found", 404);
    }

    const updateOptions = {
      returnDocument: "after" as const,
      runValidators: true,
      ...(session ? { session } : {}),
    };

    const updatedTrainerDetails = await TrainerDetailsModel.findByIdAndUpdate(
      existingTrainerDetails._id,
      { $set: data },
      updateOptions,
    );

    if (!updatedTrainerDetails) {
      throw new AppError("Failed to update trainer details", 500);
    }

    return updatedTrainerDetails;
  }

  // delete trainer details (soft delete)
  public async deleteTrainerDetails(
    userId: string,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<TrainerDetails>> {
    const updateOptions = {
      returnDocument: "after" as const,
      runValidators: true,
      ...(session ? { session } : {}),
    };

    const trainerDetails = await TrainerDetailsModel.findOneAndUpdate(
      {
        $or: [
          { userId },
          ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: userId }] : []),
        ],
      },
      { $set: { employmentStatus: "inactive" } },
      updateOptions,
    );

    if (!trainerDetails) {
      throw new AppError("Trainer details not found", 404);
    }

    return trainerDetails;
  }

  // delete trainer details (completely from db)
  public async hardDeleteTrainerDetails(
    userId: string,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<TrainerDetails>> {
    const deleteOptions = session ? { session } : {};
    const trainerDetails = await TrainerDetailsModel.findOneAndDelete(
      {
        $or: [
          { userId },
          ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: userId }] : []),
        ],
      },
      deleteOptions,
    );

    if (!trainerDetails) {
      throw new AppError("Trainer details not found", 404);
    }

    return trainerDetails;
  }
}

export default new TrainerDetailsService();
