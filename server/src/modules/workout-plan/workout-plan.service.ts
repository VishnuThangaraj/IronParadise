import mongoose, { type HydratedDocument } from "mongoose";
import WorkoutPlanModel, { type WorkoutPlan } from "./workout-plan.model.js";
import type {
  CreateWorkoutPlanInput,
  UpdateWorkoutPlanInput,
} from "./workout-plan.validator.js";
import AppError from "../../shared/errors/AppError.js";
import { generateId } from "../../shared/utils/id-generator.js";

class WorkoutPlanService {
  // create workout plan
  public async createWorkoutPlan(
    data: CreateWorkoutPlanInput,
  ): Promise<HydratedDocument<WorkoutPlan>> {
    const planNameTrimmed = data.planName.trim();
    const escapedPlanName = planNameTrimmed.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    const existingPlan = await WorkoutPlanModel.findOne({
      planName: { $regex: new RegExp(`^${escapedPlanName}$`, "i") },
    });

    if (existingPlan) {
      throw new AppError("Plan name's taken — try another one", 409);
    }

    const session: mongoose.ClientSession = await mongoose.startSession();
    try {
      session.startTransaction();
      const workoutPlanId: string = await generateId("workoutPlan");

      const [workoutPlan] = await WorkoutPlanModel.create(
        [
          {
            workoutPlanId,
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

      if (!workoutPlan) {
        throw new AppError("Couldn't create workout plan — try again", 500);
      }

      await session.commitTransaction();

      return workoutPlan;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  // get all workout plans
  public async getAllWorkoutPlans(
    filterActiveOnly = false,
  ): Promise<HydratedDocument<WorkoutPlan>[]> {
    const query = filterActiveOnly ? { isActive: true } : {};
    return await WorkoutPlanModel.find(query).sort({ createdAt: -1 });
  }

  // get workout plan by id
  public async getWorkoutPlanById(
    planId: string,
  ): Promise<HydratedDocument<WorkoutPlan>> {
    const plan = await WorkoutPlanModel.findOne({
      $or: [
        { workoutPlanId: planId },
        ...(mongoose.Types.ObjectId.isValid(planId) ? [{ _id: planId }] : []),
      ],
    });

    if (!plan) {
      throw new AppError("Workout plan not found", 404);
    }

    return plan;
  }

  // update workout plan by id
  public async updateWorkoutPlanById(
    planId: string,
    data: UpdateWorkoutPlanInput,
  ): Promise<HydratedDocument<WorkoutPlan>> {
    const existingPlan = await this.getWorkoutPlanById(planId);

    if (data.planName) {
      const newPlanNameTrimmed = data.planName.trim();
      if (
        newPlanNameTrimmed.toLowerCase() !== existingPlan.planName.toLowerCase()
      ) {
        const escapedNewPlanName = newPlanNameTrimmed.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        const duplicate = await WorkoutPlanModel.findOne({
          _id: { $ne: existingPlan._id },
          planName: { $regex: new RegExp(`^${escapedNewPlanName}$`, "i") },
        });

        if (duplicate) {
          throw new AppError("Plan name's taken — try another one", 409);
        }
      }
    }

    const updatedPlan = await WorkoutPlanModel.findByIdAndUpdate(
      existingPlan._id,
      { $set: data },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedPlan) {
      throw new AppError("Failed to update workout plan", 500);
    }

    return updatedPlan;
  }

  // delete (deactivate) workout plan
  public async deleteWorkoutPlan(
    planId: string,
  ): Promise<HydratedDocument<WorkoutPlan>> {
    const plan = await WorkoutPlanModel.findOneAndUpdate(
      {
        $or: [
          { workoutPlanId: planId },
          ...(mongoose.Types.ObjectId.isValid(planId) ? [{ _id: planId }] : []),
        ],
      },
      { $set: { isActive: false } },
      { returnDocument: "after" },
    );

    if (!plan) {
      throw new AppError("Workout plan not found", 404);
    }

    return plan;
  }
}

export default new WorkoutPlanService();
