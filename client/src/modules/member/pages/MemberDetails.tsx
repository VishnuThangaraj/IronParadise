import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  LuUtensils,
  LuPencil,
  LuTrash2,
  LuMail,
  LuPhone,
  LuCrown,
  LuDumbbell,
  LuUserCheck,
  LuExternalLink,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import DeleteModal from "@/shared/components/ui/modals/DeleteModal";
import Container from "@/shared/components/ui/containers/Container";
import { useMember } from "../hooks/use-member";
import { useMemberDelete } from "../hooks/use-member.delete";
import { IoLocationOutline } from "react-icons/io5";
import { getInitials } from "@/shared/hooks/getInitials";

const MemberDetails = () => {
  const navigate = useNavigate();

  const { memberId, id } = useParams<{ memberId?: string; id?: string }>();

  // Delete modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Tanstack query hooks
  const { data: memberResponse, isLoading } = useMember(memberId || id || "");

  const { mutate: deleteMemberMutate, isPending: isDeleting } = useMemberDelete(
    {
      onSuccess: () => {
        setOpenDeleteModal(false);
      },
    },
  );

  const user = memberResponse?.data;

  const handleConfirmDelete = () => {
    if (user) {
      deleteMemberMutate({ id: user.userId, permanent: true });
      navigate(-1);
    }
  };

  const handleInActiveConfirm = () => {
    if (user) {
      deleteMemberMutate({ id: user.userId, permanent: false });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Actions Bar */}{" "}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <PageHeader
            title="Member Profile Dashboard"
            description="view member details"
          />
        </div>
        <div className="flex items-center gap-3">
          {/* {currentDietPlan && ( */}
          <>
            <Tooltip title="Edit this member">
              <Button
                variant="blue"
                size="sm"
                onClick={() => navigate(`/member/edit/${memberId}`)}
                disabled={isLoading}
                aria-label="Edit Member"
              >
                <LuPencil size={15} /> Edit
              </Button>
            </Tooltip>
            <Tooltip title="Delete this member">
              <Button
                variant="red"
                size="sm"
                onClick={() => setOpenDeleteModal(true)}
                disabled={isLoading}
                aria-label="Delete Member"
              >
                <LuTrash2 size={15} />
              </Button>
            </Tooltip>
          </>
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex justify-baseline gap-5 w-full">
          {/* Member Profile */}
          <Container
            variant="secondary"
            className="flex flex-col w-4/12! p-0! overflow-hidden border border-slate-200/80 dark:border-white/10"
          >
            {/* Banner */}
            <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 h-20 relative overflow-hidden flex items-start justify-between p-5 px-6">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size[14px_24px] pointer-events-none" />
              <span></span>{" "}
              {user?.isActive !== undefined && (
                <span
                  className={`z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-md ${
                    user.isActive
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              )}
            </div>

            {/* Avatar Header */}
            <div className="relative px-6 -mt-10 flex items-end justify-between">
              <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-900 bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md overflow-hidden select-none shrink-0 z-10">
                {user?.profileImage ? (
                  <img
                    className="w-full h-full object-cover"
                    src={user.profileImage}
                    alt={user?.fullName || "Member"}
                  />
                ) : (
                  <span className="text-white font-extrabold text-2xl tracking-wider">
                    {user?.fullName ? getInitials(user.fullName) : "M"}
                  </span>
                )}
              </div>
            </div>

            {/* User Info Details */}
            <div className="flex flex-col gap-5 p-6 pt-3 text-sm">
              {/* Name & ID */}
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">
                  {user?.fullName || "---"}
                </h3>
                <span className="inline-block uppercase text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider mt-1">
                  ID: {user?.userId || "---"}
                </span>
              </div>

              {/* Contact Information */}
              <div className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <LuMail className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{user?.email || "---"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <LuPhone className="w-3.5 h-3.5" />
                  </div>
                  <span>{user?.phone || "---"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <IoLocationOutline className="w-4 h-4" />
                  </div>
                  <span>{user?.address || "---"}</span>
                </div>
              </div>

              {/* Demographic & Membership Metadata */}
              <div className="flex flex-col gap-2.5 text-xs border-t border-slate-200/80 dark:border-white/10 pt-4">
                <div className="flex justify-between items-center w-full">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Gender
                  </span>
                  <span className="capitalize font-semibold text-slate-800 dark:text-slate-200">
                    {user?.gender || "---"}
                  </span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    DOB
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user?.dob ? new Date(user.dob).toDateString() : "---"}
                  </span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Member Since
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user?.createdAt
                      ? new Date(user.createdAt).toDateString()
                      : "---"}
                  </span>
                </div>
              </div>
            </div>
          </Container>

          {/* Assignment */}
          <Container
            variant="secondary"
            className="flex flex-col gap-10 w-8/12! p-5! border border-slate-200/80 dark:border-white/10"
          >
            <div className="flex justify-between ">
              <div className="flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
                <span className="w-1 h-4.5 rounded-full bg-primary shadow-xs shadow-indigo-500/30 shrink-0" />
                <span>Assigned Plans & Trainer</span>
              </div>
              <Button
                type="button"
                variant="primary"
                className="py-2! px-4! text-xs font-semibold"
              >
                Manage Assignment
              </Button>
            </div>
            {/* Assignment Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Membership Plan */}
              <div
                onClick={() => {
                  if (user?.assignment?.membershipPlanId) {
                    navigate(`/membership/${user.assignment.membershipPlanId}`);
                  }
                }}
                className={`group relative flex items-center justify-between gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md transition-all duration-200 ${
                  user?.assignment?.membershipPlanId
                    ? "cursor-pointer hover:shadow-md hover:border-amber-500/40 hover:-translate-y-0.5 hover:bg-white/80 dark:hover:bg-white/8"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-transform duration-200 group-hover:scale-105">
                    <LuCrown className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Membership Plan
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wide truncate mt-0.5">
                      {user?.assignment?.membershipPlanId || (
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-normal italic">
                          Not Assigned
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                {user?.assignment?.membershipPlanId && (
                  <Tooltip title="View Plan Details">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/membership/${user.assignment?.membershipPlanId}`,
                        );
                      }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 dark:hover:bg-amber-400/10 transition-colors shrink-0"
                      aria-label="View Membership Plan Details"
                    >
                      <LuExternalLink className="w-4 h-4" />
                    </button>
                  </Tooltip>
                )}
              </div>

              {/* Assigned Trainer */}
              <div
                onClick={() => {
                  if (user?.assignment?.trainerId) {
                    navigate(`/trainer/${user.assignment.trainerId}`);
                  }
                }}
                className={`group relative flex items-center justify-between gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md transition-all duration-200 ${
                  user?.assignment?.trainerId
                    ? "cursor-pointer hover:shadow-md hover:border-purple-500/40 hover:-translate-y-0.5 hover:bg-white/80 dark:hover:bg-white/8"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-transform duration-200 group-hover:scale-105">
                    <LuUserCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Assigned Trainer
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wide truncate mt-0.5">
                      {user?.assignment?.trainerId || (
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-normal italic">
                          Not Assigned
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                {user?.assignment?.trainerId && (
                  <Tooltip title="View Trainer Details">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trainer/${user.assignment?.trainerId}`);
                      }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10 dark:hover:bg-purple-400/10 transition-colors shrink-0"
                      aria-label="View Trainer Details"
                    >
                      <LuExternalLink className="w-4 h-4" />
                    </button>
                  </Tooltip>
                )}
              </div>

              {/* Diet Plan */}
              <div
                onClick={() => {
                  if (user?.assignment?.dietPlanId) {
                    navigate(`/plan/diet/${user.assignment.dietPlanId}`);
                  }
                }}
                className={`group relative flex items-center justify-between gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md transition-all duration-200 ${
                  user?.assignment?.dietPlanId
                    ? "cursor-pointer hover:shadow-md hover:border-emerald-500/40 hover:-translate-y-0.5 hover:bg-white/80 dark:hover:bg-white/8"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 group-hover:scale-105">
                    <LuUtensils className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Diet Plan
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wide truncate mt-0.5">
                      {user?.assignment?.dietPlanId || (
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-normal italic">
                          Not Assigned
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                {user?.assignment?.dietPlanId && (
                  <Tooltip title="View Plan Details">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/plan/diet/${user.assignment?.dietPlanId}`);
                      }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 transition-colors shrink-0"
                      aria-label="View Diet Plan Details"
                    >
                      <LuExternalLink className="w-4 h-4" />
                    </button>
                  </Tooltip>
                )}
              </div>

              {/* Workout Plan */}
              <div
                onClick={() => {
                  if (user?.assignment?.workoutPlanId) {
                    navigate(`/plan/workout/${user.assignment.workoutPlanId}`);
                  }
                }}
                className={`group relative flex items-center justify-between gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md transition-all duration-200 ${
                  user?.assignment?.workoutPlanId
                    ? "cursor-pointer hover:shadow-md hover:border-indigo-500/40 hover:-translate-y-0.5 hover:bg-white/80 dark:hover:bg-white/8"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-transform duration-200 group-hover:scale-105">
                    <LuDumbbell className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Workout Plan
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wide truncate mt-0.5">
                      {user?.assignment?.workoutPlanId || (
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-normal italic">
                          Not Assigned
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                {user?.assignment?.workoutPlanId && (
                  <Tooltip title="View Plan Details">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/plan/workout/${user.assignment?.workoutPlanId}`,
                        );
                      }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 dark:hover:bg-indigo-400/10 transition-colors shrink-0"
                      aria-label="View Workout Plan Details"
                    >
                      <LuExternalLink className="w-4 h-4" />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    user?.assignment?.status === "ACTIVE"
                      ? "bg-emerald-500"
                      : user?.assignment?.status === "EXPIRED"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                  }`}
                />
                <span>
                  Status:{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user?.assignment?.status || "ACTIVE"}
                  </span>
                </span>
              </div>
              <div>
                Last plan update:{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {user?.assignment?.updatedAt
                    ? new Date(user.assignment.updatedAt).toLocaleDateString()
                    : user?.assignment?.startDate
                      ? new Date(user.assignment.startDate).toLocaleDateString()
                      : "Never"}
                </span>
              </div>
            </div>
          </Container>
        </div>
        <Container variant="secondary" className="w-full  !"></Container>
      </div>
      {/* Member Deletion Confirmation Modal */}
      <DeleteModal
        open={openDeleteModal}
        loading={isDeleting}
        onClose={() => {
          setOpenDeleteModal(false);
        }}
        onConfirm={handleConfirmDelete}
        inActiveBtn={true}
        inActiveConfirm={handleInActiveConfirm}
        title="Delete Member"
        content="Are you sure you want to delete this member? This action can be undone by an administrator."
      />
    </div>
  );
};

export default MemberDetails;
