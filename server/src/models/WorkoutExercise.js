const mongoose = require("mongoose");

const WorkoutExerciseSchema = new mongoose.Schema(
  {
    workoutPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
    },
    exerciseName: String,
    sets: Number,
    reps: Number,
    restTime: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutExercise", WorkoutExerciseSchema);
