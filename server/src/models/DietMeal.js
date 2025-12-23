const mongoose = require("mongoose");

const DietMealSchema = new mongoose.Schema(
  {
    dietPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DietPlan",
    },
    mealTime: String,
    mealDescription: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DietMeal", DietMealSchema);
