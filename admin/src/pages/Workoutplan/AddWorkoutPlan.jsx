import Button from "@mui/joy/Button";
import { CircularProgress } from "@mui/material";
import { Fragment, useContext, useState } from "react";
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

const AddWorkoutPlan = () => {
  const { workoutplans, addWorkoutplan } = useContext(PlanContext);

  const [loading, setLoading] = useState(false);
  const [workoutplan, setWorkoutplan] = useState({
    planId: `WP${workoutplans.length + 1}`,
    workoutPlanName: "",
    mondayWorkout: "",
    tuesdayWorkout: "",
    wednesdayWorkout: "",
    thursdayWorkout: "",
    fridayWorkout: "",
    saturdayWorkout: "",
    sundayWorkout: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedWorkoutplan = { ...workoutplan, [name]: value };
    setWorkoutplan(updatedWorkoutplan);
  };

  const validateAndAddWorkout = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addWorkoutplan(workoutplan);
    setWorkoutplan({
      planId: `WP${workoutplans.length + 2}`,
      workoutPlanName: "",
      mondayWorkout: "",
      tuesdayWorkout: "",
      wednesdayWorkout: "",
      thursdayWorkout: "",
      fridayWorkout: "",
      saturdayWorkout: "",
      sundayWorkout: "",
    });
    setLoading(false);
  };

  return (
    <div id="addworkoutplan">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Fitness Plans"
        currentPath="Add New Workout Plan"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 0 }}>
        <CardContent>
          <Box component="form" sx={{ p: 0 }} onSubmit={validateAndAddWorkout}>
            <div className="text-xl font-bold border-b-2 p-5 ">
              Add New Workout Plan
            </div>
            <div className="flex flex-col gap-3 px-6 py-3">
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>
                    Auto Generated Workout Plan Id
                  </FormLabel>
                  <Input
                    value={workoutplan.planId}
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
                    onChange={handleChange}
                    name="workoutPlanName"
                    variant="outlined"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Monday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Monday's Workout Plan    "
                    value={workoutplan.mondayWorkout}
                    onChange={handleChange}
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
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Tuesday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Tuesday's Workout Plan    "
                    value={workoutplan.tuesdayWorkout}
                    onChange={handleChange}
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
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Wednesday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Wednesday's Workout Plan"
                    value={workoutplan.wednesdayWorkout}
                    onChange={handleChange}
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
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Thursday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Thursday's Workout Plan    "
                    value={workoutplan.thursdayWorkout}
                    onChange={handleChange}
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
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Friday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Friday's Workout Plan"
                    value={workoutplan.fridayWorkout}
                    onChange={handleChange}
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
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Saturday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Saturday's Workout Plan    "
                    value={workoutplan.saturdayWorkout}
                    onChange={handleChange}
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
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Sunday Plan</FormLabel>
                  <Textarea
                    placeholder="Enter Sunday's Workout Plan"
                    value={workoutplan.sundayWorkout}
                    onChange={handleChange}
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
                  />
                </FormControl>
              </div>
              <div className="my-3 flex flex-row-reverse">
                <Button
                  className="transition-all duration-300"
                  variant="solid"
                  type="submit"
                  size="md"
                  sx={{
                    px: 5,
                    backgroundColor: "black",
                    "&:hover": {
                      backgroundColor: "#222222",
                    },
                  }}
                >
                  {loading ? (
                    <Fragment>
                      <CircularProgress
                        size={20}
                        sx={{
                          color: "white",
                        }}
                      />{" "}
                      <span className="ms-5 text-base">Adding ...</span>
                    </Fragment>
                  ) : (
                    "Add Diet Plan"
                  )}
                </Button>
              </div>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddWorkoutPlan;
