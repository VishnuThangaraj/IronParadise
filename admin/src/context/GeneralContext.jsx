import { toast } from "sonner";
import axios from "../service/api";
import PropTypes from "prop-types";
import { createContext, useState, useEffect, useContext } from "react";

import { AuthContext } from "./AuthContext";

export const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  //Send Mail
  const sendMail = async (mailData) => {};

  return (
    <GeneralContext.Provider value={{ sendMail }}>
      {children}
    </GeneralContext.Provider>
  );
};

GeneralProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
