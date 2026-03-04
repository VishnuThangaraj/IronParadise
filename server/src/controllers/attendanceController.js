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

    const currentTime = now.toTimeString().slice(0, 5);

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

    const lastSession = attendance.sessions.at(-1);

    // Checkout
    if (lastSession && !lastSession.checkOut) {
      lastSession.checkOut = currentTime;
      await attendance.save();

      return res.status(200).json({
        message: "Check-out successful",
        action: "logout",
        attendance,
      });
    }

    //  New Check-In Session
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
  const { date } = req.body;
  try {
    const selectedDate = new Date(date);

    const startOfMonth = new Date(
      now.getFullYear(),
      selectedDate.getMonth(),
      1,
    );
    const startOfNextMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      1,
    );

    const attendances = await Attendance.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: startOfNextMonth,
      },
    })
      .select("-createdAt -updatedAt -__v")
      .lean();

    res.status(200).json(attendances);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch Daily Attendance
const fetchDailyAttendance = async (req, res) => {
  const { date } = req.body;

  try {
    const selectedDate = new Date(date);

    const start = new Date(selectedDate.setHours(0, 0, 0, 0));
    const end = new Date(selectedDate.setHours(23, 59, 59, 999));

    const attendances = await Attendance.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    })
      .populate({
        path: "user",
        select: "name userId memberId",
      })
      .select("-createdAt -updatedAt -__v")
      .lean();

    const formattedAttendances = attendances.map((attendance) => {
      const { __v, user, ...rest } = attendance;

      return {
        ...rest,
        user_id: user?._id || null,
        userName: user?.name || null,
        userId: user.userId || user.memberId,
      };
    });

    res.status(200).json({ attendances: formattedAttendances });
  } catch (err) {
    res.staus(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch Attendance by Date Range
const fetchRangeAttendance = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const query = {
      createdAt: {
        $gte: start,
        $lte: end,
      },
    };

    const attendances = await Attendance.find(query)
      .populate({
        path: "user",
        select: "name userId memberId",
      })
      .select("-createdAt -updatedAt -__v")
      .lean();

    const formattedAttendances = attendances.map((attendance) => {
      const { user, ...rest } = attendance;

      return {
        ...rest,
        user_id: user?._id || null,
        userName: user?.name || null,
        userId: user?.userId || user?.memberId || null,
      };
    });

    res.status(200).json({
      attendances: formattedAttendances,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch Individual User Attendance
const fetchIndividualAttendance = async (req, res) => {
  const { startDate, endDate, userId } = req.body;

  try {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const query = {
      createdAt: {
        $gte: start,
        $lte: end,
      },
      user: userId,
    };

    const attendances = await Attendance.find(query)
      .populate({
        path: "user",
        select: "name userId memberId",
      })
      .select("-createdAt -updatedAt -__v")
      .lean();

    const formattedAttendances = attendances.map((attendance) => {
      const { user, ...rest } = attendance;

      return {
        ...rest,
        user_id: user?._id || null,
        userName: user?.name || null,
        userId: user?.userId || user?.memberId || null,
      };
    });

    res.status(200).json({
      attendances: formattedAttendances,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  registerAttendance,
  fetchAllAttendances,
  fetchDailyAttendance,
  fetchRangeAttendance,
  fetchMonthlyAttendance,
  fetchIndividualAttendance,
};
