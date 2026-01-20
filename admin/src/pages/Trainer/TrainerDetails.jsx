import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import {
  TrainerFieldGroup,
  initialTrainerState,
} from "../../config/TrainerFields";
import {
  selectTrainerLoading,
  selectCurrentTrainer,
} from "../../redux/trainer/trainerSelectors";
import FormField from "../../components/Form/FormField";
import { PageLocation } from "../../components/PageLocation";
import { useLocation, useParams } from "react-router-dom";
import { fetchTrainerById } from "../../redux/trainer/trainerThunks";

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

const numericFields = ["phone", "height", "weight", "salary", "aadharNumber"];

const maxLengthMap = {
  phone: 10,
  panNumber: 10,
  aadharNumber: 12,
};

const TrainerDetails = () => {
  const dispatch = useDispatch();

  const loading = useSelector(selectTrainerLoading);

  const { id } = useParams();
  const { state } = useLocation();

  const trainerId = id ?? null;
  const [editMode, setEditMode] = useState(state?.edit ?? Boolean(id));

  const trainerFromStore = useSelector(selectCurrentTrainer);

  const [trainer, setTrainer] = useState(initialTrainerState);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  useEffect(() => {
    if (trainerId) {
      dispatch(fetchTrainerById(trainerId));
    }
  }, [trainerId, dispatch]);

  useEffect(() => {
    if (trainerFromStore) {
      setTrainer({
        ...trainerFromStore,
        dob: formatDateForInput(trainerFromStore.dob),
        joiningDate: formatDateForInput(trainerFromStore.joiningDate),
      });
    }
  }, [trainerFromStore]);

  const checkValidation = () => {
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = checkValidation();
    if (!validation) return;

    try {
      // await dispatch(updateTr({ trainer })).unwrap();
      toast.success("Trainer Updated Successfully!");
    } catch {
      toast.error("Failed to Update Trainer");
    } finally {
      setEditMode(false);
    }
  };

  return (
    <div key="Trainer_Details">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Trainer"
        currentPath="Trainer Details"
      />
      <Card className="shadow-md" sx={{ my: 1, mb: 4, p: 0, pb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <div className="flex justify-between border-b-2 border-gray-200 p-5">
              <div className="text-xl font-bold ">
                {editMode ? "Update Existing Trainer" : "View Existing Trainer"}
              </div>
              {!editMode && (
                <Button
                  className="transition-transform duration-400 hover:scale-103"
                  variant="solid"
                  size="md"
                  sx={{
                    px: 3,
                    backgroundColor: "black",
                    "&:hover": { backgroundColor: "#222222" },
                  }}
                  onClick={() => setEditMode(true)}
                >
                  <i className="fa-light fa-user-pen me-2"></i>Edit Trainer
                </Button>
              )}
            </div>

            <div className="grid grid-cols-12 gap-4 px-6 pb-5">
              {TrainerFieldGroup.map((group) => (
                <Fragment key={`add_trainer_${group.title}`}>
                  <div className="col-span-12 text-lg font-semibold mt-6">
                    {group.title}
                  </div>

                  {group.fields.map(
                    (field) =>
                      (!field.showIf || field.showIf(trainer)) && (
                        <div
                          key={field.name}
                          className={getColSpan(field.size)}
                        >
                          <FormField
                            field={field}
                            value={trainer[field.name]}
                            // onChange={handleChange}
                            disabled={!editMode || field.disabled}
                          />
                        </div>
                      ),
                  )}
                </Fragment>
              ))}
            </div>

            {editMode && (
              <div className="flex justify-end px-6 py-3 gap-5">
                <Button
                  variant="outlined"
                  type="submit"
                  color="danger"
                  size="md"
                  sx={{
                    px: 3,
                  }}
                  disabled={loading}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
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
                      <span className="ms-3">Updating ...</span>
                    </Fragment>
                  ) : (
                    "Update Trainer"
                  )}
                </Button>
              </div>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerDetails;
