const User = require("../models/User");
const Member = require("../models/Member");
const Attendance = require("../models/Attendance");

// Fetch All Attendance
const fetchAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find();

    res.status(200).json(attendances);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Create Attendance
const registerAttendance = async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ message: "userId and role are required" });
  }

  try {
    const roleMap = {
      trainer: { model: User, field: "userId", userType: "User" },
      member: { model: Member, field: "memberId", userType: "Member" },
    };

    const config = roleMap[role];
    if (!config) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    const person = await config.model
      .findOne({ [config.field]: userId })
      .select("_id")
      .lean();

    if (!person) {
      return res.status(404).json({ message: `${role} not found` });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const now = new Date();

    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

    let attendance = await Attendance.findOne({
      user: person._id,
      userType: config.userType,
      date: today,
    });

    if (!attendance) {
      attendance = await Attendance.create({
        user: person._id,
        userType: config.userType,
        date: today,
        sessions: [{ checkIn: currentTime }],
      });

      return res.status(201).json({
        message: "Check-in successful (first session)",
        action: "login",
        attendance,
      });
    }

    const lastSession = attendance.sessions.at(-1); // cleaner

    //  CHECK-OUT
    if (lastSession && !lastSession.checkOut) {
      lastSession.checkOut = currentTime;
      await attendance.save();

      return res.status(200).json({
        message: "Check-out successful",
        action: "logout",
        attendance,
      });
    }

    //  NEW CHECK-IN SESSION
    attendance.sessions.push({ checkIn: currentTime });
    await attendance.save();

    return res.status(200).json({
      message: "New check-in session started",
      action: "login",
      attendance,
    });
  } catch (err) {
    console.error("Attendance error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch Monthly Attendance
const fetchMonthlyAttendance = async (req, res) => {
  const { month } = req.params.id;
  try {
    const [year, month] = month.split("-").map(Number);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  fetchAllAttendances,
  registerAttendance,
  fetchMonthlyAttendance,
};
