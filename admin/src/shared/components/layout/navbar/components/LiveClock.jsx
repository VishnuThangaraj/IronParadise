import PropTypes from "prop-types";
import { LuClock, LuCalendar } from "react-icons/lu";

const LiveClock = ({ timeString, dateString }) => {
  return (
    <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 shadow-xs">
      <div className="flex items-center gap-1.5 border-r border-slate-200/80 pr-3">
        <LuClock className="w-3.5 h-3.5 text-indigo-500" />
        <span className="font-mono text-slate-700 tracking-wider tabular-nums">
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
