const Counter = require("../models/Counter");

// Fetch the last Counter
const fetchLastCounter = async (req, res) => {
  const { identity } = req.body;

  try {
    const counter = await Counter.findById(identity);

    res.status(200).json(counter ? counter.seq : 0);

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
