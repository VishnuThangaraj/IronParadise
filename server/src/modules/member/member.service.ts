import mongoose, { type HydratedDocument } from "mongoose";

import UserService from "../user/user.service.js";
import UserModel, { type User } from "../user/user.model.js";
import MemberAssignmentModel from "./member-assignment/member-assignment.model.js";
import MemberAssignmentService from "./member-assignment/member-assignment.service.js";
import MembershipPlanModel from "../membership-plan/membership-plan.model.js";
import MemberMeasurementModel from "./member-measurement/member-measurement.model.js";
import MemberPaymentModel from "./member-payment/member-payment.model.js";
import MemberPaymentReceiptModel from "./member-payment-receipt/member-payment-receipt.model.js";
import AppError from "../../shared/errors/AppError.js";
import type {
  CreateMemberInput,
  UpdateMemberInput,
} from "./member.validator.js";

class MemberService {
  // helper to combine User + active MemberAssignment
  private async formatMemberResponse(user: any) {
    const userObj = user.toObject ? user.toObject() : user;
    const userId = userObj.userId;

    const assignment = await MemberAssignmentModel.findOne({
      userId,
      status: "ACTIVE",
    }).sort({ createdAt: -1 });

    return {
      ...userObj,
      assignment: assignment
        ? assignment.toObject
          ? assignment.toObject()
          : assignment
        : null,
    };
  }

