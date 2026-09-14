import mongoose, { type HydratedDocument } from "mongoose";

import AppError from "../../../shared/errors/AppError.js";
import type {
  CreateMemberAssignmentInput,
  UpdateMemberAssignmentInput,
} from "./member-assignment.validator.js";
import type { MemberAssignment } from "./member-assignment.model.js";
import MemberAssignmentModel from "./member-assignment.model.js";
import { generateId } from "../../../shared/utils/id-generator.js";

export type CreateMemberAssignmentData = CreateMemberAssignmentInput;
export type UpdateMemberAssignmentData = UpdateMemberAssignmentInput;

class MemberAssignmentService {
  // create member assignment
  public async createMemberAssignment(
    data: CreateMemberAssignmentData,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberAssignment>> {
    const userIdClean = data.userId.trim().toUpperCase();

    // Check if an active assignment already exists for this member
    const existingActive = await MemberAssignmentModel.findOne({
      userId: userIdClean,
      status: "ACTIVE",
    }).session(session || null);

    if (existingActive) {
      throw new AppError(
        "Active assignment already exists for this member",
        409,
      );
    }

    const assignmentId = data.assignmentId
      ? data.assignmentId.trim().toUpperCase()
      : await generateId("assignment");

    const existingId = await MemberAssignmentModel.findOne({
      assignmentId,
    }).session(session || null);

    if (existingId) {
      throw new AppError("Assignment ID already exists", 409);
    }

    const createOptions = session ? { session } : {};
    const [memberAssignment] = await MemberAssignmentModel.create(
      [
        {
          assignmentId,
          userId: userIdClean,
          ...(data.membershipPlanId
            ? { membershipPlanId: data.membershipPlanId.trim().toUpperCase() }
            : {}),
          ...(data.dietPlanId
            ? { dietPlanId: data.dietPlanId.trim().toUpperCase() }
            : {}),
          ...(data.workoutPlanId
            ? { workoutPlanId: data.workoutPlanId.trim().toUpperCase() }
            : {}),
          ...(data.trainerId
            ? { trainerId: data.trainerId.trim().toUpperCase() }
            : {}),
          ...(data.startDate ? { startDate: data.startDate } : {}),
          endDate: data.endDate,
          ...(data.status ? { status: data.status } : {}),
        },
      ],
      createOptions,
    );

    if (!memberAssignment) {
      throw new AppError("Couldn't create member assignment record", 500);
    }

    return memberAssignment;
  }

  // fetch all member assignments
  public async getAllMemberAssignments(
    status?: string,
  ): Promise<HydratedDocument<MemberAssignment>[]> {
    const query = status ? { status: status.trim().toUpperCase() } : {};
    return (await MemberAssignmentModel.find(query as any).sort({
      createdAt: -1,
    })) as any;
  }

  // fetch member assignment by assignmentId or _id
  public async getMemberAssignmentById(
    identifier: string,
  ): Promise<HydratedDocument<MemberAssignment>> {
    const cleanId = identifier.trim().toUpperCase();

    const memberAssignment = await MemberAssignmentModel.findOne({
      $or: [
        { assignmentId: cleanId },
        ...(mongoose.Types.ObjectId.isValid(identifier)
          ? [{ _id: identifier }]
          : []),
      ],
    });

    if (!memberAssignment) {
      throw new AppError("Member assignment not found", 404);
    }

    return memberAssignment;
  }

  // fetch all assignments for a specific user
  public async getMemberAssignmentsByUserId(
    userId: string,
  ): Promise<HydratedDocument<MemberAssignment>[]> {
    const userIdClean = userId.trim().toUpperCase();
    return await MemberAssignmentModel.find({ userId: userIdClean }).sort({
      createdAt: -1,
    });
  }

  // fetch current active assignment for a user
  public async getActiveMemberAssignmentByUserId(
    userId: string,
  ): Promise<HydratedDocument<MemberAssignment> | null> {
    const userIdClean = userId.trim().toUpperCase();
    return await MemberAssignmentModel.findOne({
      userId: userIdClean,
      status: "ACTIVE",
    }).sort({ createdAt: -1 });
  }

  // update member assignment
  public async updateMemberAssignment(
    identifier: string,
    data: UpdateMemberAssignmentData,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberAssignment>> {
    const existingAssignment = await this.getMemberAssignmentById(identifier);

    const updateData: Record<string, any> = { ...data };
    if (updateData.assignmentId) {
      updateData.assignmentId = updateData.assignmentId.trim().toUpperCase();
    }
    if (updateData.userId) {
      updateData.userId = updateData.userId.trim().toUpperCase();
    }
    if (updateData.membershipPlanId) {
      updateData.membershipPlanId =
        updateData.membershipPlanId.trim().toUpperCase();
    }
    if (updateData.dietPlanId) {
      updateData.dietPlanId = updateData.dietPlanId.trim().toUpperCase();
    }
    if (updateData.workoutPlanId) {
      updateData.workoutPlanId = updateData.workoutPlanId.trim().toUpperCase();
    }
    if (updateData.trainerId) {
      updateData.trainerId = updateData.trainerId.trim().toUpperCase();
    }
    if (updateData.status) {
      updateData.status = updateData.status.trim().toUpperCase();
    }

    const updateOptions = {
      returnDocument: "after" as const,
      runValidators: true,
      ...(session ? { session } : {}),
    };

    const updatedAssignment = await MemberAssignmentModel.findByIdAndUpdate(
      existingAssignment._id,
      { $set: updateData },
      updateOptions,
    );

    if (!updatedAssignment) {
      throw new AppError("Failed to update member assignment", 500);
    }

    return updatedAssignment;
  }

  // delete member assignment (soft delete - sets status to CANCELLED)
  public async deleteMemberAssignment(
    identifier: string,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberAssignment>> {
    const existingAssignment = await this.getMemberAssignmentById(identifier);

    const updateOptions = {
      returnDocument: "after" as const,
      runValidators: true,
      ...(session ? { session } : {}),
    };

    const cancelledAssignment = await MemberAssignmentModel.findByIdAndUpdate(
      existingAssignment._id,
      { $set: { status: "CANCELLED" } },
      updateOptions,
    );

    if (!cancelledAssignment) {
      throw new AppError("Member assignment not found", 404);
    }

    return cancelledAssignment;
  }

  // hard delete member assignment (completely from db)
  public async hardDeleteMemberAssignment(
    identifier: string,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<MemberAssignment>> {
    const existingAssignment = await this.getMemberAssignmentById(identifier);
    const deleteOptions = session ? { session } : {};

    const deletedAssignment = await MemberAssignmentModel.findByIdAndDelete(
      existingAssignment._id,
      deleteOptions,
    );

    if (!deletedAssignment) {
      throw new AppError("Member assignment not found", 404);
    }

    return deletedAssignment;
  }
}

export default new MemberAssignmentService();
