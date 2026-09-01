import mongoose from "mongoose";
import connectDB from "../config/database.js";
import MembershipPlanModel from "../modules/membership-plan/membership-plan.model.js";
import DietPlanModel from "../modules/diet-plan/diet-plan.model.js";
import CounterModel from "../shared/models/counter.model.js";
import { membershipPlans } from "./data/membership-plan.js";
import { dietPlans } from "./data/diet-plan.js";

/**
 * Synchronizes the sequence counter for a given collection prefix.
 */
async function syncCounterSequence(
  counterId: string,
  data: Array<Record<string, any>>,
  idKey: string,
): Promise<number> {
  let maxSequence = 0;

  for (const item of data) {
    const idVal = item[idKey];
    if (typeof idVal === "string") {
      const match = idVal.match(/\d+$/);
      if (match) {
        const sequenceNum = parseInt(match[0], 10);
        if (sequenceNum > maxSequence) {
          maxSequence = sequenceNum;
        }
      }
    }
  }

  if (maxSequence > 0) {
    await CounterModel.findByIdAndUpdate(
      counterId,
      { $set: { sequence: maxSequence } },
      { upsert: true, returnDocument: "after" },
    );
  }

  return maxSequence;
}

/**
 * Seeds membership plans and updates the corresponding auto-increment counter.
 */
async function seedMembershipPlans(): Promise<void> {
  console.log(`[INFO] Seeding Membership Plans (${membershipPlans.length} records)...`);

  await MembershipPlanModel.deleteMany({});
  console.log("[INFO] Cleared existing Membership Plans collection.");

  await MembershipPlanModel.insertMany(membershipPlans);
  console.log(`[SUCCESS] Inserted ${membershipPlans.length} Membership Plans.`);

  const maxSeq = await syncCounterSequence("membershipPlan", membershipPlans, "membershipPlanId");
  const nextId = `MPL-${String(maxSeq + 1).padStart(3, "0")}`;
  console.log(`[INFO] Synchronized counter 'membershipPlan' to sequence ${maxSeq}. Next ID: ${nextId}`);
}

/**
 * Seeds diet plans and updates the corresponding auto-increment counter.
 */
async function seedDietPlans(): Promise<void> {
  console.log(`[INFO] Seeding Diet Plans (${dietPlans.length} records)...`);

  await DietPlanModel.deleteMany({});
  console.log("[INFO] Cleared existing Diet Plans collection.");

  await DietPlanModel.insertMany(dietPlans);
  console.log(`[SUCCESS] Inserted ${dietPlans.length} Diet Plans.`);

  const maxSeq = await syncCounterSequence("dietPlan", dietPlans, "dietPlanId");
  const nextId = `DPL-${String(maxSeq + 1).padStart(3, "0")}`;
  console.log(`[INFO] Synchronized counter 'dietPlan' to sequence ${maxSeq}. Next ID: ${nextId}`);
}

/**
 * Primary seed runner.
 */
async function runSeed(): Promise<void> {
  const startTime = Date.now();
  console.log("[INFO] Initiating database seeding process...");

  try {
    await connectDB();

    await seedMembershipPlans();
    await seedDietPlans();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[SUCCESS] Database seeding completed successfully in ${duration}s.`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] Database seeding failed: ${message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("[INFO] Database connection closed.");
    process.exit(0);
  }
}

runSeed();