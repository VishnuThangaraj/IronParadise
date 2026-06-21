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
    dueAmount: {
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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    remarks: {
      type: String,
      default: "----",
    },
  },
  {
    timestamps: true,
  }
);

const PaymentHistory = model("PaymentHistory", PaymentHistorySchema);

module.exports = PaymentHistory;
