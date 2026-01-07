import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import {
  WorkoutPlanFieldGroup,
  initialWorkoutPlanState,
} from "../../config/WorkoutPlanFields";
import {
  addNewWorkoutPlan,
  fetchWorkoutPlanCounter,
} from "../../redux/workoutPlan/workoutPlanThunks";
import {
  selectWorkoutPlanLoading,
  selectWorkoutPlanCounter,
} from "../../redux/workoutPlan/workoutPlanSelector";
import FormField from "../../components/Form/FormField";
import { PageLocation } from "../../components/PageLocation";

const getColSpan = (size) => {
  switch (size) {
    case 100:
      return "col-span-12";
    case 50:
      return "col-span-6";
    case 30:
      return "col-span-4";
    default:
      return "col-span-6";
  }
};

const AddWorkoutPlan = () => {
  const dispatch = useDispatch();

  const loading = useSelector(selectWorkoutPlanLoading);
  const counter = useSelector(selectWorkoutPlanCounter);

  const [newWorkoutPlan, setNewWorkoutPlan] = useState(initialWorkoutPlanState);

  useEffect(() => {
    dispatch(fetchWorkoutPlanCounter({ role: "workout" }));
  }, [dispatch]);

  useEffect(() => {
    if (counter >= 0) {
      setNewWorkoutPlan((prev) => ({
        ...prev,
        workoutPlanId: `WPL-${String(counter + 1).padStart(3, "0")}`,
      }));
    }
  }, [counter]);

  const handleChange = (name, value) => {
    setNewWorkoutPlan((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
  };

  const checkValidation = () => {
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = checkValidation();
    if (!validation) return;

    try {
      await dispatch(addNewWorkoutPlan({ newWorkoutPlan })).unwrap();
      toast.success("Workout Plan Added Successfully!");
    } catch {
      toast.error("Failed to Add Workout Plan");
    } finally {
      setNewWorkoutPlan(initialWorkoutPlanState);
    }
  };
  return (
    <div>
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Fitness Plan"
        currentPath="Add Workout Plan"
      />

      <Card className="shadow-md" sx={{ my: 1, mb: 4, p: 0, pb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <div className="text-xl font-bold border-b-2 border-gray-200 p-5">
              Add New Workout Plan
            </div>

            <div className="grid grid-cols-12 gap-4 px-6 pb-5">
              {WorkoutPlanFieldGroup.map((group) => (
                <Fragment key={`add_trainer_${group.title}`}>
                  <div
                    className={`col-span-12 text-lg font-semibold mt-6 ${group.classes}`}
                  >
                    {group.title}
                  </div>

                  {group.fields.map(
                    (field) =>
                      (!field.showIf || field.showIf(newWorkoutPlan)) && (
                        <div
                          key={field.name}
                          className={getColSpan(field.size)}
                        >
                          <FormField
                            field={field}
                            value={newWorkoutPlan[field.name]}
                            onChange={handleChange}
                            disabled={field.disabled}
                          />
                        </div>
                      )
                  )}
                </Fragment>
              ))}
            </div>

            <div className="flex justify-end px-6 py-3">
              <Button
                variant="solid"
                type="submit"
                size="md"
                sx={{
                  px: 5,
                  backgroundColor: "black",
                  "&:hover": { backgroundColor: "#222222" },
                }}
                disabled={loading}
              >
                {loading ? (
                  <Fragment>
                    <CircularProgress variant="solid" />{" "}
                    <span className="ms-3">Adding ...</span>
                  </Fragment>
                ) : (
                  "Add Workout Plan"
                )}
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddWorkoutPlan;
