import moment from "moment";
import { Button, Table } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { MemberContext } from "../context/MemberContext";
import { GeneralContext } from "../context/GeneralContext";
import { TrainerContext } from "../context/TrainerContext";
import { SubscriptionContext } from "../context/SubscriptionContext";

import { PageLocation } from "../components/PageLocation";

const Dashboard = () => {
  const navigate = useNavigate();

  const { members } = useContext(MemberContext);
  const { trainers } = useContext(TrainerContext);
  const { attendances } = useContext(GeneralContext);
  const { paymentHistory } = useContext(SubscriptionContext);

  const [totalMembers, setTotalMembers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeMembers, setActiveMembers] = useState(2);
  const [totalTrainers, setTotalTrainers] = useState(0);
  const [expiringMembers, setExpiringMembers] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    setTotalMembers(members.length || 0);
    setTotalTrainers(trainers.length || 0);

    const total = paymentHistory.reduce(
      (acc, data) => acc + (data.amount || 0),
      0
    );
    setTotalRevenue(`₹ ${total}`);

    const active = members.reduce(
      (acc, data) =>
        acc +
        (data.subscription.planCost !== data.subscription.pending ? 1 : 0),
      0
    );
    setActiveMembers(active);

    ///// Subscription //////

    const getMembersWithExpiringSubscriptions = (members) => {
      const today = moment();

      return members
        .map((member) => {
          const endDate = moment(member.subscription.endDate);
          const daysLeft = endDate.diff(today, "days");

          return {
            id: member.username,
            name: member.name,
            endDate: endDate.format("YYYY-MM-DD"),
            daysLeft: daysLeft,
          };
        })
        .filter((member) => member.daysLeft >= 0)
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 5);
    };

    const expiringMembersList = getMembersWithExpiringSubscriptions(members);
    setExpiringMembers(expiringMembersList);

    const calculateWeeklyAttendance = () => {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const attendanceCount = daysOfWeek.map((day) => ({
        day,
        members: 0,
        trainers: 0,
      }));

      attendances.forEach(({ role, createdAt }) => {
        const dayIndex = moment(createdAt).day();
        if (role === "member") {
          attendanceCount[dayIndex].members += 1;
        } else if (role === "trainer") {
          attendanceCount[dayIndex].trainers += 1;
        }
      });

      setAttendanceData(attendanceCount);
    };

    calculateWeeklyAttendance();
  }, [members, trainers, paymentHistory, attendances]);

  const dashWidget = [
    {
      title: "Total Members",
      data: totalMembers,
      border: "border-green-300",
      icon: "fa-duotone fa-solid fa-users text-green-800 text-xl",
      bg: "bg-green-200",
    },
    {
      title: "Active Members",
      data: activeMembers,
      border: "border-yellow-300",
      icon: "fa-duotone fa-solid fa-user-clock text-yellow-800 text-xl",
      bg: "bg-yellow-200",
    },
    {
      title: "Total Trainers",
      data: totalTrainers,
      border: "border-orange-300",
      icon: "fa-duotone fa-solid fa-dumbbell text-orange-600 text-xl",
      bg: "bg-orange-300",
    },
    {
      title: "Total Revenue",
      data: totalRevenue,
      border: "border-black",
      icon: "fa-duotone fa-solid fa-money-bill-trend-up text-slate-600 text-xl",
      bg: "bg-slate-300",
    },
  ];

  return (
    <div id="dashboard">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Dashboard"
        currentPath="Gym-Management"
      />
      <div className="flex justify-between gap-5 w-full py-4">
        {/* Left Side */}
        <div className="w-9/12">
          <div className="flex justify-evenly gap-5">
            {dashWidget.map((dash, index) => (
              <div
                key={`dash-w-${index}`}
                className={`bg-white shadow-md p-4 w-full rounded-lg border-b-4 ${dash.border}`}
              >
                <div className="w-full text-sm font-semibold text-gray-500">
                  {dash.title}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-semibold">{dash.data}</div>
                  <div
                    className={`flex justify-between items-center ${dash.bg} px-3 py-2 rounded-md`}
                  >
                    <i className={dash.icon}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between gap-5 my-7">
            <div className="bg-white shadow-md w-1/2 rounded-lg">
              <div className="flex justify-between items-center  p-4">
                <div className="font-semibold text-lg">
                  Attendance This Week
                </div>
                <div>
                  <Button size="md" variant="outlined" color="neutral">
                    This Week
                  </Button>
                </div>
              </div>
              <BarChart width={400} height={380} data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="members" fill="#8884d8" />
                <Bar dataKey="trainers" fill="#82ca9d" />
              </BarChart>
            </div>
            <div className="bg-white shadow-md w-1/2 rounded-lg">
              <div className="font-semibold p-4 text-lg">
                Subscription Expiring Soon
              </div>
              <Table
                sx={{
                  "& td": { padding: "14px" },
                  "& tr > *:not(:first-child)": { textAlign: "center" },
                }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Member Name</th>
                    <th style={{ textAlign: "center" }}>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringMembers.map((member, index) => (
                    <tr key={`Expiry-mem-${index}`}>
                      <td style={{ textAlign: "center" }}>
                        {member.name}
                        <div>{member.id.toString().toUpperCase()}</div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {member.endDate}
                        <div>{member.daysLeft} days left</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-3/12">
          <div className="flex justify-between items-center bg-teal-50 p-3 shadow-md rounded-lg">
            <div className="text-gray-600 text-sm">
              let&apos;s add new member
              <div
                className="text-green-900 text-base underline font-semibold py-1 cursor-pointer ps-2"
                onClick={() => navigate("/member/add")}
              >
                + Add Member
              </div>
            </div>
            <div className="items-center">
              <img src="images/dashWomen.png" width={75} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md my-7 py-4 px-5">
            <div className="font-semibold text-xl">New Members</div>
            {members
              .slice(-5)
              .reverse()
              .map((data, index) => (
                <div
                  key={`wid-mem-${index}`}
                  className="flex gap-3 items-center border-2 rounded-md border-gray-300 p-2 mt-5"
                >
                  <img src="images/user.png" width={35} />
                  <div className="flex flex-col">
                    <div className="font-semibold text-gray-600">
                      {data.name}
                    </div>
                    <div className="text-xs font-semibold text-gray-400">
                      {data.createdAt.slice(0, 10)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
