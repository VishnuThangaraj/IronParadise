const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    start: { type: Date, required: true },
    end: { type: Date },

    allDay: { type: Boolean, default: false },

    type: {
      type: String,
      enum: ["Trainer", "Member", "Workout", "Diet", "System"],
      required: true,
    },

    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },

    visibility: {
      type: String,
      enum: ["Private", "Role-based", "Public"],
      default: "Private",
    },

    allowedRoles: {
      type: [String],
      enum: ["Admin", "Trainer", "Member"],
      default: [],
    },

    color: String,
    metadata: Object,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", EventSchema);
