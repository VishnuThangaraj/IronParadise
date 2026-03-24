const User = require("../models/User");

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

module.exports = {
  fetchAllTrainers,
};
