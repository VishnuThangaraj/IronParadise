const Enquiry = require("../models/Enquiry");

// Add Enquiry
const addEnquiry = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    subject,
    message,
    aadharNumber,
    panNumber,
  } = req.body.enquiryData;

  try {
    const enquiry = new Enquiry({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      aadharNumber,
      panNumber,
    });

    await enquiry.save();

    res.status(200).json({
      message: "Enquiry Added Successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch all Enquiry
const fetchEnquiry = async (req, res) => {
  try {
    const enquires = await Enquiry.find();

    res.status(200).json({ message: "Enquiry Fetched", enquires: enquires });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Enquiry
const updateEnquiry = async (req, res) => {
  const enquiryId = req.params.id;
  const { updatedData } = req.body;

  try {
    const enquiry = await Enquiry.findByIdAndUpdate(enquiryId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res
      .status(200)
      .json({ message: "Enquiry Updated successfully!", enquiry: enquiry });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Enquiry
const deleteEnquiry = async (req, res) => {
  const enquiryId = req.params.id;

  try {
    const enquiry = await Enquiry.findByIdAndDelete(enquiryId);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({ message: "Enquiry Deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addEnquiry,
  fetchEnquiry,
  deleteEnquiry,
  updateEnquiry,
};
