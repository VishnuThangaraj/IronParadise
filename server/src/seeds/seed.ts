import mongoose from "mongoose";
import connectDB from "../config/database.js";
import MembershipPlanModel from "../modules/membership-plan/membership-plan.model.js";
import DietPlanModel from "../modules/diet-plan/diet-plan.model.js";
import WorkoutPlanModel from "../modules/workout-plan/workout-plan.model.js";
import UserModel from "../modules/user/user.model.js";
import TrainerDetailsModel from "../modules/trainer/trainer-details/trainer-details.model.js";
import TrainerPaymentModel from "../modules/trainer/trainer-payment/trainer-payment.model.js";
import MemberAssignmentModel from "../modules/member/member-assignment/member-assignment.model.js";
import MemberMeasurementModel from "../modules/member/member-measurement/member-measurement.model.js";
import CredentialModel from "../shared/models/credential.model.js";
import CounterModel from "../shared/models/counter.model.js";
import { hashPassword } from "../shared/utils/password.js";
import { membershipPlans } from "./data/membership-plan.js";
import { dietPlans } from "./data/diet-plan.js";
import { workoutPlans } from "./data/workout-plan.js";
import { trainers } from "./data/trainer.js";
import { members } from "./data/member.js";
import { memberAssignments } from "./data/member-assignment.js";
import { memberMeasurements } from "./data/member-measurement.js";

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
 * Seeds workout plans and updates the corresponding auto-increment counter.
 */
async function seedWorkoutPlans(): Promise<void> {
  console.log(`[INFO] Seeding Workout Plans (${workoutPlans.length} records)...`);

  await WorkoutPlanModel.deleteMany({});
  console.log("[INFO] Cleared existing Workout Plans collection.");

  await WorkoutPlanModel.insertMany(workoutPlans);
  console.log(`[SUCCESS] Inserted ${workoutPlans.length} Workout Plans.`);

  const maxSeq = await syncCounterSequence("workoutPlan", workoutPlans, "workoutPlanId");
  const nextId = `WPL-${String(maxSeq + 1).padStart(3, "0")}`;
  console.log(`[INFO] Synchronized counter 'workoutPlan' to sequence ${maxSeq}. Next ID: ${nextId}`);
}

/**
 * Seeds trainers (users, details, payments, and credentials) and updates the trainer counter.
 */
async function seedTrainers(): Promise<void> {
  console.log(`[INFO] Seeding Trainers (${trainers.length} records)...`);

  await UserModel.deleteMany({ role: "trainer" });
  await TrainerDetailsModel.deleteMany({});
  await TrainerPaymentModel.deleteMany({});
  await CredentialModel.deleteMany({ userType: "trainer" });
  console.log("[INFO] Cleared existing Trainer-related collections.");

  const defaultPasswordHash = await hashPassword("Password@123");

  const userDocs = [];
  const detailDocs = [];
  const paymentDocs = [];
  const credentialDocs = [];

  for (const trn of trainers) {
    userDocs.push({
      userId: trn.userId,
      fullName: trn.fullName,
      email: trn.email.toLowerCase().trim(),
      phone: trn.phone,
      gender: trn.gender,
      dob: trn.dob ? new Date(trn.dob) : undefined,
      address: trn.address,
      profileImage: trn.profileImage,
      emergencyContact: trn.emergencyContact,
      role: "trainer" as const,
      permissions: ["trainers", "members", "dietplans", "workoutplans"],
      isActive: trn.isActive ?? true,
    });

    detailDocs.push({
      userId: trn.userId,
      qualification: trn.qualification,
      experienceYears: trn.experienceYears ?? 0,
      specialization: trn.specialization ?? ["General"],
      shiftTime: trn.shiftTime,
      joinDate: trn.joinDate ? new Date(trn.joinDate) : new Date(),
      employmentStatus: (trn.employmentStatus ?? "active") as "active" | "inactive" | "on_leave" | "terminated",
    });

    paymentDocs.push({
      userId: trn.userId,
      salary: trn.salary,
      amountDue: 0,
      amountPaid: trn.salary,
      paymentStatus: "PAID" as const,
    });

    credentialDocs.push({
      userId: trn.userId,
      userType: "trainer" as const,
      passwordHash: defaultPasswordHash,
    });
  }

  await UserModel.insertMany(userDocs);
  await TrainerDetailsModel.insertMany(detailDocs);
  await TrainerPaymentModel.insertMany(paymentDocs);
  await CredentialModel.insertMany(credentialDocs);
  console.log(`[SUCCESS] Inserted ${trainers.length} Trainers (Users, Details, Payments, Credentials).`);

  const maxSeq = await syncCounterSequence("trainer", trainers, "userId");
  const nextId = `TRN-${String(maxSeq + 1).padStart(3, "0")}`;
  console.log(`[INFO] Synchronized counter 'trainer' to sequence ${maxSeq}. Next ID: ${nextId}`);
}

