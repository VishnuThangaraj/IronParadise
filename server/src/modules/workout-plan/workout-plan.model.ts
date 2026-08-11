import { Schema, model, type InferSchemaType } from "mongoose";

const workoutExerciseSchema = new Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, default: null },
    reps: { type: String, default: null },
    rest: { type: String, default: null },
    notes: { type: String, default: null },
  },
  { _id: false },
);

const dayWorkoutSchema = new Schema(
  {
    focus: { type: String, required: true },
    exercises: { type: [workoutExerciseSchema], default: [] },
  },
  { _id: false },
);

const workoutPlanSchema = new Schema(
  {
    workoutPlanId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    planName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    goal: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    monday: { type: dayWorkoutSchema, default: null },
    tuesday: { type: dayWorkoutSchema, default: null },
    wednesday: { type: dayWorkoutSchema, default: null },
    thursday: { type: dayWorkoutSchema, default: null },
    friday: { type: dayWorkoutSchema, default: null },
    saturday: { type: dayWorkoutSchema, default: null },
    sunday: { type: dayWorkoutSchema, default: null },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type WorkoutPlan = InferSchemaType<typeof workoutPlanSchema>;

const WorkoutPlanModel = model<WorkoutPlan>("WorkoutPlan", workoutPlanSchema);

export default WorkoutPlanModel;
