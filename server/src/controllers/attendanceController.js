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

  try {
    let person, userType;

    if (role === "trainer") {
      person = await User.findOne({ userId: userId });
      userType = "User";
    } else if (role === "member") {
      person = await Member.findOne({ memberId: userId });
      userType = "Member";
    } else {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    if (!person) {
      return res.status(404).json({ message: `${role} not found` });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      user: person._id,
      userType,
      date: today,
    });

    const now = new Date();
    const currentTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!attendance) {
      attendance = await Attendance.create({
        user: person._id,
        userType,
        date: today,
        sessions: [{ checkIn: currentTime }],
      });

      return res.status(201).json({
        message: "Check-in successful (first session)",
        attendance,
      });
    }

    const lastSession = attendance.sessions[attendance.sessions.length - 1];

    if (lastSession && !lastSession.checkOut) {
      lastSession.checkOut = currentTime;
      await attendance.save();

      return res.status(200).json({
        message: "Check-out successful",
        attendance,
      });
    }

    attendance.sessions.push({ checkIn: currentTime });
    await attendance.save();

    return res.status(200).json({
      message: "New check-in session started",
      attendance,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = { fetchAllAttendances, registerAttendance };
