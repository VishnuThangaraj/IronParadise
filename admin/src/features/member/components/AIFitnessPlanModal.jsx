import { useState, useEffect } from "react";
import { LuSparkles, LuX } from "react-icons/lu";

const AIFitnessPlanModal = ({ isOpen, onClose, member, latestMeasurement, onGenerate, isGenerating, existingPlan }) => {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    activity_level: "sedentary",
    goal: "maintain",
    dietary_preference: "none",
  });

  useEffect(() => {
    if (isOpen) {
      if (existingPlan) {
        setFormData({
          weight: existingPlan.weight || latestMeasurement?.weight || "",
          height: existingPlan.height || latestMeasurement?.height || "",
          activity_level: existingPlan.activity_level || "sedentary",
          goal: existingPlan.goal || "maintain",
          dietary_preference: existingPlan.dietary_preference || "none",
        });
      } else {
        setFormData({
          weight: latestMeasurement?.weight || "",
          height: latestMeasurement?.height || "",
          activity_level: "sedentary",
          goal: "maintain",
          dietary_preference: "none",
        });
      }
    }
  }, [isOpen, latestMeasurement, existingPlan]);

  if (!isOpen) return null;

  const calculateAge = (dob) => {
    if (!dob) return 25;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const age = calculateAge(member?.dob);
    const gender = member?.gender?.toLowerCase() || "male";

    onGenerate({
      memberId: member.memberId,
      age: age,
      gender: gender,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      activity_level: formData.activity_level,
      goal: formData.goal,
      dietary_preference: formData.dietary_preference,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in font-montserrat p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <LuX className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
              <LuSparkles className="w-6 h-6 text-indigo-50" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Generate AI Fitness Plan</h2>
              <p className="text-xs text-indigo-100 font-medium mt-1">
                Personalized for {member?.name || "Member"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Weight (kg)</label>
              <input
                type="number"
                required
                step="0.1"
                min="10"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="e.g. 75"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Height (cm)</label>
              <input
                type="number"
                required
                step="0.1"
                min="50"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="e.g. 175"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity Level</label>
            <select
              value={formData.activity_level}
              onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
              className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            >
              <option value="sedentary">Sedentary (Little to no exercise)</option>
              <option value="lightly_active">Lightly Active (Light exercise 1-3 days/week)</option>
              <option value="moderately_active">Moderately Active (Moderate exercise 3-5 days/week)</option>
              <option value="very_active">Very Active (Heavy exercise 6-7 days/week)</option>
              <option value="extra_active">Extra Active (Very heavy exercise, physical job)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fitness Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "lose_weight", label: "Lose Weight" },
                { value: "maintain", label: "Maintain" },
                { value: "gain_muscle", label: "Gain Muscle" },
              ].map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: goal.value })}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    formData.goal === goal.value
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dietary Preference</label>
            <select
              value={formData.dietary_preference}
              onChange={(e) => setFormData({ ...formData, dietary_preference: e.target.value })}
              className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            >
              <option value="none">None (Standard Diet)</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
              <option value="pescatarian">Pescatarian</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-5 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <LuSparkles className="w-4 h-4" />
                  Generate Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIFitnessPlanModal;
