import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import { TrainerColumns } from "./TrainerColumns";
import { PageLocation } from "../../components/PageLocation";
import DataTable from "../../components/DataTable/DataTable";
import SearchBar from "../../components/DataTable/SearchBar";
import ExportButtons from "../../components/DataTable/ExportButtons";

import { fetchAllTrainers } from "../../redux/trainer/trainerThunks";
import { selectAllTrainers } from "../../redux/trainer/trainerSelectors";

const TrainersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const trainers = useSelector(selectAllTrainers);

  useEffect(() => {
    dispatch(fetchAllTrainers());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase();

    return trainers.filter(
      (row) =>
        row.id?.toString().toLowerCase().includes(query) ||
        row.name?.toLowerCase().includes(query) ||
        row.email?.toLowerCase().includes(query) ||
        row.mobile?.includes(query)
    );
  }, [trainers, search]);

  return (
    <div key="Trainer-List">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Trainers"
        currentPath="Trainers List"
      />

      <Card className="shadow-md" sx={{ my: 2, p: 4 }}>
        <CardContent>
          <div className="flex justify-between items-center mb-3 gap-3">
            <ExportButtons />
            <SearchBar value={search} onChange={setSearch} />

            <Button
              variant="solid"
              size="md"
              onClick={() => navigate("/trainer/add")}
              sx={{
                px: 4,
                borderRadius: 20,
                bgcolor: "black",
                "&:hover": { bgcolor: "#222" },
              }}
            >
              Add New Trainer
            </Button>
          </div>

          <DataTable rows={filteredRows} columns={TrainerColumns(navigate)} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainersList;
