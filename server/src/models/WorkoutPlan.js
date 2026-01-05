const { Schema, model } = require("mongoose");
const getNextId = require("../utils/getNextId");

const workoutPlanSchema = new Schema(
  {
    workoutPlanId: {
      type: String,
      unique: true,
      trim: true,
    },

    workoutPlanName: {
      type: String,
      required: true,
      trim: true,
    },

    goal: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    mondayWorkout: {
      type: [String],
      required: true,
    },
    tuesdayWorkout: {
      type: [String],
      required: true,
    },
    wednesdayWorkout: {
      type: [String],
      required: true,
    },
    thursdayWorkout: {
      type: [String],
      required: true,
    },
    fridayWorkout: {
      type: [String],
      required: true,
    },
    saturdayWorkout: {
      type: [String],
      required: true,
    },
    sundayWorkout: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

workoutPlanSchema.pre("save", function () {
  return getNextId("workout").then((id) => {
    this.workoutPlanId = id;
  });
});

module.exports = model("WorkoutPlan", workoutPlanSchema);
