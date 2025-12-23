const mongoose = require("mongoose");

const MembershipPlanSchema = new mongoose.Schema(
  {
    name: String,
    durationMonths: Number,
    price: Number,
    features: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MembershipPlan", MembershipPlanSchema);
