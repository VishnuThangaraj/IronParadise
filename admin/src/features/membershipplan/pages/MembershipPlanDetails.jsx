import { useParams, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuPencil, LuCalendar, LuTag, LuClock, LuBanknote } from "react-icons/lu";

import useMembershipPlanDetails from "../hooks/useMembershipPlanDetails";
import Loader from "@/shared/components/ui/Loader";

const MembershipPlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { plan, isLoading } = useMembershipPlanDetails(id);

  if (isLoading) {
    return <Loader />;
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-slate-500 font-medium">Plan not found</p>
        <button
          onClick={() => navigate("/membership/list")}
          className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-montserrat">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/membership/list")}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-250 cursor-pointer shadow-xs"
          >
            <LuArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
              {plan.name}
            </h1>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
              <LuTag className="w-3.5 h-3.5" />
              ID: {plan.membershipId}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/membership/edit/${id}`)}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-250 cursor-pointer"
        >
          <LuPencil className="w-4 h-4" />
          Edit Plan
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <LuClock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Duration</p>
              <p className="font-semibold text-slate-800">{plan.duration}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <LuBanknote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount</p>
              <p className="font-semibold text-slate-800">₹ {plan.amount?.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className={`p-3 rounded-lg ${plan.status === 'Active' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
              <LuTag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
              <p className="font-semibold text-slate-800">{plan.status}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
            Plan Description
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-xl border border-slate-100">
            {plan.description}
          </p>
        </div>

        <div className="flex items-center gap-6 pt-6 mt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <LuCalendar className="w-4 h-4 text-slate-400" />
            <span className="font-medium">Created:</span>
            {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : "N/A"}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <LuCalendar className="w-4 h-4 text-slate-400" />
            <span className="font-medium">Last Updated:</span>
            {plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString() : "N/A"}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MembershipPlanDetails;
