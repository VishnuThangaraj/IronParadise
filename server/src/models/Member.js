const mongoose = require("mongoose");
const getNextId = require("../utils/getNextId");

const MemberSchema = new mongoose.Schema(
  {
    memberId: { type: String, unique: true },

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

MemberSchema.pre("save", function () {
  return getNextId("member").then((id) => {
    this.memberId = id;
  });
});

module.exports = mongoose.model("Member", MemberSchema);
