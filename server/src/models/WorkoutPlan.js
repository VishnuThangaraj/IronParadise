const mongoose = require("mongoose");

const WorkoutPlanSchema = new mongoose.Schema(
  {
    name: String,
    goal: String,
    level: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutPlan", WorkoutPlanSchema);