  // create member (with or without initial assignment)
  public async createMember(
    data: CreateMemberInput,
    session?: mongoose.ClientSession,
  ) {
    const {
      membershipPlanId,
      dietPlanId,
      workoutPlanId,
      trainerId,
      startDate,
      endDate,
      assignment,
      ...userData
    } = data;

    // 1. Create user account with member role
    let user;
    try {
      user = await UserService.createUser(
        { ...userData, role: "member" },
        session,
      );
    } catch (error: any) {
      // If 409 conflict, check if this was an orphaned member user created during a previous crashed request
      if (error?.statusCode === 409) {
        const existingUser = await UserModel.findOne({
          email: userData.email.toLowerCase().trim(),
        }).session(session || null);

        if (existingUser && existingUser.role === "member") {
          const hasAssignment = await MemberAssignmentModel.findOne({
            userId: existingUser.userId,
          }).session(session || null);

          if (!hasAssignment) {
            // Clean up incomplete orphaned member account and retry
            await UserService.hardDeleteUser(existingUser.userId, session);
            user = await UserService.createUser(
              { ...userData, role: "member" },
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

    // 2. Check if assignment details were provided initially
    const assignmentInput =
      assignment ||
      (membershipPlanId ||
      dietPlanId ||
      workoutPlanId ||
      trainerId ||
      startDate ||
      endDate
        ? {
            membershipPlanId,
            dietPlanId,
            workoutPlanId,
            trainerId,
            startDate,
            endDate,
          }
        : null);

    if (assignmentInput) {
      try {
        const effectiveStartDate = assignmentInput.startDate || new Date();
        let effectiveEndDate = assignmentInput.endDate;

        // Auto calculate end date from membership plan duration if not provided
        if (!effectiveEndDate && assignmentInput.membershipPlanId) {
          const plan = await MembershipPlanModel.findOne({
            $or: [
              {
                membershipPlanId:
                  assignmentInput.membershipPlanId.trim().toUpperCase(),
              },
              ...(mongoose.Types.ObjectId.isValid(
                assignmentInput.membershipPlanId,
              )
                ? [{ _id: assignmentInput.membershipPlanId }]
                : []),
            ],
          }).session(session || null);

          if (plan) {
            const calcEnd = new Date(effectiveStartDate);
            calcEnd.setMonth(calcEnd.getMonth() + plan.durationMonths);
            effectiveEndDate = calcEnd;
          }
        }

        // Fallback default: 1 month duration
        if (!effectiveEndDate) {
          const defaultEnd = new Date(effectiveStartDate);
          defaultEnd.setMonth(defaultEnd.getMonth() + 1);
          effectiveEndDate = defaultEnd;
        }

        await MemberAssignmentService.createMemberAssignment(
          {
            userId,
            ...(assignmentInput.membershipPlanId
              ? { membershipPlanId: assignmentInput.membershipPlanId }
              : {}),
            ...(assignmentInput.dietPlanId
              ? { dietPlanId: assignmentInput.dietPlanId }
              : {}),
            ...(assignmentInput.workoutPlanId
              ? { workoutPlanId: assignmentInput.workoutPlanId }
              : {}),
            ...(assignmentInput.trainerId
              ? { trainerId: assignmentInput.trainerId }
              : {}),
            startDate: effectiveStartDate,
            endDate: effectiveEndDate,
            status: "ACTIVE",
          },
          session,
        );
      } catch (assignmentErr) {
        if (!session) {
          await UserService.hardDeleteUser(userId);
        }
        throw assignmentErr;
      }
    }

    const formatted = await this.formatMemberResponse(user);
    return {
      ...formatted,
      password: user.password,
    };
  }

  // fetch all members
  public async getAllMembers() {
    const users = await UserService.getAllUsers("member");

    const memberUserIds = users.map((u: any) => u.userId);
    const allAssignments = await MemberAssignmentModel.find({
      userId: { $in: memberUserIds },
      status: "ACTIVE",
    });

    const assignmentMap = new Map(allAssignments.map((a) => [a.userId, a]));

    return users.map((user: any) => {
      const userObj = user.toObject ? user.toObject() : user;
      const assignment = assignmentMap.get(userObj.userId);

      return {
        ...userObj,
        assignment: assignment
          ? assignment.toObject
            ? assignment.toObject()
            : assignment
          : null,
      };
    });
  }

  // fetch member by id
  public async getMemberById(id: string) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "member") {
      throw new AppError("Member not found", 404);
    }
    return await this.formatMemberResponse(user);
  }

  // update member
  public async updateMember(
    id: string,
    data: UpdateMemberInput,
    session?: mongoose.ClientSession,
  ) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "member") {
      throw new AppError("Member not found", 404);
    }

    const {
      membershipPlanId,
      dietPlanId,
      workoutPlanId,
      trainerId,
      startDate,
      endDate,
      assignment,
      ...userData
    } = data;

    let updatedUser = user;
    if (Object.keys(userData).length > 0) {
      updatedUser = await UserService.updateUser(id, userData, session);
    }

    const assignmentInput =
      assignment ||
      (membershipPlanId !== undefined ||
      dietPlanId !== undefined ||
      workoutPlanId !== undefined ||
      trainerId !== undefined ||
      startDate !== undefined ||
      endDate !== undefined
        ? {
            membershipPlanId,
            dietPlanId,
            workoutPlanId,
            trainerId,
            startDate,
            endDate,
          }
        : null);

    if (assignmentInput) {
      const existingAssignment = await MemberAssignmentModel.findOne({
        userId: user.userId,
        status: "ACTIVE",
      }).session(session || null);

      if (existingAssignment) {
        await MemberAssignmentService.updateMemberAssignment(
          existingAssignment.assignmentId,
          assignmentInput,
          session,
        );
      } else {
        const effectiveStartDate = assignmentInput.startDate || new Date();
        let effectiveEndDate = assignmentInput.endDate;

        if (!effectiveEndDate && assignmentInput.membershipPlanId) {
          const plan = await MembershipPlanModel.findOne({
            $or: [
              {
                membershipPlanId:
                  assignmentInput.membershipPlanId.trim().toUpperCase(),
              },
              ...(mongoose.Types.ObjectId.isValid(
                assignmentInput.membershipPlanId,
              )
                ? [{ _id: assignmentInput.membershipPlanId }]
                : []),
            ],
          }).session(session || null);

          if (plan) {
            const calcEnd = new Date(effectiveStartDate);
            calcEnd.setMonth(calcEnd.getMonth() + plan.durationMonths);
            effectiveEndDate = calcEnd;
          }
        }

        if (!effectiveEndDate) {
          const defaultEnd = new Date(effectiveStartDate);
          defaultEnd.setMonth(defaultEnd.getMonth() + 1);
          effectiveEndDate = defaultEnd;
        }

        await MemberAssignmentService.createMemberAssignment(
          {
            userId: user.userId,
            ...(assignmentInput.membershipPlanId
              ? { membershipPlanId: assignmentInput.membershipPlanId }
              : {}),
            ...(assignmentInput.dietPlanId
              ? { dietPlanId: assignmentInput.dietPlanId }
              : {}),
            ...(assignmentInput.workoutPlanId
              ? { workoutPlanId: assignmentInput.workoutPlanId }
              : {}),
            ...(assignmentInput.trainerId
              ? { trainerId: assignmentInput.trainerId }
              : {}),
            startDate: effectiveStartDate,
            endDate: effectiveEndDate,
            status: "ACTIVE",
          },
          session,
        );
      }
    }

    return await this.formatMemberResponse(updatedUser);
  }

  // delete member (soft delete)
  public async deleteMember(id: string, session?: mongoose.ClientSession) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "member") {
      throw new AppError("Member not found", 404);
    }
    const deletedUser = await UserService.deleteUser(id, session);
    await MemberAssignmentModel.updateMany(
      { userId: user.userId, status: "ACTIVE" },
      { $set: { status: "CANCELLED" } },
      { ...(session ? { session } : {}) },
    );
    return await this.formatMemberResponse(deletedUser);
  }

  // hard delete member (permanently from db)
  public async hardDeleteMember(
    id: string,
    session?: mongoose.ClientSession,
  ) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "member") {
      throw new AppError("Member not found", 404);
    }
    const deletedUser = await UserService.hardDeleteUser(id, session);
    await Promise.all([
      MemberAssignmentModel.deleteMany(
        { userId: user.userId },
        session ? { session } : {},
      ),
      MemberMeasurementModel.deleteMany(
        { userId: user.userId },
        session ? { session } : {},
      ),
      MemberPaymentModel.deleteMany(
        { userId: user.userId },
        session ? { session } : {},
      ),
      MemberPaymentReceiptModel.deleteMany(
        { userId: user.userId },
        session ? { session } : {},
      ),
    ]);
    return await this.formatMemberResponse(deletedUser);
  }
}

export default new MemberService();

