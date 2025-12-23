const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["membership", "salary"] },
    amount: Number,
    paymentMethod: String,

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    referenceId: mongoose.Schema.Types.ObjectId,
    status: String,
    remarks: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
