const { Schema, model } = require("mongoose");

const PaymentHistorySchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: true,
    },
    planName: {
      type: String,
      required: true,
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