/**
 * Seeds members (users, assignments, and credentials) and updates member & assignment counters.
 */
async function seedMembers(): Promise<void> {
  console.log(`[INFO] Seeding Members (${members.length} records)...`);

  await UserModel.deleteMany({ role: "member" });
  await MemberAssignmentModel.deleteMany({});
  await CredentialModel.deleteMany({ userType: "member" });
  console.log("[INFO] Cleared existing Member-related collections.");

  const defaultPasswordHash = await hashPassword("Password@123");

  const userDocs = [];
  const credentialDocs = [];

  for (const mbr of members) {
    userDocs.push({
      userId: mbr.userId,
      fullName: mbr.fullName,
      email: mbr.email.toLowerCase().trim(),
      phone: mbr.phone,
      gender: mbr.gender,
      dob: mbr.dob ? new Date(mbr.dob) : undefined,
      address: mbr.address,
      profileImage: mbr.profileImage,
      emergencyContact: mbr.emergencyContact,
      role: "member" as const,
      permissions: mbr.permissions ?? ["members", "dietplans", "workoutplans"],
      isActive: mbr.isActive ?? true,
    });

    credentialDocs.push({
      userId: mbr.userId,
      userType: "member" as const,
      passwordHash: defaultPasswordHash,
    });
  }

  const assignmentDocs = memberAssignments.map((asgn) => ({
    assignmentId: asgn.assignmentId,
    userId: asgn.userId,
    membershipPlanId: asgn.membershipPlanId ?? null,
    dietPlanId: asgn.dietPlanId ?? null,
    workoutPlanId: asgn.workoutPlanId ?? null,
    trainerId: asgn.trainerId ?? null,
    startDate: asgn.startDate ? new Date(asgn.startDate) : new Date(),
    endDate: asgn.endDate ? new Date(asgn.endDate) : new Date(),
    status: (asgn.status ?? "ACTIVE") as "ACTIVE" | "EXPIRED" | "CANCELLED",
  }));

  await UserModel.insertMany(userDocs);
  if (assignmentDocs.length > 0) {
    await MemberAssignmentModel.insertMany(assignmentDocs);
  }
  await CredentialModel.insertMany(credentialDocs);

  console.log(
    `[SUCCESS] Inserted ${members.length} Members and ${assignmentDocs.length} Member Assignments.`,
  );

  const maxMemberSeq = await syncCounterSequence("member", members, "userId");
  const nextMemberId = `MBR-${String(maxMemberSeq + 1).padStart(3, "0")}`;
  console.log(`[INFO] Synchronized counter 'member' to sequence ${maxMemberSeq}. Next ID: ${nextMemberId}`);

  if (assignmentDocs.length > 0) {
    const maxAssignmentSeq = await syncCounterSequence("assignment", assignmentDocs, "assignmentId");
    const nextAssignmentId = `MAS-${String(maxAssignmentSeq + 1).padStart(3, "0")}`;
    console.log(`[INFO] Synchronized counter 'assignment' to sequence ${maxAssignmentSeq}. Next ID: ${nextAssignmentId}`);
  }
}

/**
 * Seeds member measurements (20 records per member).
 */
async function seedMemberMeasurements(): Promise<void> {
  console.log(`[INFO] Seeding Member Measurements (${memberMeasurements.length} records)...`);

  await MemberMeasurementModel.deleteMany({});
  console.log("[INFO] Cleared existing Member Measurements collection.");

  const measurementDocs = memberMeasurements.map((m) => ({
    userId: m.userId,
    recordedDate: new Date(m.recordedDate),
    height: m.height,
    weight: m.weight,
    bmi: m.bmi,
    bodyFat: m.bodyFat,
    muscleMass: m.muscleMass,
    notes: m.notes,
  }));

  await MemberMeasurementModel.insertMany(measurementDocs);
  console.log(
    `[SUCCESS] Inserted ${measurementDocs.length} Member Measurements (${measurementDocs.length / members.length} per user).`,
  );
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
    await seedWorkoutPlans();
    await seedTrainers();
    await seedMembers();
    await seedMemberMeasurements();

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