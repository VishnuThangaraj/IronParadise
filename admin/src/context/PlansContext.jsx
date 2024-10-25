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

  return (
    <PlanContext.Provider value={{ dietplans, workoutplans }}>
      {children}
    </PlanContext.Provider>
  );
};

PlanProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
