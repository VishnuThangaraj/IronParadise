import { toast } from "sonner";
import axios from "../service/api";
import PropTypes from "prop-types";
import { createContext, useState, useContext, useEffect } from "react";

import { AuthContext } from "./AuthContext";

export const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [attendances, setAttendances] = useState([]);
  const [eventsList, setEvents] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const [attendance, event, schedule] = await Promise.all([
          axios.get("/general/attendance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/event", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/event/schedule", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (attendance.status === 200) {
          setAttendances(attendance.data.attendances);
        } else {
          console.log("Error Fetching Attendance List");
        }

        if (event.status === 200) {
          setEvents(event.data.events);
        } else {
          console.log("Error Fetching Events List");
        }

        if (schedule.status === 200) {
          console.log("All Events Checks Done");
        }
      } catch (err) {
        console.log("Failed to fetch Attendance", err);
      }
    };
    fetchAttendance();
  }, [token]);

  // Add New Event
  const addEvent = async (eventData) => {
    try {
      console.log(eventData);
      const response = await axios.post(
        "/event/add",
        { eventData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        const newEvent = response.data.event;
        setEvents([...eventsList, newEvent]);
        toast.success("Event Added Successfully ✔️`");
      } else {
        toast.warning("Failed to Add Event 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  //Send Mail
  const sendMail = async (mailData) => {
    try {
      const response = await axios.post(
        `/general/sendmail`,
        { mailData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success("Mail Sent Successfully 📨✔️");
      } else {
        toast.warning("Failed to Send Mail 📨");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  return (
    <GeneralContext.Provider
      value={{ eventsList, addEvent, sendMail, attendances }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

GeneralProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
