const Membership = require("../models/Membership");

// Create New Membership Plan
const createMembership = async (req, res) => {
  const { membershipId } = req.body;

  try {
    const existingMembership = await Membership.findOne({ membershipId });

    if (existingMembership) {
      return res
        .status(400)
        .json({ message: "Membership Plan already exists" });
    }

    const membership = new Membership({
      ...req.body,
    });

    await membership.save();

    const membershipResponse = membership.toObject();

    res.status(201).json({
      message: `Membership Plan created successfully`,
      membership: membershipResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch All Membership Plan
const fetchAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();

    res.status(200).json(memberships);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch Membership Plan by Id
const fetchMembershipById = async (req, res) => {
  const membershipId = req.params.id;
  try {
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      return res.status(404).json({ message: "Membership Plan not found" });
    }
    res.status(200).json({ membership: membership });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Membership Plan by Id
const updateMembershipById = async (req, res) => {
  const membershipId = req.params.id;
  const { updatedData } = req.body;
  try {
    const membership = await Membership.findByIdAndUpdate(
      membershipId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!membership) {
      return res.status(404).json({ message: "Membership Plan not found" });
    }

    const membershipResponse = membership.toObject();
    res.status(200).json({
      message: "Membership Plan updated successfully",
      membership: membershipResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Delete Membership Plan by Id
const deleteMembershipById = async (req, res) => {
  const membershipId = req.params.id;

  try {
    const membership = await Membership.findByIdAndDelete(membershipId);

    if (!membership) {
      return res.status(404).json({ message: "Membership Plan not found" });
    }

    res.status(200).json({ message: "Membership Plan Deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createMembership,
  fetchAllMemberships,
  fetchMembershipById,
  updateMembershipById,
  deleteMembershipById,
};
