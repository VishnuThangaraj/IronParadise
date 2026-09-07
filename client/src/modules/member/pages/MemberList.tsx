import { useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import DataTable from "@/shared/components/ui/table/DataTable";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import SearchBar from "@/shared/components/ui/search/SearchBar";
import DeleteModal from "@/shared/components/ui/modals/DeleteModal";
import Container from "@/shared/components/ui/containers/Container";
import SelectDropdown from "@/shared/components/ui/dropdown/SelectDropdown";
import ViewModeToggle from "@/shared/components/ui/view-mode-toggle/ViewModeToggle";

const statusFilterOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active Members" },
  { value: "inactive", label: "Inactive Members" },
];

const MemberList = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Members"
        description="Manage your gym's members ."
      >
        {" "}
        <div className="justify-center align-center">
          <Button
            variant="primary"
            className="font-semibold text-sm px-4!"
            // onClick={handleNavigateToAdd}
            aria-label="Add Member"
          >
            <div className="flex justify-between items-center gap-2">
              <FiPlus /> <span>Add Member</span>
            </div>
          </Button>
        </div>
      </PageHeader>
    </div>
  );
};

export default MemberList;
