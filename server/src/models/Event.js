const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    start: { type: Date, required: true },
    end: { type: Date },

    allDay: { type: Boolean, default: false },

    type: {
      type: String,
      enum: ["trainer", "member", "workout", "diet", "system"],
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
      enum: ["private", "role-based", "public"],
      default: "private",
    },

    allowedRoles: {
      type: [String],
      enum: ["admin", "trainer", "member"],
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
