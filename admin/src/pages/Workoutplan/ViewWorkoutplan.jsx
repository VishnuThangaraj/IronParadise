import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Input,
  Textarea,
  FormLabel,
  CardContent,
  FormControl,
} from "@mui/joy";

import { PlanContext } from "../../context/PlanContext";

import { PageLocation } from "../../components/PageLocation";

const ViewWorkoutplan = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { findWorkoutplanByID } = useContext(PlanContext);

  const workoutplanId = location.state || null;

  const [workoutplan, setWorkoutplan] = useState({
    planId: `WP0`,
    workoutPlanName: "",
    mondayWorkout: "",
    tuesdayWorkout: "",
    wednesdayWorkout: "",
    thursdayWorkout: "",
    fridayWorkout: "",
    saturdayWorkout: "",
    sundayWorkout: "",
  });

  useEffect(() => {
    if (workoutplanId === null) return navigate(-1);
    const fetchWorkoutplanData = async () => {
      const workoutplanData = await findWorkoutplanByID(workoutplanId);
      setWorkoutplan(workoutplanData);
    };
    fetchWorkoutplanData();
  }, [navigate, workoutplanId, findWorkoutplanByID]);

  return (
    <div id="viewworkoutplan">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Fitness Plans"
        currentPath="View Workout Plan"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 0 }}>
        <CardContent>
          <Box component="form" sx={{ p: 0 }}>
            <div className="text-xl font-bold border-b-2 p-5 ">
              View Workout Plan
            </div>
            <div className="flex flex-col gap-3 px-6 py-3">
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>
                    Auto Generated Workout Plan Id
                  </FormLabel>
                  <Input
                    value={workoutplan.planId.toUpperCase()}
                    variant="solid"
                    size="md"
                    sx={{ py: 1 }}
                    disabled
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Workout Plan Name</FormLabel>
                  <Input
                    placeholder="Enter the Workout Plan Name"
                    value={workoutplan.workoutPlanName}
                    name="workoutPlanName"
                    variant="outlined"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                    disabled
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Monday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Monday's Workout Plan    "
                    value={workoutplan.mondayWorkout}
                    name="mondayWorkout"
                    variant="outlined"
                    minRows={2}
                    maxRows={4}
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                    disabled
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Tuesday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Tuesday's Workout Plan    "
                    value={workoutplan.tuesdayWorkout}
                    name="tuesdayWorkout"
                    variant="outlined"
                    minRows={2}
                    maxRows={4}
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                    disabled
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Wednesday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Wednesday's Workout Plan"
                    value={workoutplan.wednesdayWorkout}
                    name="wednesdayWorkout"
                    variant="outlined"
                    minRows={2}
                    maxRows={4}
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                    disabled
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Thursday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Thursday's Workout Plan    "
                    value={workoutplan.thursdayWorkout}
                    name="thursdayWorkout"
                    variant="outlined"
                    minRows={2}
                    maxRows={4}
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                    disabled
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Friday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Friday's Workout Plan"
                    value={workoutplan.fridayWorkout}
                    name="fridayWorkout"
                    variant="outlined"
                    minRows={2}
                    maxRows={4}
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                    disabled
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Saturday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Saturday's Workout Plan    "
                    value={workoutplan.saturdayWorkout}
                    name="saturdayWorkout"
                    variant="outlined"
                    minRows={2}
                    maxRows={4}
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                    disabled
                  />
                </FormControl>
              </div>
              <div className="flex justify-between mb-5">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Sunday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Sunday's Workout Plan"
                    value={workoutplan.sundayWorkout}
                    name="sundayWorkout"
                    variant="outlined"
                    minRows={2}
                    maxRows={4}
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                    disabled
                  />
                </FormControl>
              </div>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewWorkoutplan;
