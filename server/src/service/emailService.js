const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_PASS } = require("../config/emailConfig");

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Send email function
const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Send email function
const sendMailWithFile = async (to, subject, html, file) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  if (file) {
    mailOptions.attachments = [
      {
        filename: file.originalname,
        content: file.buffer,
      },
    ];
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Send email function with PDF attachment
const sendMailPDF = async (to, subject, html, attachments) => {
  try {
    const mailOptions = {
      from: EMAIL_USER,
      to,
      subject,
      html,
      attachments: attachments.map((filePath) => ({
        filename: path.basename(filePath),
        path: filePath,
        contentType: "application/pdf",
      })),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendMail, sendMailWithFile, sendMailPDF };
