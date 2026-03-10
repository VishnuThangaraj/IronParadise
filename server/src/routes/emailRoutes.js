const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const { sendMail } = require("../controllers/emailController");

// Fetch LastCounter
router.post("/send", authenticateJWT(["admin", "V06102002T"]), sendMail);

module.exports = router;
