import moment from "moment";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, CardContent } from "@mui/joy";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { MemberContext } from "../../context/MemberContext";
import { GeneralContext } from "../../context/GeneralContext";

import { PageLocation } from "../../components/PageLocation";

const localizer = momentLocalizer(moment);

const Events = () => {
  const navigate = useNavigate();

  const { members } = useContext(MemberContext);
  const { eventsList } = useContext(GeneralContext);

  const startYear = moment().year() - 5;
  const endYear = moment().year() + 5;

  // Map member events (birthdays and subscription end dates)
  const memberEvents = members.flatMap((member) => {
    const dob = moment(member.dob);
    const month = dob.month();
    const date = dob.date();

    const birthdayEvents = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => {
        const year = startYear + i;
        return {
          title: `${member.name}'s Birthday`,
          allDay: true,
          start: new Date(year, month, date),
          end: new Date(year, month, date),
        };
      }
    );

    const subscriptionEnd = moment(member.subscription.endDate);

    if (
      subscriptionEnd.isBetween(
        moment(startYear, "YYYY"),
        moment(endYear, "YYYY"),
        null,
        "[]"
      )
    ) {
      const subscriptionMonth = subscriptionEnd.month();
      const subscriptionDate = subscriptionEnd.date();

      const subscriptionEvent = {
        title: `${member.name}'s Subscription Ends`,
        allDay: true,
        start: new Date(
          subscriptionEnd.year(),
          subscriptionMonth,
          subscriptionDate
        ),
        end: new Date(
          subscriptionEnd.year(),
          subscriptionMonth,
          subscriptionDate
        ),
      };

      return [...birthdayEvents, subscriptionEvent];
    }

    return birthdayEvents;
  });

  // Map general events from eventsList
  const generalEvents = eventsList.map((event) => ({
    title: event.name,
    description: event.description,
    allDay: true,
    start: new Date(event.startDate),
    end: new Date(event.endDate),
  }));

  // Combine member events and general events
  const events = [...memberEvents, ...generalEvents];

  return (
    <div id="events">
      <PageLocation
        pageTitle="Events Calendar"
        parentPath="Calendar"
        currentPath="Events"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 4 }}>
        <div className="flex flex-row-reverse">
          <Button
            className="transition-all duration-300"
            variant="solid"
            size="md"
            onClick={() => navigate("/event/add")}
            sx={{
              px: 3,
              backgroundColor: "black",
              "&:hover": {
                backgroundColor: "#222222",
              },
            }}
          >
            <i className="fa-solid fa-calendar-circle-plus me-4 text-white"></i>
            Add Event
          </Button>
        </div>
        <CardContent>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.title.includes("Birthday")
                  ? "#ffcc00"
                  : event.title.includes("Subscription")
                  ? "#32CD32"
                  : "#007BFF",
                color: "white",
                borderRadius: "5px",
              },
            })}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
