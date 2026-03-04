const { sendMail } = require("../services/emailService");
const renderTemplate = require("../utils/templateEngine");

const sendWelcomeEmail = async (req, res) => {
  try {
    const { email, name, plan } = req.body;

    const html = renderTemplate("welcome.hbs", {
      name,
      plan,
    });

    const result = await sendMail(
      email,
      "Welcome to Iron Paradise Gym 💪",
      html,
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = {
  sendWelcomeEmail,
};
