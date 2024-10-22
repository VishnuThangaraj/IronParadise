const Trainer = require("../models/Trainer");

// Register Admin
const registerTrainer = async (req, res) => {
  const {
    name,
    email,
    phone,
    dob,
    gender,
    specialization,
    height,
    weight,
    bmi,
    address,
  } = req.body;
  try {
    const existingEmail = await Trainer.findOne({ email });
    const existingPhone = await Trainer.findOne({ phone });

    if (existingEmail || existingPhone) {
      return res.status(409).json({ message: "Email or Phone already exists" });
    }
    const newTrainer = new Trainer({
      name,
      email,
      phone,
      dob,
      gender,
      specialization,
      height,
      weight,
      bmi,
      address,
    });

    await newTrainer.save();
    res.status(201).json({
      message: "Trainer registered successfully",
      trainer: newTrainer,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch all Trainers
const fetchTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();

    res.status(200).json({ trainers: trainers });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch Trainer by ID
const fetchTrainerById = async (req, res) => {
  const trainerId = req.params.id;

  try {
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json({ trainer: trainer });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a Trainer by ID
const updateTrainerById = async (req, res) => {
  const trainerId = req.params.id;
  const { updatedData } = req.body;

  try {
    const trainer = await Trainer.findByIdAndUpdate(trainerId, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json({ message: "Trainer Updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Trainer by ID
const deleteTrainerById = async (req, res) => {
  const trainerId = req.params.id;

  try {
    const trainer = await Trainer.findByIdAndDelete(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json({ message: "Trainer Deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  fetchTrainers,
  registerTrainer,
  fetchTrainerById,
  updateTrainerById,
  deleteTrainerById,
};
