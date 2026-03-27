import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useMemo, useState } from "react";

import { toast } from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

import Loader from "@/components/Loader";
import FormField from "@/components/Form/FormField";
import PageLocation from "@/components/PageLocation";
import ButtonPrimary from "@/components/Button/ButtonPrimary";

import {
  handleChangeValidation,
  validateFields,
} from "@/utils/FormFieldValidation";

import { formFieldColSpan } from "@/config/FormFieldConfig";
import {
  TrainerFieldGroup,
  TrainerRules,
  initialTrainerState,
} from "../../config/TrainerFields";

import { fetchCounter } from "@/redux/counter/counterThunks";
import { selectCounter } from "@/redux/counter/counterSelector";
import { addNewTrainer } from "@/redux/trainer/trainerThunks";
import { selectTrainerLoading } from "@/redux/trainer/trainerSelectors";

const AddTrainer = () => {
  const dispatch = useDispatch();

  const counter = useSelector(selectCounter);
  const loading = useSelector(selectTrainerLoading);

  const trainerId = useMemo(() => {
    if (counter < 0) return "";
    return `TRN-${String(counter + 1).padStart(3, "0")}`;
  }, [counter]);

  const [newTrainer, setNewTrainer] = useState(initialTrainerState);

  useEffect(() => {
    dispatch(fetchCounter({ identity: "trainer" }));
  }, [dispatch]);

  const handleChange = (name, value) => {
    const rules = TrainerRules[name];
    if (!handleChangeValidation(value, rules)) return;

    setNewTrainer((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "height" || name === "weight") {
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

    const payload = {
      ...newTrainer,
      userId: trainerId,
    };

    if (!validateFields(payload)) return;

    try {
      await dispatch(addNewTrainer({ newTrainer: payload })).unwrap();
      await dispatch(fetchCounter({ identity: "trainer" })).unwrap();

      toast.success("Trainer added Successfully!");

      setNewTrainer(initialTrainerState);
    } catch (error) {
      toast.warning(error?.message || "Failed to add Trainer");
    }
  };

  if (counter == null || counter < 0) return <Loader />;

  return (
    <div key="Trainers-Add">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Trainers"
        currentPath="Add New Trainer"
      />

      <Card className="shadow-md" sx={{ my: 1, mb: 4, p: 0, pb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <div className="text-xl font-bold border-b-2 border-gray-200 p-5">
              Add New Trainer
            </div>

            <div className="grid grid-cols-12 gap-4 px-6 pb-5">
              {TrainerFieldGroup.map((group) => (
                <Fragment key={`add_trainer_${group.title}`}>
                  <div className="col-span-12 text-lg font-semibold mt-6">
                    {group.title}
                  </div>

                  {group.fields.map(
                    (field) =>
                      (!field.showIf || field.showIf(newTrainer)) && (
                        <div
                          key={field.name}
                          className={formFieldColSpan(field.size)}
                        >
                          <FormField
                            field={field}
                            value={
                              field.name === "userId"
                                ? trainerId
                                : newTrainer[field.name]
                            }
                            onChange={handleChange}
                            disabled={field.disabled}
                          />
                        </div>
                      ),
                  )}
                </Fragment>
              ))}
            </div>

            <div className="flex justify-end px-6 py-3">
              <ButtonPrimary loading={loading} loadingText="Adding ..">
                Add Trainer
              </ButtonPrimary>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTrainer;
