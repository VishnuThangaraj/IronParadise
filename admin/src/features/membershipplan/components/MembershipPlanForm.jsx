import { statusOptions } from "../constants/membershipFields";

const MembershipPlanForm = ({ plan, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Plan Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Plan Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={plan?.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. Standard Monthly"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Duration <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={plan?.duration || ""}
            onChange={(e) => onChange("duration", e.target.value)}
            placeholder="e.g. 1 Month, 3 Months"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Amount (Price) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={plan?.amount || 0}
            onChange={(e) => onChange("amount", parseInt(e.target.value) || 0)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Status
          </label>
          <select
            value={plan?.status || "Active"}
            onChange={(e) => onChange("status", e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-2">
        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="3"
            value={plan?.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Plan description and features..."
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default MembershipPlanForm;
