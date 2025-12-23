const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: { type: String, enum: ["admin", "trainer", "staff"] },

    specialization: String,
    experienceYears: Number,
    salaryType: String,
    monthlySalary: Number,
    joiningDate: Date,
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
