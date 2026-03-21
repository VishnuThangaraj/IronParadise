import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {toast} from "sonner";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";

import DisplayModal from "../../components/Modal/DisplayModal";
import CompactTable from "../../components/DataTable/CompactTable";

import PageLocation from "../../components/PageLocation";
import {useNavigate} from "react-router-dom";

import Calendar from "../../components/Calendar";

import {initialAttendanceSessionState} from "../../config/AttendanceFields";
import {AttendanceCalendarColumns} from "./AttendanceCalendarColumns";
import {
    fetchAllAttendances,
    fetchDailyAttendance,
} from "../../redux/attendance/attendanceThunks";
import {
    selectAllAttendances,
    selectCurrentAttendance,
} from "../../redux/attendance/attendanceSelector";
import {AttendanceSessionColumns} from "./AttendanceSessionColumns";

const AttendanceCalendar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [openAttendance, setopenAttendance] = useState(false);
    const dailyAttendance = useSelector(selectCurrentAttendance);

    const [sessionUser, setSessionUser] = useState(initialAttendanceSessionState);
    const [openSession, setOpenSession] = useState(false);

    const [currentDate, setCurrentDate] = useState(null);

    const attendances = useSelector(selectAllAttendances);

    useEffect(() => {
        dispatch(fetchAllAttendances());
    }, [dispatch]);

    const displayAttendance = async (info) => {
        setCurrentDate(info);
        try {
            await dispatch(fetchDailyAttendance({date: info})).unwrap();
            setopenAttendance(true);
        } catch (error) {
            console.log(error);
            toast.error("Failed to Fetch Attendance");
        }
    };

    const handleDatesChange = (arg) => {
        const currentMonth = arg.view.currentStart.toLocaleString("default", {
            month: "numeric",
            year: "numeric",
        });
        // console.log(currentMonth);
    };

    return (
        <div key="admin_attendance_calendar_page">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Calendar"
                currentPath="Attendance"
            />

            <Card className="shadow-md" sx={{my: 2, py: 4}}>
                <CardContent>
                    <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-3 gap-3">
                        <div className="text-xl font-bold ">Attendance Calendar</div>
                        <Button
                            variant="solid"
                            size="md"
                            onClick={() => navigate("/attendance/report")}
                            sx={{
                                px: 3,
                                borderRadius: 20,
                                bgcolor: "black",
                                "&:hover": {bgcolor: "#222"},
                            }}
                        >
                            <i className="fa-light fa-file me-2"></i>
                            Generate Report
                        </Button>
                    </div>

                    <Calendar
                        events={attendances || []}
                        eventOnClick={displayAttendance}
                        showEventCountOnly={true}
                        handleDatesChange={handleDatesChange}
                    />
                </CardContent>
            </Card>

            {/* Daily Attendance Display */}
            {currentDate && (
                <DisplayModal
                    open={openAttendance}
                    setOpen={setopenAttendance}
                    icon="fa-regular fa-clipboard-user"
                    title={`Attendance ( ${currentDate} )`}
                    content={
                        <CompactTable
                            rows={dailyAttendance || []}
                            columns={AttendanceCalendarColumns({
                                navigate,
                                setSessionUser,
                                setOpenSession,
                            })}
                        />
                    }
                />
            )}

            {/* Daily Attendance Session */}
            {openAttendance && (
                <DisplayModal
                    open={openSession}
                    setOpen={setOpenSession}
                    icon="fa-regular fa-calendar-clock"
                    title={` Sessions | ${sessionUser.name} - ( ${currentDate} )`}
                    content={
                        <CompactTable
                            rows={sessionUser.sessions || []}
                            columns={AttendanceSessionColumns()}
                        />
                    }
                />
            )}
        </div>
    );
};

export default AttendanceCalendar;
