const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    durationMonths: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, default: "inactive" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Membership", MembershipSchema);
