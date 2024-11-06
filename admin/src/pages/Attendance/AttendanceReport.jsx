import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { toast } from "sonner";
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
  const [dateError, setDateError] = useState("");
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

  const handleStartDateChange = (date, dateString) => {
    setStartDate(dateString);
    validateDateRange(dateString, endDate);
  };

  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString);
    validateDateRange(startDate, dateString);
  };

  const validateDateRange = (start, end) => {
    const today = dayjs();

    if (start && dayjs(start).isAfter(today)) {
      setDateError("Start date must be before today's date.");
    } else if (end && dayjs(end).isAfter(today)) {
      setDateError("End date must be before today's date.");
    } else if (start && end) {
      if (dayjs(end).isBefore(start)) {
        setDateError("End date must be after start date.");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  };

  // Generate Attendance Report
  const generateReport = () => {
    if (!userId || !startDate || !endDate || dateError) return;

    setLoading(true);

    const filteredData = attendances.filter(
      (attendance) =>
        attendance.username.toLowerCase() === userId.toLowerCase() &&
        dayjs(attendance.createdAt).isAfter(startDate) &&
        dayjs(attendance.createdAt).isBefore(endDate)
    );

    if (filteredData.length === 0) {
      toast.info("No attendance data found for the specified date range.");
      setLoading(false);
      return;
    }

    const reportData = filteredData.map((record) => {
      const loginTime = dayjs(record.createdAt);
      let logoutTime;

      if (record.action === "logout") {
        logoutTime = dayjs(record.updatedAt);
      } else if (record.action === "login") {
        logoutTime = loginTime
          .clone()
          .set("hour", 18)
          .set("minute", 0)
          .set("second", 0);
      }

      const duration = logoutTime.diff(loginTime, "minutes");
      const formattedDuration = `${Math.floor(duration / 60)}h ${
        duration % 60
      }m`;

      return {
        Name: record.name,
        Username: record.username,
        Role: record.role,
        LoginTime: loginTime.format("YYYY-MM-DD HH:mm:ss"),
        LogoutTime: logoutTime.format("YYYY-MM-DD HH:mm:ss"),
        Duration: formattedDuration,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

    XLSX.writeFile(workbook, `${userId}_Attendance_Report.xlsx`);

    setLoading(false);
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
          <Box component="form" sx={{ p: 0 }}>
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
              {dateError && (
                <FormHelperText sx={{ color: "red", mt: 1 }}>
                  {dateError}
                </FormHelperText>
              )}
              <div className="my-3 flex flex-row-reverse">
                <Button
                  className="transition-all duration-300"
                  variant="solid"
                  type="button"
                  size="md"
                  onClick={generateReport}
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
