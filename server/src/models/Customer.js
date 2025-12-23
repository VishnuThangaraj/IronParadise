const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: { type: String, unique: true },
    gender: String,
    dob: Date,
    city: String,
    state: String,

    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
