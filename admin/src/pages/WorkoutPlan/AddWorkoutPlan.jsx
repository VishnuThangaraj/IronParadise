import {useDispatch, useSelector} from "react-redux";
import {Fragment, useEffect, useMemo, useState} from "react";

import {toast} from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

import Loader from "@/components/Loader"
import FormField from "@/components/Form/FormField";
import PageLocation from "@/components/PageLocation";
import ButtonPrimary from "@/components/Button/ButtonPrimary";

import {handleChangeValidation, validateFields} from "@/utils/FormFieldValidation"

import {formFieldColSpan} from "@/config/FormFieldConfig";
import {initialWorkoutPlanState, WorkoutPlanFieldGroup, WorkoutPlanRules} from "@/config/WorkoutPlanFields";

import {fetchCounter} from "@/redux/counter/counterThunks";
import {selectCounter} from "@/redux/counter/counterSelector";
import {addNewWorkoutPlan} from "@/redux/workoutPlan/workoutPlanThunks";
import {selectWorkoutPlanLoading} from "@/redux/workoutPlan/workoutPlanSelector";

const AddWorkoutPlan = () => {
    const dispatch = useDispatch();

    const counter = useSelector(selectCounter);
    const loading = useSelector(selectWorkoutPlanLoading);

    const workoutPlanId = useMemo(() => {
        if (counter < 0) return "";
        return `WPL-${String(counter + 1).padStart(3, "0")}`;
    }, [counter]);

    const [newWorkoutPlan, setNewWorkoutPlan] = useState(initialWorkoutPlanState);

    useEffect(() => {
        dispatch(fetchCounter({identity: "workout"}));
    }, [dispatch]);


    const handleChange = (name, value) => {
        const rules = WorkoutPlanRules[name];
        if (!handleChangeValidation(value, rules)) return;

        setNewWorkoutPlan((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...newWorkoutPlan,
            workoutPlanId
        }

        if (!validateFields(payload)) return;

        try {
            await dispatch(addNewWorkoutPlan({newWorkoutPlan: payload})).unwrap();
            await dispatch(fetchCounter({identity: "workout"})).unwrap();

            toast.success("Workout plan added successfully!");

            setNewWorkoutPlan(initialWorkoutPlanState);

        } catch (error) {
            toast.warning(error?.message || "Failed to add Workout plan");
        }
    };

    if (!counter || counter < 0) return <Loader/>;

    return (
        <div>
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Fitness Plan"
                currentPath="Add Workout Plan"
            />

            <Card className="shadow-md" sx={{my: 1, mb: 4, p: 0, pb: 3}}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <div className="text-xl font-bold border-b-2 border-gray-200 p-5">
                            Add New Workout Plan
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
                                            (!field.showIf || field.showIf(newWorkoutPlan)) && (
                                                <div
                                                    key={field.name}
                                                    className={formFieldColSpan(field.size)}
                                                >
                                                    <FormField
                                                        field={field}
                                                        value={field.name === 'workoutPlanId' ? workoutPlanId : newWorkoutPlan[field.name]}
                                                        onChange={handleChange}
                                                        disabled={field.disabled}
                                                    />
                                                </div>
                                            )
                                    )}
                                </Fragment>
                            ))}
                        </div>

                        <div className="flex justify-end px-6 py-3">
                            <ButtonPrimary
                                loading={loading}
                                loadingText="Adding .."
                            >
                                Add Workout Plan
                            </ButtonPrimary>
                        </div>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddWorkoutPlan;
