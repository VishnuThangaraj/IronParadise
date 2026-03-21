import {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {toast} from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import {
    TrainerFieldGroup,
    initialTrainerState,
} from "../../config/TrainerFields";
import {
    addNewTrainer,
    fetchTrainerCounter,
} from "../../redux/trainer/trainerThunks";
import {
    selectTrainerLoading,
    selectTrainerCounter,
} from "../../redux/trainer/trainerSelectors";
import FormField from "../../components/Form/FormField";
import PageLocation from "../../components/PageLocation";

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

const numericFields = ["phone", "height", "weight", "salary", "aadharNumber"];

const maxLengthMap = {
    phone: 10,
    panNumber: 10,
    aadharNumber: 12,
};

const AddTrainer = () => {
    const dispatch = useDispatch();

    const loading = useSelector(selectTrainerLoading);
    const counter = useSelector(selectTrainerCounter);

    const [newTrainer, setNewTrainer] = useState(initialTrainerState);

    useEffect(() => {
        dispatch(fetchTrainerCounter({role: "trainer"}));
    }, [dispatch]);

    useEffect(() => {
        if (counter) {
            setNewTrainer((prev) => ({
                ...prev,
                userId: `TRN-${String(counter + 1).padStart(3, "0")}`,
            }));
        }
    }, [counter]);

    const handleChange = (name, value) => {
        if (numericFields.includes(name) && isNaN(Number(value))) return;

        if (maxLengthMap[name] && value.length > maxLengthMap[name]) return;

        if (name === "panNumber") {
            value = value.toUpperCase();
        }

        setNewTrainer((prev) => {
            const updated = {...prev, [name]: value};

            if (name === "height" || name === "weight") {
                const height = Number(updated.height) / 100;
                const weight = Number(updated.weight);

                if (height > 0 && weight > 0) {
                    updated.bmi = Number((weight / (height * height)).toFixed(2));
                } else {
                    updated.bmi = "";
                }
            }

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
            await dispatch(addNewTrainer({newTrainer})).unwrap();
            toast.success("Trainer Added Successfully!");
        } catch {
            toast.error("Failed to Add Trainer");
        } finally {
            setNewTrainer(initialTrainerState);
        }
    };

    return (
        <div key="Trainers-Add">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Trainers"
                currentPath="Add New Trainer"
            />

            <Card className="shadow-md" sx={{my: 1, mb: 4, p: 0, pb: 3}}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <div className="text-xl font-bold border-b-2 border-gray-200 p-5">
                            Add New Trainer
                        </div>

                        <div className="grid grid-cols-12 gap-4 px-6 pb-5">
                            {TrainerFieldGroup.map((group) => (
                                <Fragment key={`add_trainer_${group.title}`}>
                                    <div className="col-span-12 text-lg font-semibold mt-6">
                                        {group.title}
                                    </div>

                                    {group.fields.map(
                                        (field) =>
                                            (!field.showIf || field.showIf(newTrainer)) && (
                                                <div
                                                    key={field.name}
                                                    className={getColSpan(field.size)}
                                                >
                                                    <FormField
                                                        field={field}
                                                        value={newTrainer[field.name]}
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
                                        <span className="ms-3">Adding ...</span>
                                    </Fragment>
                                ) : (
                                    "Add Trainer"
                                )}
                            </Button>
                        </div>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddTrainer;
