import { DatePicker } from "antd";
import { useContext } from "react";
import Button from "@mui/joy/Button";
import {
  Card,
  Input,
  Select,
  Option,
  FormLabel,
  Textarea,
  CardContent,
  FormControl,
} from "@mui/joy";

import { TrainerContext } from "../context/TrainerContext";

import { PageLocation } from "../components/PageLocation";

const specializationOptions = [
  "Personal Trainer",
  "Weight Management Specialist",
  "Bodybuilding Coach",
  "Wellness Specialist",
  "Strength and Conditioning Coach",
  "Cardio Fitness Trainer",
  "Functional Fitness Trainer",
  "Sports Performance Coach",
  "Rehabilitation Specialist",
  "Yoga Instructor",
  "Pilates Instructor",
  "Group Fitness Instructor",
  " Nutrition and Diet Planning",
  "Aerobics Instructor",
  "CrossFit Trainer",
  " Martial Arts Trainer",
  "Flexibility and Mobility Coach",
  "Endurance Training Specialist",
  "Senior Fitness Specialist",
  "Pre/Postnatal Fitness Specialist",
  "Injury Prevention and Recovery",
  "Dance Fitness Instructor",
  "Mind-Body Specialist",
  "Holistic Health Coach",
  "Core Training Specialist",
];

const AddTrainer = () => {
  const { trainers } = useContext(TrainerContext);

  return (
    <div id="addtrainer">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Trainers"
        currentPath="Add New Trainer"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 0 }}>
        <CardContent>
          <div className="text-xl font-bold border-b-2 p-5 ">
            Add New Trainer
          </div>
          <div className="flex flex-col gap-3 p-6">
            <div className="flex justify-between">
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Auto Generated Id</FormLabel>
                <Input
                  value={`TR${trainers.length + 1}`}
                  variant="solid"
                  size="md"
                  sx={{ py: 1 }}
                  disabled
                  fullWidth
                />
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Full Name</FormLabel>
                <Input
                  placeholder="Trainer Name"
                  variant="outlined"
                  size="md"
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  fullWidth
                />
              </FormControl>
            </div>
            <div className="flex justify-between">
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Email Address</FormLabel>
                <Input
                  placeholder="example@gmail.com"
                  variant="outlined"
                  size="md"
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  fullWidth
                />
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Contact Number</FormLabel>
                <Input
                  placeholder="+91 0000 0000 00"
                  variant="outlined"
                  size="md"
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  fullWidth
                />
              </FormControl>
            </div>
            <div className="flex justify-between">
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Date of Birth</FormLabel>
                <DatePicker
                  style={{
                    height: "42px",
                  }}
                />
              </FormControl>
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Gender</FormLabel>
                <Select
                  placeholder="Select Gender"
                  sx={{
                    backgroundColor: "white",
                    height: "42px",
                  }}
                >
                  <Option value="">Choose...</Option>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </FormControl>
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Specialization</FormLabel>
                <Select
                  placeholder="Select Gender"
                  sx={{
                    backgroundColor: "white",
                    height: "42px",
                  }}
                >
                  <Option value="">Choose...</Option>
                  {specializationOptions.map((specialization, index) => (
                    <Option
                      key={`specialization-${index}`}
                      value={specialization}
                    >
                      {specialization}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex justify-between">
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Height (cm)</FormLabel>
                <Input
                  placeholder="152 cm"
                  variant="outlined"
                  size="md"
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  fullWidth
                />
              </FormControl>
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Weight (kg)</FormLabel>
                <Input
                  placeholder="65 kg"
                  variant="outlined"
                  size="md"
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  fullWidth
                />
              </FormControl>
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>BMI</FormLabel>
                <Input
                  value={0}
                  variant="outlined"
                  size="md"
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  disabled
                  fullWidth
                />
              </FormControl>
            </div>
            <div className="flex justify-between">
              <FormControl sx={{ width: "100%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Address</FormLabel>
                <Textarea
                  placeholder="Enter your address"
                  minRows={2}
                  maxRows={2}
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  size="md"
                  fullWidth
                />
              </FormControl>
            </div>
            <div className="my-3">
              <Button
                size="md"
                className="transition-all duration-300"
                variant="solid"
                sx={{
                  px: 5,
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "#222222",
                  },
                }}
              >
                Add Trainer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTrainer;
