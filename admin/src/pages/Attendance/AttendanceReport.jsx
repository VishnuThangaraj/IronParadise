import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { DatePicker } from "antd";
import { CircularProgress } from "@mui/material";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  Input,
  Button,
  FormLabel,
  CardContent,
  FormControl,
  FormHelperText,
} from "@mui/joy";

import { MemberContext } from "../../context/MemberContext";
import { GeneralContext } from "../../context/GeneralContext";
import { TrainerContext } from "../../context/TrainerContext";

import { PageLocation } from "../../components/PageLocation";

const AttendanceReport = () => {
  const { members } = useContext(MemberContext);
  const { trainers } = useContext(TrainerContext);
  const { attendances } = useContext(GeneralContext);

  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [showInvalidId, setShowInvalidId] = useState(false);

  useEffect(() => {
    const combined = [...members, ...trainers].map(
      ({ _id, name, username, role }) => ({
        id: _id,
        name,
        username: username.toUpperCase(),
        role,
      })
    );

    setUsers(combined);
  }, [trainers, members]);

  const handleChange = (e) => {
    const { value } = e.target;
    if (value && value.length > 5) return;

    setUserId(value.toUpperCase());

    if (value.length > 2) {
      const foundUser = users.find(
        (data) => data.username.toLowerCase() === value.toLowerCase()
      );

      if (foundUser) {
        setName(foundUser.name);
        setShowInvalidId(false);
      } else {
        setName("");
        setShowInvalidId(true);
      }
    } else {
      setShowInvalidId(false);
      setName("");
    }
  };

  // Start Date
  const handleStartDateChange = (date, dateString) => {
    setStartDate(dateString);
  };

  // End Date
  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString);
  };

  return (
    <div id="attendanceReport">
      <PageLocation
        pageTitle="Attendance Report"
        parentPath="Calendar"
        currentPath="Attendance Report"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 0 }}>
        <CardContent>
          <Box
            component="form"
            sx={{ p: 0 }}
            //   onSubmit={validateAndGenerate}
          >
            <div className="text-xl font-bold border-b-2 p-5 ">
              Generate New Attendance Report
            </div>
            <div className="flex flex-col gap-4 px-6 py-3">
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>User ID</FormLabel>
                  <Input
                    onChange={handleChange}
                    placeholder="MBXX"
                    variant="outlined"
                    value={userId}
                    size="md"
                    sx={{ py: 1 }}
                  />
                  {showInvalidId && (
                    <FormHelperText sx={{ color: "red", mt: 1 }}>
                      Invalid Member/Trainer ID Provided
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 16 }}>Full Name</FormLabel>
                  <Input
                    variant="solid"
                    placeholder=""
                    value={name}
                    size="md"
                    sx={{ py: 1 }}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Start Date</FormLabel>
                  <DatePicker
                    value={startDate ? dayjs(startDate, "YYYY-MM-DD") : null}
                    onChange={handleStartDateChange}
                    format="YYYY-MM-DD"
                    style={{
                      height: "42px",
                    }}
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>End Date</FormLabel>
                  <DatePicker
                    value={endDate ? dayjs(endDate, "YYYY-MM-DD") : null}
                    onChange={handleEndDateChange}
                    format="YYYY-MM-DD"
                    style={{
                      height: "42px",
                    }}
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
                    px: 3,
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
                      <span className="ms-5 text-base">Generating ...</span>
                    </Fragment>
                  ) : (
                    "Generate Report"
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

export default AttendanceReport;
