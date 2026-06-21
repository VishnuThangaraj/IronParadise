const { Schema, model } = require("mongoose");

const MembershipPlanSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    planId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

MembershipPlanSchema.index({ planId: 1 });

const MembershipPlan = model("MembershipPlan", MembershipPlanSchema);
module.exports = MembershipPlan;
