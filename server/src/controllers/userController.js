const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const { getById } = require("../queries/generalQueries");

//  User Login
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Please enter a valid Email ID" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Password provided" });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to Authenticate",
      error: err.message,
    });
  }
};

// Register Admin
const registerUser = async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    if (!email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, phone and password",
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

    const user = await User.create({ ...req.body });

    const { password: _, ...userResponse } = user.toObject();

    res.status(201).json({
      success: true,
      message: `Admin registered successfully`,
      user: userResponse,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: err.message,
    });
  }
};

// User Profile
const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: err.message,
    });
  }
};

// Fetch User by ID
const fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.aggregate(getById(id));

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: user[0] || {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch User",
      error: err.message,
    });
  }
};

// Fetch User by UserID
const fetchUserByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ userId: userId })
      .select("-password -__v -createdAt -updatedAt")
      .lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: user || {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch User",
      error: err.message,
    });
  }
};

// Delete User by ID
const deleteUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const [user, deletedMembership, deletedFitnessPlan] = await Promise.all([
      User.findByIdAndDelete(userId),
      Membership.findOneAndDelete({ memberId: userId }),
      FitnessPlan.findOneAndDelete({ memberId: userId }),
    ]);

    if (!user || !deletedMembership || !deletedFitnessPlan) {
      return res
        .status(404)
        .json({ status: false, message: "Failed to delete User" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      userId: userId,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete User",
      error: err.message,
    });
  }
};

module.exports = {
  userLogin,
  userProfile,
  registerUser,
  fetchUserById,
  fetchUserByUserId,
};
