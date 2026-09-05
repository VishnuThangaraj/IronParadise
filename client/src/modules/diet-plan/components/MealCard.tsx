import { useState } from "react";
import Button from "@/shared/components/ui/buttons/Button";
import Container from "@/shared/components/ui/containers/Container";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import type { MealItem as Meal } from "../types/diet-plan.types";
import type { Meals } from "../constants/diet-plan.meals";

interface MealItemProps {
  meal: Meals;
  items: Meal[];
  onRemoveItem?: (index: number) => void;
  onAddItem?: (item: Meal) => void;
  readOnly?: boolean;
}

const MealCard = ({
  meal,
  items,
  onAddItem,
  onRemoveItem,
  readOnly = false,
}: MealItemProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [calories, setCalories] = useState<string | number>(0);
  const [protein, setProtein] = useState<string | number>(0);
  const [carbs, setCarbs] = useState<string | number>(0);
  const [fat, setFat] = useState<string | number>(0);

  const handleCancel = () => {
    setIsAdding(false);
    setName("");
    setQuantity("");
    setCalories(0);
    setProtein(0);
    setCarbs(0);
    setFat(0);
  };

  const handleSaveItem = () => {
    if (!name.trim()) return;

    onAddItem?.({
      name: name.trim(),
      quantity: quantity.trim() || "1",
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    });

    handleCancel();
  };

  return (
    <Container
      variant="secondary"
      key={`dpl-meal-${meal}`}
      className="flex-col p-5! gap-2"
    >
      <div className="flex justify-between gap-2.5 items-center">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <div className="uppercase font-semibold text-sm text-slate-800 dark:text-slate-100">
            {meal}
          </div>
        </div>
        {!readOnly && onAddItem && !isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding((prev) => !prev)}
            className="flex items-center text-xs text-primary font-semibold cursor-pointer select-none"
          >
            <LuPlus className="w-3.5 h-3.5" />
            <span className="ms-1">Add Item</span>
          </button>
        )}
      </div>

      {/* Meal Items */}
      <div className="flex-1 space-y-3 min-h-20">
        {items.length === 0 ? (
          <div className="h-full min-h-20 border border-dashed border-slate-200 dark:border-white/15 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 text-[10px] font-medium p-4 text-center">
            {readOnly
              ? "No items scheduled for this meal."
              : 'No items added yet. Click "Add Item" to customize.'}
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => {
              return (
                <div
                  key={`dpl-item-${index}`}
                  className="flex bg-slate-200/60 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 rounded-xl p-3 flex-col items-start justify-between gap-2.5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex justify-between w-full items-center">
                    <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">
                      {item.name}
                    </div>
                    {!readOnly && onRemoveItem && (
                      <Button
                        type="button"
                        className="rounded-full p-1! hover:bg-red-200! hover:text-red-700!"
                        variant="transparent"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onRemoveItem(index);
                        }}
                      >
                        <LuTrash2 className="text-xs h-3 w-3 cursor-pointer" />
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 text-[10px] font-bold">
                    {item.quantity && (
                      <div>
                        <span className="bg-slate-300/60 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-md">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-1.5 ps-0.5 tracking-wide text-slate-600 dark:text-slate-300">
                      <span className="text-orange-600 dark:text-orange-400">
                        {item.calories} kcal
                      </span>
                      <span className="text-slate-400 dark:text-slate-500">
                        •
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        P: {item.protein}g
                      </span>
                      <span className="text-slate-400 dark:text-slate-500">
                        •
                      </span>
                      <span className="text-amber-600 dark:text-amber-400">
                        C: {item.carbs}g
                      </span>
                      <span className="text-slate-400 dark:text-slate-500">
                        •
                      </span>
                      <span className="text-rose-600 dark:text-rose-400">
                        F: {item.fat}g
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inline Add Item Form */}
      {isAdding && (
        <div className="pt-4 mt-1 border-t border-slate-200/80 dark:border-white/10 space-y-3">
          {/* Row 1: Item Name & Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                ITEM NAME *
              </label>
              <input
                type="text"
                placeholder="e.g. Oats"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="block w-full rounded-xl border border-slate-200 dark:border-white/15 px-3 py-2 bg-white/70 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                QUANTITY
              </label>
              <input
                type="text"
                placeholder="e.g. 50g"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 dark:border-white/15 px-3 py-2 bg-white/70 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
              />
            </div>
          </div>

          {/* Row 2: KCAL, P (G), C (G), F (G) */}
          <div className="grid grid-cols-4 gap-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                KCAL
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 dark:border-white/15 px-2.5 py-2 bg-white/70 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 text-center"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                P (G)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 dark:border-white/15 px-2.5 py-2 bg-white/70 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 text-center"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                C (G)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 dark:border-white/15 px-2.5 py-2 bg-white/70 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 text-center"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                F (G)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 dark:border-white/15 px-2.5 py-2 bg-white/70 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 text-center"
              />
            </div>
          </div>

          {/* Row 3: Action Buttons */}
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
              Save Item
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default MealCard;
