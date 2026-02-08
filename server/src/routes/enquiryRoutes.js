const express = require("express");
const router = express.Router();

const validateObjectId = require("../middleware/validateObjectId");

const {
  fetchAllEnquiry,
  fetchEnquiryById,
  updateEnquiryById,
  addNewEnquiry,
  deleteEnquiryById,
} = require("../controllers/enquiryController");

// GET all enquiries
router.get("/", fetchAllEnquiry);

// POST new Enquiry
router.post("/create/", addNewEnquiry);

// GET single enquiry
router.get("/:id", validateObjectId("id"), fetchEnquiryById);

// PATCH mark enquiry as replied
router.patch("/:id/reply", validateObjectId("id"), updateEnquiryById);

// DELETE enquiry
router.delete("/:id", validateObjectId("id"), deleteEnquiryById);

module.exports = router;
