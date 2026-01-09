const FitnessPlan = require("../models/MemberFitnessPlan");

// Create New Fitness Plan
const createFitnessPlan = async (req, res) => {
  const { fitnessPlanId } = req.body;

  try {
    const existingFitnessPlan = await FitnessPlan.findOne({ fitnessPlanId });

    if (existingFitnessPlan) {
      return res.status(400).json({ message: "Fitness Plan already exists" });
    }

    const fitnessPlan = new FitnessPlan({
      ...req.body,
    });

    await fitnessPlan.save();

    const fitnessPlanResponse = fitnessPlan.toObject();

    res.status(201).json({
      message: `Fitness Plan created successfully`,
      fitnessPlan: fitnessPlanResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch All Fitness Plan
const fetchAllFitnessPlans = async (req, res) => {
  try {
    const fitnessPlans = await FitnessPlan.find();

    res.status(200).json(fitnessPlans);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch Fitness Plan by Id
const fetchFitnessPlanById = async (req, res) => {
  const fitnessPlanId = req.params.id;
  try {
    const fitnessPlan = await FitnessPlan.findById(fitnessPlanId);
    if (!fitnessPlan) {
      return res.status(404).json({ message: "Fitness Plan not found" });
    }
    res.status(200).json({ fitnessPlan: fitnessPlan });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Fitness Plan by Id
const updateFitnessPlanById = async (req, res) => {
  const fitnessPlanId = req.params.id;
  const { updatedData } = req.body;
  try {
    const fitnessPlan = await FitnessPlan.findByIdAndUpdate(
      fitnessPlanId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!fitnessPlan) {
      return res.status(404).json({ message: "Fitness Plan not found" });
    }

    const fitnessPlanResponse = fitnessPlan.toObject();
    res.status(200).json({
      message: "Fitness Plan updated successfully",
      fitnessPlan: fitnessPlanResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Delete Fitness Plan by Id
const deleteFitnessPlanById = async (req, res) => {
  const fitnessPlanId = req.params.id;

  try {
    const fitnessPlan = await FitnessPlan.findByIdAndDelete(fitnessPlanId);

    if (!fitnessPlan) {
      return res.status(404).json({ message: "Fitness Plan not found" });
    }

    res.status(200).json({ message: "Fitness Plan Deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createFitnessPlan,
  fetchAllFitnessPlans,
  fetchFitnessPlanById,
  updateFitnessPlanById,
  deleteFitnessPlanById,
};
