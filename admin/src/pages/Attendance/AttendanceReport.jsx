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
import { useSelector } from "react-redux";

import FormField from "../../components/Form/FormField";
import { formFieldColSpan } from "../../config/FormFieldConfig";

const AttendanceReport = () => {
  const loading = useSelector(selectAttendanceLoading);
  const attendances = useSelector(selectCurrentAttendance);

  const [attendanceReport, setAttendanceReport] = useState(
    initialAttendanceReportState,
  );
  const [individualAttendance, setIndividualAttendance] = useState(
    initialIndividualAttendanceState,
  );

  const generateAttendance = (e) => {
    e.preventDefault();
  };

  const individualAttendanceReport = (e) => {
    e.preventDefault();
  };

  const handleAttendanceChange = (name, value) => {};

  const handleIndividualAttendanceChange = (name, value) => {};

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
    </div>
  );
};

export default AttendanceReport;
