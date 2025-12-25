require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//  Trainer Login
const trainerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const trainer = await User.findOne({ email, role: "trainer" });

    if (!trainer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, trainer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: trainer._id,
        role: trainer.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      token,
      trainer: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        role: trainer.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Register Trainer
const registerTrainer = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    specialization,
    experienceYears,
    monthlySalary,
    joiningDate,
  } = req.body;

  try {
    const existingTrainer = await User.findOne({ email });
    if (existingTrainer) {
      return res.status(400).json({ message: "Trainer already exists" });
    }

    const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const trainer = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "trainer",
      specialization,
      experienceYears,
      monthlySalary,
      joiningDate,
    });

    await trainer.save();

    res.status(201).json({
      message: "Trainer registered successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Trainer Profile
const trainerProfile = async (req, res) => {
  try {
    const trainer = await User.findOne({
      _id: req.user.id,
      role: "trainer",
    }).select("-password");

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json(trainer);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  trainerLogin,
  registerTrainer,
  trainerProfile,
};
