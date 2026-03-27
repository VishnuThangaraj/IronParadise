const mongoose = require("mongoose");

const TrainerSalarySchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    monthYear: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    totalPayable: {
      type: Number,
      default: 0,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partial"],
      default: "pending",
    },
    paidOn: {
      type: Date,
      default: null,
    },
    pendingAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TrainerSalary", TrainerSalarySchema);
