const nodemailer = require("nodemailer");
const path = require("path");
const { EMAIL_USER, EMAIL_PASS } = require("../config/emailConfig");

// Create transporter (modern & secure)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Verify connection once at startup
transporter.verify((error) => {
  if (error) {
    console.error("Email transporter error:", error);
  } else {
    console.log("Email server ready");
  }
});

// Base Mail Sender
const baseSendMail = async (options) => {
  try {
    const info = await transporter.sendMail({
      from: `"Gym Management" <${EMAIL_USER}>`,
      ...options,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Send Simple Email

const sendMail = async (to, subject, html, text = "") => {
  return baseSendMail({
    to,
    subject,
    html,
    text,
  });
};

// Send Email With Single Uploaded File (multer buffer)

const sendMailWithFile = async (to, subject, html, file) => {
  const attachments = file
    ? [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ]
    : [];

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
};
