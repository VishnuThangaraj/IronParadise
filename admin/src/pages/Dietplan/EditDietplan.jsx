import Button from "@mui/joy/Button";
import { CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Fragment, useContext, useEffect, useState } from "react";
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

const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const EditDietplan = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { findDietplanByID, updateDietplan } = useContext(PlanContext);

  const dietplanId = location.state || null;

  const [loading, setLoading] = useState(false);
  const [dietplan, setDietplan] = useState({
    planId: `DP0`,
    dietPlanName: "",
    mondayBreakfast: "",
    mondayLunch: "",
    mondayDinner: "",
    tuesdayBreakfast: "",
    tuesdayLunch: "",
    tuesdayDinner: "",
    wednesdayBreakfast: "",
    wednesdayLunch: "",
    wednesdayDinner: "",
    thursdayBreakfast: "",
    thursdayLunch: "",
    thursdayDinner: "",
    fridayBreakfast: "",
    fridayLunch: "",
    fridayDinner: "",
    saturdayBreakfast: "",
    saturdayLunch: "",
    saturdayDinner: "",
    sundayBreakfast: "",
    sundayLunch: "",
    sundayDinner: "",
  });

  useEffect(() => {
    if (dietplanId === null) return navigate(-1);
    const fetchWorkoutplanData = async () => {
      const workoutplanData = await findDietplanByID(dietplanId);
      setDietplan(workoutplanData);
    };
    fetchWorkoutplanData();
  }, [navigate, dietplanId, findDietplanByID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedDietplan = { ...dietplan, [name]: value };
    setDietplan(updatedDietplan);
  };

  const validateAndEditDietplan = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateDietplan(dietplanId, dietplan);
    setDietplan({
      planId: `DP0`,
      dietPlanName: "",
      mondayBreakfast: "",
      mondayLunch: "",
      mondayDinner: "",
      tuesdayBreakfast: "",
      tuesdayLunch: "",
      tuesdayDinner: "",
      wednesdayBreakfast: "",
      wednesdayLunch: "",
      wednesdayDinner: "",
      thursdayBreakfast: "",
      thursdayLunch: "",
      thursdayDinner: "",
      fridayBreakfast: "",
      fridayLunch: "",
      fridayDinner: "",
      saturdayBreakfast: "",
      saturdayLunch: "",
      saturdayDinner: "",
      sundayBreakfast: "",
      sundayLunch: "",
      sundayDinner: "",
    });
    setLoading(false);
    navigate("/plan/diet/list");
  };

  return (
    <div id="editdietplan">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Fitness Plans"
        currentPath="Edit Diet Plan"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 0 }}>
        <CardContent>
          <Box
            component="form"
            sx={{ p: 0 }}
            onSubmit={validateAndEditDietplan}
          >
            <div className="text-xl font-bold border-b-2 p-5 ">
              Add New Diet Plan
            </div>
            <div className="flex flex-col gap-4 px-6 py-3">
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>
                    Auto Generated Diet Plan Id
                  </FormLabel>
                  <Input
                    value={dietplan.planId.toUpperCase()}
                    variant="solid"
                    size="md"
                    sx={{ py: 1 }}
                    disabled
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Diet Plan Name</FormLabel>
                  <Input
                    placeholder="Enter the Diet Plan Name"
                    value={dietplan.dietPlanName}
                    onChange={handleChange}
                    name="dietPlanName"
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
              {weekDays.map((days, index) => (
                <div
                  key={`dietday-${index}`}
                  className="flex justify-between flex-col"
                >
                  <div className="text-center mt-2 font-bold text-xl">
                    {days.slice(0, 1).toUpperCase() + days.slice(1)}&apos;s Plan
                  </div>
                  <div className="flex justify-between">
                    <FormControl sx={{ width: "31%" }}>
                      <FormLabel sx={{ fontSize: 15 }}>
                        Breakfast Plan
                      </FormLabel>
                      <Textarea
                        placeholder="Enter Breakfast Plan"
                        value={dietplan[`${days}Breakfast`]}
                        name={`${days}Breakfast`}
                        onChange={handleChange}
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
                    <FormControl sx={{ width: "31%" }}>
                      <FormLabel sx={{ fontSize: 15 }}>Lunch Plan</FormLabel>
                      <Textarea
                        placeholder="Enter Lunch Plan"
                        value={dietplan[`${days}Lunch`]}
                        onChange={handleChange}
                        name={`${days}Lunch`}
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
                    <FormControl sx={{ width: "31%" }}>
                      <FormLabel sx={{ fontSize: 15 }}>Dinner Plan</FormLabel>
                      <Textarea
                        placeholder="Enter Dinner Plan"
                        value={dietplan[`${days}Dinner`]}
                        onChange={handleChange}
                        name={`${days}Dinner`}
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
                </div>
              ))}

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
                      <span className="ms-5 text-base">Updating ...</span>
                    </Fragment>
                  ) : (
                    "Update Diet Plan"
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

export default EditDietplan;
