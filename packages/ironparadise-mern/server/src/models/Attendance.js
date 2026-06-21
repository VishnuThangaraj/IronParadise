const { Schema, model } = require("mongoose");

const attendanceSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["trainer", "member"],
      required: true,
    },
    action: {
      type: String,
      enum: ["login", "logout"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Attendance", attendanceSchema);
