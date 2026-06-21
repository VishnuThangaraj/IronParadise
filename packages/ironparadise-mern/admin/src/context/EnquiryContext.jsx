import { toast } from "sonner";
import axios from "../service/api";
import PropTypes from "prop-types";
import { createContext, useState, useContext, useEffect } from "react";

import { AuthContext } from "./AuthContext";

export const EnquiryContext = createContext();

export const EnquiryProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [enquires, setEnquires] = useState([]);

  useEffect(() => {
    const fetchEnquires = async () => {
      const response = await axios.get("/enquiry", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setEnquires(response.data.enquires || []);
      } else {
        console.log("Error Fetching Enquiry List");
      }
    };
    fetchEnquires();
  }, [token]);

  // Find Enquiry with ID
  const findEnquiry = async (enquiryId) => {
    return enquires.filter((enquiry) => enquiry._id === enquiryId)[0];
  };

  // Update Enquiry
  const updateEnquiry = async (enquiryId, updatedData) => {
    try {
      const response = await axios.put(
        `/enquiry/update/${enquiryId}`,
        { updatedData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const updatedEnquiry = response.data.enquiry;
        setEnquires((prevEnquires) =>
          prevEnquires.map((enquiry) =>
            enquiry._id === enquiryId ? updatedEnquiry || enquiry : enquiry
          )
        );
        toast.success("Replay Mail Sent for the Enquiry ✔️");
      } else {
        toast.warning("Failed to Send replay for Enquiry 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  const updateEnquiry2 = async (enquiryId, enquiryData) => {
    setEnquires((prevEnquires) =>
      prevEnquires.map((enquiry) =>
        enquiry._id === enquiryId ? enquiryData || enquiry : enquiry
      )
    );
  };

  // Delete Enquiry
  const deleteEnquiry = async (enquiryId) => {
    try {
      const response = await axios.delete(`/enquiry/delete/${enquiryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setEnquires((prevEnquires) =>
          prevEnquires.filter((enquiry) => enquiry._id !== enquiryId)
        );
        toast.success("Enquiry Removed from the List ✔️");
      } else {
        toast.warning("Failed to Delete Enquiry 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  return (
    <EnquiryContext.Provider
      value={{
        enquires,
        findEnquiry,
        updateEnquiry,
        updateEnquiry2,
        deleteEnquiry,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
};

EnquiryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
