import { motion } from "motion/react";
import { LuFileText } from "react-icons/lu";
import PropTypes from "prop-types";

const DietPlanInfo = ({ dietPlan, onChange, fields }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs"
    >
      <div className="flex items-center gap-2 mb-4">
        <LuFileText className="w-4 h-4 text-indigo-500" />
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Plan Information
        </h2>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {field.label}
            </label>
            {field.name === "description" ? (
              <textarea
                value={dietPlan[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 resize-none"
              />
            ) : (
              <input
                type="text"
                value={dietPlan[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

DietPlanInfo.propTypes = {
  dietPlan: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
};

export default DietPlanInfo;
