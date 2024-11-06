const moment = require("moment");
const Member = require("../models/Member");
const Trainer = require("../models/Trainer");
const Attendance = require("../models/Attendance");
const { sendMail, sendMailWithFile } = require("../service/emailService");

// Get Trainers and Members
const getUsers = async (req, res) => {
  try {
    const members = await Member.find();
    const trainers = await Trainer.find();

    const combined = [...members, ...trainers].map(
      ({ _id, name, username, role }) => ({
        id: _id,
        name,
        username: username.toUpperCase(),
        role,
      })
    );

    res.status(200).json({
      message: "Members and Trainers Fetched Successfully",
      attendance: combined,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Send Mail
const sendMailFromAdmin = async (req, res) => {
  const { name, to, subject, message } = req.body.mailData;

  try {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Message from Iron Paradise Admin</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f2f2f2;
                color: #333333;
            }
            .container {
                max-width: 700px;
                margin: auto;
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 60px 20px;
                background-image: url("https://media.istockphoto.com/id/1369897943/photo/focus-on-disc-close-up-shot-hands-adding-weight-to-barbell-rod-at-gym-concept-of-fitness.jpg?s=612x612&w=0&k=20&c=H0fxQoJGyMv9npWuD42R6xiG8JUpqZNPbp4dLWh7B7k=");
                background-size: cover;
                background-position: center;
                color: #ffffff;
                text-shadow: 5px 5px 10px black;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                position: relative;
                overflow: hidden;
            }
            .header h1 {
                margin: 0;
                font-size: 36px;
                font-weight: bold;
                position: relative;
                z-index: 1;
                text-transform: uppercase;
            }
            .content {
                padding: 20px;
                background-color: #f9f9f9;
            }
            h2 {
                color: gray;
                font-size: 28px;
                margin-top: 0;
            }
            p {
                font-size: 16px;
                color: #555555;
                line-height: 1.6;
                margin: 0 0 15px;
            }
            a {
                color: black;
                text-decoration: none;
                font-weight: bold;
            }
            a:hover {
                text-decoration: underline;
            }
            .footer {
                background-color: #eeeeee;
                padding: 20px;
                border-top: 1px solid #ddd;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }
            .footer h2 {
                color: black;
                font-size: 20px;
                margin: 0 0 10px;
            }
            .footer p {
                font-size: 14px;
                color: #666666;
                margin: 0 0 10px;
            }
            .footer ul {
                padding: 0;
                list-style: none;
                margin: 0;
            }
            .footer li {
                margin-bottom: 10px;
            }
            .footer .socials {
                text-align: center;
                margin-top: 20px;
            }
            .footer .socials a {
                color: gray;
                text-decoration: none;
                margin: 0 12px;
                font-size: 24px;
            }
            .footer .socials a:hover {
                color: black;
            }
            .fa {
                margin-right: 8px;
            }
        </style>
        <!-- FontAwesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    </head>

    <body>
        <div class="container">
            <div class="header">
                <h1>Iron Paradise</h1>
            </div>
            <div class="content">
                <h2>Hello, ${name}!</h2>
                <p>${message}</p>
                <p>Sincerely,<br />Iron Paradise Admin</p>
            </div>
            <div class="footer">
                <div class="section">
                    <h2>Contact Information</h2>
                    <p><strong>Iron Paradise</strong></p>
                    <p>12, Alpha Street, Sulur, Coimbatore - 641402</p>
                    <p>Phone: 6383 580 365</p>
                </div>
                <div class="section">
                    <h2>Support</h2>
                    <p>If you need assistance, please contact our support team:</p>
                    <p>Email: <a href="mailto:support@ironparadise.com">support@ironparadise.com</a></p>
                    <p>Phone: +91 6584 857 496</p>
                </div>
                <div class="section">
                    <h2>Follow Us</h2>
                    <p>Connect with us on social media for updates and news:</p>
                    <div class="socials">
                        <a href="https://facebook.com" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://twitter.com" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="https://instagram.com" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="https://www.tiktok.com" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>
                        <a href="https://wa.me/6584857496" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;

    await sendMail(to, subject, html);
    res.status(200).json({ message: "Mail sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Send Bulk Mail
const sendBulkMail = async (req, res) => {
  const { subject, message, recipients } = req.body;
  const file = req.file;
  try {
    const emailPromises = recipients.map((email) => {
      const html = ` <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Message from Iron Paradise Admin</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f2f2f2;
                color: #333333;
            }
            .container {
                max-width: 700px;
                margin: auto;
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 60px 20px;
                background-image: url("https://media.istockphoto.com/id/1369897943/photo/focus-on-disc-close-up-shot-hands-adding-weight-to-barbell-rod-at-gym-concept-of-fitness.jpg?s=612x612&w=0&k=20&c=H0fxQoJGyMv9npWuD42R6xiG8JUpqZNPbp4dLWh7B7k=");
                background-size: cover;
                background-position: center;
                color: #ffffff;
                text-shadow: 5px 5px 10px black;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                position: relative;
                overflow: hidden;
            }
            .header h1 {
                margin: 0;
                font-size: 36px;
                font-weight: bold;
                position: relative;
                z-index: 1;
                text-transform: uppercase;
            }
            .content {
                padding: 20px;
                background-color: #f9f9f9;
            }
            h2 {
                color: gray;
                font-size: 28px;
                margin-top: 0;
            }
            p {
                font-size: 16px;
                color: #555555;
                line-height: 1.6;
                margin: 0 0 15px;
            }
            a {
                color: black;
                text-decoration: none;
                font-weight: bold;
            }
            a:hover {
                text-decoration: underline;
            }
            .footer {
                background-color: #eeeeee;
                padding: 20px;
                border-top: 1px solid #ddd;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }
            .footer h2 {
                color: black;
                font-size: 20px;
                margin: 0 0 10px;
            }
            .footer p {
                font-size: 14px;
                color: #666666;
                margin: 0 0 10px;
            }
            .footer ul {
                padding: 0;
                list-style: none;
                margin: 0;
            }
            .footer li {
                margin-bottom: 10px;
            }
            .footer .socials {
                text-align: center;
                margin-top: 20px;
            }
            .footer .socials a {
                color: gray;
                text-decoration: none;
                margin: 0 12px;
                font-size: 24px;
            }
            .footer .socials a:hover {
                color: black;
            }
            .fa {
                margin-right: 8px;
            }
        </style>
        <!-- FontAwesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    </head>

    <body>
        <div class="container">
            <div class="header">
                <h1>Iron Paradise</h1>
            </div>
            <div class="content">
                <h2>Hey!</h2>
                <p>${message}</p>
                <p>Sincerely,<br />Iron Paradise Admin</p>
            </div>
            <div class="footer">
                <div class="section">
                    <h2>Contact Information</h2>
                    <p><strong>Iron Paradise</strong></p>
                    <p>12, Alpha Street, Sulur, Coimbatore - 641402</p>
                    <p>Phone: 6383 580 365</p>
                </div>
                <div class="section">
                    <h2>Support</h2>
                    <p>If you need assistance, please contact our support team:</p>
                    <p>Email: <a href="mailto:support@ironparadise.com">support@ironparadise.com</a></p>
                    <p>Phone: +91 6584 857 496</p>
                </div>
                <div class="section">
                    <h2>Follow Us</h2>
                    <p>Connect with us on social media for updates and news:</p>
                    <div class="socials">
                        <a href="https://facebook.com" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://twitter.com" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="https://instagram.com" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="https://www.tiktok.com" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>
                        <a href="https://wa.me/6584857496" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;

      return sendMailWithFile(email, subject, html, file);
    });

    Promise.all(emailPromises);

    res.status(200).json({ message: "Bulk Mail Sent Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Mark Attendance
const markAttendance = async (req, res) => {
  const { id, name, username, role } = req.body.user;

  if (!id || !role) {
    return res.status(400).json({ message: "ID and role are required" });
  }

  try {
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    const lastAction = await Attendance.findOne({
      id,
      role,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: -1 });

    if (lastAction && lastAction.action === "login") {
      lastAction.action = "logout";
      await lastAction.save();

      return res.status(200).json({
        message: "Attendance updated to logout for the existing login entry",
        attendance: lastAction,
      });
    } else {
      const newAttendance = new Attendance({
        id,
        name,
        role,
        username,
        action: "login",
      });

      await newAttendance.save();

      return res.status(200).json({
        message: "Attendance marked as login",
        attendance: newAttendance,
      });
    }
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Check Attendance
const checkAttendance = async (req, res) => {
  const { id, role } = req.body.foundUser;

  if (!id || !role) {
    return res.status(400).json({ message: "ID and role are required" });
  }

  try {
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    const lastAction = await Attendance.findOne({
      id,
      role,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: -1 });

    if (lastAction && lastAction.action === "login") {
      return res.status(200).json({ message: "Punch Out" });
    } else {
      return res.status(200).json({ message: "Punch In" });
    }
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch All Attendance
const fetchAttendance = async (req, res) => {
  try {
    const attendances = await Attendance.find();

    res
      .status(200)
      .json({ message: "Attendance Fetched", attendances: attendances });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getUsers,
  sendBulkMail,
  markAttendance,
  checkAttendance,
  fetchAttendance,
  sendMailFromAdmin,
};
