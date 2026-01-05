const mongoose = require("mongoose");

const MemberFitnessPlanSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    workoutPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
    },
    dietPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DietPlan",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("MemberFitnessPlan", MemberFitnessPlanSchema);
