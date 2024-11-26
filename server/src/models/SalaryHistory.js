const { Schema, model } = require("mongoose");

const SalaryHistorySchema = new Schema(
  {
    trainer: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    pending: {
      type: Number,
      required: true,
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

const SalaryHistory = model("SalaryHistory", SalaryHistorySchema);

module.exports = SalaryHistory;
