const DietPlan = require("../models/DietPlan");
const WorkoutPlan = require("../models/WorkoutPlan");

// Add New Diet Plan
const addDietPlan = async (req, res) => {
  const dietPlan = req.body.dietPlan;
  try {
    const newDietPlan = new DietPlan({ dietPlan });

    await newDietPlan.save();

    res.status(201).json({
      message: "Diet Plan added successfully",
      dietplan: newDietPlan,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch All Diet Plans
const fetchDietplans = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find();

    res
      .status(200)
      .json({ message: "Diet Plans Fetched", dietPlans: dietPlans });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a Diet PLan by ID
const updateDietplanById = async (req, res) => {
  const dietplanId = req.params.id;
  const { updatedData } = req.body;

  try {
    const dietplan = await DietPlan.findByIdAndUpdate(dietplanId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!dietplan) {
      return res.status(404).json({ message: "Diet Plan not found" });
    }

    res.status(200).json({
      message: "Diet Plan Updated successfully!",
      dietplan: dietplan,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Diet PLan by ID
const deleteDietplanById = async (req, res) => {
  const dietplanId = req.params.id;

  try {
    const dietplan = await DietPlan.findByIdAndDelete(dietplanId);

    if (!dietplan) {
      return res.status(404).json({ message: "Diet Plan not found" });
    }

    res.status(200).json({ message: "Diet Plan Deleted Successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add New Workout Plan
const addWorkoutPlan = async (req, res) => {
  const workoutPlan = req.body.workoutPlan;
  try {
    const newWorkoutplan = new WorkoutPlan({ ...workoutPlan });

    await newWorkoutplan.save();

    res.status(201).json({
      message: "Workout Plan added successfully",
      workoutplan: newWorkoutplan,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch All Workout Plans
const fetchWorkoutplans = async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find();

    res
      .status(200)
      .json({ message: "Workout Plans Fetched", workoutPlans: workoutPlans });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a Workour PLan by ID
const updateWorkoutplanById = async (req, res) => {
  const workoutplanId = req.params.id;
  const { updatedData } = req.body;

  try {
    const workoutplan = await WorkoutPlan.findByIdAndUpdate(
      workoutplanId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!workoutplan) {
      return res.status(404).json({ message: "Workout Plan not found" });
    }

    res.status(200).json({
      message: "Workout Plan Updated successfully!",
      workoutplan: workoutplan,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Workout PLan by ID
const deleteWorkoutplanById = async (req, res) => {
  const workoutplanId = req.params.id;

  try {
    const workoutplan = await WorkoutPlan.findByIdAndDelete(workoutplanId);

    if (!workoutplan) {
      return res.status(404).json({ message: "Workout Plan not found" });
    }

    res.status(200).json({ message: "Workout Plan Deleted Successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addDietPlan,
  addWorkoutPlan,
  fetchDietplans,
  fetchWorkoutplans,
  deleteDietplanById,
  updateDietplanById,
  deleteWorkoutplanById,
  updateWorkoutplanById,
};
