import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";

import {toast} from "sonner";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import PageLocation from "../../components/PageLocation";
import {useNavigate} from "react-router-dom";

import Calendar from "../../components/Calendar";

const Events = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDatesChange = async (arg) => {
        const date = arg.view.currentStart;

        const formattedDate = `${date.getFullYear()}-${String(
            date.getMonth() + 1,
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        console.log(formattedDate);
    };

    const displayEvent = (info) => {
        console.log(info);
    };

    return (
        <div key="Admin_events_page">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Calendar"
                currentPath="Events"
            />

            <Card className="shadow-md" sx={{my: 2, p: 4}}>
                <CardContent>
                    <div className="flex justify-between flex-col-reverse items-end mb-3 gap-3">
                        <Button
                            variant="solid"
                            size="md"
                            onClick={() => navigate("/events/add")}
                            sx={{
                                px: 4,
                                borderRadius: 20,
                                bgcolor: "black",
                                "&:hover": {bgcolor: "#222"},
                            }}
                        >
                            <i className="fa-light fa-calendar-circle-plus me-2"></i>
                            Add Event
                        </Button>
                    </div>

                    <Calendar
                        eventOnClick={displayEvent}
                        showEventCountOnly={false}
                        handleDatesChange={handleDatesChange}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default Events;
