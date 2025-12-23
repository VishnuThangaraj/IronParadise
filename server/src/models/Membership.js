const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true,
    },
    startDate: Date,
    endDate: Date,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", MembershipSchema);
