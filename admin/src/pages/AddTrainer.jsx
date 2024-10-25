import dayjs from "dayjs";
import { DatePicker } from "antd";
import Button from "@mui/joy/Button";
import { CircularProgress } from "@mui/material";
import { Fragment, useContext, useState } from "react";
import {
  Box,
  Card,
  Input,
  Option,
  Select,
  Textarea,
  FormLabel,
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
  const { trainers, addTrainer } = useContext(TrainerContext);

  const [loading, setLoading] = useState(false);
  const [trainer, setTrainer] = useState({
    username: trainers.length + 1,
    name: "",
    email: "",
    phone: "",
    dob: null,
    gender: null,
    specialization: null,
    height: "",
    weight: "",
    bmi: 0,
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "phone" || name === "height" || name === "weight") &&
      isNaN(Number(value))
    ) {
      return;
    }

    // Update the trainer state
    const updatedTrainer = { ...trainer, [name]: value };
    setTrainer(updatedTrainer);

    // Calculate BMI if height and weight are present
    if (name === "height" || name === "weight") {
      const height = Number(updatedTrainer.height) / 100;
      const weight = Number(updatedTrainer.weight);

      if (weight > 0 && height > 0) {
        const bmi = weight / (height * height);
        setTrainer((prev) => ({ ...prev, bmi: Number(bmi.toFixed(2)) }));
      }
    }
  };

  const handleDateChange = (date, dateString) => {
    setTrainer({ ...trainer, ["dob"]: dateString });
  };

  const handleGenderChange = (event, newValue) => {
    setTrainer({ ...trainer, ["gender"]: newValue });
  };

  const handleSpecializatoinChange = (event, newValue) => {
    setTrainer({ ...trainer, ["specialization"]: newValue });
  };

  const validateAndAddTrainer = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addTrainer(trainer);
    setTrainer({
      username: trainers.length + 2,
      name: "",
      email: "",
      phone: "",
      dob: null,
      gender: null,
      specialization: null,
      height: "",
      weight: "",
      bmi: 0,
      address: "",
    });
    setLoading(false);
  };

  return (
    <div id="addtrainer">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Trainers"
        currentPath="Add New Trainer"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 0 }}>
        <CardContent>
          <Box component="form" sx={{ p: 0 }} onSubmit={validateAndAddTrainer}>
            <div className="text-xl font-bold border-b-2 p-5 ">
              Add New Trainer
            </div>
            <div className="flex flex-col gap-3 px-6 py-3">
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Auto Generated Id</FormLabel>
                  <Input
                    value={`TR${trainers.length + 1}`}
                    variant="solid"
                    size="md"
                    sx={{ py: 1 }}
                    disabled
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Full Name</FormLabel>
                  <Input
                    placeholder="Trainer Name"
                    onChange={handleChange}
                    value={trainer.name}
                    variant="outlined"
                    name="name"
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
                  <FormLabel sx={{ fontSize: 15 }}>Email Address</FormLabel>
                  <Input
                    placeholder="example@gmail.com"
                    onChange={handleChange}
                    value={trainer.email}
                    variant="outlined"
                    name="email"
                    type="email"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Contact Number</FormLabel>
                  <Input
                    placeholder="0000 0000 00"
                    onChange={handleChange}
                    startDecorator={"+91"}
                    value={trainer.phone}
                    variant="outlined"
                    name="phone"
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
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Date of Birth</FormLabel>
                  <DatePicker
                    value={
                      trainer.dob ? dayjs(trainer.dob, "YYYY-MM-DD") : null
                    }
                    onChange={handleDateChange}
                    format="YYYY-MM-DD"
                    style={{
                      height: "42px",
                    }}
                  />
                </FormControl>
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Gender</FormLabel>
                  <Select
                    onChange={handleGenderChange}
                    placeholder="Select Gender"
                    value={trainer.gender}
                    variant="outlined"
                    name="gender"
                    sx={{
                      backgroundColor: "white",
                      height: "42px",
                    }}
                  >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </FormControl>
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Specialization</FormLabel>
                  <Select
                    onChange={handleSpecializatoinChange}
                    placeholder="Select Specialization"
                    value={trainer.specialization}
                    name="specialization"
                    variant="outlined"
                    sx={{
                      backgroundColor: "white",
                      height: "42px",
                    }}
                    required
                  >
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
                    onChange={handleChange}
                    value={trainer.height}
                    variant="outlined"
                    name="height"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                  />
                </FormControl>
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Weight (kg)</FormLabel>
                  <Input
                    placeholder="65 kg"
                    onChange={handleChange}
                    value={trainer.weight}
                    variant="outlined"
                    name="weight"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                  />
                </FormControl>
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>BMI</FormLabel>
                  <Input
                    onChange={handleChange}
                    value={trainer.bmi}
                    variant="outlined"
                    name="bmi"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    disabled
                    required
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "100%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Address</FormLabel>
                  <Textarea
                    placeholder="Enter your address"
                    onChange={handleChange}
                    value={trainer.address}
                    variant="outlined"
                    name="address"
                    minRows={2}
                    maxRows={2}
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    size="md"
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
                    "Add Trainer"
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

export default AddTrainer;
