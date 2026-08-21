import { LuCrown, LuEye, LuPencil, LuTrash2 } from "react-icons/lu";

import type { MembershipPlan } from "../types/membership-plan.types";
import Button from "@/shared/components/ui/buttons/Button";
import Container from "@/shared/components/ui/containers/Container";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import Chip from "@/shared/components/ui/chip/Chip";

export interface MembershipPlanGridProps {
  rows: MembershipPlan[];
  loading?: boolean;
  editPlan: (planId: string) => void;
  deletePlan: (planId: string) => void;
  viewPlan: (planId: string) => void;
}

const MembershipPlanGrid = ({
  rows,
  loading,
  editPlan,
  viewPlan,
  deletePlan,
}: MembershipPlanGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {rows.map((row, index) => {
        const planFeaturesLength = row?.features?.length || 0;
        return (
          <Container
            variant="secondary"
            key={`MPL-GRID-${index}`}
            className="flex-col justify-between p-6! gap-4 rounded-2xl! group hover:z-30 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-black/40 hover:-translate-y-0.5"
          >
            {/* Top Content */}
            <div className="flex flex-col gap-4">
              {/* Header: Icon, Plan Name & Status */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl ${getDeterministicGradient(
                    row?._id || row?.membershipPlanId,
                  )} flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0`}
                >
                  <LuCrown size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-bold text-slate-800 dark:text-slate-100 truncate tracking-tight">
                    {row.planName}
                  </div>
                </div>
                <div className="ml-auto shrink-0">
                  <Chip
                    variant={row.isActive ? "active" : "inactive"}
                    size="xs"
                    dot={true}
                    label={row.isActive ? "Active" : "Inactive"}
                  />
                </div>
              </div>

              {/* Price & Duration */}
              <div className="flex items-baseline gap-1 pt-0.5">
                <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
                  ₹
                  {Number(row.price).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  / {row.durationMonths}{" "}
                  {row.durationMonths === 1 ? "Month" : "Months"}
                </span>
              </div>

              {/* Subtle Divider */}
              <div className="h-px w-full bg-slate-200/60 dark:bg-white/10" />

              {/* Features Section */}
              <div className="min-h-6.5 flex items-center">
                {planFeaturesLength > 0 ? (
                  <div className="flex items-center gap-2 text-xs w-full">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium truncate flex-1 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shrink-0" />
                      <span className="truncate">{row?.features[0]}</span>
                    </div>
                    {planFeaturesLength > 1 && (
                      <Tooltip
                        title={
                          <div className="flex flex-col gap-1 py-0.5 text-left">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              Plan Features
                            </span>
                            {row.features.map((feature, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200"
                              >
                                <span className="text-emerald-500 font-bold">
                                  ✓
                                </span>{" "}
                                {feature}
                              </div>
                            ))}
                          </div>
                        }
                        position="top"
                      >
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/15 cursor-help shrink-0 hover:bg-slate-200/80 dark:hover:bg-white/20 transition-colors leading-none">
                          +{planFeaturesLength - 1} more
                        </span>
                      </Tooltip>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 dark:text-slate-500 italic flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                    <span>Standard plan privileges</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 font-semibold"
                loading={loading}
                variant="transparent"
                onClick={() => viewPlan(row.membershipPlanId as string)}
                aria-label="View Plan"
              >
                <LuEye size={15} className="shrink-0" />
                <span>View Details</span>
              </Button>
              <Tooltip title="Edit this plan">
                <Button
                  size="sm"
                  variant="green"
                  loading={loading}
                  onClick={() => editPlan(row.membershipPlanId as string)}
                  aria-label="Edit Plan"
                >
                  <LuPencil size={14} className="shrink-0" />
                </Button>
              </Tooltip>
              <Tooltip title="Delete this plan">
                <Button
                  size="sm"
                  variant="red"
                  loading={loading}
                  onClick={() => deletePlan(row.membershipPlanId as string)}
                  aria-label="Delete Plan"
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

export default MembershipPlanGrid;
