import { toast } from "sonner";
import axios from "../service/api";
import PropTypes from "prop-types";
import { createContext, useState, useEffect, useContext } from "react";

import { AuthContext } from "./AuthContext";

export const TrainerContext = createContext();

export const TrainerProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get("/trainer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setTrainers(response.body.trainers || []);
        } else {
          console.log("Error Fetching Trainers List");
        }
      } catch (err) {
        console.log("Error Connecting to Server | ", err);
      }
    };
    fetchTrainers();
  }, [token]);

  // Add New Trainer
  const addTrainer = async () => {};

  return (
    <TrainerContext.Provider value={{ trainers, addTrainer }}>
      {children}
    </TrainerContext.Provider>
  );
};

TrainerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
