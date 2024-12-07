const Trainer = require("../models/Trainer");
const SalaryHistory = require("../models/SalaryHistory");
const { sendMail } = require("../service/emailService");

// Register Trainer
const registerTrainer = async (req, res) => {
  const {
    name,
    username,
    email,
    phone,
    dob,
    gender,
    specialization,
    height,
    weight,
    bmi,
    salary,
    address,
    panNumber,
    aadharNumber,
  } = req.body.trainer;
  try {
    const existingEmail = await Trainer.findOne({ email });
    const existingPhone = await Trainer.findOne({ phone });

    if (existingEmail || existingPhone) {
      return res.status(409).json({ message: "Email or Phone already exists" });
    }

    const newTrainer = new Trainer({
      name,
      username: `TR${username}`,
      email,
      phone,
      dob: new Date(dob),
      gender,
      specialization,
      height,
      weight,
      bmi,
      salary,
      address,
      panNumber,
      aadharNumber,
    });

    await newTrainer.save();
    res.status(201).json({
      message: "Trainer registered successfully",
      trainer: newTrainer,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch all Trainers
const fetchTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();

    res.status(200).json({ message: "Trainers Fetched", trainers: trainers });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch Salary History
const fetchSalaryHistory = async (req, res) => {
  try {
    const salaryhistory = await SalaryHistory.find();

    res
      .status(200)
      .json({ message: "Salary History Fetched", salary: salaryhistory });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch Trainer by ID
const fetchTrainerById = async (req, res) => {
  const trainerId = req.params.id;

  try {
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json({ trainer: trainer });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a Trainer by ID
const updateTrainerById = async (req, res) => {
  const trainerId = req.params.id;
  const { updatedData } = req.body;

  try {
    const trainer = await Trainer.findByIdAndUpdate(trainerId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res
      .status(200)
      .json({ message: "Trainer Updated successfully!", trainer: trainer });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const salaryPaymentMail = async (trainer, payment) => {
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
            <h2>Hello, ${trainer.name}!</h2>
            <p>We hope you're doing well and continuing to inspire our members at Iron Paradise!</p>
            <p>We are pleased to inform you that your salary for the month has been processed.</p>
            
            <p><strong>Total Salary:</strong> ₹ ${payment.salary.toFixed(1)}</p>
            <p><strong>Amount Paid:</strong> ₹ ${payment.amount.toFixed(1)}</p>
            <p><strong>Pending Amount:</strong> ₹ ${payment.pending.toFixed(
              1
            )}</p>
            <p><strong>Payment Mode:</strong> ${payment.paymentMethod}</p>
            <p><strong>Payment Date:</strong> ${`${payment.createdAt}`.slice(
              0,
              16
            )}</p>

            <p>If you have any questions or need further details, please feel free to reach out.</p>
            <p>Thank you for your hard work and dedication!</p>
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

    sendMail(trainer.email, "IronParadise | Trainer Salary Payment", html);

    console.log("Mail Sent for Trainer Salary Payment");
  } catch (err) {
    console.log("Failed to Send Mail for Trainer Salary Payment", err);
  }
};

// Custom Salary Payment
const customSalary = async (req, res) => {
  const trainerId = req.params.id;
  const payment = req.body.payment;

  try {
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    trainer.pending = payment.pending;
    const updatedTrainer = await trainer.save();

    const history = new SalaryHistory(payment);
    const newHistory = await history.save();

    salaryPaymentMail(updatedTrainer, newHistory);

    res.status(200).json({
      message: "Salary Payment Made successfully!",
      trainer: updatedTrainer,
      history: newHistory,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Full Salary Payment for Trainers
const batchPayment = async (req, res) => {
  const { trainers, paymode, remarks } = req.body;

  try {
    const updatePromises = trainers.map(async (trainerId) => {
      const trainer = await Trainer.findById(trainerId);

      if (trainer.pending > 0) {
        const trainerUpdatePromise = Trainer.findByIdAndUpdate(
          trainerId,
          { pending: 0 },
          { new: true }
        );

        const payment = new SalaryHistory({
          trainer: trainerId,
          amount: trainer.pending,
          salary: trainer.salary,
          pending: 0,
          remarks: remarks,
          paymentMethod: paymode,
        });

        const [updatedTrainer, savedPayment] = await Promise.all([
          trainerUpdatePromise,
          payment.save(),
        ]);

        salaryPaymentMail(updatedTrainer, savedPayment);
      }
    });

    await Promise.all(updatePromises);

    const updatedTrainers = await Trainer.find();
    const salaryhistory = await SalaryHistory.find();

    res.status(200).json({
      message: "Salary Payment Made successfully!",
      trainers: updatedTrainers,
      history: salaryhistory,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Trainer by ID
const deleteTrainerById = async (req, res) => {
  const trainerId = req.params.id;

  try {
    const trainer = await Trainer.findByIdAndDelete(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json({ message: "Trainer Deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  customSalary,
  batchPayment,
  fetchTrainers,
  registerTrainer,
  fetchTrainerById,
  updateTrainerById,
  deleteTrainerById,
  fetchSalaryHistory,
};
