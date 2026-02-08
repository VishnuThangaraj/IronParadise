const Enquiry = require("../models/Enquiry");

// Fetch All Enquiries
const fetchAllEnquiry = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    res.status(200).json({ enquiries });
  } catch (err) {
    console.error("Fetch Enquiries Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add New Enquiry
const addNewEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry({ ...req.body });
    await enquiry.save();

    res.status(201).json({
      message: "Enquiry added successfully",
      enquiry,
    });
  } catch (err) {
    console.error("Adding Enquiry Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Fetch Enquiry by ID
const fetchEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).select("-__v").lean();

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({ enquiry });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark Enquiry as Replied
const updateEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { replied: true },
      { new: true, runValidators: true },
    )
      .select("-__v")
      .lean();

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({
      message: "Enquiry marked as replied",
      enquiry,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Enquiry by ID
const deleteEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id).lean();

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({
      message: "Enquiry deleted successfully",
      enquiry,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  fetchAllEnquiry,
  addNewEnquiry,
  fetchEnquiryById,
  updateEnquiryById,
  deleteEnquiryById,
};
