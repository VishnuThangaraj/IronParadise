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
import {DietPlanFieldGroup, DietPlanRules, initialDietPlanState} from "@/config/DietPlanFields";

import {fetchCounter} from "@/redux/counter/counterThunks";
import {selectCounter} from "@/redux/counter/counterSelector";
import {addNewDietPlan} from "@/redux/dietPlan/dietPlanThunks";
import {selectDietPlanLoading} from "@/redux/dietPlan/dietPlanSelector";

const AddDietPlan = () => {
    const dispatch = useDispatch();

    const counter = useSelector(selectCounter);
    const loading = useSelector(selectDietPlanLoading);

    const dietPlanId = useMemo(() => {
        if (counter < 0) return "";
        return `DPL-${String(counter + 1).padStart(3, "0")}`;
    }, [counter]);

    const [newDietPlan, setNewDietPlan] = useState({
        ...initialDietPlanState
    });

    useEffect(() => {
        dispatch(fetchCounter({identity: "diet"}));
    }, [dispatch]);

    const handleChange = (name, value) => {
        const rules = DietPlanRules[name];
        if (!handleChangeValidation(value, rules)) return;

        setNewDietPlan((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields(newDietPlan)) return;

        try {
            await dispatch(addNewDietPlan({newDietPlan})).unwrap();

            toast.success("Diet Plan Added Successfully!");

            const nextId = `DPL-${String(counter + 2).padStart(3, "0")}`;
            setNewDietPlan({
                ...initialDietPlanState,
                dietPlanId: nextId,
            });
        } catch (error) {
            toast.warning(error?.message || "Failed to Add Diet Plan");

            setNewDietPlan({
                ...initialDietPlanState,
                dietPlanId,
            });
        }
    };

    if (counter < 0) return <Loader/>;

    return (
        <div>
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Fitness Plan"
                currentPath="Add Diet Plan"
            />

            <Card className="shadow-md" sx={{my: 1, mb: 4, p: 0, pb: 3}}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <div className="text-xl font-bold border-b-2 border-gray-200 p-5">
                            Add New Diet Plan
                        </div>

                        <div className="grid grid-cols-12 gap-4 px-6 pb-5">
                            {DietPlanFieldGroup.map((group) => (
                                <Fragment key={`add_trainer_${group.title}`}>
                                    <div
                                        className={`col-span-12 text-lg font-semibold mt-6 ${group.classes}`}
                                    >
                                        {group.title}
                                    </div>

                                    {group?.fields.map(
                                        (field) =>
                                            (!field.showIf || field.showIf(newDietPlan)) && (
                                                <div
                                                    key={field.name}
                                                    className={formFieldColSpan(field.size)}
                                                >
                                                    <FormField
                                                        field={field}
                                                        value={newDietPlan[field.name]}
                                                        onChange={handleChange}
                                                        disabled={field.disabled}
                                                    />
                                                </div>
                                            ),
                                    )}
                                </Fragment>
                            ))}
                        </div>

                        <div className="flex justify-end px-6 py-3">
                            <ButtonPrimary
                                loading={loading}
                                loadingText="Adding .."
                            >
                                Add Diet Plan
                            </ButtonPrimary>
                        </div>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddDietPlan;
