import {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {toast} from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import {EventFieldGroup, initialEventState} from "../../config/EventFields";

import {selectEventLoading} from "../../redux/event/eventSelector";

import {addNewEvent} from "../../redux/event/eventThunks";

import {fetchAllTrainers} from "../../redux/trainer/trainerThunks";
import {selectAllTrainers} from "../../redux/trainer/trainerSelectors";

import {fetchAllMembers} from "../../redux/member/memberThunks";
import {selectAllMembers} from "../../redux/member/memberSelector";

import FormField from "../../components/Form/FormField";
import PageLocation from "../../components/PageLocation";
import {useMemo} from "react";
import {useCallback} from "react";

const getColSpan = (size = 50) =>
    ({
        100: "col-span-12",
        50: "col-span-6",
        30: "col-span-4",
    })[size] || "col-span-6";

const numericFields = ["phone", "height", "weight", "salary", "aadharNumber"];

const maxLengthMap = {
    phone: 10,
    panNumber: 10,
    aadharNumber: 12,
};

const AddEvent = () => {
    const dispatch = useDispatch();

    const loading = useSelector(selectEventLoading);

    const members = useSelector(selectAllMembers);
    const trainers = useSelector(selectAllTrainers);

    const [newEvent, setNewEvent] = useState(initialEventState);

    useEffect(() => {
        dispatch(fetchAllMembers());
        dispatch(fetchAllTrainers());
    }, [dispatch]);

    const trainerOptions = useMemo(
        () => trainers.map((t) => ({label: t.name, value: t._id})),
        [trainers],
    );

    const memberOptions = useMemo(
        () => members.map((m) => ({label: m.name, value: m._id})),
        [members],
    );

    const handleChange = useCallback((name, value) => {
        if (numericFields.has(name) && isNaN(value)) return;
        if (maxLengthMap[name] && value.length > maxLengthMap[name]) return;

        setNewEvent((prev) => {
            const updated = {...prev, [name]: value};
            return updated;
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(addNewEvent(newEvent)).unwrap();
            toast.success("Event Added to Calendar.");
        } catch (error) {
            console.log(error);
            toast.error("Failed to Add Event.");
        } finally {
            setNewEvent(initialEventState);
        }
    };

    return (
        <div key="AddEvent">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Calendar"
                currentPath="Add New Event"
            />

            <Card className="shadow-md" sx={{my: 1, mb: 4, p: 0, pb: 3}}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <div className="text-xl font-bold border-b-2 border-gray-200 p-5">
                            Add New Event
                        </div>

                        <div className="grid grid-cols-12 gap-4 px-6 pb-5">
                            {EventFieldGroup.map((group) => (
                                <Fragment key={`add_event_${group.title}`}>
                                    <div className="col-span-12 text-lg font-semibold mt-6">
                                        {group.title}
                                    </div>

                                    {group.fields.map(
                                        (field) =>
                                            (!field.showIf || field.showIf(newEvent)) && (
                                                <div
                                                    key={field.name}
                                                    className={getColSpan(field.size)}
                                                >
                                                    <FormField
                                                        field={field}
                                                        value={newEvent[field.name]}
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
                                    "Add Event"
                                )}
                            </Button>
                        </div>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddEvent;
