const { Schema, model } = require("mongoose");

const workoutPlanSchema = new Schema(
  {
    workoutPlanName: { type: String, required: true },
    mondayWorkout: { type: String, required: true },
    tuesdayWorkout: { type: String, required: true },
    wednesdayWorkout: { type: String, required: true },
    thursdayWorkout: { type: String, required: true },
    fridayWorkout: { type: String, required: true },
    saturdayWorkout: { type: String, required: true },
    sundayWorkout: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = model("WorkoutPlan", workoutPlanSchema);
