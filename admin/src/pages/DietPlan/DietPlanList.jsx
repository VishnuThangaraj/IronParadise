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

import { DietPlanColumns } from "@/pages/DietPlan/DietPlanColumns.jsx";

import { selectAllDietPlans } from "@/redux/dietPlan/dietPlanSelector";
import {
  deleteDietPlanById,
  fetchAllDietPlans,
} from "@/redux/dietPlan/dietPlanThunks";

const DietPlanList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const [search, setSearch] = useState("");

  const dietPlans = useSelector(selectAllDietPlans);

  useEffect(() => {
    dispatch(fetchAllDietPlans());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    if (!search) return dietPlans;

    const query = search.toLowerCase();

    return dietPlans.filter((row) => {
      return [row?.dietPlanId, row?.dietPlanName, row?.goal]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(query));
    });
  }, [dietPlans, search]);

  const deleteDietPlanWithId = async (e) => {
    e.preventDefault();

    try {
      await dispatch(deleteDietPlanById({ dietPlanId: deleteId })).unwrap();
      toast.success("Diet plan deleted successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to delete Diet plan");
    } finally {
      setDeleteId(null);
      setOpenDelete(false);
    }
  };

  if (dietPlans == null) return <Loader />;

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
            <ExportButtons data={filteredRows.slice()} fileName="diet_plans" />

            <SearchBar value={search} onChange={setSearch} />

            <ButtonRounded location={"/plan/diet/add"}>
              Add New Plan
            </ButtonRounded>
          </div>

          <DataTable
            rows={filteredRows}
            columns={DietPlanColumns({
              navigate,
              setDeleteId,
              setOpenDelete,
            })}
            rowClick={true}
            getRowId={(row) => row._id}
            rowClickPath={"/plan/diet/details"}
          />
        </CardContent>
      </Card>

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
