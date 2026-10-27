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
import { generateId } from "../../shared/utils/id-generator.js";
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

  // fetch all member payments enriched with user, assignment & membership plan details
  public async getAllMemberPayments(filter?: {
    paymentStatus?: string | undefined;
    membershipPlanId?: string | undefined;
    search?: string | undefined;
  }) {
    // 1. Get all member users
    const users = await UserService.getAllUsers("member");
    const userMap = new Map(users.map((u: any) => [u.userId, u]));

    // 2. Get all assignments
    const assignments = await MemberAssignmentModel.find().sort({
      createdAt: -1,
    });
    // Keep map of latest / active assignment per user
    const userAssignmentMap = new Map<string, any>();
    const assignmentMap = new Map<string, any>();
    for (const asgn of assignments) {
      assignmentMap.set(asgn.assignmentId, asgn);
      if (
        !userAssignmentMap.has(asgn.userId) ||
        asgn.status === "ACTIVE"
      ) {
        if (
          !userAssignmentMap.has(asgn.userId) ||
          userAssignmentMap.get(asgn.userId)?.status !== "ACTIVE"
        ) {
          userAssignmentMap.set(asgn.userId, asgn);
        }
      }
    }

    // 3. Get all membership plans
    const plans = await MembershipPlanModel.find();
    const planMap = new Map(plans.map((p) => [p.membershipPlanId, p]));

    // 4. Get all member payments
    let payments = await MemberPaymentModel.find().sort({ createdAt: -1 });
    const paymentUserIds = new Set(payments.map((p) => p.userId));

    // 5. Reconcile: Ensure any member with an assignment has an initial MemberPayment record
    const missingPaymentDocs = [];
    for (const [userId, asgn] of userAssignmentMap.entries()) {
      if (!paymentUserIds.has(userId) && asgn.membershipPlanId) {
        const plan = planMap.get(asgn.membershipPlanId);
        if (plan) {
          const generatedPaymentId = await generateId("payment");
          missingPaymentDocs.push({
            paymentId: generatedPaymentId,
            userId,
            assignmentId: asgn.assignmentId,
            totalAmount: plan.price,
            amountPaid: 0,
            amountDue: plan.price,
            dueDate: asgn.startDate || asgn.createdAt || new Date(),
            paymentStatus: "PENDING" as const,
          });
        }
      }
    }

    if (missingPaymentDocs.length > 0) {
      try {
        await MemberPaymentModel.insertMany(missingPaymentDocs);
        payments = (await MemberPaymentModel.find().sort({
          createdAt: -1,
        })) as any;
      } catch (err) {
        console.error("Error auto-reconciling member payments:", err);
      }
    }

    // 6. Enrich payments
    let enriched = payments.map((pay: any) => {
      const payObj = pay.toObject ? pay.toObject() : pay;
      const user = userMap.get(payObj.userId);
      const asgn =
        assignmentMap.get(payObj.assignmentId) ||
        userAssignmentMap.get(payObj.userId);
      const plan = asgn?.membershipPlanId
        ? planMap.get(asgn.membershipPlanId)
        : null;

      return {
        _id: payObj._id,
        paymentId: payObj.paymentId,
        userId: payObj.userId,
        assignmentId: payObj.assignmentId,
        fullName: user?.fullName || "Member",
        email: user?.email || "",
        phoneNumber: user?.phone || "",
        profileImage: user?.profileImage || "",
        gender: user?.gender || "prefer_not_to_say",
        isActive: user ? user.isActive !== false : true,
        membershipPlan: plan
          ? {
              membershipPlanId: plan.membershipPlanId,
              planName: plan.planName,
              price: plan.price,
              durationMonths: plan.durationMonths,
            }
          : null,
        assignment: asgn
          ? {
              assignmentId: asgn.assignmentId,
              startDate: asgn.startDate,
              endDate: asgn.endDate,
              status: asgn.status,
            }
          : null,
        totalAmount: payObj.totalAmount,
        amountPaid: payObj.amountPaid,
        amountDue: payObj.amountDue,
        dueDate: payObj.dueDate,
        paymentStatus: payObj.paymentStatus,
        createdAt: payObj.createdAt,
        updatedAt: payObj.updatedAt,
      };
    });

    // 7. Apply optional filters
    if (filter?.paymentStatus && filter.paymentStatus !== "all") {
      enriched = enriched.filter(
        (p) =>
          p.paymentStatus.toUpperCase() ===
          filter.paymentStatus!.toUpperCase(),
      );
    }
    if (filter?.membershipPlanId && filter.membershipPlanId !== "all") {
      enriched = enriched.filter(
        (p) =>
          p.membershipPlan?.membershipPlanId === filter.membershipPlanId,
      );
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      enriched = enriched.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.userId.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phoneNumber.toLowerCase().includes(q) ||
          (p.membershipPlan &&
            p.membershipPlan.planName.toLowerCase().includes(q)),
      );
    }

    return enriched;
  }

  // fetch all member payment receipts enriched with member and payment details
  public async getAllMemberPaymentReceipts(filter?: {
    userId?: string | undefined;
    paymentId?: string | undefined;
  }) {
    const query: Record<string, any> = {};
    if (filter?.userId) {
      query.userId = filter.userId.trim().toUpperCase();
    }
    if (filter?.paymentId) {
      query.paymentId = filter.paymentId.trim().toUpperCase();
    }

    const receipts = await MemberPaymentReceiptModel.find(query).sort({
      paymentDate: -1,
      createdAt: -1,
    });

    const userIds = Array.from(new Set(receipts.map((r) => r.userId)));
    const paymentIds = Array.from(new Set(receipts.map((r) => r.paymentId)));

    const [users, payments] = await Promise.all([
      UserModel.find({ userId: { $in: userIds } }),
      MemberPaymentModel.find({ paymentId: { $in: paymentIds } }),
    ]);

    const userMap = new Map(users.map((u) => [u.userId, u]));
    const paymentMap = new Map(payments.map((p) => [p.paymentId, p]));

    const assignmentIds = Array.from(
      new Set(
        payments
          .map((p) => p.assignmentId)
          .filter((id): id is string => typeof id === "string" && id.length > 0),
      ),
    );
    const assignments = await MemberAssignmentModel.find({
      assignmentId: { $in: assignmentIds },
    });
    const assignmentMap = new Map(
      assignments.map((a) => [a.assignmentId, a]),
    );

    const planIds = Array.from(
      new Set(
        assignments
          .map((a) => a.membershipPlanId)
          .filter((id): id is string => typeof id === "string" && id.length > 0),
      ),
    );
    const plans = await MembershipPlanModel.find({
      membershipPlanId: { $in: planIds },
    });
    const planMap = new Map(plans.map((p) => [p.membershipPlanId, p]));

    return receipts.map((rcpt: any) => {
      const r = rcpt.toObject ? rcpt.toObject() : rcpt;
      const user = userMap.get(r.userId);
      const payment = paymentMap.get(r.paymentId);
      const asgn = payment
        ? assignmentMap.get(payment.assignmentId)
        : null;
      const plan = asgn?.membershipPlanId
        ? planMap.get(asgn.membershipPlanId)
        : null;

      return {
        ...r,
        fullName: user?.fullName || "Member",
        email: user?.email || "",
        phoneNumber: user?.phone || "",
        profileImage: user?.profileImage || "",
        planName: plan?.planName || "Membership Subscription",
        assignmentId: payment?.assignmentId || null,
        totalAmount: payment?.totalAmount ?? null,
        amountDue: payment?.amountDue ?? null,
        paymentStatus: payment?.paymentStatus ?? null,
      };
    });
  }
}

export default new MemberService();

