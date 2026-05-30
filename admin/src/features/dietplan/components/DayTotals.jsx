import { motion } from "motion/react";
import { LuFlame, LuApple, LuScale, LuInfo, LuTrendingUp } from "react-icons/lu";
import PropTypes from "prop-types";

const DayTotals = ({ activeDay, totals }) => {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <LuTrendingUp className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {capitalize(activeDay)}'s Totals
          </h2>
        </div>
        <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md uppercase">
          Live Macro Count
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {/* Calories */}
        <div className="bg-slate-800/60 border border-slate-700/30 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
            <LuFlame className="w-3 h-3 text-orange-400" /> Calories
          </span>
          <span className="text-lg font-extrabold text-slate-100 mt-1">
            {totals.calories} <span className="text-[10px] font-bold text-slate-400">kcal</span>
          </span>
        </div>

        {/* Protein */}
        <div className="bg-slate-800/60 border border-slate-700/30 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
            <LuApple className="w-3 h-3 text-emerald-400" /> Protein
          </span>
          <span className="text-lg font-extrabold text-slate-100 mt-1">
            {totals.protein} <span className="text-[10px] font-bold text-slate-400">g</span>
          </span>
        </div>

        {/* Carbs */}
        <div className="bg-slate-800/60 border border-slate-700/30 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
            <LuScale className="w-3 h-3 text-amber-400" /> Carbs
          </span>
          <span className="text-lg font-extrabold text-slate-100 mt-1">
            {totals.carbs} <span className="text-[10px] font-bold text-slate-400">g</span>
          </span>
        </div>

        {/* Fat */}
        <div className="bg-slate-800/60 border border-slate-700/30 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
            <LuInfo className="w-3 h-3 text-red-400" /> Fats
          </span>
          <span className="text-lg font-extrabold text-slate-100 mt-1">
            {totals.fat} <span className="text-[10px] font-bold text-slate-400">g</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

DayTotals.propTypes = {
  activeDay: PropTypes.string.isRequired,
  totals: PropTypes.shape({
    calories: PropTypes.number,
    protein: PropTypes.number,
    carbs: PropTypes.number,
    fat: PropTypes.number,
  }).isRequired,
};

export default DayTotals;
