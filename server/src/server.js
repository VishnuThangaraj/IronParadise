const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/dbConfig");
const corsOptions = require("./config/corsConfig");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const generalRoutes = require("./routes/generalRoutes");
const trainerRoutes = require("./routes/trainerRoutes");

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
app.use("/general", generalRoutes);
app.use("/trainer", trainerRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on PORT >> ${PORT} <<`));
