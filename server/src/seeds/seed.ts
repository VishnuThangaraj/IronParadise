import mongoose from "mongoose";
import connectDB from "../config/database.js";
import MembershipPlanModel from "../modules/membership-plan/membership-plan.model.js";
import CounterModel from "../shared/models/counter.model.js";
import { membershipPlans } from "./data/membership-plan.js";

/**
 * Synchronizes the sequence counter for a given collection prefix.
 */
async function syncCounterSequence(
  counterId: string,
  data: Array<{ membershipPlanId: string }>,
): Promise<number> {
  let maxSequence = 0;

  for (const item of data) {
    const match = item.membershipPlanId.match(/\d+$/);
    if (match) {
      const sequenceNum = parseInt(match[0], 10);
      if (sequenceNum > maxSequence) {
        maxSequence = sequenceNum;
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

  const maxSeq = await syncCounterSequence("membershipPlan", membershipPlans);
  const nextId = `MPL-${String(maxSeq + 1).padStart(3, "0")}`;
  console.log(`[INFO] Synchronized counter 'membershipPlan' to sequence ${maxSeq}. Next ID: ${nextId}`);
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