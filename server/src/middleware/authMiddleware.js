const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateJWT =
  (requiredRoles = []) =>
  (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      if (!user || !requiredRoles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Unauthorized Access" });
      }

      req.user = user;
      next();
    });
  };

module.exports = authenticateJWT;
