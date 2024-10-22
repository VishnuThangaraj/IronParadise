const cors = require("cors");
require("dotenv").config();

const allowedOrigins = [process.env.ADMIN_ORIGIN, process.env.CLIENT_ORIGIN];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

module.exports = corsOptions;
