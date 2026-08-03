import mongoose, { type HydratedDocument } from "mongoose";

import type {
  CreateDietPlanInput,
  UpdateDietPlanInput,
} from "./diet-plan.validator.js";
import AppError from "../../shared/errors/AppError.js";
import { generateId } from "../../shared/utils/id-generator.js";
import DietPlanModel, { type DietPlan } from "./diet-plan.model.js";

class DietPlanService {
  // Create DietPlan
  public async createDietPlan(
    data: CreateDietPlanInput,
  ): Promise<HydratedDocument<DietPlan>> {
    const planNameTrimmed = data.planName.trim();

    const existingPlan = await DietPlanModel.findOne({
      planName: { $regex: new RegExp(`^${planNameTrimmed}$`, "i") },
    });

    if (existingPlan) {
      throw new AppError("Plan name's taken — try another one", 409);
    }

    const session: mongoose.ClientSession = await mongoose.startSession();

    try {
      session.startTransaction();
      const dietPlanId: string = await generateId("dietPlan");

      const [dietPlan] = await DietPlanModel.create(
        [
          {
            dietPlanId,
            planName: data.planName,
            goal: data.goal,
            ...(data.description ? { description: data.description } : {}),
            ...(data.monday ? { monday: data.monday } : {}),
            ...(data.tuesday ? { tuesday: data.tuesday } : {}),
            ...(data.wednesday ? { wednesday: data.wednesday } : {}),
            ...(data.thursday ? { thursday: data.thursday } : {}),
            ...(data.friday ? { friday: data.friday } : {}),
            ...(data.saturday ? { saturday: data.saturday } : {}),
            ...(data.sunday ? { sunday: data.sunday } : {}),
          },
        ],
        { session },
      );

      if (!dietPlan) {
        throw new AppError("Couldn't create diet plan — try again", 500);
      }

      await session.commitTransaction();

      return dietPlan;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  // Get All Diet Plans
  public async getAllDietPlans(
    filterActiveOnly = false,
  ): Promise<HydratedDocument<DietPlan>[]> {
    const query = filterActiveOnly ? { isActive: true } : {};
    return await DietPlanModel.find(query).sort({ createdAt: -1 });
  }

  // Get Diet Plan by Id
  public async getDietPlanbyId(
    planId: string,
  ): Promise<HydratedDocument<DietPlan>> {
    const plan = await DietPlanModel.findOne({
      $or: [
        { dietPlanId: planId },
        ...(mongoose.Types.ObjectId.isValid(planId) ? [{ _id: planId }] : []),
      ],
    });

    if (!plan) {
      throw new AppError("Diet plan not found", 404);
    }

    return plan;
  }

  // Update Diet Plan
  public async updateDietPlan(
    planId: string,
    data: UpdateDietPlanInput,
  ): Promise<HydratedDocument<DietPlan>> {
    const existingPlan = await this.getDietPlanbyId(planId);

    if (data.planName) {
      const newPlanNameTrimmed = data.planName.trim();
      if (
        newPlanNameTrimmed.toLowerCase() !== existingPlan.planName.toLowerCase()
      ) {
        const duplicate = await DietPlanModel.findOne({
          _id: { $ne: existingPlan._id },
          planName: { $regex: new RegExp(`^${newPlanNameTrimmed}$`, "i") },
        });

        if (duplicate) {
          throw new AppError("Plan name's taken — try another one", 409);
        }
      }
    }

    const updatedPlan = await DietPlanModel.findByIdAndUpdate(
      existingPlan._id,
      { $set: data },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedPlan) {
      throw new AppError("Failed to update diet plan", 500);
    }

    return updatedPlan;
  }

  // Delete (Deactivate) Diet Plan
  public async deleteDietPlan(
    planId: string,
  ): Promise<HydratedDocument<DietPlan>> {
    const plan = await DietPlanModel.findOneAndUpdate(
      {
        $or: [
          { dietPlanId: planId },
          ...(mongoose.Types.ObjectId.isValid(planId) ? [{ _id: planId }] : []),
        ],
      },
      { $set: { isActive: false } },
      { returnDocument: "after" },
    );

    if (!plan) {
      throw new AppError("Diet plan not found", 404);
    }

    return plan;
  }
}

export default new DietPlanService();
