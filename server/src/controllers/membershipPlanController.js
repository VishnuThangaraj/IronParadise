const MembershipPlan = require("../models/MembershipPlan");

// Create New Membership Plan
const createMembershipPlan = async (req, res) => {
  const {membershipPlanId} = req.body;

  try {
    const existingMembershipPlan = await MembershipPlan.findOne({
      membershipPlanId,
    });
    if (existingMembershipPlan) {
      return res
        .status(400)
        .json({message: "Membership Plan already exists"});
    }

    const membershipPlan = new MembershipPlan({
      ...req.body,
    });

    await membershipPlan.save();

    const membershipPlanResponse = membershipPlan.toObject();

    res.status(201).json({
      message: `Membership Plan created successfully`,
      membershipPlan: membershipPlanResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch All Membership Plans
const fetchAllMembershipPlans = async (req, res) => {
  try {
    const membershipPlans = await MembershipPlan.find();

    res.status(200).json(membershipPlans);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch Membership Plan by Id
const fetchmemberhsipPlanById = async (req, res) => {
  const membershipPlanId = req.params.id;
  try {
    const membershipPlan = await MembershipPlan.findById(membershipPlanId);
    if (!membershipPlan) {
      return res.status(404).json({message: "Membership Plan not found"});
    }
    res.status(200).json({membershipPlan: membershipPlan});
  } catch (err) {
    res.status(500).json({message: "Server error", error: err.message});
  }
};

// Update Membership Plan by Id
const updateMembershipPlanById = async (req, res) => {
  const membershipPlanId = req.params.id;
  const {updatedData} = req.body;
  try {
    const membershipPlan = await MembershipPlan.findByIdAndUpdate(
      membershipPlanId,
      updatedData,
      {new: true, runValidators: true}
    );

    if (!membershipPlan) {
      return res.status(404).json({message: "Membership Plan not found"});
    }

    const membershipPlanResponse = membershipPlan.toObject();
    res.status(200).json({
      message: "Membership Plan updated successfully",
      membershipPlan: membershipPlanResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Delete Membership by Id
const deleteMembershipPlanById = async (req, res) => {
  const membershipPlanId = req.params.id;

  try {
    const membershipPlan = await MembershipPlan.findByIdAndDelete(
      membershipPlanId
    );

    if (!membershipPlan) {
      return res.status(404).json({message: "Membership Plan not found"});
    }

    res.status(200).json({message: "Membership Plan Deleted successfully!"});
  } catch (err) {
    res.status(500).json({message: "Server error", error: err.message});
  }
};

module.exports = {
  createMembershipPlan,
  fetchmemberhsipPlanById,
  fetchAllMembershipPlans,
  updateMembershipPlanById,
  deleteMembershipPlanById,
};
