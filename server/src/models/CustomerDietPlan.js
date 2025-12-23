const mongoose = require("mongoose");

const CustomerDietPlanSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
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

module.exports = mongoose.model("CustomerDietPlan", CustomerDietPlanSchema);
