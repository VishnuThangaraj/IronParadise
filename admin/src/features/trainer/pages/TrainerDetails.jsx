import { useNavigate } from "react-router-dom";
import { LuArrowLeft, LuPencil, LuUser, LuMail, LuPhone, LuMapPin, LuBriefcase, LuClock, LuCalendar, LuBadgeDollar } from "react-icons/lu";
import { format } from "date-fns";

import useTrainerDetails from "../hooks/useTrainerDetails";
import Loader from "@/shared/components/ui/Loader";

const TrainerDetails = () => {
  const navigate = useNavigate();
  const { trainer, isLoading } = useTrainerDetails();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-montserrat">
        <LuUser className="w-12 h-12 mb-4 text-slate-300" />
        <h2 className="text-lg font-bold text-slate-700">Trainer Not Found</h2>
        <p className="text-sm">The trainer you are looking for does not exist.</p>
        <button
          onClick={() => navigate("/trainer/list")}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors"
        >
          Back to List
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-montserrat">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/trainer/list")}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-250 cursor-pointer shadow-xs"
          >
            <LuArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
              Trainer Profile
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Detailed view of the trainer's information.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/trainer/edit/${trainer.trainerID}`)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors text-sm font-bold shadow-xs cursor-pointer"
        >
          <LuPencil className="w-4 h-4" />
          Edit Trainer
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] overflow-hidden">
        {/* Header Section */}
        <div className="relative h-32 bg-linear-to-r from-indigo-500 to-purple-600">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center">
                <LuUser className="w-10 h-10 text-slate-400" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-6">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                trainer.isWorking
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {trainer.isWorking ? "Active (Working)" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-16 pb-8 px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">{trainer.name}</h2>
            <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wide mt-1">
              {trainer.specialization || "General Trainer"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600">
                  <LuMail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">{trainer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <LuPhone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">{trainer.mobile}</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <LuMapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <span className="text-sm font-medium leading-relaxed">
                    {trainer.address || "No address provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                Employment Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <LuBriefcase className="w-4 h-4" />
                    <span>Experience</span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    {trainer.experience} {trainer.experience === 1 ? "year" : "years"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <LuClock className="w-4 h-4" />
                    <span>Shift</span>
                  </div>
                  <span className="font-semibold text-slate-800">{trainer.shiftTime}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <LuBadgeDollar className="w-4 h-4" />
                    <span>Salary</span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    ${trainer.salary?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <LuCalendar className="w-4 h-4" />
                    <span>Joined</span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    {formatDate(trainer.joinDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                Personal Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Gender</span>
                  <span className="font-semibold text-slate-800">{trainer.gender}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(trainer.dob)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetails;
