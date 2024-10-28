const { Schema, model } = require("mongoose");

const PaymentHistorySchema = new Schema(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "MembershipPlan",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "creditcard", "debitcard", "banktransfer"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentHistory = model("PaymentHistory", PaymentHistorySchema);

module.exports = PaymentHistory;
