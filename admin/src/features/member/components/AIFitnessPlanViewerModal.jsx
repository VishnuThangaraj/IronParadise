import { useState } from "react";
import { LuX, LuActivity, LuUtensils, LuDumbbell, LuInfo, LuCircleCheck } from "react-icons/lu";

const AIFitnessPlanViewerModal = ({ isOpen, onClose, plan }) => {
  const [activeTab, setActiveTab] = useState("metrics");

  if (!isOpen || !plan) return null;

  const { fitness_metrics: metrics, diet_plan: diet, workout_plan: workout } = plan;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in font-montserrat p-4">
      <div className="bg-slate-50 rounded-2xl max-w-4xl w-full h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <LuX className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold">Personalized AI Fitness Plan</h2>
            <p className="text-sm text-indigo-100 font-medium mt-1">
              Generated precisely for the member's metrics and goals.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto">
            <TabButton
              active={activeTab === "metrics"}
              onClick={() => setActiveTab("metrics")}
              icon={<LuActivity />}
              label="Engine & Macros"
            />
            <TabButton
              active={activeTab === "diet"}
              onClick={() => setActiveTab("diet")}
              icon={<LuUtensils />}
              label="Diet Plan"
            />
            <TabButton
              active={activeTab === "workout"}
              onClick={() => setActiveTab("workout")}
              icon={<LuDumbbell />}
              label="Workout Plan"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {activeTab === "metrics" && (
            <div className="space-y-6 animate-slide-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard title="BMI" value={metrics.bmi} unit="" color="indigo" />
                <MetricCard title="BMR" value={Math.round(metrics.bmr)} unit="kcal" color="purple" />
                <MetricCard title="TDEE" value={Math.round(metrics.tdee)} unit="kcal" color="amber" />
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Daily Target Macros</h3>
                <div className="flex items-center justify-center mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-slate-800">{Math.round(metrics.calories)}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Calories</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <MacroCard label="Protein" value={metrics.protein_g} color="bg-rose-50 text-rose-600 border-rose-100" />
                  <MacroCard label="Carbs" value={metrics.carbs_g} color="bg-blue-50 text-blue-600 border-blue-100" />
                  <MacroCard label="Fats" value={metrics.fat_g} color="bg-amber-50 text-amber-600 border-amber-100" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "diet" && (
            <div className="space-y-6 animate-slide-in">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                <LuInfo className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-800">Dietary Preference: {diet.dietary_preference}</h4>
                  <div className="mt-2 space-y-1">
                    {diet.coaching_tips?.map((tip, idx) => (
                      <p key={idx} className="text-xs text-indigo-700/80">• {tip}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
                  Daily Meals Schedule
                </h3>
                <div className="space-y-4">
                  {diet.daily_meals?.map((meal, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-800">{meal.meal_name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg">{meal.timing}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5">{meal.description}</p>
                      </div>
                      <div className="flex gap-3 shrink-0">
                        <div className="text-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Cal</p>
                          <p className="text-xs font-bold text-slate-700">{Math.round(meal.calories)}</p>
                        </div>
                        <div className="text-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Pro</p>
                          <p className="text-xs font-bold text-slate-700">{Math.round(meal.protein_g)}g</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {diet.grocery_list && diet.grocery_list.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Grocery List</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {diet.grocery_list.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <LuCircleCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "workout" && (
            <div className="space-y-6 animate-slide-in">
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <h4 className="text-sm font-bold text-purple-800">{workout.routine_name}</h4>
                <div className="mt-2 space-y-1">
                  {workout.general_tips?.map((tip, idx) => (
                    <p key={idx} className="text-xs text-purple-700/80">• {tip}</p>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {workout.weekly_schedule?.map((dayPlan, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-800">{dayPlan.day}</h4>
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg uppercase tracking-wide">
                        {dayPlan.focus}
                      </span>
                    </div>
                    
                    <div className="p-4">
                      {dayPlan.exercises && dayPlan.exercises.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="pb-2 pr-4">Exercise</th>
                                <th className="pb-2 px-3">Sets</th>
                                <th className="pb-2 px-3">Reps/Time</th>
                                <th className="pb-2 px-3">Rest</th>
                                <th className="pb-2 pl-3">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dayPlan.exercises.map((ex, i) => (
                                <tr key={i} className="border-b border-slate-50 last:border-0 text-xs font-medium text-slate-600">
                                  <td className="py-2.5 pr-4 font-bold text-slate-700">{ex.exercise_name}</td>
                                  <td className="py-2.5 px-3">{ex.sets}</td>
                                  <td className="py-2.5 px-3">{ex.reps}</td>
                                  <td className="py-2.5 px-3">{ex.rest_seconds}s</td>
                                  <td className="py-2.5 pl-3 text-[11px] text-slate-500">{ex.notes || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 font-medium italic text-center py-4">Rest Day or Active Recovery</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
      active
        ? "bg-white text-indigo-700 shadow-sm"
        : "bg-white/10 text-white hover:bg-white/20"
    }`}
  >
    {icon}
    {label}
  </button>
);

const MetricCard = ({ title, value, unit, color }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };
  
  return (
    <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center ${colors[color]}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">{title}</p>
      <p className="text-2xl font-extrabold">
        {value} <span className="text-xs font-bold opacity-70 ml-0.5">{unit}</span>
      </p>
    </div>
  );
};

const MacroCard = ({ label, value, color }) => (
  <div className={`p-3 rounded-xl border text-center ${color}`}>
    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">{label}</p>
    <p className="text-lg font-bold">{Math.round(value)}g</p>
  </div>
);

export default AIFitnessPlanViewerModal;
