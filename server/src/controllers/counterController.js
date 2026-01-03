const Counter = require("../models/Counter");

// Fetch the last Counter
const fetchLastCounter = async (req, res) => {
  const { role } = req.body;

  try {
    const counter = await Counter.findById(role);

    res.status(200).json(counter);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  fetchLastCounter,
};
