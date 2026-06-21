const { Schema, model } = require("mongoose");

const subscriptionSchema = new Schema(
  {
    membershipPlan: {
      type: Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    planDuration: {
      type: Number,
      required: true,
    },
    planCost: {
      type: Number,
      required: true,
    },
    pending: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const memberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    height: {
      type: Number,
      min: 0,
    },
    weight: {
      type: Number,
      min: 0,
    },
    bmi: {
      type: Number,
      min: 0,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      default: "member",
    },
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    dietPlan: {
      type: Schema.Types.ObjectId,
      ref: "DietPlan",
      required: true,
    },
    subscription: {
      type: subscriptionSchema,
    },
    workoutPlan: {
      type: Schema.Types.ObjectId,
      ref: "WorkoutPlan",
      required: true,
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
  },
  {
    timestamps: true,
  }
);

memberSchema.index({ email: 1 });

module.exports = model("Member", memberSchema);
