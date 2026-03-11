const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const { sendEmail } = require("../controllers/emailController");

// Fetch LastCounter
router.post("/send", authenticateJWT(["admin", "V06102002T"]), sendEmail);

module.exports = router;
