import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Card, Button, CardContent } from "@mui/joy";
import { PageLocation } from "../../components/PageLocation";
import DataTable from "../../components/DataTable/DataTable";
import SearchBar from "../../components/DataTable/SearchBar";
import { DietPlanColumns } from "./DietPlanColumns";
import ExportButtons from "../../components/DataTable/ExportButtons";

import { fetchAllDietPlans } from "../../redux/dietPlan/dietPlanThunks";
import { selectAllDietPlans } from "../../redux/dietPlan/dietPlanSelector";

const DietPlanList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        row.name?.toString().toLowerCase().includes(query) ||
        row.durationMonths?.toString().toLowerCase().includes(query) ||
        row.price?.toString().toLowerCase().includes(query) ||
        row.features?.toString().toLowerCase().includes(query)
    );
  }, [dietPlans, search]);

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
              onClick={() => navigate("/subscription/add")}
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

          <DataTable rows={filteredRows} columns={DietPlanColumns(navigate)} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DietPlanList;
