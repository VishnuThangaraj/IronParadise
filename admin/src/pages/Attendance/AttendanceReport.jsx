import { useState } from "react";
import { toast } from "sonner";

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import { PageLocation } from "../../components/PageLocation";

import {
  IndividualReportFieldGroup,
  AttendanceReportFieldGroup,
  initialAttendanceReportState,
  initialIndividualAttendanceState,
} from "../../config/AttendanceReportFields";

import {
  selectCurrentAttendance,
  selectAttendanceLoading,
} from "../../redux/attendance/attendanceSelector";
import { useDispatch, useSelector } from "react-redux";

import FormField from "../../components/Form/FormField";
import { formFieldColSpan } from "../../config/FormFieldConfig";

import { fetchMemberByMemberId } from "../../redux/member/memberThunks";
import { fetchTrainerByUserId } from "../../redux/trainer/trainerThunks";

import {
  fetchRangeAttendance,
  fetchIndividualAttendance,
} from "../../redux/attendance/attendanceThunks";
import { Fragment } from "react";

const AttendanceReport = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAttendanceLoading);
  const attendances = useSelector(selectCurrentAttendance);

  const isAlphabetic = (v) => /^[A-Z]+$/.test(v);
  const isNumeric = (v) => /^\d+(\.\d+)?$/.test(v);

  const [attendanceReport, setAttendanceReport] = useState(
    initialAttendanceReportState,
  );

  const [individualAttendance, setIndividualAttendance] = useState(
    initialIndividualAttendanceState,
  );

  const fetchUserWithId = async (value) => {
    try {
      const isMember = value.startsWith("MBR");

      const action = isMember
        ? fetchMemberByMemberId({ memberId: value })
        : fetchTrainerByUserId({ trainerId: value });

      const data = await dispatch(action).unwrap();

      setIndividualAttendance((prev) => ({
        ...prev,
        name: data?.name || "",
      }));
    } catch {
      setIndividualAttendance((prev) => ({
        ...prev,
        name: "",
      }));

      toast.warning(
        `Invalid ${value.startsWith("MBR") ? "Member" : "Trainer"} ID Provided`,
      );
    }
  };

  const handleIdValidation = () => {
    const id = individualAttendance?.userId || "";

    if (id.length !== 7) {
      toast.warning("ID must be in format MBR-001 or TRN-001");
      return false;
    }

    if (!individualAttendance.name) {
      toast.warning("Please enter a valid ID and verify name");
      return false;
    }

    return true;
  };

  const generateAttendance = async (e) => {
    e.preventDefault();

    if (!Object.values(attendanceReport).every((value) => value !== null))
      return toast.warning("All fields are required !");

    try {
      await dispatch(
        fetchRangeAttendance({ attendanceData: attendanceReport }),
      ).unwrap();
      toast.success("Attendance Generated Successfully!");
    } catch {
      toast.error("Failed to Generate Attendance Trainer");
    } finally {
      setAttendanceReport(initialAttendanceReportState);
    }
  };

  const individualAttendanceReport = (e) => {
    e.preventDefault();
    if (!handleIdValidation) return;
  };

  const handleAttendanceChange = (name, value) => {
    setAttendanceReport((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleIndividualAttendanceChange = (name, value) => {
    if (name == "userId") {
      let v = value.toUpperCase();
      const prevValue = individualAttendance[name] || "";
      const prevSize = prevValue.length;

      if (v.length > 7) return;

      setIndividualAttendance((prev) => ({ ...prev, name: "" }));

      if (v.endsWith("-")) v = v.slice(0, -1);

      const size = v.length;
      const first = v.slice(0, 3);
      const last = size > 3 ? v.slice(4) : "";

      const validRoots = ["MBR", "TRN"];
      const isValidPrefix = (val) =>
        validRoots.some((root) => root.startsWith(val));

      if (first && (!isAlphabetic(first) || !isValidPrefix(first))) return;
      if (last && !isNumeric(last)) return;

      if (size === 4 && prevValue.slice(-1) !== "-") {
        v = `${first}-${value.slice(-1)}`;
      }

      if (size === 3 && prevValue.slice(-1) === "-") {
        v = value.slice(0, -1);
      }

      if (size >= 3 && prevSize < size && !v.includes("-")) {
        v = `${first}-${last}`;
      }

      setIndividualAttendance((prev) => ({
        ...prev,
        [name]: v,
      }));

      if (size === 7) fetchUserWithId(v);
    } else {
      setIndividualAttendance((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  return (
    <div key="Attendance-Report">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Calendar"
        currentPath="Attendance Report"
      />

      <Card sx={{ my: 1, mb: 4, pb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={generateAttendance}>
            <div className="text-xl font-bold border-b p-5">
              Generate Attendance Report
            </div>

            <div className="grid grid-cols-12 gap-4 px-6 mt-7 pb-5">
              {AttendanceReportFieldGroup.map(
                (field) =>
                  (!field.showIf || field.showIf(attendanceReport)) && (
                    <div
                      key={field.name}
                      className={formFieldColSpan(field.size)}
                    >
                      <FormField
                        field={field}
                        value={attendanceReport[field.name]}
                        onChange={handleAttendanceChange}
                        disabled={field.disabled}
                      />
                    </div>
                  ),
              )}
            </div>

            <div className="flex justify-end px-6 py-1 pb-2">
              <Button
                variant="solid"
                type="submit"
                size="md"
                sx={{
                  px: 4,
                  backgroundColor: "black",
                  "&:hover": { backgroundColor: "#222222" },
                }}
                disabled={loading}
              >
                {loading ? (
                  <Fragment>
                    <CircularProgress variant="solid" />{" "}
                    <span className="ms-3">Generating ...</span>
                  </Fragment>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ my: 1, mb: 4, pb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={individualAttendanceReport}>
            <div className="text-xl font-bold border-b p-5">
              Generate Individual Attendance Report
            </div>

            <div className="grid grid-cols-12 gap-4 px-6 mt-7 pb-5">
              {IndividualReportFieldGroup.map(
                (field) =>
                  (!field.showIf || field.showIf(individualAttendance)) && (
                    <div
                      key={field.name}
                      className={formFieldColSpan(field.size)}
                    >
                      <FormField
                        field={field}
                        value={individualAttendance[field.name]}
                        onChange={handleIndividualAttendanceChange}
                        disabled={field.disabled}
                      />
                    </div>
                  ),
              )}
            </div>

            <div className="flex justify-end px-6 py-1 pb-2">
              <Button
                variant="solid"
                type="submit"
                size="md"
                sx={{
                  px: 4,
                  backgroundColor: "black",
                  "&:hover": { backgroundColor: "#222222" },
                }}
                disabled={loading}
              >
                {loading ? (
                  <Fragment>
                    <CircularProgress variant="solid" />{" "}
                    <span className="ms-3">Generating ...</span>
                  </Fragment>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceReport;
