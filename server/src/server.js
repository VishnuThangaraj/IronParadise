require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/dbConfig");
const corsOptions = require("./config/corsConfig");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const memberRoutes = require("./routes/memberRoutes");
const counterRoutes = require("./routes/counterRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const dietPlanRoutes = require("./routes/dietPlanRoutes");
const workoutPlanRoutes = require("./routes/workoutPlanRoutes");
const membershipPlanRoutes = require("./routes/membershipPlanRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Apply CORS middleware
const cors = require("cors");
app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/member", memberRoutes);
app.use("/counter", counterRoutes);
app.use("/trainer", trainerRoutes);
app.use("/dietplan", dietPlanRoutes);
app.use("/workoutplan", workoutPlanRoutes);
app.use("/membershipplan", membershipPlanRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT >> ${PORT} <<`);
});
