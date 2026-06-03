import { useParams, useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

import useEditMembershipPlan from "../hooks/useEditMembershipPlan";
import MembershipPlanForm from "../components/MembershipPlanForm";
import ButtonPrimary from "@/shared/components/ui/form/button/ButtonPrimary";
import Loader from "@/shared/components/ui/Loader";

const EditMembershipPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { plan, isLoading, isSubmitting, handleMetadataChange, handleSubmit } =
    useEditMembershipPlan(id);

  if (isLoading) {
    return <Loader />;
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
              Edit Plan
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Update details for {plan?.name || "this plan"}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/membership/list")}
            className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all duration-250 cursor-pointer bg-white"
          >
            Cancel
          </button>
          <ButtonPrimary
            onClick={handleSubmit}
            loading={isSubmitting}
            loadingText="Updating..."
            className="px-5 py-2 text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            Update Plan
          </ButtonPrimary>
        </div>
      </div>

      <div className="w-full">
        <MembershipPlanForm plan={plan} onChange={handleMetadataChange} />
      </div>
    </div>
  );
};

export default EditMembershipPlan;
