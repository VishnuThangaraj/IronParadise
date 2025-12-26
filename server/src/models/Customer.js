const mongoose = require("mongoose");
const getNextId = require("../utils/getNextId");

const CustomerSchema = new mongoose.Schema(
  {
    customerId: { type: String, unique: true }, // CST-001

    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, unique: true, required: true },
    gender: String,
    dob: Date,
    city: String,
    state: String,

    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // role = trainer
    },

    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

CustomerSchema.pre("save", async function (next) {
  if (!this.customerId) {
    this.customerId = await getNextId("customer");
  }
  next();
});

module.exports = mongoose.model("Customer", CustomerSchema);
