const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Member = require("../models/Member");
const PaymentHistory = require("../models/PaymentHistory");
const { sendMail, sendMailPDF } = require("../service/emailService");
const SubscriptionHistory = require("../models/SubscriptionHistory");

// Function to generate diet plan PDF
const generateDietPlanPDF = async (dietPlan) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, "diet-plan.pdf");

  doc.pipe(fs.createWriteStream(filePath));

  doc
    .fontSize(14)
    .text(`Diet Plan: ${dietPlan.dietPlanName}`, { underline: true })
    .moveDown(2);

  // Loop through each day's meals and add them to the PDF
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  days.forEach((day) => {
    doc.text(
      `${day.charAt(0).toUpperCase() + day.slice(1)} Breakfast: ${
        dietPlan[`${day}Breakfast`]
      }`
    );
    doc.text(
      `${day.charAt(0).toUpperCase() + day.slice(1)} Lunch: ${
        dietPlan[`${day}Lunch`]
      }`
    );
    doc.text(
      `${day.charAt(0).toUpperCase() + day.slice(1)} Dinner: ${
        dietPlan[`${day}Dinner`]
      }`
    );
    doc.moveDown();
  });

  doc.end();
  return filePath;
};

// Function to generate workout plan PDF
const generateWorkoutPlanPDF = async (workoutPlan) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, "workout-plan.pdf");

  doc.pipe(fs.createWriteStream(filePath));

  doc
    .fontSize(14)
    .text(`Workout Plan: ${workoutPlan.workoutPlanName}`, { underline: true })
    .moveDown(2);

  // Loop through each day's workouts and add them to the PDF
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  days.forEach((day) => {
    doc.text(
      `${day.charAt(0).toUpperCase() + day.slice(1)}: ${
        workoutPlan[`${day}Workout`]
      }`
    );
    doc.moveDown();
  });

  doc.end();
  return filePath;
};

