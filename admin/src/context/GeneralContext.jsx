import { toast } from "sonner";
import axios from "../service/api";
import PropTypes from "prop-types";
import { createContext, useState, useContext, useEffect } from "react";

import { AuthContext } from "./AuthContext";

export const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get("/general/attendance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setAttendances(response.data.attendances);
        }
      } catch (err) {
        console.log("Failed to fetch Attendance", err);
      }
    };
    fetchAttendance();
  }, [token]);

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
    <GeneralContext.Provider value={{ sendMail, attendances }}>
      {children}
    </GeneralContext.Provider>
  );
};

GeneralProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
