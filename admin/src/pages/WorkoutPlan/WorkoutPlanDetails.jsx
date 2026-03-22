import {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useParams} from "react-router-dom";

import {toast} from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

import Loader from "@/components/Loader";
import FormField from "@/components/Form/FormField";
import PageLocation from "@/components/PageLocation";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import ButtonOutlined from "@/components/Button/ButtonOutlined";

import {handleChangeValidation, validateFields} from "@/utils/FormFieldValidation"

import {formFieldColSpan} from "@/config/FormFieldConfig";
import {initialWorkoutPlanState, WorkoutPlanFieldGroup, WorkoutPlanRules,} from "@/config/WorkoutPlanFields";

import {selectCurrentWorkoutPlan, selectWorkoutPlanLoading,} from "@/redux/workoutPlan/workoutPlanSelector";
import {fetchWorkoutPlanById, updateWorkoutPlanById,} from "@/redux/workoutPlan/workoutPlanThunks";

const WorkoutPlanDetails = () => {
    const dispatch = useDispatch();

    const loading = useSelector(selectWorkoutPlanLoading);

    const {id} = useParams();
    const {state} = useLocation();

    const workoutPlanId = id ?? null;
    const [editMode, setEditMode] = useState(state?.edit ?? Boolean(id));

    const workoutPlanFromStore = useSelector(selectCurrentWorkoutPlan);

    const [workoutPlan, setWorkoutPlan] = useState(initialWorkoutPlanState);

    useEffect(() => {
        if (workoutPlanId) {
            dispatch(fetchWorkoutPlanById(workoutPlanId));
        }
    }, [workoutPlanId, dispatch]);

    useEffect(() => {
        if (workoutPlanFromStore) {
            setWorkoutPlan(workoutPlanFromStore);
        }
    }, [workoutPlanFromStore]);

    const handleChange = (name, value) => {
        const rules = WorkoutPlanRules[name];
        if (!handleChangeValidation(value, rules)) return;

        setWorkoutPlan((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields(workoutPlan)) return;

        try {
            await dispatch(
                updateWorkoutPlanById({workoutPlanId: id, updatedData: workoutPlan}),
            ).unwrap();
            toast.success("Workout plan updated successfully");
            setEditMode(false);
        } catch (error) {
            toast.warning(error?.message || "Failed to update Workout plan");
        }
    };

    if (!workoutPlan) return <Loader/>

    return (
        <div key="WorkoutPlanDetails">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Fitness Plan"
                currentPath="Workout Plan Details"
            />
            <Card className="shadow-md" sx={{my: 1, mb: 4, p: 0, pb: 3}}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <div className="flex justify-between border-b-2 border-gray-200 p-5">
                            <div className="text-xl font-bold ">
                                {editMode
                                    ? "Update Existing Workout Plan"
                                    : "View Existing Workout Plan"}
                            </div>
                            {!editMode && (
                                <ButtonPrimary
                                    onClick={() => setEditMode(true)}
                                >
                                    <i className="fa-light fa-pot-food me-2"></i>Edit Workout Plan
                                </ButtonPrimary>
                            )}
                        </div>

                        <div className="grid grid-cols-12 gap-4 px-6 pb-5">
                            {WorkoutPlanFieldGroup.map((group) => (
                                <Fragment key={`add_trainer_${group.title}`}>
                                    <div
                                        className={`col-span-12 text-lg font-semibold mt-6 ${group.classes}`}
                                    >
                                        {group.title}
                                    </div>

                                    {group?.fields.map(
                                        (field) =>
                                            (!field.showIf || field.showIf(workoutPlan)) && (
                                                <div
                                                    key={field.name}
                                                    className={formFieldColSpan(field.size)}
                                                >
                                                    <FormField
                                                        field={field}
                                                        value={workoutPlan[field.name]}
                                                        onChange={handleChange}
                                                        disabled={!editMode || field.disabled}
                                                    />
                                                </div>
                                            ),
                                    )}
                                </Fragment>
                            ))}
                        </div>

                        {editMode && (
                            <div className="flex justify-end px-6 py-3 gap-5">
                                <ButtonOutlined
                                    color="danger"
                                    loading={loading}
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </ButtonOutlined>
                                <ButtonPrimary
                                    loading={loading}
                                    loadingText={"Updating ..."}
                                    disabled={loading}
                                >Update Workout Plan
                                </ButtonPrimary>
                            </div>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default WorkoutPlanDetails;
