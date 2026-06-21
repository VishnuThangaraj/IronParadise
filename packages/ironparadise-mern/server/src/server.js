require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/dbConfig");
const corsOptions = require("./config/corsConfig");
const errorHandler = require("./middleware/errorHandler");

const Admin = require("./models/Admin");

const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const eventRoutes = require("./routes/eventRoutes");
const memberRoutes = require("./routes/memberRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const generalRoutes = require("./routes/generalRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Apply CORS middleware
app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/plan", planRoutes);
app.use("/event", eventRoutes);
app.use("/member", memberRoutes);
app.use("/enquiry", enquiryRoutes);
app.use("/general", generalRoutes);
app.use("/trainer", trainerRoutes);
app.use("/subscription", subscriptionRoutes);

// Test Route
app.get("/diet/add", (req, res) => {
  console.log("Working");
  return res.status(200).send("Working...");
});

// Error handling middleware
app.use(errorHandler);

const onServerStart = async () => {
  try {
    const admins = await Admin.find();
    if (!admins || admins.length === 0) {
      const newUser = new Admin({
        name: "IronParadise-Admin",
        email: process.env.ADMIN_USERNAME,
        gender: "male",
        password: process.env.ADMIN_PASSWORD,
      });
      await newUser.save();
      console.log(" Default admin created");
    }
  } catch (err) {
    console.log("Server error", err);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  onServerStart();
  console.log(`Server running on PORT >> ${PORT} <<`);
});