// Add New Member
const registerMember = async (req, res) => {
  const {
    name,
    username,
    email,
    phone,
    dob,
    gender,
    height,
    weight,
    bmi,
    address,
    trainerId,
    dietPlan,
    workoutPlan,
    startDate,
    endDate,
    planDuration,
    planCost,
    membershipPlanId,
  } = req.body.member;
  try {
    if (
      !name ||
      !email ||
      !phone ||
      !dob ||
      !trainerId ||
      !dietPlan ||
      !workoutPlan
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingEmail = await Member.findOne({ email });
    const existingPhone = await Member.findOne({ phone });

    if (existingEmail || existingPhone) {
      return res.status(409).json({ message: "Email or Phone already exists" });
    }

    const subscription =
      startDate && endDate && membershipPlanId
        ? {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            membershipPlan: membershipPlanId,
            planDuration: planDuration,
            planCost: planCost,
            pending: planCost,
          }
        : undefined;

    const newMember = new Member({
      name,
      username,
      email,
      phone,
      dob,
      gender,
      height,
      weight,
      bmi,
      address,
      role: "member",
      trainerId: trainerId,
      dietPlan: dietPlan,
      workoutPlan: workoutPlan,
      subscription,
    });

    const currentMember = await newMember.save();

    const savedMember = await Member.findById(currentMember._id)
      .populate("workoutPlan")
      .populate("trainerId")
      .populate("dietPlan");

    const dietPlanPDF = await generateDietPlanPDF(savedMember.dietPlan);
    const workoutPlanPDF = await generateWorkoutPlanPDF(
      savedMember.workoutPlan
    );

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Iron Paradise</title>
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
            <h2>Welcome, ${savedMember.name}!</h2>
            <p>Thank you for registering with Iron Paradise! We are excited to help you reach your fitness goals. Here are your account details:</p>

            <p><strong>Name:</strong> ${savedMember.name}</p>
            <p><strong>Username:</strong> ${savedMember.username.toUpperCase()}</p>
            <p><strong>Email:</strong> ${savedMember.email}</p>
            <p><strong>Phone:</strong> ${savedMember.phone}</p>
            <p><strong>Date of Birth:</strong> ${`${savedMember.dob}`.slice(
              4,
              16
            )}</p>
            <p><strong>Gender:</strong> ${savedMember.gender}</p>
            <p><strong>Height:</strong> ${savedMember.height} cm</p>
            <p><strong>Weight:</strong> ${savedMember.weight} kg</p>
            <p><strong>BMI:</strong> ${savedMember.bmi}</p>
            <p><strong>Address:</strong> ${savedMember.address}</p>
            
            <p>If you have any questions or need further assistance, feel free to reach out to our support team!</p>

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
</html>
`;
    await sendMailPDF(savedMember.email, "Welcome to Iron Paradise", html, [
      dietPlanPDF,
      workoutPlanPDF,
    ]);

    fs.unlinkSync(dietPlanPDF);
    fs.unlinkSync(workoutPlanPDF);

    res.status(201).json({
      message: "Member registered successfully",
      member: savedMember,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while adding new member",
      error: err.message,
    });
  }
};

// Fetch all Members
const fetchMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("workoutPlan")
      .populate("trainerId")
      .populate("dietPlan");

    res.status(200).json({ message: "Members Fetched", members: members });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a Member
const updateMember = async (req, res) => {
  const memberId = req.params.id;
  const { updatedData } = req.body;

  try {
    const member = await Member.findByIdAndUpdate(memberId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res
      .status(200)
      .json({ message: "Member Updated successfully!", member: member });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Subscription Plan for the member
const updateSubPlan = async (req, res) => {
  const memberId = req.params.id;
  const { subscription } = req.body;

  try {
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.subscription = subscription;

    await member.save();

    const updatedMember = await Member.findById(memberId)
      .populate("workoutPlan")
      .populate("trainerId")
      .populate("dietPlan");

    res.status(200).json({
      message: "Subscription Updated successfully!",
      member: updatedMember,
    });
    await member.save();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a Member
const deleteMember = async (req, res) => {
  const memberId = req.params.id;

  try {
    const member = await Member.findByIdAndDelete(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "Member Deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Member Plan
const updatePlan = async (req, res) => {
  const memberId = req.params.id;
  const { planData } = req.body;

  try {
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.dietPlan = planData.dietplan;
    member.workoutPlan = planData.workoutplan;

    await member.save();

    const updatedMember = await Member.findById(memberId)
      .populate("workoutPlan")
      .populate("trainerId")
      .populate("dietPlan");

    const dietPlanPDF = await generateDietPlanPDF(updatedMember.dietPlan);
    const workoutPlanPDF = await generateWorkoutPlanPDF(
      updatedMember.workoutPlan
    );

    const html = `<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Iron Paradise - Your Plans Have Been Updated</title>
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
            <h2>Plans Updated!</h2>
            <p>Hello, ${updatedMember.name}!</p>

            <p>We wanted to inform you that your diet and workout plans have been updated. Please find the updated plans in the attached PDFs for your reference.</p>

            <p><strong>What's changed?</strong></p>
            <ul>
                <li><strong>Diet Plan:</strong> Your daily meal schedule and recipes have been updated to better align with your goals.</li><br>
                <li><strong>Workout Plan:</strong> Your workout routine has been revised to provide you with more effective exercises for maximum results.</li>
            </ul>

            <p>If you have any questions or need further assistance, feel free to reach out to our support team!</p>

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

    await sendMailPDF(
      updatedMember.email,
      "Iron Paradise | Fitness Plan Update",
      html,
      [dietPlanPDF, workoutPlanPDF]
    );

    fs.unlinkSync(dietPlanPDF);
    fs.unlinkSync(workoutPlanPDF);

    res.status(200).json({
      message: "Fitness Plan Updated successfully!",
      member: updatedMember,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Make Payment
const makePayment = async (req, res) => {
  const { member, dueAmount, subscription } = req.body.payment;
  const payment = req.body.payment;
  try {
    const existingMember = await Member.findById(member);

    if (!existingMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    let newSubscription = null;
    if (
      existingMember.subscription.planCost ===
      existingMember.subscription.pending
    ) {
      const newSubscription1 = new SubscriptionHistory({
        member: member,
        subscription: subscription,
        startDate: existingMember.subscription.startDate,
        endDate: existingMember.subscription.endDate,
      });

      const tempSubscription = await newSubscription1.save();

      newSubscription = await SubscriptionHistory.findById(
        tempSubscription._id
      ).populate("subscription");
    }

    existingMember.subscription.pending = dueAmount;
    await existingMember.save();

    const updatedMember = await Member.findById(member)
      .populate("workoutPlan")
      .populate("trainerId")
      .populate("dietPlan");

    const paymentHis = new PaymentHistory({
      ...payment,
      startDate: updatedMember.subscription.startDate,
      endDate: updatedMember.subscription.endDate,
    });
    const tempHis = await paymentHis.save();

    const paymentHistClear = await PaymentHistory.findById(
      tempHis._id
    ).populate("subscription");

    res.status(200).json({
      message: "Payment made successfully!",
      member: updatedMember,
      payment: paymentHistClear,
      subscription: newSubscription,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  updatePlan,
  makePayment,
  fetchMembers,
  updateMember,
  deleteMember,
  updateSubPlan,
  registerMember,
};
