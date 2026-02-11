const User = require("../models/User");

// Fetch All Trainers
const fetchAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" })
      .select("-createdAt -updatedAt -password -__v")
      .lean();

    res.status(200).json(trainers);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  fetchAllTrainers,
};
