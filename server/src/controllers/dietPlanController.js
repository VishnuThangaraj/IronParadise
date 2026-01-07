const DietPlan = require("../models/DietPlan");

// Create New Diet Plan
const createDietPlan = async (req, res) => {
  const { dietPlanId } = req.body;

  try {
    const existingDietPlan = await DietPlan.findOne({ dietPlanId });

    if (existingDietPlan) {
      return res.status(400).json({ message: "Diet Plan already exists" });
    }

    const dietPlan = new DietPlan({
      ...req.body,
    });

    await dietPlan.save();

    const dietPlanResponse = dietPlan.toObject();

    res.status(201).json({
      message: `Diet Plan created successfully`,
      dietPlan: dietPlanResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch All Diet Plan
const fetchAllDietPlans = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find();

    res.status(200).json(dietPlans);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch Diet Plan by Id
const fetchDietPlanById = async (req, res) => {
  const dietPlanId = req.params.id;
  try {
    const dietPlan = await DietPlan.findById(dietPlanId);
    if (!dietPlan) {
      return res.status(404).json({ message: "Diet Plan not found" });
    }
    res.status(200).json({ dietPlan: dietPlan });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Diet Plan by Id
const updateDietPlanById = async (req, res) => {
  const dietPlanId = req.params.id;
  const { updatedData } = req.body;
  try {
    const dietPlan = await DietPlan.findByIdAndUpdate(dietPlanId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!dietPlan) {
      return res.status(404).json({ message: "Diet Plan not found" });
    }

    const dietPlanResponse = dietPlan.toObject();
    res.status(200).json({
      message: "Diet Plan updated successfully",
      dietPlan: dietPlanResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Delete Diet Plan by Id
const deleteDietPlanById = async (req, res) => {
  const dietPlanId = req.params.id;

  try {
    const dietPlan = await DietPlan.findByIdAndDelete(dietPlanId);

    if (!dietPlan) {
      return res.status(404).json({ message: "Diet Plan not found" });
    }

    res.status(200).json({ message: "Diet Plan Deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createDietPlan,
  fetchAllDietPlans,
  fetchDietPlanById,
  updateDietPlanById,
  deleteDietPlanById,
};
