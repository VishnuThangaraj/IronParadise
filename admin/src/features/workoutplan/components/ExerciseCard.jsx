import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LuPlus, LuTrash2, LuDumbbell } from "react-icons/lu";
import PropTypes from "prop-types";

const ExerciseCard = ({ exercises, onAddExercise, onRemoveExercise, disabled }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    rest: "",
    notes: "",
  });

  const handleOpenAddForm = () => {
    setIsAdding(true);
    setNewExercise({
      name: "",
      sets: "",
      reps: "",
      rest: "",
      notes: "",
    });
  };

  const handleCloseAddForm = () => {
    setIsAdding(false);
  };

  const handleNewExerciseChange = (e) => {
    const { name, value } = e.target;
    setNewExercise((prev) => ({ ...prev, [name]: value }));
  };

  const isFormInvalid = !newExercise.name.trim();

  const handleSaveExercise = () => {
    if (isFormInvalid) return;
    onAddExercise(newExercise);
    setIsAdding(false);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col h-full">
      {/* Exercise Card Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
          <LuDumbbell className="w-4 h-4 text-indigo-500" />
          Exercises
        </h4>
        {!disabled && (
          <button
            type="button"
            onClick={handleOpenAddForm}
            disabled={isAdding}
            className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 disabled:text-indigo-300 transition-colors duration-200 cursor-pointer"
          >
            <LuPlus className="w-3.5 h-3.5" /> Add Exercise
          </button>
        )}
      </div>

      {/* Exercises List */}
      <div className="flex-1 space-y-3 min-h-[80px]">
        {exercises.length === 0 ? (
          <div className="h-full min-h-[80px] border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[10px] font-medium p-4 text-center">
            No exercises added yet. Click "Add Exercise" to customize.
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {exercises.map((exercise, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start justify-between gap-2 hover:bg-slate-100/70 transition-all duration-200"
                >
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-800">
                      {exercise.name}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] font-bold text-slate-500">
                      {exercise.sets && (
                        <span className="bg-slate-200/60 px-1.5 py-0.5 rounded-md text-indigo-700">
                          Sets: {exercise.sets}
                        </span>
                      )}
                      {exercise.reps && (
                        <span className="bg-slate-200/60 px-1.5 py-0.5 rounded-md text-indigo-700">
                          Reps: {exercise.reps}
                        </span>
                      )}
                      {exercise.rest && <span>Rest: {exercise.rest}</span>}
                      {exercise.notes && <span>• {exercise.notes}</span>}
                    </div>
                  </div>

                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => onRemoveExercise(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all duration-200 cursor-pointer shrink-0"
                    >
                      <LuTrash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Inline Form to add exercise */}
      <AnimatePresence>
        {isAdding && !disabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4 pt-4 border-t border-slate-100"
          >
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  Exercise Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newExercise.name}
                  onChange={handleNewExerciseChange}
                  placeholder="e.g. Barbell Squat"
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:bg-white transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    Sets
                  </label>
                  <input
                    type="number"
                    name="sets"
                    value={newExercise.sets}
                    onChange={handleNewExerciseChange}
                    placeholder="3"
                    min="0"
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:bg-white transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    Reps
                  </label>
                  <input
                    type="text"
                    name="reps"
                    value={newExercise.reps}
                    onChange={handleNewExerciseChange}
                    placeholder="8-12"
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:bg-white transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    Rest
                  </label>
                  <input
                    type="text"
                    name="rest"
                    value={newExercise.rest}
                    onChange={handleNewExerciseChange}
                    placeholder="90s"
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  Notes
                </label>
                <input
                  type="text"
                  name="notes"
                  value={newExercise.notes}
                  onChange={handleNewExerciseChange}
                  placeholder="Keep back straight"
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:bg-white transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCloseAddForm}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-200 text-slate-600 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveExercise}
                  disabled={isFormInvalid}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-200 shadow-xs"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ExerciseCard.propTypes = {
  exercises: PropTypes.array.isRequired,
  onAddExercise: PropTypes.func.isRequired,
  onRemoveExercise: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ExerciseCard;
