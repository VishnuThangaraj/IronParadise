import moment from "moment";
import * as XLSX from "xlsx";
import { useContext, useMemo, useState } from "react";
import {
  Card,
  Table,
  Modal,
  Button,
  Divider,
  CardContent,
  DialogTitle,
  ModalDialog,
  DialogContent,
} from "@mui/joy";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { GeneralContext } from "../context/GeneralContext";

import { PageLocation } from "../components/PageLocation";

const localizer = momentLocalizer(moment);

const Attendance = () => {
  const { attendances } = useContext(GeneralContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    trainers: [],
    members: [],
  });

  const events = useMemo(() => {
    const attendanceByDate = {};

    attendances.forEach(({ id, role, createdAt }) => {
      const dateKey = moment(createdAt).startOf("day").toISOString();
      if (!attendanceByDate[dateKey]) {
        attendanceByDate[dateKey] = {
          trainers: new Set(),
          members: new Set(),
        };
      }

      if (role === "trainer") {
        attendanceByDate[dateKey].trainers.add(id);
      } else if (role === "member") {
        attendanceByDate[dateKey].members.add(id);
      }
    });

    return Object.entries(attendanceByDate).flatMap(
      ([date, { trainers, members }]) => {
        const events = [];
        const uniqueTrainers = Array.from(trainers).map((id) =>
          attendances.find((a) => a.id === id)
        );
        const uniqueMembers = Array.from(members).map((id) =>
          attendances.find((a) => a.id === id)
        );

        if (uniqueTrainers.length > 0) {
          events.push({
            title: `${uniqueTrainers.length} | Trainers`,
            allDay: true,
            start: new Date(date),
            end: new Date(date),
            trainers: uniqueTrainers,
          });
        }
        if (uniqueMembers.length > 0) {
          events.push({
            title: `${uniqueMembers.length} | Members`,
            allDay: true,
            start: new Date(date),
            end: new Date(date),
            members: uniqueMembers,
          });
        }
        return events;
      }
    );
  }, [attendances]);

  const handleEventClick = (event) => {
    setModalData({
      title: event.title,
      trainers: event.trainers || [],
      members: event.members || [],
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handlePersonDetailClick = (person) => {
    setSelectedPerson(person);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedPerson(null);
  };

  const getAttendanceLogs = (id) => {
    return attendances
      .filter((attendance) => attendance.id === id)
      .map((log) => {
        const loginTime = moment(log.createdAt);
        const logoutTime = moment(log.updatedAt || log.createdAt);
        const durationInSeconds = logoutTime.diff(loginTime, "seconds");
        const durationInMinutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        const status = loginTime.isSame(logoutTime)
          ? "Active"
          : `${durationInMinutes} min ${seconds} sec`;

        return {
          loginTime: loginTime.format("YYYY-MM-DD HH:mm"),
          logoutTime: logoutTime.format("YYYY-MM-DD HH:mm"),
          status: status,
        };
      });
  };

  const exportIndividualAttendance = () => {
    if (!selectedPerson) return;

    const attendanceLogs = getAttendanceLogs(selectedPerson.id);

    const data = attendanceLogs.map((log) => ({
      "Login Time": log.loginTime,
      "Logout Time": log.status === "Active" ? "---" : log.logoutTime,
      Duration: log.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${selectedPerson.name} Attendance`);

    XLSX.writeFile(wb, `${selectedPerson.name}_Attendance_Log.xlsx`);
  };

  return (
    <div id="attendance">
      <PageLocation
        pageTitle="Attendance Calendar"
        parentPath="Calendar"
        currentPath="Attendance"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 4 }}>
        <CardContent>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.title.includes("Trainer")
                  ? "#4A4A4A"
                  : "#B0B0B0",
                color: "white",
                borderRadius: "5px",
              },
            })}
            onSelectEvent={handleEventClick}
          />
        </CardContent>
      </Card>

      {/* Modal for displaying attendance details */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "600px" }}
        >
          <DialogTitle>
            <div className="flex items-center gap-4">
              <i className="fa-duotone fa-solid fa-calendar-circle-user text-blue-600 me-1 text-2xl"></i>
              Attendance List
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="px-2">
              <div className="font-semibold my-2">
                {modalData.title.slice(4)}
              </div>
              <Table
                sx={{ "& tr > *:not(:first-child)": { textAlign: "right" } }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>ID</th>
                    <th style={{ textAlign: "center" }}>Full Name</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {modalData.trainers.length > 0
                    ? modalData.trainers.map((trainer) => (
                        <tr key={trainer.id}>
                          <td style={{ textAlign: "center" }}>
                            {trainer.username.toUpperCase()}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {trainer.name}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handlePersonDetailClick(trainer)}
                              sx={{ p: 1 }}
                            >
                              <i className="fa-sharp-duotone fa-solid fa-share-all me-2"></i>
                              View Log
                            </Button>
                          </td>
                        </tr>
                      ))
                    : modalData.members.map((member) => (
                        <tr key={member.id}>
                          <td style={{ textAlign: "center" }}>
                            {member.username.toUpperCase()}
                          </td>
                          <td style={{ textAlign: "center" }}>{member.name}</td>
                          <td style={{ textAlign: "center" }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handlePersonDetailClick(member)}
                              sx={{ p: 1 }}
                            >
                              <i className="fa-sharp-duotone fa-solid fa-share-all"></i>
                              View Log
                            </Button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </Table>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>

      {/* Modal for displaying individual attendance logs */}
      <Modal open={detailModalOpen} onClose={handleCloseDetailModal}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "500px" }}
        >
          <DialogTitle>
            <div className="flex items-center gap-4">
              <i className="fa-duotone fa-solid fa-user-clock text-green-600 me-1 text-2xl"></i>
              {selectedPerson ? selectedPerson.name : ""}&apos;s Attendance Log
              <div className="ms-10">
                <Button
                  className="transition-all duration-300"
                  onClick={exportIndividualAttendance}
                  variant="solid"
                  type="submit"
                  size="sm"
                  sx={{
                    px: 2,
                    backgroundColor: "black",
                    "&:hover": {
                      backgroundColor: "#222222",
                    },
                  }}
                >
                  Export
                </Button>
              </div>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Table
              sx={{ "& tr > *:not(:first-child)": { textAlign: "right" } }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Login Time</th>
                  <th style={{ textAlign: "center" }}>Logout Time</th>
                  <th style={{ textAlign: "center" }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {selectedPerson &&
                  getAttendanceLogs(selectedPerson.id).map((log, index) => (
                    <tr key={`log-${index}`}>
                      <td style={{ textAlign: "center" }}>{log.loginTime}</td>
                      <td style={{ textAlign: "center" }}>
                        {log.status === "Active" ? "---" : log.logoutTime}
                      </td>
                      <td style={{ textAlign: "center" }}>{log.status}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {!selectedPerson ||
            getAttendanceLogs(selectedPerson.id).length === 0 ? (
              <p>No attendance records found.</p>
            ) : null}
          </DialogContent>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default Attendance;
