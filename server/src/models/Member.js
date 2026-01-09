const mongoose = require("mongoose");
const getNextId = require("../utils/getNextId");

const MemberSchema = new mongoose.Schema(
  {
    memberId: { type: String, unique: true, trim: true },

    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    height: Number,
    weight: Number,
    bmi: Number,
    dob: { type: Date, required: true },
    address: {
      type: String,
      trim: true,
    },

    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: { type: String, default: "inactive" },
  },
  { timestamps: true }
);

MemberSchema.pre("save", function () {
  return getNextId("member").then((id) => {
    this.memberId = id;
  });
});

module.exports = mongoose.model("Member", MemberSchema);
