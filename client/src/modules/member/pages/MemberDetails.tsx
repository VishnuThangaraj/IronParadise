import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch } from "@/app/store";

import {
  LuUtensils,
  LuCalendar,
  LuPencil,
  LuTrash2,
  LuMail,
  LuPhone,
  LuLocate,
  LuPin,
  LuLocateFixed,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import Skeleton from "@/shared/components/ui/feedback/Skeleton";
import DaySelector from "@/shared/components/ui/date/DaySelector";
import DeleteModal from "@/shared/components/ui/modals/DeleteModal";
import Container from "@/shared/components/ui/containers/Container";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
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
  const {
    data: memberResponse,
    isLoading,
    isError,
    error,
  } = useMember(memberId || id || "");

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
            className="flex flex-col justify-between w-8/12! p-5! border border-slate-200/80 dark:border-white/10"
          >
            <div className="flex justify-between ">
              <div className="flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
                <span className="w-1 h-4.5 rounded-full bg-primary shadow-xs shadow-indigo-500/30 shrink-0" />
                <span>Assigned Plans & Trainer</span>
              </div>
              <Button type="button" variant="primary" className="py-2! px-4! text-xs font-semibold">
                Manage Assignment
              </Button>
            </div>
            <div></div>
            <div className="flex justify-end text-xs text-gray-600">Last plan update: Never</div>
          </Container>
        </div>
        <Container variant="secondary" className="w-full  !">
          d
        </Container>
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
