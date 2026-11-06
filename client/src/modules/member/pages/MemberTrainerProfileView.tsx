import { useNavigate } from "react-router-dom";
import {
  LuUsers,
  LuClock,
  LuMail,
  LuArrowLeft,
  LuMessageSquare,
  LuAward,
} from "react-icons/lu";

import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import Button from "@/shared/components/ui/buttons/Button";

import { useMemberSelfTrainer } from "../hooks/use-member-self-trainer";

export const MemberTrainerProfileView = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, isError, error, refetch } = useMemberSelfTrainer();

  const trainer = response?.data;

  return (
    <div className="flex flex-col gap-6 w-full pb-10 animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="My Assigned Coach"
        description="View your dedicated personal trainer's profile, credentials, shift timing, and contact channels."
      >
        <Button
          onClick={() => navigate("/dashboard")}
          variant="secondary"
          size="sm"
          className="rounded-xl! font-semibold!"
        >
          <LuArrowLeft className="w-4 h-4 mr-1 text-slate-500" />
          Dashboard
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading coach profile...</span>
        </div>
      ) : isError ? (
        <Container variant="secondary" className="p-8 text-center rounded-2xl border-rose-200">
          <p className="text-sm font-semibold text-rose-600">
            {error instanceof Error ? error.message : "Failed to load trainer profile."}
          </p>
          <Button onClick={() => refetch()} variant="secondary" size="sm" className="mt-4">
            Try Again
          </Button>
        </Container>
      ) : !trainer ? (
        /* Empty State: No Personal Trainer Assigned */
        <Container
          variant="secondary"
          className="p-12 text-center rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4"
        >
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center text-3xl shadow-sm">
            <LuUsers />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">
              No Personal Coach Assigned Yet
            </h4>
            <p className="text-sm text-slate-500 max-w-md mt-1">
              You currently do not have a dedicated personal trainer linked to your account.
              Please reach out to the gym front desk or management to assign a fitness trainer.
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="primary"
            size="sm"
            className="rounded-xl! font-semibold! mt-2"
          >
            Return to Dashboard
          </Button>
        </Container>
      ) : (
        /* Detailed Trainer Profile */
        <div className="flex flex-col gap-6">
          {/* Hero Profile Card */}
          <Container
            variant="secondary"
            className="w-full! max-w-none! mx-0! p-6! sm:p-8! rounded-3xl! border-indigo-200/50! dark:border-indigo-900/30! bg-linear-to-br from-white via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="relative shrink-0">
                {trainer.profileImage ? (
                  <img
                    src={trainer.profileImage}
                    alt={trainer.fullName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-black ring-4 ring-indigo-500/20 shadow-md">
                    {trainer.fullName?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-xs text-white">
                  ✓
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                    {trainer.fullName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-300/40 font-mono">
                    {trainer.userId}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {trainer.qualification}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {trainer.experienceYears} Years Professional Fitness Experience
                </p>
              </div>
            </div>

            {/* Quick Shift Badge */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0 bg-white/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 backdrop-blur-xs w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Floor Hours
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                <LuClock className="w-4 h-4 text-indigo-500" />
                <span>
                  {trainer.shiftTime?.start} - {trainer.shiftTime?.end}
                </span>
              </div>
            </div>
          </Container>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specializations & Expertise */}
            <Container
              variant="secondary"
              className="p-6! rounded-3xl! border-slate-200/80 dark:border-slate-800 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <LuAward className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-slate-800 dark:text-white">
                  Coaching Specializations
                </h4>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your trainer possesses certified competence in the following fitness disciplines:
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {trainer.specialization?.map((spec, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60"
                  >
                    ⚡ {spec}
                  </span>
                ))}
              </div>
            </Container>

            {/* Contact Channels Card */}
            <Container
              variant="secondary"
              className="p-6! rounded-3xl! border-slate-200/80 dark:border-slate-800 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <LuMail className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-slate-800 dark:text-white">
                  Contact Information
                </h4>
              </div>

              <div className="flex flex-col gap-3 pt-1 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">Email Address:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 select-all">
                    {trainer.email}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">Phone Number:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono select-all">
                    {trainer.phone || "On File"}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => navigate("/message")}
                  variant="primary"
                  size="sm"
                  className="w-full! rounded-xl! font-semibold!"
                >
                  <LuMessageSquare className="w-4 h-4 mr-1.5" />
                  Chat with Coach in Messages
                </Button>
              </div>
            </Container>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberTrainerProfileView;
