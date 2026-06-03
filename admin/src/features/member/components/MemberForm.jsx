import { genderOptions } from "../constants/memberFields";

const MemberForm = ({ member, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={member.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. John Doe"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={member.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="e.g. john@example.com"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={member.mobile || ""}
            onChange={(e) => onChange("mobile", e.target.value)}
            placeholder="e.g. +1 234 567 8900"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Gender
          </label>
          <select
            value={member.gender || ""}
            onChange={(e) => onChange("gender", e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          >
            {genderOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Date of Birth
          </label>
          <input
            type="date"
            value={member.dob || ""}
            onChange={(e) => onChange("dob", e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>

        {/* Join Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Join Date
          </label>
          <input
            type="date"
            value={member.joinDate || ""}
            onChange={(e) => onChange("joinDate", e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>
      </div>

      <div className="pt-2">
        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={member.address || ""}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Full Address"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={member.isActive ?? true}
          onChange={(e) => onChange("isActive", e.target.checked)}
          className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
          Active Status
        </label>
      </div>
    </div>
  );
};

export default MemberForm;
