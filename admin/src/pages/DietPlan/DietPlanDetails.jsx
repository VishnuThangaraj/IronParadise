import {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {toast} from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import {
    DietPlanFieldGroup,
    initialDietPlanState,
} from "../../config/DietPlanFields";
import {
    selectDietPlanLoading,
    selectCurrentDietPlan,
} from "../../redux/dietPlan/dietPlanSelector";

import FormField from "../../components/Form/FormField";
import PageLocation from "../../components/PageLocation";
import {useLocation, useParams} from "react-router-dom";
import {
    fetchDietPlanById,
    updateDietPlanById,
} from "../../redux/dietPlan/dietPlanThunks";

const getColSpan = (size) => {
    switch (size) {
        case 100:
            return "col-span-12";
        case 50:
            return "col-span-6";
        case 30:
            return "col-span-4";
        default:
            return "col-span-6";
    }
};

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
        setDietPlan((prev) => {
            const updated = {...prev, [name]: value};
            return updated;
        });
    };

    const checkValidation = () => {
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = checkValidation();
        if (!validation) return;

        try {
            await dispatch(
                updateDietPlanById({dietPlanId: id, updatedData: dietPlan}),
            ).unwrap();
            toast.success("Diet Plan Updated Successfully!");
        } catch {
            toast.error("Failed to Update Diet Plan");
        } finally {
            setEditMode(false);
        }
    };

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
                                <Button
                                    className="transition-transform duration-400 hover:scale-103"
                                    variant="solid"
                                    size="md"
                                    sx={{
                                        px: 3,
                                        backgroundColor: "black",
                                        "&:hover": {backgroundColor: "#222222"},
                                    }}
                                    onClick={() => setEditMode(true)}
                                >
                                    <i className="fa-light fa-pot-food me-2"></i>Edit Diet Plan
                                </Button>
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

                                    {group.fields.map(
                                        (field) =>
                                            (!field.showIf || field.showIf(dietPlan)) && (
                                                <div
                                                    key={field.name}
                                                    className={getColSpan(field.size)}
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
                                <Button
                                    variant="outlined"
                                    type="submit"
                                    color="danger"
                                    size="md"
                                    sx={{
                                        px: 3,
                                    }}
                                    disabled={loading}
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    size="md"
                                    sx={{
                                        px: 5,
                                        backgroundColor: "black",
                                        "&:hover": {backgroundColor: "#222222"},
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Fragment>
                                            <CircularProgress variant="solid"/>{" "}
                                            <span className="ms-3">Updating ...</span>
                                        </Fragment>
                                    ) : (
                                        "Update Diet Plan"
                                    )}
                                </Button>
                            </div>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default DietPlanDetails;
