const mongoose = require("mongoose");
const Member = require("../models/Member");
const Membership = require("../models/Membership");
const MembershipPlan = require("../models/MembershipPlan");

// Create New Membership Plan
const createMembership = async (req, res) => {
  const { memberId, planId, price, durationMonths, startDate, endDate } =
    req.body;

  try {
    const memberObjectId = new mongoose.Types.ObjectId(memberId);
    const planObjectId = new mongoose.Types.ObjectId(planId);

    const member = await Member.findById(memberObjectId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const existingMembership = await Membership.findOne({
      memberId: memberObjectId,
    });

    if (existingMembership) {
      return res
        .status(400)
        .json({ message: "Membership already exists for the Member." });
    }

    const membershipPlan = await MembershipPlan.findById(planObjectId);

    if (!membershipPlan) {
      return res.status(404).json({ message: "Membership Plan not found" });
    }

    const membership = await Membership.create({
      memberId: memberObjectId,
      planId: planObjectId,
      price,
      durationMonths,
      startDate,
      endDate,
    });

    const populatedMembership = await Membership.findById(membership._id)
      .populate("memberId", "-password")
      .populate("planId");

    res.status(201).json({
      message: "Membership created successfully",
      membership: populatedMembership,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch All Membership Plan
const fetchAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find()
      .select("-createdAt -updatedAt -password -__v")
      .populate({
        path: "planId",
        select: "name",
      })
      .populate({
        path: "memberId",
        select: "name memberId",
      })
      .lean();

    const formattedMemberships = memberships.map((membership) => ({
      ...membership,

      planId: membership.planId?._id || null,
      planName: membership.planId?.name || "Not Assigned",

      memberObjectId: membership.memberId?._id || null,
      memberId: membership.memberId?.memberId || "Not Assigned",
      memberName: membership.memberId?.name || "Not Assigned",
    }));

    res.status(200).json({ memberships: formattedMemberships });
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
    const membership = await Membership.findById(membershipId)
      .populate("memberId")
      .populate("planId");

    console.log(membership);

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
