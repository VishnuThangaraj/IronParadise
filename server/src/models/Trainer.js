const { Schema, model } = require("mongoose");

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
  },
  {
    timestamps: true,
  }
);

trainerSchema.index({ email: 1 });

module.exports = model("Trainer", trainerSchema);
