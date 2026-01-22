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
import { WorkoutPlanColumns } from "./WorkoutPlanColumns";
import ExportButtons from "../../components/DataTable/ExportButtons";

import {
  fetchAllWorkoutPlans,
  deleteWorkoutPlanById,
} from "../../redux/workoutPlan/workoutPlanThunks";
import { selectAllWorkoutPlans } from "../../redux/workoutPlan/workoutPlanSelector";

import DeletionModal from "../../components/Modal/DeletionModal";

const WorkoutPlanList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const [search, setSearch] = useState("");
  const workoutPlans = useSelector(selectAllWorkoutPlans);

  useEffect(() => {
    dispatch(fetchAllWorkoutPlans());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase();

    return workoutPlans.filter(
      (row) =>
        row.workoutPlanId?.toString().toLowerCase().includes(query) ||
        row.workoutPlanName?.toString().toLowerCase().includes(query) ||
        row.goal?.toString().toLowerCase().includes(query),
    );
  }, [workoutPlans, search]);

  const checkValidation = () => {
    return true;
  };

  const deleteWorkoutPlanWithId = async (e) => {
    e.preventDefault();
    const validation = checkValidation();
    if (!validation) return;

    try {
      await dispatch(deleteWorkoutPlanById({ workoutPlanId: deleteId }));
      toast.success("Workout Plan Deleted Successfully");
    } catch {
      toast.error("Failed to Delete Workout Plan");
    } finally {
      setDeleteId(null);
      setOpenDelete(false);
    }
  };

  return (
    <div key="WorkoutPlan-List">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Workout"
        currentPath="Workout Plan List"
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
              Add New Workout Plan
            </Button>
          </div>

          <DataTable
            rows={filteredRows}
            columns={WorkoutPlanColumns({
              navigate,
              setDeleteId,
              setOpenDelete,
            })}
            rowClick={true}
            getRowId={(row) => row._id}
            rowClickPath={"/plan/workout/details"}
          />
        </CardContent>
      </Card>

      {/* Deletion Modal */}
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        icon={`fa-light fa-dumbbell`}
        origin={"Workout Plan"}
        confirmation={deleteWorkoutPlanWithId}
      />
    </div>
  );
};

export default WorkoutPlanList;
