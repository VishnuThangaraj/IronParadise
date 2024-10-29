import moment from "moment";
import { useContext } from "react";
import { Card, CardContent } from "@mui/joy";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { MemberContext } from "../context/MemberContext";

import { PageLocation } from "../components/PageLocation";

const localizer = momentLocalizer(moment);

const Events = () => {
  const { members } = useContext(MemberContext);

  const startYear = moment().year() - 5;
  const endYear = moment().year() + 5;

  const events = members.flatMap((member) => {
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

  return (
    <div id="events">
      <PageLocation
        pageTitle="Events Calendar"
        parentPath="Calendar"
        currentPath="Events"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 4 }}>
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
                  : "#32CD32",
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
