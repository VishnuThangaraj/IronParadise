const mongoose = require("mongoose");

const TrainerSalarySchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: String,
    salary: Number,
    deductions: Number,
    totalPayable: Number,
    paymentStatus: String,
    paidOn: Date,
    pendingAmount: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("TrainerSalary", TrainerSalarySchema);
