import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import { PageLocation } from "../../components/PageLocation";
import { useNavigate } from "react-router-dom";

import Calendar from "../../components/Calendar";

import { fetchAllAttendances } from "../../redux/attendance/attendanceThunks";
import { selectAllAttendances } from "../../redux/attendance/attendanceSelector";

const AttendanceCalendar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const attendances = useSelector(selectAllAttendances);

  useEffect(() => {
    dispatch(fetchAllAttendances());
  }, [dispatch]);

  const displayAttendance = (info) => {
    console.log(info);
  };

  const handleDatesChange = (arg) => {
    const currentMonth = arg.view.currentStart.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div key="admin_attendance_calendar_page">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Calendar"
        currentPath="Attendance"
      />

      <Card className="shadow-md" sx={{ my: 2, py: 4 }}>
        <CardContent>
          <div className="text-xl font-bold border-b-2 border-gray-200 pb-4 mb-3">
            Attendance Calendar
          </div>
          <Calendar
            events={attendances || []}
            eventOnClick={displayAttendance}
            showEventCountOnly={true}
            handleDatesChange={handleDatesChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceCalendar;
