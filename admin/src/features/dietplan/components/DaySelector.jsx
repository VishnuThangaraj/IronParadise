import PropTypes from "prop-types";

const DaySelector = ({ days, activeDay, onSelectDay }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-xs flex flex-wrap gap-1.5">
      {days.map((day) => {
        const isActive = activeDay === day;
        return (
          <button
            key={day}
            type="button"
            onClick={() => onSelectDay(day)}
            className={`flex-1 min-w-[70px] py-2 px-3 text-[11px] font-bold rounded-xl transition-all duration-250 cursor-pointer text-center capitalize ${
              isActive
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-600 bg-transparent hover:bg-slate-50"
            }`}
          >
            {day.slice(0, 3)}
          </button>
        );
      })}
    </div>
  );
};

DaySelector.propTypes = {
  days: PropTypes.array.isRequired,
  activeDay: PropTypes.string.isRequired,
  onSelectDay: PropTypes.func.isRequired,
};

export default DaySelector;
