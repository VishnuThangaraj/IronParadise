const Membership = require("../models/Membership");

// Create New Membership Plan
const createMembership = async (req, res) => {
  const { memberId, plan, price, durationMonths, startDate, endDate } =
    req.body;

  try {
    const member = await Member.findOne({ memberId });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const existingMembership = await Membership.findOne({
      memberId: member._id,
    });

    if (existingMembership) {
      return res
        .status(400)
        .json({ message: "Membership already exists for the Member." });
    }

    const membership = await Membership.create({
      memberId: member._id,
      plan,
      price,
      durationMonths,
      startDate,
      endDate,
    });

    const populatedMembership = await Membership.findById(membership._id)
      .populate("memberId")
      .populate("plan");

    res.status(201).json({
      message: "Membership created successfully",
      membership: populatedMembership,
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
    const membership =
      await Membership.findById(membershipId).populate("memberId");
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
      },
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
