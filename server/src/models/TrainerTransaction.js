const { Schema, model } = require("mongoose");

const TrainerTransactionSchema = new Schema(
  {
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    salaryRef: {
      type: Schema.Types.ObjectId,
      ref: "TrainerSalary", // link to monthly salary
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "creditcard", "debitcard", "banktransfer"],
      required: true,
    },

    transactionType: {
      type: String,
      enum: ["payment", "deduction", "bonus"],
      default: "payment",
    },

    note: {
      type: String,
      default: "",
    },

    paidOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model("TrainerTransaction", TrainerTransactionSchema);
