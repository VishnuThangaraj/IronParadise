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
import {DietPlanFieldGroup, DietPlanRules, initialDietPlanState,} from "@/config/DietPlanFields";

import {selectCurrentDietPlan, selectDietPlanLoading,} from "@/redux/dietPlan/dietPlanSelector";
import {fetchDietPlanById, updateDietPlanById} from "@/redux/dietPlan/dietPlanThunks";

const DietPlanDetails = () => {
    const dispatch = useDispatch();

    const loading = useSelector(selectDietPlanLoading);

    const {id} = useParams();
    const {state} = useLocation();

    const dietPlanId = id ?? null;
    const [editMode, setEditMode] = useState(state?.edit ?? Boolean(id));

    const dietPlanFromStore = useSelector(selectCurrentDietPlan);

    const [dietPlan, setDietPlan] = useState(initialDietPlanState);

    useEffect(() => {
        if (dietPlanId) {
            dispatch(fetchDietPlanById(dietPlanId));
        }
    }, [dietPlanId, dispatch]);

    useEffect(() => {
        if (dietPlanFromStore) {
            setDietPlan(dietPlanFromStore);
        }
    }, [dietPlanFromStore]);

    const handleChange = (name, value) => {
        const rules = DietPlanRules[name];
        if (!handleChangeValidation(value, rules)) return;

        setDietPlan((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields(dietPlan)) return;

        try {
            await dispatch(
                updateDietPlanById({dietPlanId: id, updatedData: dietPlan}),
            ).unwrap();
            toast.success("Diet plan updated successfully");
            setEditMode(false);
        } catch (error) {
            toast.warning(error?.message || "Failed to update Diet plan");
        }
    };

    if (!dietPlan) return <Loader/>;

    return (
        <div key="DietPlanDetails">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Fitness Plan"
                currentPath="Diet Plan Details"
            />
            <Card className="shadow-md" sx={{my: 1, mb: 4, p: 0, pb: 3}}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <div className="flex justify-between border-b-2 border-gray-200 p-5">
                            <div className="text-xl font-bold ">
                                {editMode
                                    ? "Update Existing Diet Plan"
                                    : "View Existing Diet Plan"}
                            </div>
                            {!editMode && (
                                <ButtonPrimary
                                    onClick={() => setEditMode(true)}
                                >
                                    <i className="fa-light fa-pot-food me-2"></i>Edit Diet Plan
                                </ButtonPrimary>
                            )}
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
                                            (!field.showIf || field.showIf(dietPlan)) && (
                                                <div
                                                    key={field.name}
                                                    className={formFieldColSpan(field.size)}
                                                >
                                                    <FormField
                                                        field={field}
                                                        value={dietPlan[field.name]}
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
                                >
                                    Update Diet Plan
                                </ButtonPrimary>
                            </div>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default DietPlanDetails;
