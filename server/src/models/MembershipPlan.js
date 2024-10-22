const { Schema, model } = require("mongoose");

const MembershipPlanSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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

const MembershipPlan = model("MembershipPlan", MembershipPlanSchema);
module.exports = MembershipPlan;
