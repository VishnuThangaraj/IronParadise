import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import { PageLocation } from "../../components/PageLocation";
import { useNavigate } from "react-router-dom";

import Calendar from "../../components/Calendar";

const AttendanceCalendar = () => {
  const navigate = useNavigate();

  const handleDatesChange = (arg) => {
    console.log(arg);

    const currentMonth = arg.view.currentStart.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    console.log(currentMonth);
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
            events={[{ title: "Trainer Session", date: "2026-01-20" }]}
            showEventCountOnly={true}
            handleDatesChange={handleDatesChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceCalendar;
