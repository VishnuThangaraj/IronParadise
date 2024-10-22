require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Admin Login
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ token, admin: { username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Register Admin
const registerAdmin = async (req, res) => {
  const { name, username, gender, password } = req.body;
  try {
    const newUser = new Admin({ name, username, gender, password });

    await newUser.save();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin Profile
const adminDetails = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  adminLogin,
  adminDetails,
  registerAdmin,
};
