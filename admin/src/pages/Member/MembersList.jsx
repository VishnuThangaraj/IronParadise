import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Card, Button, CardContent } from "@mui/joy";

import { MemberColumns } from "./MemberColumns";
import { PageLocation } from "../../components/PageLocation";
import DataTable from "../../components/DataTable/DataTable";
import SearchBar from "../../components/DataTable/SearchBar";
import ExportButtons from "../../components/DataTable/ExportButtons";

import { fetchAllMembers } from "../../redux/member/memberThunks";
import { selectAllMembers } from "../../redux/member/memberSelector";

import { fetchAllTrainers } from "../../redux/trainer/trainerThunks";
import { selectAllTrainers } from "../../redux/trainer/trainerSelectors";

import { fetchAllDietPlans } from "../../redux/dietPlan/dietPlanThunks";
import { selectAllDietPlans } from "../../redux/dietPlan/dietPlanSelector";

import { fetchAllWorkoutPlans } from "../../redux/workoutPlan/workoutPlanThunks";
import { selectAllWorkoutPlans } from "../../redux/workoutPlan/workoutPlanSelector";

const MembersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const members = useSelector(selectAllMembers);

  useEffect(() => {
    dispatch(fetchAllMembers());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase();

    return members.filter(
      (row) =>
        row.memberId?.toString().toLowerCase().includes(query) ||
        row.name?.toLowerCase().includes(query) ||
        row.email?.toLowerCase().includes(query) ||
        row.mobile?.includes(query)
    );
  }, [members, search]);

  return (
    <div key="Members-List">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Member"
        currentPath="Members List"
      />

      <Card className="shadow-md" sx={{ my: 2, p: 4 }}>
        <CardContent>
          <div className="flex justify-between items-center mb-3 gap-3">
            <ExportButtons />
            <SearchBar value={search} onChange={setSearch} />

            <Button
              variant="solid"
              size="md"
              onClick={() => navigate("/member/add")}
              sx={{
                px: 4,
                borderRadius: 20,
                bgcolor: "black",
                "&:hover": { bgcolor: "#222" },
              }}
            >
              Add New Member
            </Button>
          </div>

          <DataTable rows={filteredRows} columns={MemberColumns(navigate)} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersList;
