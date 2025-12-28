require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/dbConfig");
const corsOptions = require("./config/corsConfig");
const errorHandler = require("./middleware/errorHandler");

// const Admin = require("./models/Admin");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const trainerRoutes = require("./routes/trainerRoutes");

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
app.use("/trainer", trainerRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT >> ${PORT} <<`);
});
