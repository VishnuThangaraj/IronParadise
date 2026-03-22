const WorkoutPlan = require("../models/WorkoutPlan");
const MemberFitnessPlan = require("../models/MemberFitnessPlan");

const {getAll, getById} = require("../queries/generalQueries");

// Create New Workout Plan
const createWorkoutPlan = async (req, res) => {
    const {workoutPlanId, workoutPlanName} = req.body;

    try {
        if (!workoutPlanId || !workoutPlanName) {
            return res.status(400).json({
                success: false,
                message: "Workout plan Id and Name are required"
            });
        }

        const existingWorkoutPlan = await WorkoutPlan.findOne({
            $or: [{workoutPlanId}, {workoutPlanName}]
        });

        if (existingWorkoutPlan) {
            if (existingWorkoutPlan.workoutPlanId === workoutPlanId) {
                return res.status(409).json({
                    success: false,
                    message: "Workout plan with this ID already exists"
                });
            }

            if (existingWorkoutPlan.workoutPlanName === workoutPlanName) {
                return res.status(409).json({
                    success: false,
                    message: "Workout plan with this name already exists"
                });
            }
        }

        const workoutPlan = new WorkoutPlan({
            ...req.body,
        });

        await workoutPlan.save();

        const workoutPlanResponse = workoutPlan.toObject();

        res.status(201).json({
            success: true,
            message: `Workout Plan created successfully`,
            workoutPlan: workoutPlanResponse,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// Fetch All Workout Plan
const fetchAllWorkoutPlans = async (req, res) => {
    try {
        const workoutPlans = await WorkoutPlan.aggregate(getAll());

        res.status(200).json({
            success: true,
            message: 'Workout plans have been fetched successfully',
            workoutPlans
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// Fetch Workout Plan by Id
const fetchWorkoutPlanById = async (req, res) => {
    const workoutPlanId = req.params.id;
    try {
        const workoutPlan = await WorkoutPlan.aggregate(getById(workoutPlanId));

        if (!workoutPlan) {
            return res.status(404).json({success: false, message: "Workout Plan not found"});
        }
        res.status(200).json({
            success: true,
            message: "Workout plan have been fetched successfully",
            workoutPlan: workoutPlan[0] || {}
        });
    } catch (err) {
        res.status(500).json({success: false, message: "Server error", error: err.message});
    }
};

// Update Workout Plan by Id
const updateWorkoutPlanById = async (req, res) => {
    const workoutPlanId = req.params.id;
    const {updatedData} = req.body;
    try {
        const existingWorkoutPlan = await WorkoutPlan.findOne({
            workoutPlanName: updatedData?.workoutPlanName,
            _id: {$ne: workoutPlanId}
        });

        if (existingWorkoutPlan) {
            return res.status(409).json({
                success: false,
                message: "A Workout plan with this name already exists"
            })
        }

        const workoutPlan = await WorkoutPlan.findByIdAndUpdate(
            workoutPlanId,
            updatedData,
            {new: true, runValidators: true},
        );

        if (!workoutPlan) {
            return res.status(404).json({success: false, message: "Workout Plan not found"});
        }

        const workoutPlanResponse = workoutPlan.toObject();
        res.status(200).json({
            success: true,
            message: "Workout Plan updated successfully",
            workoutPlan: workoutPlanResponse,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// Delete Workout Plan by ID
const deleteWorkoutPlanById = async (req, res) => {
    const workoutPlanId = req.params.id;

    try {
        const memberFitnessPlan = await MemberFitnessPlan.findOne({workoutPlan: workoutPlanId});

        if (memberFitnessPlan) {
            return res.status(409).json({
                success: false,
                message: "Workout plan is assigned to members and cannot be deleted"
            })
        }

        const workoutPlan = await WorkoutPlan.findByIdAndDelete(workoutPlanId);

        if (!workoutPlan) {
            return res.status(404).json({message: "Workout Plan not found"});
        }

        res.status(200).json({
            success: true,
            message: "Workout Plan Deleted successfully!",
            workoutPlanId: workoutPlanId,
        });
    } catch (err) {
        res.status(500).json({success: false, message: "Server error", error: err.message});
    }
};

module.exports = {
    createWorkoutPlan,
    fetchAllWorkoutPlans,
    fetchWorkoutPlanById,
    updateWorkoutPlanById,
    deleteWorkoutPlanById,
};
