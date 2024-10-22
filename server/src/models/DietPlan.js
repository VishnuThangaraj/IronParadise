const { Schema, model } = require("mongoose");

const dietPlanSchema = new Schema(
  {
    dietPlanName: { type: String, required: true },
    mondayBreakfast: { type: String, required: true },
    mondayLunch: { type: String, required: true },
    mondayDinner: { type: String, required: true },
    tuesdayBreakfast: { type: String, required: true },
    tuesdayLunch: { type: String, required: true },
    tuesdayDinner: { type: String, required: true },
    wednesdayBreakfast: { type: String, required: true },
    wednesdayLunch: { type: String, required: true },
    wednesdayDinner: { type: String, required: true },
    thursdayBreakfast: { type: String, required: true },
    thursdayLunch: { type: String, required: true },
    thursdayDinner: { type: String, required: true },
    fridayBreakfast: { type: String, required: true },
    fridayLunch: { type: String, required: true },
    fridayDinner: { type: String, required: true },
    saturdayBreakfast: { type: String, required: true },
    saturdayLunch: { type: String, required: true },
    saturdayDinner: { type: String, required: true },
    sundayBreakfast: { type: String, required: true },
    sundayLunch: { type: String, required: true },
    sundayDinner: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = model("DietPlan", dietPlanSchema);
