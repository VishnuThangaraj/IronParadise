import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

import Loader from "@/components/Loader.jsx";
import PageLocation from "@/components/PageLocation";
import DataTable from "@/components/DataTable/DataTable";
import SearchBar from "@/components/DataTable/SearchBar";
import ButtonRounded from "@/components/Button/ButtonRounded";
import ExportButtons from "@/components/DataTable/ExportButtons";

import { selectAllTrainers } from "@/redux/trainer/trainerSelectors";
import { fetchAllTrainers } from "@/redux/trainer/trainerThunks";

import { TrainerPayrollColumns } from "@/pages/Trainer/TrainerPayrollColumns";

const TrainersPayroll = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const trainers = useSelector(selectAllTrainers);

  useEffect(() => {
    dispatch(fetchAllTrainers());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    if (!search) return trainers;

    const query = search.toLowerCase();

    return trainers.filter((row) => {
      return [row?.id, row?.name, row?.email, row?.mobile]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(query));
    });
  }, [trainers, search]);

  if (trainers == null) return <Loader />;

  return (
    <div key="Trainers-Payroll">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Trainers"
        currentPath="Trainers Payroll"
      />

      <Card className="shadow-md" sx={{ my: 2, p: 4 }}>
        <CardContent>
          <div className="flex justify-between items-center mb-3 gap-3">
            <ExportButtons
              data={filteredRows.slice()}
              fileName="trainers_data"
            />
            <SearchBar value={search} onChange={setSearch} />

            <ButtonRounded onClick={() => navigate("/trainer/add")}>
              Add New Trainer
            </ButtonRounded>
          </div>

          <DataTable
            rows={filteredRows.slice()}
            columns={TrainerPayrollColumns()}
            rowClick={true}
            getRowId={(row) => row._id}
            rowClickPath={"/trainer/details"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainersPayroll;
