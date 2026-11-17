import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  LuPencil,
  LuTrash2,
  LuMail,
  LuPhone,
  LuClock,
  LuAward,
  LuDollarSign,
  LuShieldAlert,
  LuUsers,
  LuCalendarCheck2,
  LuExternalLink,
} from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";

import Button from "@/shared/components/ui/buttons/Button";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import DeleteModal from "@/shared/components/ui/modals/DeleteModal";
import Container from "@/shared/components/ui/containers/Container";
import { getInitials } from "@/shared/hooks/getInitials";

import { fetchTrainerById } from "../redux/trainer.thunks";
import {
  selectCurrentTrainer,
  selectTrainerLoading,
  selectTrainerError,
} from "../redux/trainer.selector";
import useTrainerDelete from "../hooks/use-trainer.delete";

const TrainerDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id?: string }>();

  const trainer = useSelector(selectCurrentTrainer);
  const loading = useSelector(selectTrainerLoading);
  const error = useSelector(selectTrainerError);

  const {
    isDeleting,
    openDeleteTrainerModal,
    handleDeleteTrainerClick,
    handleDeleteTrainer,
    setOpenDeleteTrainerModal,
  } = useTrainerDelete();

  useEffect(() => {
    if (id) {
      dispatch(fetchTrainerById(id));
    }
  }, [dispatch, id]);

  const targetId = trainer?.userId || id || "";

  return (
    <div className="flex flex-col gap-6 w-full pb-10 animate-fadeIn">
      {/* Top Header & Actions Bar */}
      <PageHeader
        title="Trainer Profile Dashboard"
        description="View trainer credentials, assigned members, shift hours, and payroll status."
      >
        <div className="flex items-center gap-3">
          <Tooltip title="Edit this trainer">
            <Button
              variant="blue"
              size="sm"
              onClick={() => navigate(`/trainer/edit/${targetId}`)}
              disabled={loading}
              aria-label="Edit Trainer"
            >
              <LuPencil size={15} /> Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete this trainer">
            <Button
              variant="red"
              size="sm"
              onClick={() => handleDeleteTrainerClick(targetId, true)}
              disabled={loading}
              aria-label="Delete Trainer"
            >
              <LuTrash2 size={15} />
            </Button>
          </Tooltip>
        </div>
      </PageHeader>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading trainer profile...</span>
        </div>
      ) : error ? (
        <Container variant="secondary" className="w-full! max-w-full! mx-0! p-8 text-center rounded-2xl border-rose-200">
          <p className="text-sm font-semibold text-rose-600">{error}</p>
          <Button
            onClick={() => id && dispatch(fetchTrainerById(id))}
            variant="secondary"
            size="sm"
            className="mt-4"
          >
            Try Again
          </Button>
        </Container>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
          {/* Trainer Profile Left Column */}
          <Container
            variant="secondary"
            className="w-full lg:w-4/12! max-w-none! mx-0! flex flex-col p-0! overflow-hidden rounded-2xl! shadow-xs border border-slate-200/80 dark:border-white/10"
          >
            {/* Banner */}
            <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 h-20 relative overflow-hidden flex items-start justify-between p-5 px-6">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size[14px_24px] pointer-events-none" />
              <span />
              <span
                className={`z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-md uppercase tracking-wider ${
                  (trainer?.employmentStatus || "active") === "active"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                }`}
              >
                {trainer?.employmentStatus || "Active"}
              </span>
            </div>

            {/* Avatar Header */}
            <div className="relative px-6 -mt-10 flex items-end justify-between">
              <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-900 bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md overflow-hidden select-none shrink-0 z-10">
                {trainer?.profileImage ? (
                  <img
                    className="w-full h-full object-cover"
                    src={trainer.profileImage}
                    alt={trainer?.fullName || "Trainer"}
                  />
                ) : (
                  <span className="text-white font-extrabold text-2xl tracking-wider">
                    {trainer?.fullName ? getInitials(trainer.fullName) : "TR"}
                  </span>
                )}
              </div>
            </div>

            {/* User Info Details */}
            <div className="flex flex-col gap-5 p-6 pt-3 text-sm">
              {/* Name & ID */}
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">
                  {trainer?.fullName || "---"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-block uppercase text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider font-mono">
                    ID: {trainer?.userId || "---"}
                  </span>
                  <span className="text-slate-400 text-xs">• {trainer?.qualification || "Certified Coach"}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <LuMail className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{trainer?.email || "---"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <LuPhone className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono">{trainer?.phone || "---"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <IoLocationOutline className="w-4 h-4" />
                  </div>
                  <span>{trainer?.address || "---"}</span>
                </div>
              </div>

              {/* Demographic & Employment Metadata */}
              <div className="flex flex-col gap-2.5 text-xs border-t border-slate-200/80 dark:border-white/10 pt-4">
                <div className="flex justify-between items-center w-full">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Gender</span>
                  <span className="capitalize font-semibold text-slate-800 dark:text-slate-200">
                    {trainer?.gender || "---"}
                  </span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Experience</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {trainer?.experienceYears ? `${trainer.experienceYears} Years` : "---"}
                  </span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Join Date</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {trainer?.joinDate ? new Date(trainer.joinDate).toDateString() : "---"}
                  </span>
                </div>
              </div>
            </div>
          </Container>

          {/* Right Column: Coaching Assignment, Specializations & Quick Actions */}
          <Container
            variant="secondary"
            className="w-full lg:w-8/12! max-w-none! mx-0! flex flex-col gap-8 p-6! rounded-2xl! shadow-xs border border-slate-200/80 dark:border-white/10"
          >
            {/* Header: Shift & Salary Overview */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
                <span className="w-1 h-4.5 rounded-full bg-primary shadow-xs shadow-indigo-500/30 shrink-0" />
                <span>Coaching Profile & Duties</span>
              </div>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Shift Hours */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <LuClock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Floor Shift Hours</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {trainer?.shiftTime?.start || "09:00"} - {trainer?.shiftTime?.end || "17:00"}
                  </p>
                </div>
              </div>

              {/* Monthly Salary */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <LuDollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Monthly Compensation</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    ₹{(trainer?.salary || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Qualification */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <LuAward className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Accreditation</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {trainer?.qualification || "Certified Fitness Instructor"}
                  </p>
                </div>
              </div>

              {/* Assigned Members Quick Shortcut */}
              <div
                onClick={() => navigate("/trainer/my-members")}
                className="group flex items-center justify-between gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md hover:border-indigo-500/40 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                    <LuUsers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Trainees Roster</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      Assigned Members
                    </p>
                  </div>
                </div>
                <LuExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
              </div>
            </div>

            {/* Specializations & Focus Disciplines */}
            <div className="flex flex-col gap-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Coaching Disciplines & Specializations
              </h5>
              <div className="flex flex-wrap gap-2">
                {trainer?.specialization && trainer.specialization.length > 0 ? (
                  trainer.specialization.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60"
                    >
                      ⚡ {spec}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No specific disciplines listed</span>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            {trainer?.emergencyContact && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                  <LuShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Emergency Contact
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    <strong className="text-slate-800 dark:text-slate-200">
                      {trainer.emergencyContact.fullName}
                    </strong>{" "}
                    ({trainer.emergencyContact.relation || "Contact"}) •{" "}
                    <span className="font-mono">{trainer.emergencyContact.phone}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Quick Action Buttons Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/trainer/members-attendance")}
                className="font-semibold"
              >
                <LuCalendarCheck2 className="w-4 h-4 mr-1.5 text-indigo-500" />
                View Member Attendance Logs
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/trainer/payroll")}
                className="font-semibold"
              >
                <LuDollarSign className="w-4 h-4 mr-1.5 text-emerald-500" />
                View Payroll Details
              </Button>
            </div>
          </Container>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={openDeleteTrainerModal}
        loading={isDeleting}
        onClose={() => setOpenDeleteTrainerModal(false)}
        onConfirm={handleDeleteTrainer}
        title="Delete Trainer"
        content="Are you sure you want to delete this trainer? This will remove the trainer profile from the system."
      />
    </div>
  );
};

export default TrainerDetails;
