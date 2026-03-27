const { Schema, model } = require("mongoose");
const getNextId = require("../utils/getNextId");

const TrainerTransactionSchema = new Schema(
  {
    transactionId: {
      type: String,
      unique: true,
    },

    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    salaryRef: {
      type: Schema.Types.ObjectId,
      ref: "TrainerSalary",
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

TrainerTransactionSchema.pre("save", async function () {
  if (this.isNew) {
    this.transactionId = await getNextId("transaction");
  }
});

module.exports = model("TrainerTransaction", TrainerTransactionSchema);
