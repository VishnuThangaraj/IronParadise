const mongoose = require("mongoose");
const getNextId = require("../utils/getNextId");

const CustomerSchema = new mongoose.Schema(
  {
    customerId: { type: String, unique: true }, // CST-001

    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    gender: String,
    dob: Date,
    city: String,
    state: String,

    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

CustomerSchema.pre("save", function () {
  if (this.customerId) return;

  return getNextId(this.role).then((id) => {
    this.customerId = id;
  });
});

module.exports = mongoose.model("Customer", CustomerSchema);
