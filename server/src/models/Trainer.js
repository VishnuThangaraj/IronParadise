const { Schema, model } = require("mongoose");

const trainerPaylist = new Schema(
  {
    pending: {
      type: Number,
      required: true,
    },
    paymentMonth: {
      type: String,
      required: true,
    },
    paymentYear: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const trainerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    specialization: {
      type: String,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },
    weight: {
      type: Number,
      required: false,
    },
    aadharNumber: {
      type: String,
      required: true,
      unique: true,
    },
    panNumber: {
      type: String,
      required: true,
      unique: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    bmi: {
      type: Number,
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "trainer",
    },
    payroll: {
      type: trainerPaylist,
    },
  },
  {
    timestamps: true,
  }
);

trainerSchema.index({ email: 1 });

module.exports = model("Trainer", trainerSchema);
