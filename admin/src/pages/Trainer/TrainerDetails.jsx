import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import { toast } from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

import Loader from "@/components/Loader";
import FormField from "@/components/Form/FormField";
import PageLocation from "@/components/PageLocation";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import ButtonOutlined from "@/components/Button/ButtonOutlined";

import {
  handleChangeValidation,
  validateFields,
} from "@/utils/FormFieldValidation";

import { formFieldColSpan } from "@/config/FormFieldConfig";
import {
  TrainerFieldGroup,
  TrainerRules,
  initialTrainerState,
} from "@/config/TrainerFields";

import {
  selectTrainerLoading,
  selectCurrentTrainer,
} from "@/redux/trainer/trainerSelectors";
import {
  fetchTrainerById,
  updateTrainerById,
} from "@/redux/trainer/trainerThunks";

const TrainerDetails = () => {
  const dispatch = useDispatch();

  const loading = useSelector(selectTrainerLoading);

  const { id } = useParams();
  const { state } = useLocation();

  const trainerId = id ?? null;
  const [editMode, setEditMode] = useState(state?.edit ?? Boolean(id));

  const trainerFromStore = useSelector(selectCurrentTrainer);

  const [trainer, setTrainer] = useState(initialTrainerState);

  useEffect(() => {
    if (trainerId) {
      dispatch(fetchTrainerById(trainerId));
    }
  }, [trainerId, dispatch]);

  const [prevStoreItem, setPrevStoreItem] = useState(trainerFromStore);

  if (trainerFromStore !== prevStoreItem) {
    setPrevStoreItem(trainerFromStore);
    if (trainerFromStore) {
      setTrainer({
        ...initialTrainerState,
        ...trainerFromStore,
      });
    }
  }

  const handleChange = (name, value) => {
    const rules = TrainerRules[name];
    if (!handleChangeValidation(value, rules)) return;

    if (name === "panNumber") {
      value = value.toUpperCase();
    }

    setTrainer((prev) => {
      const updated = { ...prev, [name]: value };

      if (name == "height" || name == "weight") {
        const height = Number(updated.height) / 100;
        const weight = Number(updated.weight);

        if (height > 0 && weight > 0) {
          updated.bmi = Number((weight / (height * height)).toFixed(2));
        } else {
          updated.bmi = "";
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields(trainer)) return;

    try {
      await dispatch(
        updateTrainerById({ trainerId: id, updatedData: trainer }),
      ).unwrap();
      toast.success("Trainer updated successfully");
      setEditMode(false);
    } catch (error) {
      toast.warning(error?.message || "Failed to update trainer");
    }
  };

  if (!trainer) return <Loader />;

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
                <ButtonPrimary onClick={() => setEditMode(true)}>
                  <i className="fa-light fa-user-pen me-2"></i>Edit Trainer
                </ButtonPrimary>
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
                          className={formFieldColSpan(field.size)}
                        >
                          <FormField
                            field={field}
                            value={trainer[field.name]}
                            onChange={handleChange}
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
                <ButtonOutlined
                  color="danger"
                  loading={loading}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </ButtonOutlined>
                <ButtonPrimary loading={loading} loadingText={"Updating ..."}>
                  Update Trainer
                </ButtonPrimary>
              </div>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerDetails;
