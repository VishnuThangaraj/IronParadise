import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import type { AppDispatch } from "@/app/store";

import { LuUtensils, LuCalendar, LuPencil, LuTrash2 } from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import Skeleton from "@/shared/components/ui/feedback/Skeleton";
import DaySelector from "@/shared/components/ui/date/DaySelector";
import DeleteModal from "@/shared/components/ui/modals/DeleteModal";
import Container from "@/shared/components/ui/containers/Container";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";

const MemberDetails = () => {
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
                  // onClick={() =>
                  //   handleNavigateToEdit(currentDietPlan.dietPlanId)
                  // }
                  aria-label="Edit Member"
                >
                  <LuPencil size={15} /> Edit
                </Button>
              </Tooltip>
              <Tooltip title="Delete this member">
                <Button
                  variant="red"
                  size="sm"
                  // onClick={() =>
                  //   handleDeletePlanClick(currentDietPlan.dietPlanId, true)
                  // }
                  aria-label="Delete Member"
                >
                  <LuTrash2 size={15} />
                </Button>
              </Tooltip>
            </>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
