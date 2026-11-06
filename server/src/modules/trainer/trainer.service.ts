import type mongoose from "mongoose";

import UserService from "../user/user.service.js";
import UserModel from "../user/user.model.js";
import TrainerDetailsModel from "./trainer-details/trainer-details.model.js";
import TrainerPaymentModel from "./trainer-payment/trainer-payment.model.js";
import TrainerPaymentReceiptModel from "./trainer-payment-receipt/trainer-payment-receipt.model.js";
import MemberAssignmentModel from "../member/member-assignment/member-assignment.model.js";
import MembershipPlanModel from "../membership-plan/membership-plan.model.js";
import WorkoutPlanModel from "../workout-plan/workout-plan.model.js";
import DietPlanModel from "../diet-plan/diet-plan.model.js";
import AttendanceModel from "../attendance/attendance.model.js";
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
      amountPaid: payment?.amountPaid ?? 0,
      amountDue:
        payment?.amountDue !== undefined
          ? payment.amountDue
          : (payment?.salary ?? 0),
      paymentStatus: payment?.paymentStatus ?? "PENDING",
      lastAccruedMonth: payment?.lastAccruedMonth ?? null,
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

    // Normalize shift times so Mongoose required fields are never empty strings
    const effectiveShiftTime = {
      start:
        shiftTime?.start && shiftTime.start.trim()
          ? shiftTime.start.trim()
          : "09:00",
      end:
        shiftTime?.end && shiftTime.end.trim()
          ? shiftTime.end.trim()
          : "17:00",
    };

    // 1. Create user account with trainer role
    let user;
    try {
      user = await UserService.createUser(
        { ...userData, role: "trainer" },
        session,
      );
    } catch (error: any) {
      // If 409 conflict, check if this was an orphaned trainer user created during a previous crashed request
      if (error?.statusCode === 409) {
        const existingUser = await UserModel.findOne({
          email: userData.email.toLowerCase().trim(),
        }).session(session || null);

        if (existingUser && existingUser.role === "trainer") {
          const hasDetails = await TrainerDetailsModel.findOne({
            userId: existingUser.userId,
          }).session(session || null);

          if (!hasDetails) {
            // Clean up the incomplete orphaned trainer account and retry creation
            await UserService.hardDeleteUser(existingUser.userId, session);
            user = await UserService.createUser(
              { ...userData, role: "trainer" },
              session,
            );
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }

    const userId = user.userId;

    try {
      // 2. Create TrainerDetails
      await TrainerDetailsModel.create(
        [
          {
            userId,
            qualification: qualification || "General",
            shiftTime: effectiveShiftTime,
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
    } catch (createErr) {
      // If creating details or payment failed and there's no active transaction session, rollback the user
      if (!session) {
        await UserService.hardDeleteUser(userId);
      }
      throw createErr;
    }

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
        amountPaid: payment?.amountPaid ?? 0,
        amountDue:
          payment?.amountDue !== undefined
            ? payment.amountDue
            : (payment?.salary ?? 0),
        paymentStatus: payment?.paymentStatus ?? "PENDING",
        lastAccruedMonth: payment?.lastAccruedMonth ?? null,
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
    if (shiftTime !== undefined) {
      detailsUpdate.shiftTime = {
        start:
          shiftTime.start && shiftTime.start.trim()
            ? shiftTime.start.trim()
            : "09:00",
        end:
          shiftTime.end && shiftTime.end.trim()
            ? shiftTime.end.trim()
            : "17:00",
      };
    }
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

  // Fetch all members assigned to this trainer
  public async getAssignedMembers(
    trainerId: string,
    options?: { search?: string; status?: string },
  ) {
    const normalizedTrainerId = trainerId.trim().toUpperCase();
    const filter: any = { trainerId: normalizedTrainerId };
    if (options?.status) {
      filter.status = options.status.toUpperCase();
    }

    const assignments = await MemberAssignmentModel.find(filter).sort({
      createdAt: -1,
    });

    // Deduplicate by member userId, taking latest assignment
    const latestAssignmentByMember = new Map<string, any>();
    for (const asgn of assignments) {
      if (!latestAssignmentByMember.has(asgn.userId)) {
        latestAssignmentByMember.set(asgn.userId, asgn);
      }
    }

    const assignedUserIds = Array.from(latestAssignmentByMember.keys());
    let members = await UserModel.find({ userId: { $in: assignedUserIds } });

    if (options?.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      members = members.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.userId.toLowerCase().includes(q) ||
          (m.phone && m.phone.toLowerCase().includes(q)),
      );
    }

    const planIds = new Set<string>();
    const workoutPlanIds = new Set<string>();
    const dietPlanIds = new Set<string>();

    for (const asgn of latestAssignmentByMember.values()) {
      if (asgn.membershipPlanId) planIds.add(asgn.membershipPlanId);
      if (asgn.workoutPlanId) workoutPlanIds.add(asgn.workoutPlanId);
      if (asgn.dietPlanId) dietPlanIds.add(asgn.dietPlanId);
    }

    const [membershipPlans, workoutPlans, dietPlans] = await Promise.all([
      MembershipPlanModel.find({
        membershipPlanId: { $in: Array.from(planIds) },
      }),
      WorkoutPlanModel.find({
        workoutPlanId: { $in: Array.from(workoutPlanIds) },
      }),
      DietPlanModel.find({ dietPlanId: { $in: Array.from(dietPlanIds) } }),
    ]);

    const membershipPlanMap = new Map(
      membershipPlans.map((p) => [p.membershipPlanId, p]),
    );
    const workoutPlanMap = new Map(
      workoutPlans.map((p) => [p.workoutPlanId, p]),
    );
    const dietPlanMap = new Map(dietPlans.map((p) => [p.dietPlanId, p]));

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    const todayAttendances = await AttendanceModel.find({
      userId: { $in: members.map((m) => m.userId) },
      date: { $gte: startOfToday, $lte: endOfToday },
    });
    const todayAttMap = new Map(todayAttendances.map((a) => [a.userId, a]));

    const result = members.map((m) => {
      const asgn = latestAssignmentByMember.get(m.userId);
      const mPlan = asgn?.membershipPlanId
        ? membershipPlanMap.get(asgn.membershipPlanId)
        : null;
      const wPlan = asgn?.workoutPlanId
        ? workoutPlanMap.get(asgn.workoutPlanId)
        : null;
      const dPlan = asgn?.dietPlanId
        ? dietPlanMap.get(asgn.dietPlanId)
        : null;
      const todayAtt = todayAttMap.get(m.userId);

      return {
        ...m.toObject(),
        assignment: asgn ? asgn.toObject() : null,
        membershipPlan: mPlan
          ? {
              planId: mPlan.membershipPlanId,
              name: mPlan.planName,
              planName: mPlan.planName,
              price: mPlan.price,
            }
          : null,
        workoutPlan: wPlan
          ? {
              planId: wPlan.workoutPlanId,
              name: wPlan.planName,
              planName: wPlan.planName,
              fitnessGoal: wPlan.goal,
            }
          : null,
        dietPlan: dPlan
          ? {
              planId: dPlan.dietPlanId,
              name: dPlan.planName,
              planName: dPlan.planName,
              goal: dPlan.goal,
            }
          : null,
        todayAttendance: todayAtt
          ? {
              status: todayAtt.status,
              checkIn: todayAtt.checkIn,
              checkOut: todayAtt.checkOut,
              durationMinutes: todayAtt.durationMinutes,
            }
          : null,
      };
    });

    return {
      members: result,
      totalCount: result.length,
    };
  }

  // Fetch attendance records strictly for members assigned to this trainer
  public async getAssignedMembersAttendance(
    trainerId: string,
    options?: {
      memberId?: string;
      startDate?: string;
      endDate?: string;
      status?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const normalizedTrainerId = trainerId.trim().toUpperCase();
    const assignedUserIds = await MemberAssignmentModel.find({
      trainerId: normalizedTrainerId,
    }).distinct("userId");

    if (assignedUserIds.length === 0) {
      return {
        records: [],
        pagination: {
          total: 0,
          page: 1,
          limit: options?.limit || 20,
          pages: 0,
        },
      };
    }

    const query: any = {};

    if (options?.memberId && options.memberId.trim()) {
      const reqMemberId = options.memberId.trim().toUpperCase();
      if (!assignedUserIds.includes(reqMemberId)) {
        throw new AppError("Requested member is not assigned to you", 403);
      }
      query.userId = reqMemberId;
    } else {
      query.userId = { $in: assignedUserIds };
    }

    if (options?.startDate || options?.endDate) {
      query.date = {};
      if (options.startDate) {
        query.date.$gte = new Date(options.startDate);
      }
      if (options.endDate) {
        const end = new Date(options.endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    if (options?.status && options.status.trim()) {
      query.status = options.status.trim().toLowerCase();
    }

    const page = Math.max(1, Number(options?.page) || 1);
    const limit = Math.max(1, Number(options?.limit) || 20);
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      AttendanceModel.find(query)
        .sort({ date: -1, checkIn: -1 })
        .skip(skip)
        .limit(limit),
      AttendanceModel.countDocuments(query),
    ]);

    const userIds = Array.from(new Set(records.map((r) => r.userId)));
    const users = await UserModel.find({ userId: { $in: userIds } });
    const userMap = new Map(users.map((u) => [u.userId, u]));

    const enrichedRecords = records.map((rec) => {
      const u = userMap.get(rec.userId);
      return {
        ...rec.toObject(),
        fullName: u?.fullName || rec.userId,
        email: u?.email || "",
        phone: u?.phone || "",
        profileImage: u?.profileImage || "",
      };
    });

    return {
      records: enrichedRecords,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Fetch logged-in trainer's own payroll & receipts
  public async getMyPayroll(trainerId: string) {
    const normalizedTrainerId = trainerId.trim().toUpperCase();
    const [payment, receipts] = await Promise.all([
      TrainerPaymentModel.findOne({ userId: normalizedTrainerId }),
      TrainerPaymentReceiptModel.find({
        userId: normalizedTrainerId,
      }).sort({ paymentDate: -1 }),
    ]);

    return {
      payment: payment ? payment.toObject() : null,
      receipts: receipts ? receipts.map((r) => r.toObject()) : [],
    };
  }
}

export default new TrainerService();
