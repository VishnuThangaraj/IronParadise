const mongoose = require("mongoose");

const DietPlanSchema = new mongoose.Schema(
  {
    name: String,
    goal: String,
    description: String,
    calories: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DietPlan", DietPlanSchema);
