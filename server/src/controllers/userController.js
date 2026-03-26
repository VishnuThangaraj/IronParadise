const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const TrainerSalary = require("../models/TrainerSalary");

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

    const user = await User.findOne({ email });

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
    res.status(500).json({
      success: false,
      message: "Failed to Authenticate",
      error: err.message,
    });
  }
};

// Register User
const registerUser = async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      if (existingUser.phone === phone) {
        return res.status(409).json({
          success: false,
          message: "User with this phone number already exists",
        });
      }
    }

    let finalPassword = password;

    if (!finalPassword) {
      const random5Digits = crypto.randomInt(10000, 100000);
      finalPassword = `${req.body.userId}${random5Digits}`;
    }

    const user = new User({
      ...req.body,
      password: finalPassword,
    });

    await user.save();

    if (user.role == "trainer") {
      const trainerSalary = new TrainerSalary({
        trainer: user._id,
        month: new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        salary: user.monthlySalary,
        deductions: 0,
        totalPayable: user.monthlySalary,
        paymentStatus: "pending",
        paidOn: null,
        pendingAmount: user.monthlySalary,
      });

      await trainerSalary.save();
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: `${
        user.role.charAt(0).toUpperCase() + user.role.slice(1)
      } registered successfully`,
      user: userResponse,
    });
  } catch (err) {
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
  const userId = req.params.id;
  try {
    const user = await User.aggregate(getById(userId));

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
    const user = await User.findOne({ userId: userId });
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

// Update User by ID
const updateUserById = async (req, res) => {
  const userId = req.params.id;
  const { member, membership, fitnessPlan } = req.body;

  try {
    const [existingMember, existingMembership, existingFitnessPlan] =
      await Promise.all([
        Member.findOne({ userId }),
        Membership.findOne({ memberId: userId }),
        FitnessPlan.findOne({ memberId: userId }),
      ]);

    if (!existingMember || !existingMembership || !existingFitnessPlan) {
      return res.status(404).json({
        success: false,
        message: !existingMember
          ? "Member not found"
          : !existingMembership
            ? "Membership not found"
            : "Fitness Plan not found",
      });
    }

    const [user, updatedMembership, updatedFitnessPlan] = await Promise.all([
      User.findByIdAndUpdate(userId, member, {
        new: true,
        runValidators: true,
      }),
      Membership.findByIdAndUpdate(existingMembership._id, membership, {
        new: true,
        runValidators: true,
      }),
      FitnessPlan.findByIdAndUpdate(existingFitnessPlan._id, fitnessPlan, {
        new: true,
        runValidators: true,
      }),
    ]);

    if (!user || !updatedMembership || !updatedFitnessPlan) {
      return res
        .status(404)
        .json({ status: false, message: "Failed to update User" });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update User",
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
      trainerId: userId,
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
  updateUserById,
  deleteUserById,
};
