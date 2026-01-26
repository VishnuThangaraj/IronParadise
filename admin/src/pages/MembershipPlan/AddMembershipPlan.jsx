import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import {
  MembershipPlanFieldGroup,
  initialMembershipPlanState,
} from "../../config/MembershipPlanFields";
import {
  addNewMembershipPlan,
  fetchMembershipPlanCounter,
} from "../../redux/membershipPlan/membershipPlanThunks";
import {
  selectMembershipPlanLoading,
  selectMembershipPlanCounter,
} from "../../redux/membershipPlan/membershipPlanSelectors";
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

const numericFields = ["durationMonths", "price"];

const maxLengthMap = {
  price: 5,
  durationMonths: 24,
};

const AddMembershipPlan = () => {
  const dispatch = useDispatch();

  const loading = useSelector(selectMembershipPlanLoading);
  const counter = useSelector(selectMembershipPlanCounter);

  const [newMembershipPlan, setNewMembershipPlan] = useState(
    initialMembershipPlanState,
  );

  useEffect(() => {
    dispatch(fetchMembershipPlanCounter({ role: "membershipplan" }));
  }, [dispatch]);

  useEffect(() => {
    if (counter >= 0) {
      setNewMembershipPlan((prev) => ({
        ...prev,
        membershipPlanId: `MPL-${String(counter + 1).padStart(3, "0")}`,
      }));
    }
  }, [counter]);

  const handleChange = (name, value) => {
    if (numericFields.includes(name) && isNaN(Number(value))) return;

    if (maxLengthMap[name] && value.length > maxLengthMap[name]) return;

    setNewMembershipPlan((prev) => {
      return {
        ...prev,
        [name]: value,
      };
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
      await dispatch(addNewMembershipPlan({ newMembershipPlan })).unwrap();
      toast.success("Membership Plan Added Successfully!");
    } catch {
      toast.error("Failed to Add Membership Plan");
    } finally {
      setNewMembershipPlan(initialMembershipPlanState);
    }
  };

  return (
    <div key="MembershipPlan-Add">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Membership"
        currentPath="Membership Plan List"
      />

      <Card className="shadow-md" sx={{ my: 1, mb: 4, p: 0, pb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <div className="text-xl font-bold border-b-2 border-gray-200 p-5">
              Add New Membership Plan
            </div>

            <div className="grid grid-cols-12 gap-4 px-6 pb-5">
              {MembershipPlanFieldGroup.map((group) => (
                <Fragment key={`add_trainer_${group.title}`}>
                  <div className="col-span-12 text-lg font-semibold mt-6">
                    {group.title}
                  </div>

                  {group.fields.map(
                    (field) =>
                      (!field.showIf || field.showIf(newMembershipPlan)) && (
                        <div
                          key={field.name}
                          className={getColSpan(field.size)}
                        >
                          <FormField
                            field={field}
                            value={newMembershipPlan[field.name]}
                            onChange={handleChange}
                            disabled={field?.disabled ?? false}
                          />
                        </div>
                      ),
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
                  "Add Membership Plan"
                )}
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMembershipPlan;
