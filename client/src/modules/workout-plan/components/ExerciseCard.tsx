import { useState, useMemo } from "react";
import {
  LuPlus,
  LuTrash2,
  LuDumbbell,
  LuRepeat,
  LuLayers,
  LuTimer,
  LuInfo,
  LuMoon,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import Container from "@/shared/components/ui/containers/Container";

import type {
  DayWorkout,
  WorkoutExercise,
} from "@/modules/workout-plan/types/workout-plan.types";
import type { WeekDay } from "@/shared/components/ui/date/constants/week-days";

export interface ExerciseCardProps {
  activeDay: WeekDay;
  exercise?: DayWorkout | WorkoutExercise[];
  workout?: DayWorkout;
  onRemoveItem?: (index: number) => void;
  onAddItem?: (item: WorkoutExercise) => void;
  readOnly?: boolean;
}

const ExerciseCard = ({
  activeDay,
  exercise,
  workout,
  onAddItem,
  onRemoveItem,
  readOnly = false,
}: ExerciseCardProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState<string>("");
  const [sets, setSets] = useState<string | number>("");
  const [reps, setReps] = useState<string>("");
  const [rest, setRest] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const dayWorkout: DayWorkout = useMemo(() => {
    if (!exercise && !workout) {
      return { focus: "", exercises: [] };
    }
    const data = workout || exercise;
    if (Array.isArray(data)) {
      return { focus: "", exercises: data };
    }
    return {
      focus: data?.focus || "",
      exercises: Array.isArray(data?.exercises) ? data.exercises : [],
    };
  }, [exercise, workout]);

  const isRestDay = useMemo(() => {
    const focusLower = dayWorkout.focus?.toLowerCase() || "";
    return (
      (focusLower.includes("rest") || focusLower.includes("recovery")) &&
      dayWorkout.exercises.length === 0
    );
  }, [dayWorkout.focus, dayWorkout.exercises.length]);

  const handleCancel = () => {
    setIsAdding(false);
    setName("");
    setSets("");
    setReps("");
    setRest("");
    setNotes("");
  };

  const handleSaveItem = () => {
    if (!name.trim()) return;

    onAddItem?.({
      name: name.trim(),
      sets: Number(sets) || 1,
      reps: reps.trim() || "8-12 reps",
      rest: rest.trim() || "60-90 sec",
      notes: notes.trim() || "",
    });

    handleCancel();
  };

  return (
    <Container
      variant="secondary"
      key={`wpl-exercise-${activeDay}`}
      className="flex-col p-6! gap-5"
    >
      {!readOnly && onAddItem && !isAdding && (
        <div className="flex justify-end w-full -mb-2">
          <button
            type="button"
            onClick={() => setIsAdding((prev) => !prev)}
            className="flex items-center text-xs text-primary font-semibold cursor-pointer select-none"
          >
            <LuPlus className="w-3.5 h-3.5" />
            <span className="ms-1">Add Exercise</span>
          </button>
        </div>
      )}
      {/* Exercises Content Area */}
      <div className="flex-1 space-y-3 min-h-24">
        {dayWorkout.exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-slate-200 dark:border-white/15 bg-slate-50/50 dark:bg-white/2 text-center my-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center mb-3">
              {isRestDay ? (
                <LuMoon className="w-6 h-6 text-indigo-400 block" />
              ) : (
                <LuDumbbell className="w-6 h-6 text-slate-400 dark:text-slate-500 block" />
              )}
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {isRestDay ? "Rest & Recovery Day" : "No Exercises Scheduled"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
              {isRestDay
                ? "Rest days are vital for muscle protein synthesis, joint recovery, and neuromuscular reset. Stay hydrated and prioritize nutrition."
                : readOnly
                  ? "No specific exercises have been scheduled for this day in the current plan."
                  : 'No exercises added yet. Click "Add Exercise" to customize this routine.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayWorkout.exercises.map((item, index) => (
              <div
                key={`wpl-exercise-item-${index}`}
                className="group relative flex flex-col gap-2.5 p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-xs hover:shadow-md transition-all duration-200"
              >
                {/* Header: Number, Name, Delete */}
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-indigo-500/15 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-black text-indigo-600 dark:text-indigo-400 shrink-0">
                      {index + 1}
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {item.name}
                    </h4>
                  </div>

                  {!readOnly && onRemoveItem && (
                    <Button
                      type="button"
                      variant="transparent"
                      className="rounded-full p-1.5! text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveItem(index);
                      }}
                      aria-label="Remove exercise"
                    >
                      <LuTrash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                {/* Metrics: Sets, Reps, Rest */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                    <LuLayers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>
                      {item.sets} {Number(item.sets) === 1 ? "Set" : "Sets"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    <LuRepeat className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{item.reps || "N/A"}</span>
                  </div>

                  {item.rest && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                      <LuTimer className="w-3.5 h-3.5 text-amber-500 shrink-0 -translate-y-px" />
                      <span className="leading-none">{item.rest}</span>
                    </div>
                  )}
                </div>

                {/* Coaching Cues / Notes */}
                {item.notes && (
                  <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <LuInfo className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="italic">{item.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inline Add Item Form */}
      {isAdding && (
        <div className="pt-4 mt-1 border-t border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <LuPlus className="w-3.5 h-3.5 text-primary" />
            <span>Add Exercise</span>
          </div>

          {/* Row 1: Name & Sets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                EXERCISE NAME *
              </label>
              <input
                type="text"
                placeholder="e.g. Barbell Flat Bench Press"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="block w-full rounded-xl border border-slate-200 dark:border-white/15 px-3 py-2 bg-white/70 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                SETS *
              </label>
              <input
                type="number"
                min="1"
                placeholder="4"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 dark:border-white/15 px-3 py-2 bg-white/70 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 text-center"
              />
            </div>
          </div>

          {/* Row 2: Reps & Rest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                REPS TARGET *
              </label>
              <input
                type="text"
                placeholder="e.g. 6-8 reps / 8-12 reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 dark:border-white/15 px-3 py-2 bg-white/70 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                REST PERIOD
              </label>
              <input
                type="text"
                placeholder="e.g. 90 sec / 2-3 min"
                value={rest}
                onChange={(e) => setRest(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 dark:border-white/15 px-3 py-2 bg-white/70 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
              />
            </div>
          </div>

          {/* Row 3: Notes */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
              COACHING CUES / FORM NOTES
            </label>
            <input
              type="text"
              placeholder="e.g. Retract scapulae, touch lower sternum, control the descent"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 dark:border-white/15 px-3 py-2 bg-white/70 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
            />
          </div>

          {/* Row 4: Action Buttons */}
          <div className="flex justify-end items-center gap-2 pt-1">
            <Button
              type="button"
              variant="transparent"
              onClick={handleCancel}
              className="px-4! py-2! text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveItem}
              className="px-4! py-2! text-xs"
            >
              Save Exercise
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ExerciseCard;
