const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const enquiryController = require("../controllers/enquiryController");

// Add Enquiry
router.post("/add", enquiryController.addEnquiry);

// Fetch all Enquiry
router.get("/", authenticateJWT(["admin"]), enquiryController.fetchEnquiry);

// Update Enquiry
router.put(
  "/update/:id",
  authenticateJWT(["admin"]),
  enquiryController.updateEnquiry
);

// Delete Enquiry
router.delete(
  "/delete/:id",
  authenticateJWT(["admin"]),
  enquiryController.deleteEnquiry
);

module.exports = router;
