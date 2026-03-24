import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

import Loader from "@/components/Loader.jsx";
import PageLocation from "@/components/PageLocation";
import DataTable from "@/components/DataTable/DataTable";
import SearchBar from "@/components/DataTable/SearchBar";
import DeletionModal from "@/components/Modal/DeletionModal";
import ButtonRounded from "@/components/Button/ButtonRounded";
import ExportButtons from "@/components/DataTable/ExportButtons";

import { TrainerColumns } from "@/pages/Trainer/TrainerColumns";

import { selectAllTrainers } from "@/redux/trainer/trainerSelectors";
import {
  fetchAllTrainers,
  deleteTrainerById,
} from "@/redux/trainer/trainerThunks";

const TrainersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

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

  const deleteTrainerWithId = async (e) => {
    e.preventDefault();

    try {
      await dispatch(deleteTrainerById({ trainerId: deleteId }));
      toast.success("Trainer deleted successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to delete Trainer");
    } finally {
      setDeleteId(null);
      setOpenDelete(false);
    }
  };

  if (trainers == null) return <Loader />;

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
            columns={TrainerColumns({
              navigate,
              setDeleteId,
              setOpenDelete,
            })}
            rowClick={true}
            getRowId={(row) => row._id}
            rowClickPath={"/trainer/details"}
          />
        </CardContent>
      </Card>

      {/* Deletion Modal */}
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        icon={`fa-light fa-user-slash`}
        origin={"Trainer"}
        confirmation={deleteTrainerWithId}
      />
    </div>
  );
};

export default TrainersList;
