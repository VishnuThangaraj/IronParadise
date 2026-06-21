import PropTypes from "prop-types";

import { LuClock, LuCalendar } from "react-icons/lu";

const LiveClock = ({ timeString, dateString }) => {
  return (
    <div className="hidden lg:flex items-center gap-4 bg-slate-50 shadow-xs px-3 py-1.5 border border-slate-100 rounded-xl font-semibold text-slate-500 text-xs">
      <div className="flex items-center gap-1.5 pr-3 border-slate-200/80 border-r">
        <LuClock className="w-3.5 h-3.5 text-indigo-500" />
        <span className="font-mono tabular-nums text-slate-700 tracking-wider">
          {timeString}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <LuCalendar className="w-3.5 h-3.5 text-indigo-500" />
        <span className="text-slate-600">{dateString}</span>
      </div>
    </div>
  );
};

LiveClock.propTypes = {
  timeString: PropTypes.string.isRequired,
  dateString: PropTypes.string.isRequired,
};

export default LiveClock;
