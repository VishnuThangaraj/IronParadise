import mongoose, { type HydratedDocument } from "mongoose";

import MembershipPlanModel, {
  type MembershipPlan,
} from "./membership-plan.model.js";
import type {
  CreateMembershipPlanInput,
  UpdateMembershipPlanInput,
} from "./membership-plan.validator.js";
import AppError from "../../shared/errors/AppError.js";
import { generateId } from "../../shared/utils/id-generator.js";

class MembershipPlanService {
  // Create Membership Plan
  public async createMembershipPlan(
    data: CreateMembershipPlanInput,
  ): Promise<HydratedDocument<MembershipPlan>> {
    const planNameTrimmed = data.planName.trim();
    const escapedPlanName = planNameTrimmed.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    const existingPlan = await MembershipPlanModel.findOne({
      planName: { $regex: new RegExp(`^${escapedPlanName}$`, "i") },
    });

    if (existingPlan) {
      throw new AppError("Plan name's taken — try another one", 409);
    }

    const session: mongoose.ClientSession = await mongoose.startSession();
    try {
      session.startTransaction();
      const membershipPlanId: string = await generateId("membershipPlan");

      const [membershipPlan] = await MembershipPlanModel.create(
        [
          {
            membershipPlanId,
            planName: data.planName,
            durationMonths: data.durationMonths,
            price: data.price,
            ...(data.features ? { features: data.features } : {}),
          },
        ],
        { session },
      );

      if (!membershipPlan) {
        throw new AppError("Couldn't create membership — try again", 500);
      }

      await session.commitTransaction();

      return membershipPlan;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  // Get All Membership Plans
  public async getAllMembershipPlans(
    filterActiveOnly = false,
  ): Promise<HydratedDocument<MembershipPlan>[]> {
    const query = filterActiveOnly ? { isActive: true } : {};
    return MembershipPlanModel.find(query).sort({ createdAt: -1 });
  }

  // Get Membership Plan By ID
  public async getMembershipPlanById(
    planId: string,
  ): Promise<HydratedDocument<MembershipPlan>> {
    const plan = await MembershipPlanModel.findOne({
      $or: [
        { membershipPlanId: planId },
        ...(mongoose.Types.ObjectId.isValid(planId) ? [{ _id: planId }] : []),
      ],
    });

    if (!plan) {
      throw new AppError("Membership plan not found", 404);
    }

    return plan;
  }

  // Update Membership Plan
  public async updateMembershipPlan(
    planId: string,
    data: UpdateMembershipPlanInput,
  ): Promise<HydratedDocument<MembershipPlan>> {
    const existingPlan = await this.getMembershipPlanById(planId);

    if (data.planName) {
      const newPlanNameTrimmed = data.planName.trim();
      if (
        newPlanNameTrimmed.toLowerCase() !== existingPlan.planName.toLowerCase()
      ) {
        const escapedNewPlanName = newPlanNameTrimmed.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        const duplicate = await MembershipPlanModel.findOne({
          _id: { $ne: existingPlan._id },
          planName: { $regex: new RegExp(`^${escapedNewPlanName}$`, "i") },
        });

        if (duplicate) {
          throw new AppError("Plan name's taken — try another one", 409);
        }
      }
    }

    const updatedPlan = await MembershipPlanModel.findByIdAndUpdate(
      existingPlan._id,
      { $set: data },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedPlan) {
      throw new AppError("Failed to update membership plan", 500);
    }

    return updatedPlan;
  }

  // Delete (Deactivate) Membership Plan
  public async deleteMembershipPlan(
    planId: string,
  ): Promise<HydratedDocument<MembershipPlan>> {
    const plan = await MembershipPlanModel.findOneAndUpdate(
      {
        $or: [
          { membershipPlanId: planId },
          ...(mongoose.Types.ObjectId.isValid(planId) ? [{ _id: planId }] : []),
        ],
      },
      { $set: { isActive: false } },
      { returnDocument: "after" },
    );

    if (!plan) {
      throw new AppError("Membership plan not found", 404);
    }

    return plan;
  }

  // Delete Membership Plan Permanently (Hard Delete)
  public async deleteMembershipPlanPermanently(
    planId: string,
  ): Promise<HydratedDocument<MembershipPlan>> {
    const plan = await MembershipPlanModel.findOneAndDelete({
      $or: [
        { membershipPlanId: planId },
        ...(mongoose.Types.ObjectId.isValid(planId) ? [{ _id: planId }] : []),
      ],
    });

    if (!plan) {
      throw new AppError("Membership plan not found", 404);
    }

    return plan;
  }
}

export default new MembershipPlanService();

