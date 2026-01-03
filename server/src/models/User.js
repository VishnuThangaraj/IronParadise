require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const getNextId = require("../utils/getNextId");

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },

    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "trainer", "staff"],
      required: true,
    },

    dob: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    height: Number,
    weight: Number,
    bmi: Number,

    aadharNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    panNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    specialization: String,
    experienceYears: Number,
    monthlySalary: Number,

    joiningDate: { type: Date, default: Date.now },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

UserSchema.pre("save", function () {
  if (this.userId) return;

  return getNextId(this.role).then((id) => {
    this.userId = id;
  });
});

UserSchema.pre("save", function () {
  if (!this.isModified("password")) return;

  return bcrypt
    .hash(this.password, Number(process.env.SALT_ROUNDS))
    .then((hash) => {
      this.password = hash;
    });
});

module.exports = mongoose.model("User", UserSchema);
