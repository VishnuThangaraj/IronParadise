import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LuX, LuActivity, LuScale, LuRuler, LuPercent } from "react-icons/lu";

const KioskMeasurementModal = ({ isOpen, onClose, onSave, userName }) => {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    bodyFat: "",
    waist: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow only numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-montserrat">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/50 shadow-2xl shadow-indigo-500/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-5 bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                  <LuActivity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-wide">Daily Log</h2>
                  <p className="text-[11px] font-medium text-slate-400">
                    How was your session, {userName}?
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <LuX className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <p className="text-xs text-slate-400 font-medium text-center">
                Track your progress by logging your daily stats. (Optional)
              </p>

              <div className="space-y-4">
                {/* Weight Field (Required effectively for tracking but optional here to allow skip) */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      <LuScale className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="e.g. 75.5"
                      className="w-full bg-slate-800 border-2 border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all font-semibold text-sm shadow-inner"
                    />
                  </div>
                </div>

                {/* Optional Fields Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Body Fat */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                      Body Fat (%)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <LuPercent className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        name="bodyFat"
                        value={formData.bodyFat}
                        onChange={handleChange}
                        placeholder="e.g. 15"
                        className="w-full bg-slate-800 border-2 border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all font-semibold text-xs shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Waist */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                      Waist (in)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <LuRuler className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        name="waist"
                        value={formData.waist}
                        onChange={handleChange}
                        placeholder="e.g. 32"
                        className="w-full bg-slate-800 border-2 border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all font-semibold text-xs shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-slate-800 p-5 bg-slate-900/50">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.weight && !formData.bodyFat && !formData.waist}
                className="flex-[2] rounded-xl bg-indigo-500 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:bg-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-500"
              >
                Save Stats
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default KioskMeasurementModal;
