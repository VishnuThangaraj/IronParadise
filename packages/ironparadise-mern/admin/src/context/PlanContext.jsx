import { toast } from "sonner";
import axios from "../service/api";
import PropTypes from "prop-types";
import { createContext, useState, useEffect, useContext } from "react";

import { AuthContext } from "./AuthContext";

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [dietplans, setDietplans] = useState([]);
  const [workoutplans, setWorkoutplans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const [dietResponse, workoutResponse] = await Promise.all([
          axios.get("/plan/diet", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/plan/workout", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (dietResponse.status === 200) {
          setDietplans(dietResponse.data.dietplans || []);
        } else {
          console.log("Error Fetching Dietplan List");
        }

        if (workoutResponse.status === 200) {
          setWorkoutplans(workoutResponse.data.workoutplans || []);
        } else {
          console.log("Error Fetching Workoutplan List");
        }
      } catch (err) {
        console.error("Error Connecting to Server:", err);
      }
    };

    fetchPlans();
  }, [token]);

  // Add New Diet Plan
  const addDietplan = async (dietPlan) => {
    try {
      const response = await axios.post(
        "/plan/diet/add",
        { dietPlan },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        const newDietplan = response.data.dietplan;
        setDietplans([...dietplans, newDietplan]);
        toast.success("Dietplan Added Successfully ✔️");
      } else {
        toast.warning("Failed to Add Diet Plan 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Add New Workout Plan
  const addWorkoutplan = async (workoutPlan) => {
    try {
      const response = await axios.post(
        "/plan/workout/add",
        { workoutPlan },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        const newWorkoutplan = response.data.workoutplan;
        setWorkoutplans([...workoutplans, newWorkoutplan]);
        toast.success("Workout Plan Added Successfully ✔️");
      } else {
        toast.warning("Failed to Add Workout Plan 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Fetch Dietplan by ID
  const findDietplanByID = (dietplanId) => {
    return dietplans.filter((dietplan) => dietplan._id === dietplanId)[0];
  };

  // Fetch Workoutplan by ID
  const findWorkoutplanByID = (workoutplanId) => {
    return workoutplans.filter(
      (workoutplan) => workoutplan._id === workoutplanId
    )[0];
  };

  // Update Dietplan by ID
  const updateDietplan = async (dietplanId, updatedData) => {
    try {
      const response = await axios.put(
        `/plan/diet/update/${dietplanId}`,
        { updatedData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const updatedDietplan = response.data.dietplan || {};
        setDietplans((prevDietplans) =>
          prevDietplans.map((dietplan) =>
            dietplan._id === dietplanId ? updatedDietplan : dietplan
          )
        );
        toast.success("Dietplan Updated Successfully ✔️");
      } else {
        toast.warning("Failed to Update Dietplan 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Update Workoutplan by ID
  const updateWorkoutplan = async (workoutplanId, updatedData) => {
    try {
      const response = await axios.put(
        `/plan/workout/update/${workoutplanId}`,
        { updatedData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const updatedWorkoutplan = response.data.workoutplan || {};
        setWorkoutplans((prevWorkoutplans) =>
          prevWorkoutplans.map((workoutplan) =>
            workoutplan._id === workoutplanId ? updatedWorkoutplan : workoutplan
          )
        );
        toast.success("Workout Plan Updated Successfully ✔️");
      } else {
        toast.warning("Failed to Update Workout Plan 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Delete Dietplan
  const deleteDietplan = async (dietplanId) => {
    try {
      const response = await axios.delete(`/plan/diet/delete/${dietplanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setDietplans((prevDietplans) =>
          prevDietplans.filter((dietplan) => dietplan._id !== dietplanId)
        );
        toast.success("Dietplan Removed Successfully ✔️");
      } else {
        toast.warning("Failed to Remove Dietplan 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Delete Workoutplan
  const deleteWorkoutplan = async (workoutplanId) => {
    try {
      const response = await axios.delete(
        `/plan/workout/delete/${workoutplanId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setWorkoutplans((prevWorkoutplans) =>
          prevWorkoutplans.filter(
            (workoutplan) => workoutplan._id !== workoutplanId
          )
        );
        toast.success("Workout Plan Removed Successfully ✔️");
      } else {
        toast.warning("Failed to Remove Workout Plan 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  return (
    <PlanContext.Provider
      value={{
        dietplans,
        addDietplan,
        workoutplans,
        addWorkoutplan,
        deleteDietplan,
        updateDietplan,
        findDietplanByID,
        deleteWorkoutplan,
        updateWorkoutplan,
        findWorkoutplanByID,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

PlanProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
