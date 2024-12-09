import { toast } from "sonner";
import axios from "../service/api";
import PropTypes from "prop-types";
import { createContext, useState, useContext, useEffect } from "react";

import { AuthContext } from "./AuthContext";

export const EnquiryContext = createContext();

export const EnquiryProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [enquires, setEnquires] = useState([]);

  return (
    <EnquiryContext.Provider
      value={{
        enquires,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
};

EnquiryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
