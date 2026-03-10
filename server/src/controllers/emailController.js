// Fetch the last Counter
const sendMail = async (req, res) => {
  console.log(req.body);

  try {
    // const counter = await Counter.findById(role);

    res.status(200).json(counter);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  sendMail,
};
