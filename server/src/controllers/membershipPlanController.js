const Membership = require("../models/Membership")
const MembershipPlan = require("../models/MembershipPlan");

const {getAll, getById} = require("../queries/generalQueries");

// Create New Membership Plan
const createMembershipPlan = async (req, res) => {
    const {membershipPlanId, name} = req.body;

    try {
        if (!membershipPlanId || !name) {
            return res.status(400).json({
                success: false,
                message: "Membership plan Id and Name are required"
            });
        }

        const existingMembershipPlan = await MembershipPlan.findOne({
            $or: [{membershipPlanId}, {name}]
        });

        if (existingMembershipPlan) {
            if (existingMembershipPlan.membershipPlanId === membershipPlanId) {
                return res.status(409).json({
                    success: false,
                    message: "A membership plan with this ID already exists."
                })
            }

            if (existingMembershipPlan.name === name) {
                return res.status(409).json({
                    success: false,
                    message: "A membership plan with this name already exists."
                })
            }
        }

        const membershipPlan = new MembershipPlan({
            ...req.body,
        });

        await membershipPlan.save();

        const membershipPlanResponse = membershipPlan.toObject();

        res.status(201).json({
            success: true,
            message: `Membership plan created successfully`,
            membershipPlan: membershipPlanResponse,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// Fetch All Membership Plans
const fetchAllMembershipPlans = async (req, res) => {
    try {
        const membershipPlans = await MembershipPlan.aggregate(getAll());

        res.status(200).json({
            success: true,
            message: 'Membership plans have been fetched successfully',
            membershipPlans
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// Fetch Membership Plan by ID
const fetchMembershipPlanById = async (req, res) => {
    const membershipPlanId = req.params.id;
    try {
        const membershipPlan = await MembershipPlan.aggregate(getById(membershipPlanId));

        if (!membershipPlan) {
            return res.status(404).json({success: false, message: "No membership plan found with the given ID"});
        }

        res.status(200).json({
            success: true,
            message: "Membership plan have been fetched successfully",
            membershipPlan: membershipPlan[0] || {}
        });
    } catch (err) {
        res.status(500).json({success: false, message: "Server error", error: err.message});
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
                .status(409)
                .json({success: false, message: "A membership plan with this name already exists"});
        }
        const membershipPlan = await MembershipPlan.findByIdAndUpdate(
            membershipPlanId,
            updatedData,
            {new: true, runValidators: true},
        );

        if (!membershipPlan) {
            return res.status(404).json({success: false, message: "Membership Plan not found"});
        }

        const membershipPlanResponse = membershipPlan.toObject();

        res.status(200).json({
            success: true,
            message: "Membership plan updated successfully",
            membershipPlan: membershipPlanResponse,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
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
            return res.status(409).json({
                success: false,
                message: "Membership plan is assigned to members and cannot be deleted"
            })
        }

        const membershipPlan =
            await MembershipPlan.findByIdAndDelete(membershipPlanId);

        if (!membershipPlan) {
            return res.status(404).json({success: false, message: "No membership plan found with the given ID"});
        }

        res.status(200).json({
            success: true,
            message: "Membership plan Deleted successfully",
            membershipPlanId: membershipPlanId,
        });
    } catch (err) {
        res.status(500).json({success: false, message: "Server error", error: err.message});
    }
};

module.exports = {
    createMembershipPlan,
    fetchMembershipPlanById,
    fetchAllMembershipPlans,
    updateMembershipPlanById,
    deleteMembershipPlanById,
};
