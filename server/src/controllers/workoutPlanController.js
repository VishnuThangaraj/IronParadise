const WorkoutPlan = require("../models/WorkoutPlan");

// Create New Workout Plan
const createWorkoutPlan = async (req, res) => {
    const {workoutPlanId} = req.body;

    try {
        const existingWorkoutPlan = await WorkoutPlan.findOne({workoutPlanId});

        if (existingWorkoutPlan) {
            return res
                .status(400)
                .json({message: "Workout Plan already exists"});
        }

        const workoutPlan = new WorkoutPlan({
            ...req.body,
        });

        await workoutPlan.save();

        const workoutPlanResponse = workoutPlan.toObject();


        res.status(201).json({
            message: `Workout Plan created successfully`,
            workoutPlan: workoutPlanResponse,
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
}

// Fetch All Workout Plan
const fetchAllWorkoutPlans = async (req, res) => {
    try {
        const workoutPlans = await WorkoutPlan.find();

        res.status(200).json(workoutPlans);
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
}

// Fetch Workout Plan by Id
const fetchWorkoutPlanById = async (req, res) => {
    const workoutPlanId = req.params.id;
    try {
        const workoutPlan = await WorkoutPlan.findById(workoutPlanId);
        if (!workoutPlan) {
            return res.status(404).json({message: "Workout Plan not found"});
        }
        res.status(200).json({workoutPlan: workoutPlan});
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
}

// Update Workout Plan by Id
const updateWorkoutPlanById = async (req, res) => {
    const workoutPlanId = req.params.id;
    const {updatedData} = req.body;
    try {
        const workoutPlan = await WorkoutPlan.findByIdAndUpdate(
            workoutPlanId,
            updatedData,
            {new: true, runValidators: true}
        );

        if (!workoutPlan) {
            return res.status(404).json({message: "Workout Plan not found"});
        }

        const workoutPlanResponse = workoutPlan.toObject();
        res.status(200).json({
            message: "Workout Plan updated successfully",
            workoutPlan: workoutPlanResponse,
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};

// Delete Workout Plan by Id
const deleteWorkoutPlanById = async (req, res) => {
    const workoutPlanId = req.params.id;

    try {
        const workoutPlan = await WorkoutPlan.findByIdAndDelete(
            workoutPlanId
        );

        if (!workoutPlan) {
            return res.status(404).json({message: "Workout Plan not found"});
        }

        res.status(200).json({message: "Workout Plan Deleted successfully!"});
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
};

module.exports = {
    createWorkoutPlan,
    fetchAllWorkoutPlans,
    fetchWorkoutPlanById,
    updateWorkoutPlanById,
    deleteWorkoutPlanById
}
