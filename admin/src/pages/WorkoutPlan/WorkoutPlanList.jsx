import {useNavigate} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {toast} from "sonner";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

import Loader from "@/components/Loader.jsx";
import PageLocation from "@/components/PageLocation";
import DataTable from "@/components/DataTable/DataTable";
import SearchBar from "@/components/DataTable/SearchBar";
import DeletionModal from "@/components/Modal/DeletionModal";
import ButtonRounded from "@/components/Button/ButtonRounded";
import ExportButtons from "@/components/DataTable/ExportButtons";

import {WorkoutPlanColumns} from "./WorkoutPlanColumns";

import {selectAllWorkoutPlans} from "@/redux/workoutPlan/workoutPlanSelector";
import {deleteWorkoutPlanById, fetchAllWorkoutPlans,} from "@/redux/workoutPlan/workoutPlanThunks";

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
        if (!search) return workoutPlans;

        const query = search.toLowerCase();

        return workoutPlans.filter((row) => {
                return [row?.workoutPlanId, row?.workoutPlanName, row?.goal]
                    .filter(Boolean)
                    .some((value) =>
                        value.toString().toLowerCase().includes(query)
                    );
            }
        );
    }, [workoutPlans, search]);

    const deleteWorkoutPlanWithId = async (e) => {
        e.preventDefault();

        try {
            await dispatch(deleteWorkoutPlanById({workoutPlanId: deleteId}));
            toast.success("Workout plan deleted successfully");
        } catch (error) {
            toast.error(error?.message || "Failed to delete Workout plan");
        } finally {
            setDeleteId(null);
            setOpenDelete(false);
        }
    };

    if (workoutPlans == null) return <Loader/>

    return (
        <div key="WorkoutPlan-List">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Workout"
                currentPath="Workout Plan List"
            />
            <Card className="shadow-md" sx={{my: 2, p: 4}}>
                <CardContent>
                    <div className="flex justify-between items-center mb-3 gap-3">
                        <ExportButtons data={filteredRows.slice()}
                                       fileName="workout_plans"/>
                        <SearchBar value={search} onChange={setSearch}/>

                        <ButtonRounded location={"/plan/workout/add"}>
                            Add New Plan
                        </ButtonRounded>
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
