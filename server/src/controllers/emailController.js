const { sendMail } = require("../service/emailService");
const renderTemplate = require("../service/templateEngine");

// Send Email without Attachment
const sendEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "to, subject and message are required",
      });
    }

    const html = renderTemplate("layouts/base.hbs", {
      body: renderTemplate("general/custom.hbs", {
        name: "User",
        message: message,
      }),
    });

    const result = await sendMail(to, subject, html);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: result.messageId,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = { sendEmail };
