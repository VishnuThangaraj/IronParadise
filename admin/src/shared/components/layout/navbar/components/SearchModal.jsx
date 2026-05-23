import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "motion/react";
import { LuSearch, LuShieldAlert } from "react-icons/lu";

const SearchModal = ({
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  focusedSearchIndex,
  setFocusedSearchIndex,
  searchInputRef,
  handleSearchKeyDown,
  filteredSearchItems,
  handleSearchNavigation,
}) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-100 h-14 bg-slate-50/80">
              <LuSearch className="w-5 h-5 text-indigo-500" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type to search panels or sections (e.g. Trainers, Members, Payroll)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFocusedSearchIndex(0);
                }}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-hidden font-medium"
              />
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
              {filteredSearchItems.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2.5">
                  <LuShieldAlert className="w-10 h-10 text-slate-300" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">
                      No results found
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      No panels matching "{searchQuery}"
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Matched Panels ({filteredSearchItems.length})
                  </div>
                  {filteredSearchItems.map((item, index) => {
                    const isFocused = index === focusedSearchIndex;
                    return (
                      <div
                        key={item.path}
                        onClick={() => handleSearchNavigation(item.path)}
                        onMouseEnter={() => setFocusedSearchIndex(index)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                          isFocused
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold truncate leading-normal">
                            {item.name}
                          </span>
                          <span
                            className={`text-[10px] truncate leading-none mt-1 ${
                              isFocused ? "text-indigo-200" : "text-slate-400"
                            }`}
                          >
                            {item.desc}
                          </span>
                        </div>
                        <span
                          className={`text-[9.5px] px-2 py-0.5 rounded-md font-bold shrink-0 ml-4 ${
                            isFocused
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Footer Instructions */}
            <div className="h-10 bg-slate-50 border-t border-slate-100 flex items-center justify-between px-4 text-[10px] font-semibold text-slate-400 tracking-wide select-none shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-xs font-mono font-bold text-slate-500">
                    ↑↓
                  </kbd>{" "}
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-xs font-mono font-bold text-slate-500">
                    Enter
                  </kbd>{" "}
                  to select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-xs font-mono font-bold text-slate-500">
                  ESC
                </kbd>{" "}
                to close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

SearchModal.propTypes = {
  isSearchOpen: PropTypes.bool.isRequired,
  setIsSearchOpen: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  focusedSearchIndex: PropTypes.number.isRequired,
  setFocusedSearchIndex: PropTypes.func.isRequired,
  searchInputRef: PropTypes.shape({ current: PropTypes.any }),
  handleSearchKeyDown: PropTypes.func.isRequired,
  filteredSearchItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      desc: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleSearchNavigation: PropTypes.func.isRequired,
};

export default SearchModal;
