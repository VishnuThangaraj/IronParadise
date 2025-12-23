require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/dbConfig");
const corsOptions = require("./config/corsConfig");
const errorHandler = require("./middleware/errorHandler");

// const Admin = require("./models/Admin");

const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();

// Connect to MongsoDB
connectDB();

// Apply CORS middleware
const cors = require("cors");
app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);

// Error handling middleware
app.use(errorHandler);

const onServerStart = async () => {
  try {
    const admins = await Admin.find();
    if (!admins || admins.length === 0) {
      const newUser = new Admin({
        name: "IronParadise",
        email: process.env.ADMIN_USERNAME,
        gender: "male",
        password: process.env.ADMIN_PASSWORD,
      });
      await newUser.save();
    }
  } catch (err) {
    console.log("Server error", err);
  }
};

const PORT = process.env.PORT;
app.listen(PORT, () => {
  // onServerStart();
  console.log(`Server running on PORT >> ${PORT} <<`);
});
