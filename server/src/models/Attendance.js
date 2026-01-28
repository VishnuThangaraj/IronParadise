const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userType",
    },
    userType: {
      type: String,
      required: true,
      enum: ["User", "Member"],
    },
    date: {
      type: Date,
      required: true,
    },

    sessions: [
      {
        checkIn: String,
        checkOut: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
