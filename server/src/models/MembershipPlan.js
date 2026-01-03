const mongoose = require("mongoose");

const MembershipPlanSchema = new mongoose.Schema(
  {
    membershipPlanId: { type: String, unique: true },
    name: String,
    durationMonths: Number,
    price: Number,
    features: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

MembershipPlanSchema.pre("save", function () {
  return getNextId("membershipplan").then((id) => {
    this.membershipPlanId = id;
  });
});

module.exports = mongoose.model("MembershipPlan", MembershipPlanSchema);
