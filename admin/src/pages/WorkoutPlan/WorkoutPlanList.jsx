import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Card, Button, CardContent } from "@mui/joy";
import { PageLocation } from "../../components/PageLocation";
import DataTable from "../../components/DataTable/DataTable";
import SearchBar from "../../components/DataTable/SearchBar";
import { WorkoutPlanColumns } from "./WorkoutPlanColumns";
import ExportButtons from "../../components/DataTable/ExportButtons";

import { fetchAllWorkoutPlans } from "../../redux/workoutPlan/workoutPlanThunks";
import { selectAllWorkoutPlans } from "../../redux/workoutPlan/workoutPlanSelector";

const WorkoutPlanList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        row.name?.toString().toLowerCase().includes(query) ||
        row.durationMonths?.toString().toLowerCase().includes(query) ||
        row.price?.toString().toLowerCase().includes(query) ||
        row.features?.toString().toLowerCase().includes(query)
    );
  }, [workoutPlans, search]);

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
            columns={WorkoutPlanColumns(navigate)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutPlanList;
