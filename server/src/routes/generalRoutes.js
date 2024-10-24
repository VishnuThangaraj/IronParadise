const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const generalController = require("../controllers/generalController");

// Send Mail
router.post(
  "/sendmail",
  authenticateJWT(["admin"]),
  generalController.sendMailFromAdmin
);

module.exports = router;
