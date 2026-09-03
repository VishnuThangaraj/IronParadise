import {
  LuUtensils,
  LuEye,
  LuPencil,
  LuTrash2,
  LuTarget,
} from "react-icons/lu";

import Chip from "@/shared/components/ui/chip/Chip";
import Button from "@/shared/components/ui/buttons/Button";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import Container from "@/shared/components/ui/containers/Container";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";

import type { DietPlan } from "@/modules/diet-plan/types/diet-plan.types";

export interface DietPlanGridProps {
  rows: DietPlan[];
  loading?: boolean;
  editPlan: (planId: string) => void;
  deletePlan: (planId: string) => void;
  viewPlan: (planId: string) => void;
}

const DietPlanGrid = ({
  rows,
  loading,
  editPlan,
  viewPlan,
  deletePlan,
}: DietPlanGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {rows.map((row, index) => {
        return (
          <Container
            variant="secondary"
            key={`DPL-GRID-${index}`}
            className="flex-col justify-between p-6! gap-4 rounded-2xl! group hover:z-30 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-black/40 hover:-translate-y-0.5"
          >
            {/* Top Content */}
            <div className="flex flex-col gap-4">
              {/* Header: Icon, Plan Name & Status */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl ${getDeterministicGradient(
                    row?._id || row?.dietPlanId,
                  )} flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0`}
                >
                  <LuUtensils size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate tracking-tight">
                    {row.planName}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <LuTarget className="w-3 h-3 text-slate-400 shrink-0" />
                    <div className="text-[10px] primary-text font-bold uppercase tracking-wider truncate">
                      {row.goal}
                    </div>
                  </div>
                </div>
              </div>
              {/* Description */}
              <div className="text-slate-500 font-medium text-[11px] leading-relaxed line-clamp-3 min-h-8">
                {row.description || 'No Description Provided :)'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 font-semibold"
                loading={loading}
                variant="transparent"
                onClick={() => viewPlan(row.dietPlanId as string)}
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
                  onClick={() => editPlan(row.dietPlanId as string)}
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
                  onClick={() => deletePlan(row.dietPlanId as string)}
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

export default DietPlanGrid;
