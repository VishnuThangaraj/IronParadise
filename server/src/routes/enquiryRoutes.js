const express = require("express");
const router = express.Router();

const validateObjectId = require("../middleware/validateObjectId");

const {
  fetchAllEnquiry,
  fetchEnquiryById,
  updateEnquiryById,
  deleteEnquiryById,
} = require("../controllers/enquiryController");

// GET all enquiries
router.get("/", fetchAllEnquiry);

// GET single enquiry
router.get("/:id", validateObjectId("id"), fetchEnquiryById);

// PATCH mark enquiry as replied
router.patch("/:id/reply", validateObjectId("id"), updateEnquiryById);

// DELETE enquiry
router.delete("/:id", validateObjectId("id"), deleteEnquiryById);

module.exports = router;
