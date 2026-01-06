import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import {
  DietPlanFieldGroup,
  initialDietPlanState,
} from "../../config/DietPlanFields";
import {
  addNewDietPlan,
  fetchDietPlanCounter,
} from "../../redux/dietPlan/dietPlanThunks";
import {
  selectDietPlanLoading,
  selectDietPlanCounter,
} from "../../redux/dietPlan/dietPlanSelector";
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

const AddDietPlan = () => {
  const dispatch = useDispatch();

  const loading = useSelector(selectDietPlanLoading);
  const counter = useSelector(selectDietPlanCounter);

  const [NewDietPlan, setNewDietPlan] = useState(initialDietPlanState);

  useEffect(() => {
    dispatch(fetchDietPlanCounter({ role: "diet" }));
  }, [dispatch]);

  useEffect(() => {
    if (counter) {
      setNewDietPlan((prev) => ({
        ...prev,
        userId: `WPL-${String(counter + 1).padStart(3, "0")}`,
      }));
    }
  }, [counter]);

  const handleChange = (name, value) => {
    setNewDietPlan((prev) => {
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
      await dispatch(addNewDietPlan({ NewDietPlan })).unwrap();
      toast.success("Diet Plan Added Successfully!");
    } catch {
      toast.error("Failed to Add Diet Plan");
    } finally {
      setNewDietPlan(initialDietPlanState);
    }
  };
  return (
    <div>
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Fitness Plan"
        currentPath="Add Diet Plan"
      />

      <Card className="shadow-md" sx={{ my: 1, mb: 4, p: 0, pb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <div className="text-xl font-bold border-b-2 border-gray-200 p-5">
              Add New Diet Plan
            </div>

            <div className="grid grid-cols-12 gap-4 px-6 pb-5">
              {DietPlanFieldGroup.map((group) => (
                <Fragment key={`add_trainer_${group.title}`}>
                  <div className="col-span-12 text-lg font-semibold mt-6">
                    {group.title}
                  </div>

                  {group.fields.map(
                    (field) =>
                      (!field.showIf || field.showIf(NewDietPlan)) && (
                        <div
                          key={field.name}
                          className={getColSpan(field.size)}
                        >
                          <FormField
                            field={field}
                            value={NewDietPlan[field.name]}
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
                  "Add Diet Plan"
                )}
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDietPlan;
