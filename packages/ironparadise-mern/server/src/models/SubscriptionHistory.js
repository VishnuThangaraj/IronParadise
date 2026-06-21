const { Schema, model } = require("mongoose");

const subscriptionHistorySchema = new Schema(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("SubscriptionHistory", subscriptionHistorySchema);
