const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userType: String,
    date: Date,
    checkIn: String,
    checkOut: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
