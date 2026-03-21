const Membership = require("../models/Membership")
const MembershipPlan = require("../models/MembershipPlan");

const {getAllMembershipPlans, getMembershipPlanById} = require("../queries/membershipPlanQueries");

// Create New Membership Plan
const createMembershipPlan = async (req, res) => {
    const {membershipPlanId, name} = req.body;

    try {
        const existingMembershipPlan = await MembershipPlan.findOne({
            $or: [{membershipPlanId}, {name}]
        });
        if (existingMembershipPlan) {
            return res
                .status(400)
                .json({message: "A membership plan with this ID or name already exists."});
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
        const membershipPlans = await MembershipPlan.aggregate(getAllMembershipPlans());

        res.status(200).json(membershipPlans);
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};

// Fetch Membership Plan by ID
const fetchMembershipPlanById = async (req, res) => {
    const membershipPlanId = req.params.id;
    try {
        const membershipPlan = await MembershipPlan.aggregate(getMembershipPlanById(membershipPlanId));

        if (!membershipPlan) {
            return res.status(404).json({message: "No membership plan found with the given ID"});
        }
        res.status(200).json({membershipPlan: membershipPlan[0] || []});
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
};

// Update Membership Plan by ID
const updateMembershipPlanById = async (req, res) => {
    const membershipPlanId = req.params.id;
    const {updatedData} = req.body;
    try {
        const existingMembershipPlan = await MembershipPlan.findOne({
            name: updatedData?.name
        });

        if (existingMembershipPlan) {
            return res
                .status(400)
                .json({message: "A membership plan with this name already exists."});
        }
        const membershipPlan = await MembershipPlan.findByIdAndUpdate(
            membershipPlanId,
            updatedData,
            {new: true, runValidators: true},
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

// Delete Membership by ID
const deleteMembershipPlanById = async (req, res) => {
    const membershipPlanId = req.params.id;

    try {
        const membership = await Membership.findOne({planId: membershipPlanId});

        if (membership) {
            return res.status(409).json({message: "Membership plan is assigned to members and cannot be deleted."})
        }

        const membershipPlan =
            await MembershipPlan.findByIdAndDelete(membershipPlanId);

        if (!membershipPlan) {
            return res.status(404).json({message: "No membership plan found with the given ID"});
        }

        res.status(200).json({
            message: "Membership Plan Deleted successfully!",
            membershipPlanId: membershipPlanId,
        });
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
};

module.exports = {
    createMembershipPlan,
    fetchMembershipPlanById,
    fetchAllMembershipPlans,
    updateMembershipPlanById,
    deleteMembershipPlanById,
};
