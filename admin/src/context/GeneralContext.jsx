import { toast } from "sonner";
import axios from "../service/api";
import PropTypes from "prop-types";
import { createContext, useContext } from "react";

import { AuthContext } from "./AuthContext";

export const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

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
    <GeneralContext.Provider value={{ sendMail }}>
      {children}
    </GeneralContext.Provider>
  );
};

GeneralProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
