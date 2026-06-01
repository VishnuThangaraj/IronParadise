import { motion } from "motion/react";
import { LuTarget } from "react-icons/lu";
import PropTypes from "prop-types";

const DayFocus = ({ focus, onChange, disabled }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 shadow-xs"
    >
      <div className="flex items-center gap-2 mb-3">
        <LuTarget className="w-4 h-4 text-indigo-600" />
        <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
          Daily Focus
        </h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <input
          type="text"
          value={focus || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., Chest & Triceps, Active Recovery"
          disabled={disabled}
          className="px-3.5 py-2 text-xs font-semibold text-indigo-900 bg-white border border-indigo-200 rounded-xl outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 disabled:opacity-70 disabled:bg-slate-50"
        />
      </div>
    </motion.div>
  );
};

DayFocus.propTypes = {
  focus: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default DayFocus;
