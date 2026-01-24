import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { toast } from "sonner";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import { PageLocation } from "../../components/PageLocation";
import DataTable from "../../components/DataTable/DataTable";
import SearchBar from "../../components/DataTable/SearchBar";
import { MembershipPlanColumns } from "./MembershipPlanColumns";
import ExportButtons from "../../components/DataTable/ExportButtons";

import {
  deleteMembershipPlanById,
  fetchAllMembershipPlans,
} from "../../redux/membershipPlan/membershipPlanThunks";
import { selectAllMembershipPlans } from "../../redux/membershipPlan/membershipPlanSelectors";

import DeletionModal from "../../components/Modal/DeletionModal";

const MembershipPlanList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const [search, setSearch] = useState("");
  const membershipPlans = useSelector(selectAllMembershipPlans);

  useEffect(() => {
    dispatch(fetchAllMembershipPlans());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase();

    return membershipPlans.filter(
      (row) =>
        row.membershipPlanId?.toString().toLowerCase().includes(query) ||
        row.name?.toString().toLowerCase().includes(query) ||
        row.durationMonths?.toString().toLowerCase().includes(query) ||
        row.price?.toString().toLowerCase().includes(query) ||
        row.features?.toString().toLowerCase().includes(query),
    );
  }, [membershipPlans, search]);

  const checkValidation = () => {
    return true;
  };

  const deleteMembershipPlanWithId = async (e) => {
    e.preventDefault();
    const validation = checkValidation();
    if (!validation) return;

    try {
      await dispatch(deleteMembershipPlanById({ membershipPlanId: deleteId }));
      toast.success("Membership Plan Deleted Successfully");
    } catch {
      toast.error("Failed to Delete Membership Plan");
    } finally {
      setDeleteId(null);
      setOpenDelete(false);
    }
  };

  return (
    <div key="MembershipPlan-List">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Membership"
        currentPath="Membership Plan List"
      />
      <Card className="shadow-md" sx={{ my: 2, p: 4 }}>
        <CardContent>
          <div className="flex justify-between items-center mb-3 gap-3">
            <ExportButtons />
            <SearchBar value={search} onChange={setSearch} />

            <Button
              variant="solid"
              size="md"
              onClick={() => navigate("/subscription/add")}
              sx={{
                px: 4,
                borderRadius: 20,
                bgcolor: "black",
                "&:hover": { bgcolor: "#222" },
              }}
            >
              Add New Membership Plan
            </Button>
          </div>

          <DataTable
            rows={filteredRows}
            columns={MembershipPlanColumns({
              navigate,
              setDeleteId,
              setOpenDelete,
            })}
            rowClick={true}
            getRowId={(row) => row._id}
            rowClickPath={"/subscription/details"}
          />
        </CardContent>
      </Card>

      {/* Deletion Modal */}
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        icon={`fa-light fa-dumbbell`}
        origin={"Membership Plan"}
        confirmation={deleteMembershipPlanWithId}
      />
    </div>
  );
};

export default MembershipPlanList;
