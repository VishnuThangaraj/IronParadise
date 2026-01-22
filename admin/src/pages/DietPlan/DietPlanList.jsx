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
import { DietPlanColumns } from "./DietPlanColumns";
import ExportButtons from "../../components/DataTable/ExportButtons";

import {
  fetchAllDietPlans,
  deleteDietPlanById,
} from "../../redux/dietPlan/dietPlanThunks";
import { selectAllDietPlans } from "../../redux/dietPlan/dietPlanSelector";
import DeletionModal from "../../components/Modal/DeletionModal";

const DietPlanList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const [search, setSearch] = useState("");
  const dietPlans = useSelector(selectAllDietPlans);

  useEffect(() => {
    dispatch(fetchAllDietPlans());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase();

    return dietPlans.filter(
      (row) =>
        row.dietPlanId?.toString().toLowerCase().includes(query) ||
        row.dietPlanName?.toString().toLowerCase().includes(query) ||
        row.goal?.toString().toLowerCase().includes(query),
    );
  }, [dietPlans, search]);

  const checkValidation = () => {
    return true;
  };

  const deleteDietPlanWithId = async (e) => {
    e.preventDefault();
    const validation = checkValidation();
    if (!validation) return;

    try {
      await dispatch(deleteDietPlanById({ dietPlanId: deleteId }));
      toast.success("Diet Plan Deleted Successfully");
    } catch {
      toast.error("Failed to Delete Diet Plan");
    } finally {
      setDeleteId(null);
      setOpenDelete(false);
    }
  };

  return (
    <div key="DietPlan-List">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Diet"
        currentPath="Diet Plan List"
      />
      <Card className="shadow-md" sx={{ my: 2, p: 4 }}>
        <CardContent>
          <div className="flex justify-between items-center mb-3 gap-3">
            <ExportButtons />
            <SearchBar value={search} onChange={setSearch} />

            <Button
              variant="solid"
              size="md"
              onClick={() => navigate("/plan/diet/add")}
              sx={{
                px: 4,
                borderRadius: 20,
                bgcolor: "black",
                "&:hover": { bgcolor: "#222" },
              }}
            >
              Add New Diet Plan
            </Button>
          </div>

          <DataTable
            rows={filteredRows}
            columns={DietPlanColumns({ navigate, setDeleteId, setOpenDelete })}
            rowClick={true}
            getRowId={(row) => row._id}
            rowClickPath={"/plan/diet/details"}
          />
        </CardContent>
      </Card>

      {/* Deletion Modal */}
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        icon={`fa-light fa-pot-food`}
        origin={"Diet Plan"}
        confirmation={deleteDietPlanWithId}
      />
    </div>
  );
};

export default DietPlanList;
