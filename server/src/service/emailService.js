const nodemailer = require("nodemailer");
const path = require("path");
const { EMAIL_USER, EMAIL_PASS } = require("../config/emailConfig");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error);
  } else {
    console.log("Email server ready");
  }
});

// Base Mail Sender
const baseSendMail = async (options) => {
  try {
    const mailOptions = {
      from: `"Gym Management" <${EMAIL_USER}>`,
      ...options,
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error("❌ Error sending email:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

// Send Simple Email
const sendMail = async (to, subject, html, text = "", extra = {}) => {
  return baseSendMail({
    to,
    subject,
    html,
    text,
    ...extra,
  });
};

// Send Email With Uploaded File (multer buffer)
const sendMailWithFile = async (to, subject, html, file) => {
  const attachments = [];

  if (file) {
    attachments.push({
      filename: file.originalname,
      content: file.buffer,
    });
  }

  return baseSendMail({
    to,
    subject,
    html,
    attachments,
  });
};

// Send Email With PDF File Paths
const sendMailPDF = async (to, subject, html, filePaths = []) => {
  const attachments = filePaths.map((filePath) => ({
    filename: path.basename(filePath),
    path: filePath,
    contentType: "application/pdf",
  }));

  return baseSendMail({
    to,
    subject,
    html,
    attachments,
  });
};

module.exports = {
  sendMail,
  sendMailWithFile,
  sendMailPDF,
  transporter,
};
