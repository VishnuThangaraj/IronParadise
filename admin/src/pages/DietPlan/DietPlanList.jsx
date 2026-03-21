import {useNavigate} from "react-router-dom";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {toast} from "sonner";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import {DietPlanColumns} from "./DietPlanColumns";
import DataTable from "@/components/DataTable/DataTable";
import PageLocation from "@/components/PageLocation";
import SearchBar from "@/components/DataTable/SearchBar";
import ExportButtons from "@/components/DataTable/ExportButtons";
import DeletionModal from "@/components/Modal/DeletionModal";

import {deleteDietPlanById, fetchAllDietPlans,} from "@/redux/dietPlan/dietPlanThunks";

import {selectAllDietPlans} from "@/redux/dietPlan/dietPlanSelector";

const DietPlanList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const dietPlans = useSelector(selectAllDietPlans);

    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);

    useEffect(() => {
        dispatch(fetchAllDietPlans());
    }, [dispatch]);

    /* ---------------- SEARCH FILTER ---------------- */

    const filteredRows = useMemo(() => {
        if (!search) return dietPlans;

        const query = search.toLowerCase();

        return dietPlans.filter((row) =>
            [row.dietPlanId, row.dietPlanName, row.goal]
                .some((value) =>
                    value?.toString().toLowerCase().includes(query)
                )
        );
    }, [dietPlans, search]);

    /* ---------------- DELETE HANDLER ---------------- */

    const deleteDietPlanWithId = useCallback(
        async (e) => {
            e.preventDefault();

            try {
                await dispatch(deleteDietPlanById({dietPlanId: deleteId})).unwrap();
                toast.success("Diet Plan Deleted Successfully");
            } catch (error) {
                toast.error(error?.message || "Failed to Delete Diet Plan");
            } finally {
                setDeleteId(null);
                setOpenDelete(false);
            }
        },
        [dispatch, deleteId]
    );

    /* ---------------- TABLE COLUMNS ---------------- */

    const columns = useMemo(
        () => DietPlanColumns({navigate, setDeleteId, setOpenDelete}),
        [navigate]
    );

    return (
        <div key="DietPlan-List">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Diet"
                currentPath="Diet Plan List"
            />

            <Card className="shadow-md" sx={{my: 2, p: 4}}>
                <CardContent>
                    <div className="flex justify-between items-center mb-3 gap-3">
                        <ExportButtons/>

                        <SearchBar value={search} onChange={setSearch}/>

                        <Button
                            variant="solid"
                            size="md"
                            onClick={() => navigate("/plan/diet/add")}
                            sx={{
                                px: 4,
                                borderRadius: 20,
                                bgcolor: "black",
                                "&:hover": {bgcolor: "#222"},
                            }}
                        >
                            Add New Diet Plan
                        </Button>
                    </div>

                    <DataTable
                        rows={filteredRows}
                        columns={columns}
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
