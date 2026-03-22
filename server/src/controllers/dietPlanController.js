const DietPlan = require("../models/DietPlan");
const MemberFitnessPlan = require("../models/MemberFitnessPlan");

const {getAll, getById} = require("../queries/generalQueries");

// Create New Diet Plan
const createDietPlan = async (req, res) => {
    const {dietPlanId, dietPlanName} = req.body;

    try {
        if (!dietPlanId || !dietPlanName) {
            return res.status(400).json({
                success: false,
                message: "Diet plan Id and Name are required"
            });
        }

        const existingDietPlan = await DietPlan.findOne({
            $or: [{dietPlanId}, {dietPlanName}]
        });

        if (existingDietPlan) {
            if (existingDietPlan.dietPlanId === dietPlanId) {
                return res.status(409).json({
                    success: false,
                    message: "Diet plan with this ID already exists"
                });
            }

            if (existingDietPlan.dietPlanName === dietPlanName) {
                return res.status(409).json({
                    success: false,
                    message: "Diet plan with this name already exists"
                });
            }
        }

        const dietPlan = new DietPlan({
            ...req.body
        });

        await dietPlan.save();

        const dietPlanResponse = dietPlan.toObject();

        return res.status(201).json({
            success: true,
            message: "Diet plan created successfully",
            dietPlan: dietPlanResponse
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

// Fetch All Diet Plans
const fetchAllDietPlans = async (req, res) => {
    try {
        const dietPlans = await DietPlan.aggregate(getAll());

        res.status(200).json({
            success: true,
            message: 'Diet plans have been fetched successfully',
            dietPlans
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// Fetch Diet Plan by ID
const fetchDietPlanById = async (req, res) => {
    const dietPlanId = req.params.id;
    try {
        const dietPlan = await DietPlan.aggregate(getById(dietPlanId));

        if (!dietPlan) {
            return res.status(404).json({success: false, message: "Diet Plan not found"});
        }

        res.status(200).json({
            success: true,
            message: "Diet plan have been fetched successfully",
            dietPlan: dietPlan[0] || {}
        });
    } catch (err) {
        res.status(500).json({success: false, message: "Server error", error: err.message});
    }
};

// Update Diet Plan by ID
const updateDietPlanById = async (req, res) => {
    const dietPlanId = req.params.id;
    const {updatedData} = req.body;
    try {
        const existingDietPlan = await DietPlan.findOne({
            dietPlanName: updatedData?.dietPlanName,
            _id: {$ne: dietPlanId}
        });

        if (existingDietPlan) {
            return res.status(409).json({
                success: false,
                message: "A Diet plan with this name already exists"
            })
        }

        const dietPlan = await DietPlan.findByIdAndUpdate(dietPlanId, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!dietPlan) {
            return res.status(404).json({success: false, message: "Diet Plan not found"});
        }

        const dietPlanResponse = dietPlan.toObject();

        res.status(200).json({
            success: true,
            message: "Diet plan updated successfully",
            dietPlan: dietPlanResponse,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// Delete Diet Plan by ID
const deleteDietPlanById = async (req, res) => {
    const dietPlanId = req.params.id;

    try {
        const memberFitnessPlan = await MemberFitnessPlan.findOne({dietPlan: dietPlanId});

        if (memberFitnessPlan) {
            return res.status(409).json({
                success: false,
                message: "Diet plan is assigned to members and cannot be deleted"
            })
        }

        const dietPlan = await DietPlan.findByIdAndDelete(dietPlanId);

        if (!dietPlan) {
            return res.status(404).json({success: false, message: "No Diet plan found with the given ID"});
        }

        res.status(200).json({
            success: true,
            message: "Diet plan Deleted successfully",
            dietPlanId: dietPlanId,
        });
    } catch (err) {
        res.status(500).json({success: false, message: "Server error", error: err.message});
    }
};

module.exports = {
    createDietPlan,
    fetchAllDietPlans,
    fetchDietPlanById,
    updateDietPlanById,
    deleteDietPlanById,
};
