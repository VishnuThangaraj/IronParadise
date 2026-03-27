const User = require("../models/User");
const Attendance = require("../models/Attendance");
const TrainerSalary = require("../models/TrainerSalary");
const TrainerTransaction = require("../models/TrainerTransaction");

const { getById } = require("../queries/generalQueries");
const { getAllTrainerQuery } = require("../queries/trainerQueries");

// Fetch All Trainers
const fetchAllTrainers = async (req, res) => {
  try {
    const trainers = await User.aggregate(getAllTrainerQuery());

    res.status(200).json({
      success: true,
      message: "Trainers have been fetched successfully",
      trainers: trainers || [],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch trainers",
      error: err.message,
    });
  }
};

// Register Trainer
const registerTrainer = async (req, res) => {
  const { email, phone, password, userId, monthlySalary, ...rest } = req.body;

  try {
    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and phone number",
      });
    }

    const existingTrainer = await User.findOne({
      $or: [{ email }, { phone }],
    }).lean();

    if (existingTrainer) {
      const field = existingTrainer.email === email ? "email" : "phone number";

      return res.status(409).json({
        success: false,
        message: `Trainer with this ${field} already exists`,
      });
    }

    const finalPassword =
      password || `${userId}${require("crypto").randomInt(10000, 100000)}`;

    const user = await User.create({
      email,
      phone,
      monthlySalary,
      password: finalPassword,
      ...rest,
    });

    const trainerResponse = {
      ...user.toObject(),
      formattedDob: new Date(user?.dob).toDateString(),
    };

    const html = renderTemplate("layouts/base.hbs", {
      body: renderTemplate("trainer/welcomeTrainer.hbs", {
        trainer: trainerResponse,
      }),
    });

    const subject = "Iron Paradise - Trainer Registration";

    sendMail(trainerResponse.email, subject, html);

    await TrainerSalary.create({
      trainer: user._id,
      monthYear: new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      salary: monthlySalary,
      totalPayable: monthlySalary,
      pendingAmount: monthlySalary,
    });

    const { password: _, ...userResponse } = user.toObject();

    res.status(201).json({
      success: true,
      message: `Trainer registered successfully`,
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to register trainer",
      error: err.message,
    });
  }
};

// Fetch Trainer by ID
const fetchTrainerById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide trainer ID",
      });
    }
    const trainer = await User.aggregate(getById(id));

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trainer has been fetched successfully",
      trainer: trainer[0] || {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Trainer",
      error: err.message,
    });
  }
};

// Fetch Trainer by UserID
const fetchTrainerByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide trainer ID",
      });
    }
    const trainer = await User.findOne({ userId })
      .select("-password -__v -createdAt -updatedAt")
      .lean();

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trainer has been fetched successfully",
      trainer: trainer || {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Trainer",
      error: err.message,
    });
  }
};

// Update Traienr by ID
const updateTrainerById = async (req, res) => {
  const { trainerId } = req.params;
  const { monthlySalary, ...updatedData } = req.body;
  try {
    if (!trainerId) {
      return res.status(400).json({
        success: false,
        message: "Please provide trainer ID",
      });
    }

    const updateTrainerPromise = User.findByIdAndUpdate(
      trainerId,
      { monthlySalary, ...updatedData },
      { new: true, runValidators: true },
    )
      .select("-password")
      .lean();

    const latestSalaryPromise = monthlySalary
      ? TrainerSalary.findOne({ trainer: trainerId }).sort({ createdAt: -1 })
      : Promise.resolve(null);

    const [trainer, latestSalary] = await Promise.all([
      updateTrainerPromise,
      latestSalaryPromise,
    ]);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    let responseMessage = "Trainer has been updated successfully";

    if (monthlySalary) {
      if (!latestSalary) {
        return res.status(404).json({
          success: false,
          message: "Trainer salary not found",
        });
      }

      const { pendingAmount, totalPayable } = latestSalary;
      let salaryMessage = "Salary will take effect from next month";

      if (pendingAmount != 0 && totalPayable - pendingAmount >= monthlySalary) {
        latestSalary.salary = monthlySalary;
        latestSalary.totalPayable = monthlySalary;
        latestSalary.pendingAmount -= monthlySalary;
        await latestSalary.save();
        salaryMessage = "Salary will take effect from this month";
      }

      responseMessage += `, ${salaryMessage}`;
    }

    res.status(200).json({
      success: true,
      message: responseMessage,
      trainer: trainer || {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update Trainer",
      error: err.message,
    });
  }
};

// Delete Trainer by ID
const deleteTrainerById = async (req, res) => {
  const { trainerId } = req.params;
  try {
    if (!trainerId) {
      return res.status(400).json({
        success: false,
        message: "Please provide trainer ID",
      });
    }
    const trainer = await User.findByIdAndDelete(trainerId);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    await Promise.all([
      TrainerSalary.deleteMany({ trainer: trainerId }),
      TrainerTransaction.deleteMany({ trainerId }),
      Attendance.deleteMany({ user: trainerId }),
    ]);

    res.status(200).json({
      success: true,
      message: "Trainer has been deleted successfully",
      trainer: trainer || {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Trainer",
      error: err.message,
    });
  }
};

module.exports = {
  fetchAllTrainers,
  registerTrainer,
  fetchTrainerById,
  updateTrainerById,
  deleteTrainerById,
  fetchTrainerByUserId,
};
