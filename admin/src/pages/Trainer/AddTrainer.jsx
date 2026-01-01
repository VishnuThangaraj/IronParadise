import { useState } from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import { TrainerColumns } from "./TrainerColumns";
import { PageLocation } from "../../components/PageLocation";
import { initialTrainerState } from "../../config/TrainerFields";

const AddTrainer = () => {
  const [newTrainer, setNewTrainer] = useState(initialTrainerState);
  const handleSubmit = () => {};
  const handleChange = () => {};

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

            <div className="grid grid-cols-2 gap-4 px-6 pb-5">
              {/* {TrainerColumns.map((group))} */}
            </div>

            {/* Submit */}
            <div className="flex justify-end px-6 py-3">
              <Button
                className="transition-all duration-300"
                variant="solid"
                type="submit"
                size="md"
                sx={{
                  px: 5,
                  backgroundColor: "black",
                  "&:hover": { backgroundColor: "#222222" },
                }}
                // disabled={loading}
              >
                {/* {loading ? (
                  <Fragment>
                    <CircularProgress size={20} sx={{ color: "white" }} />
                    <span className="ms-3 text-base">Adding...</span>
                  </Fragment>
                ) : (
                  "Add Trainer"
                )} */}
                Add Trainer
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTrainer;
