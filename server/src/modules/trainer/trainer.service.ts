import type mongoose from "mongoose";

import UserService from "../user/user.service.js";
import TrainerDetailsModel from "./trainer-details/trainer-details.model.js";
import TrainerPaymentModel from "./trainer-payment/trainer-payment.model.js";
import AppError from "../../shared/errors/AppError.js";
import type {
  CreateTrainerInput,
  UpdateTrainerInput,
} from "./trainer.validator.js";

class TrainerService {
  // helper to combine User + TrainerDetails + TrainerPayment
  private async formatTrainerResponse(user: any) {
    const userObj = user.toObject ? user.toObject() : user;
    const userId = userObj.userId;

    const [details, payment] = await Promise.all([
      TrainerDetailsModel.findOne({ userId }),
      TrainerPaymentModel.findOne({ userId }),
    ]);

    return {
      ...userObj,
      joinDate: details?.joinDate
        ? new Date(details.joinDate).toISOString()
        : new Date().toISOString(),
      experienceYears: details?.experienceYears ?? 0,
      specialization: details?.specialization ?? ["General"],
      qualification: details?.qualification ?? "General",
      shiftTime: details?.shiftTime ?? { start: "09:00", end: "17:00" },
      employmentStatus: details?.employmentStatus ?? "active",
      salary: payment?.salary ?? 0,
    };
  }

  // create trainer
  public async createTrainer(
    data: CreateTrainerInput,
    session?: mongoose.ClientSession,
  ) {
    const {
      qualification,
      shiftTime,
      joinDate,
      experienceYears,
      specialization,
      employmentStatus,
      salary,
      ...userData
    } = data;

    // 1. Create user account with trainer role
    const user = await UserService.createUser(
      { ...userData, role: "trainer" },
      session,
    );

    const userId = user.userId;

    // 2. Create TrainerDetails
    await TrainerDetailsModel.create(
      [
        {
          userId,
          qualification: qualification || "General",
          shiftTime: shiftTime || { start: "09:00", end: "17:00" },
          ...(joinDate ? { joinDate } : {}),
          ...(experienceYears !== undefined ? { experienceYears } : {}),
          ...(specialization ? { specialization } : {}),
          ...(employmentStatus ? { employmentStatus } : {}),
        },
      ],
      session ? { session } : {},
    );

    // 3. Create TrainerPayment (salary)
    const trainerSalary = salary !== undefined ? salary : 0;
    await TrainerPaymentModel.create(
      [
        {
          userId,
          salary: trainerSalary,
          amountDue: trainerSalary,
          amountPaid: 0,
          paymentStatus: "PENDING",
        },
      ],
      session ? { session } : {},
    );

    return this.formatTrainerResponse(user);
  }

  // fetch all trainers
  public async getAllTrainers() {
    const users = await UserService.getAllUsers("trainer");

    const trainerUserIds = users.map((u: any) => u.userId);
    const [allDetails, allPayments] = await Promise.all([
      TrainerDetailsModel.find({ userId: { $in: trainerUserIds } }),
      TrainerPaymentModel.find({ userId: { $in: trainerUserIds } }),
    ]);

    const detailsMap = new Map(allDetails.map((d) => [d.userId, d]));
    const paymentMap = new Map(allPayments.map((p) => [p.userId, p]));

    return users.map((user: any) => {
      const userObj = user.toObject ? user.toObject() : user;
      const details = detailsMap.get(userObj.userId);
      const payment = paymentMap.get(userObj.userId);

      return {
        ...userObj,
        joinDate: details?.joinDate
          ? new Date(details.joinDate).toISOString()
          : new Date().toISOString(),
        experienceYears: details?.experienceYears ?? 0,
        specialization: details?.specialization ?? ["General"],
        qualification: details?.qualification ?? "General",
        shiftTime: details?.shiftTime ?? { start: "09:00", end: "17:00" },
        employmentStatus: details?.employmentStatus ?? "active",
        salary: payment?.salary ?? 0,
      };
    });
  }

  // fetch trainer by id
  public async getTrainerById(id: string) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "trainer") {
      throw new AppError("Trainer not found", 404);
    }
    return this.formatTrainerResponse(user);
  }

  // update trainer
  public async updateTrainer(
    id: string,
    data: UpdateTrainerInput,
    session?: mongoose.ClientSession,
  ) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "trainer") {
      throw new AppError("Trainer not found", 404);
    }

    const {
      qualification,
      shiftTime,
      joinDate,
      experienceYears,
      specialization,
      employmentStatus,
      salary,
      ...userData
    } = data;

    // Update user info if any user field provided
    let updatedUser = user;
    if (Object.keys(userData).length > 0) {
      updatedUser = await UserService.updateUser(id, userData, session);
    }

    const userId = user.userId;

    // Update or upsert TrainerDetails
    const detailsUpdate: Record<string, any> = {};
    if (qualification !== undefined) detailsUpdate.qualification = qualification;
    if (shiftTime !== undefined) detailsUpdate.shiftTime = shiftTime;
    if (joinDate !== undefined) detailsUpdate.joinDate = joinDate;
    if (experienceYears !== undefined)
      detailsUpdate.experienceYears = experienceYears;
    if (specialization !== undefined)
      detailsUpdate.specialization = specialization;
    if (employmentStatus !== undefined)
      detailsUpdate.employmentStatus = employmentStatus;

    if (Object.keys(detailsUpdate).length > 0) {
      await TrainerDetailsModel.findOneAndUpdate(
        { userId },
        { $set: detailsUpdate },
        { upsert: true, new: true, ...(session ? { session } : {}) },
      );
    }

    // Update or upsert TrainerPayment salary
    if (salary !== undefined) {
      const existingPayment = await TrainerPaymentModel.findOne({
        userId,
      }).session(session || null);
      if (existingPayment) {
        existingPayment.salary = salary;
        await existingPayment.save({ ...(session ? { session } : {}) });
      } else {
        await TrainerPaymentModel.create(
          [
            {
              userId,
              salary,
              amountDue: salary,
              amountPaid: 0,
              paymentStatus: "PENDING",
            },
          ],
          session ? { session } : {},
        );
      }
    }

    return this.formatTrainerResponse(updatedUser);
  }

  // delete trainer (soft delete)
  public async deleteTrainer(id: string, session?: mongoose.ClientSession) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "trainer") {
      throw new AppError("Trainer not found", 404);
    }
    const deletedUser = await UserService.deleteUser(id, session);
    await TrainerDetailsModel.findOneAndUpdate(
      { userId: user.userId },
      { $set: { employmentStatus: "inactive" } },
      { ...(session ? { session } : {}) },
    );
    return this.formatTrainerResponse(deletedUser);
  }

  // hard delete trainer
  public async hardDeleteTrainer(
    id: string,
    session?: mongoose.ClientSession,
  ) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "trainer") {
      throw new AppError("Trainer not found", 404);
    }
    const deletedUser = await UserService.hardDeleteUser(id, session);
    await Promise.all([
      TrainerDetailsModel.findOneAndDelete(
        { userId: user.userId },
        session ? { session } : {},
      ),
      TrainerPaymentModel.findOneAndDelete(
        { userId: user.userId },
        session ? { session } : {},
      ),
    ]);
    return this.formatTrainerResponse(deletedUser);
  }
}

export default new TrainerService();
