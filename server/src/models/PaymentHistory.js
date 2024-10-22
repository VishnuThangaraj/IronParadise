const mongoose = require("mongoose");

const PaymentHistorySchema = new mongoose.Schema(
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
    membershipPlan: {
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

const PaymentHistory = mongoose.model("PaymentHistory", PaymentHistorySchema);
module.exports = PaymentHistory;
