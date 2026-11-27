import {
  LuAward,
  LuClock,
  LuEye,
  LuIndianRupee,
  LuMail,
  LuPencil,
  LuPhone,
  LuTrash2,
  LuUsers,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import Chip from "@/shared/components/ui/chip/Chip";
import Container from "@/shared/components/ui/containers/Container";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";

import type { Trainer } from "../types/trainer.types";

export interface TrainerGridProps {
  rows: Trainer[];
  loading?: boolean;
  onView?: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

const getTrainerStatusChip = (trainer: Trainer) => {
  const status = trainer.employmentStatus || (trainer.isActive ? "active" : "inactive");

  if (!trainer.isActive || status === "inactive") {
    return <Chip variant="inactive" size="xs" dot label="INACTIVE" />;
  }

  switch (status) {
    case "on_leave":
      return <Chip variant="warning" size="xs" dot label="ON LEAVE" />;
    case "terminated":
      return <Chip variant="danger" size="xs" dot label="TERMINATED" />;
    case "active":
    default:
      return <Chip variant="active" size="xs" dot label="ACTIVE" />;
  }
};

const TrainerGrid = ({
  rows = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}: TrainerGridProps) => {
  if (loading && rows.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`trainer-skeleton-${index}`}
            className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800/40 animate-pulse border border-slate-200/50 dark:border-white/5"
          />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <Container
        variant="secondary"
        className="w-full! max-w-full! mx-0! p-12! rounded-2xl! flex flex-col items-center justify-center text-center gap-3"
      >
        <LuUsers className="w-10 h-10 text-slate-400 stroke-1" />
        <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
          No Trainers Found
        </h4>
        <p className="text-xs text-slate-400 max-w-sm">
          No trainers match your current search or status filter. Try adjusting
          your filters or add a new trainer.
        </p>
      </Container>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {rows.map((trainer) => {
        const initial = trainer.fullName
          ? trainer.fullName.charAt(0).toUpperCase()
          : "T";
        const specializations = Array.isArray(trainer.specialization)
          ? trainer.specialization.filter(Boolean)
          : [];
        const visibleSpecializations = specializations.slice(0, 3);
        const remainingSpecializations =
          specializations.length - visibleSpecializations.length;
        const expYears = Number(trainer.experienceYears) || 0;
        const salary = Number(trainer.salary) || 0;
        const shiftLabel =
          trainer.shiftTime?.start && trainer.shiftTime?.end
            ? `${trainer.shiftTime.start} - ${trainer.shiftTime.end}`
            : "Not set";

        return (
          <Container
            key={trainer.userId || trainer._id}
            variant="secondary"
            className="w-full! max-w-none! mx-0! flex-col justify-between p-6! gap-4 rounded-2xl! group hover:z-30 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-black/40 hover:-translate-y-0.5"
          >
            {/* Top Content */}
            <div className="flex flex-col gap-4">
              {/* Header: Avatar, Name, ID & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 min-w-[48px] max-w-[48px] min-h-[48px] max-h-[48px] rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs relative flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    {trainer.profileImage ? (
                      <img
                        src={trainer.profileImage}
                        alt={trainer.fullName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover block"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full ${getDeterministicGradient(
                        trainer.userId || trainer._id,
                      )} flex items-center justify-center text-white text-base font-bold ${
                        trainer.profileImage ? "absolute inset-0 -z-10" : ""
                      }`}
                    >
                      {initial}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate tracking-tight">
                      {trainer.fullName}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 dark:text-slate-500 truncate">
                      {trainer.userId}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">{getTrainerStatusChip(trainer)}</div>
              </div>

              {/* Meta Details */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 min-w-0">
                  <LuAward className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">
                    {expYears} {expYears === 1 ? "yr" : "yrs"} exp
                    {trainer.qualification ? ` • ${trainer.qualification}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 min-w-0">
                  <LuIndianRupee className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-semibold truncate">
                    ₹{salary.toLocaleString("en-IN")}/mo
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 min-w-0">
                  <LuClock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{shiftLabel}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 min-w-0">
                  <LuPhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{trainer.phone || "-"}</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                <LuMail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{trainer.email || "-"}</span>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap items-center gap-1.5 min-h-6">
                {visibleSpecializations.length > 0 ? (
                  <>
                    {visibleSpecializations.map((spec) => (
                      <Chip
                        key={spec}
                        variant="primary"
                        size="xs"
                        label={spec}
                      />
                    ))}
                    {remainingSpecializations > 0 && (
                      <Chip
                        variant="secondary"
                        size="xs"
                        label={`+${remainingSpecializations}`}
                      />
                    )}
                  </>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    No specializations listed
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
              <Button
                size="sm"
                className="flex-1 font-semibold"
                loading={loading}
                variant="transparent"
                onClick={() => onView?.(trainer.userId)}
                aria-label="View Details"
              >
                <LuEye size={15} className="shrink-0" />
                <span>View Details</span>
              </Button>
              <Tooltip title="Edit Trainer">
                <Button
                  size="sm"
                  variant="green"
                  loading={loading}
                  onClick={() => onEdit?.(trainer.userId)}
                  aria-label="Edit Trainer"
                >
                  <LuPencil size={14} className="shrink-0" />
                </Button>
              </Tooltip>
              <Tooltip title="Delete Trainer">
                <Button
                  size="sm"
                  variant="red"
                  loading={loading}
                  onClick={() => onDelete?.(trainer.userId)}
                  aria-label="Delete Trainer"
                >
                  <LuTrash2 size={14} className="shrink-0" />
                </Button>
              </Tooltip>
            </div>
          </Container>
        );
      })}
    </div>
  );
};

export default TrainerGrid;
