import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import PropTypes from "prop-types";

const MealCard = ({ meal, items, onAddItem, onRemoveItem }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const handleOpenAddForm = () => {
    setIsAdding(true);
    setNewItem({
      name: "",
      quantity: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    });
  };

  const handleCloseAddForm = () => {
    setIsAdding(false);
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const isFormInvalid =
    !newItem.name.trim() ||
    !newItem.quantity.trim() ||
    newItem.calories === "" ||
    newItem.protein === "" ||
    newItem.carbs === "" ||
    newItem.fat === "";

  const handleSaveItem = () => {
    if (isFormInvalid) return;
    onAddItem(newItem);
    setIsAdding(false);
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col h-full">
      {/* Meal Card Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          {capitalize(meal)}
        </h4>
        <button
          type="button"
          onClick={handleOpenAddForm}
          disabled={isAdding}
          className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 disabled:text-indigo-300 transition-colors duration-200 cursor-pointer"
        >
          <LuPlus className="w-3.5 h-3.5" /> Add Item
        </button>
      </div>

      {/* Meal Items List */}
      <div className="flex-1 space-y-3 min-h-[80px]">
        {items.length === 0 ? (
          <div className="h-full min-h-[80px] border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[10px] font-medium p-4 text-center">
            No items added yet. Click "Add Item" to customize.
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start justify-between gap-2 hover:bg-slate-100/70 transition-all duration-200"
                >
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-800">
                      {item.name}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] font-bold text-slate-500">
                      {item.quantity && (
                        <span className="bg-slate-200/60 px-1.5 py-0.5 rounded-md">
                          Qty: {item.quantity}
                        </span>
                      )}
                      <span className="text-orange-600">{item.calories} kcal</span>
                      <span>•</span>
                      <span>P: {item.protein}g</span>
                      <span>•</span>
                      <span>C: {item.carbs}g</span>
                      <span>•</span>
                      <span>F: {item.fat}g</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(idx)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all duration-200 cursor-pointer shrink-0"
                  >
                    <LuTrash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Inline Form to add meal item */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4 pt-4 border-t border-slate-100"
          >
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={handleNewItemChange}
                    placeholder="e.g. Oats"
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    Quantity
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={newItem.quantity}
                    onChange={handleNewItemChange}
                    placeholder="e.g. 50g"
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    Kcal
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={newItem.calories}
                    onChange={handleNewItemChange}
                    placeholder="0"
                    min="0"
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:bg-white transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    P (g)
                  </label>
                  <input
                    type="number"
                    name="protein"
                    value={newItem.protein}
                    onChange={handleNewItemChange}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:bg-white transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    C (g)
                  </label>
                  <input
                    type="number"
                    name="carbs"
                    value={newItem.carbs}
                    onChange={handleNewItemChange}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:bg-white transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    F (g)
                  </label>
                  <input
                    type="number"
                    name="fat"
                    value={newItem.fat}
                    onChange={handleNewItemChange}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:bg-white transition-all duration-200"
                  />
                </div>
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
                  onClick={handleSaveItem}
                  disabled={isFormInvalid}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-200 shadow-xs"
                >
                  Save Item
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

MealCard.propTypes = {
  meal: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

export default MealCard;
