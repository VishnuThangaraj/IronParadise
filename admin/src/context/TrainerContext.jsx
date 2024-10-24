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
          const trainersList = response.data.trainers;
          setTrainers(trainersList || []);
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
  const addTrainer = async (trainer) => {
    try {
      const response = await axios.post(
        "/trainer/add",
        { trainer },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        const newTrainer = response.data.trainer;
        setTrainers([...trainers, newTrainer]);
        toast.success("Trainer Added Successfully 💪🏼");
      } else {
        toast.warning("Failed to Add Trainer 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Fetch Trainer by ID
  const findTrainerByID = (trainerId) => {
    return trainers.filter((trainer) => trainer._id === trainerId)[0];
  };

  // Update Trainer by ID
  const updateTrainer = async (trainerId, updatedData) => {
    try {
      const response = await axios.put(
        `/trainer/update/${trainerId}`,
        { updatedData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const updatedTrainer = response.data.trainer || {};
        setTrainers((prevTrainers) =>
          prevTrainers.map((trainer) =>
            trainer._id === trainerId ? updatedTrainer : trainer
          )
        );
        toast.success("Trainer Updated Successfully 💪🏼");
      } else {
        toast.warning("Failed to Update Trainer 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Delete Trainer
  const deleteTrainer = async (trainerId) => {
    try {
      const response = await axios.delete(`/trainer/delete/${trainerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setTrainers((prevTrainers) =>
          prevTrainers.filter((trainer) => trainer._id !== trainerId)
        );
        toast.success("Trainer Removed Successfully ✔️");
      } else {
        toast.warning("Failed to Remove Trainer 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  return (
    <TrainerContext.Provider
      value={{
        trainers,
        addTrainer,
        deleteTrainer,
        updateTrainer,
        findTrainerByID,
      }}
    >
      {children}
    </TrainerContext.Provider>
  );
};

TrainerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
