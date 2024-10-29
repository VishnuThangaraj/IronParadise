import Table from "@mui/joy/Table";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { MemberContext } from "../context/MemberContext";

import { PageLocation } from "../components/PageLocation";

const Dashboard = () => {
  const navigate = useNavigate();

  const { members } = useContext(MemberContext);

  const [totalMembers, setTotalMembers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeMembers, setActiveMembers] = useState(2);
  const [totalTrainers, setTotalTrainers] = useState(0);

  useEffect(() => {}, []);

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
      <div className="flex justify-between gap-10 w-full py-4">
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
            <div className="bg-white shadow-md w-1/2 rounded-lg">s</div>
            <div className="bg-white shadow-md w-1/2 rounded-lg">
              <div className="font-semibold p-4 text-lg">
                Subscription Expiring Soon
              </div>
              <Table
                sx={{ "& tr > *:not(:first-child)": { textAlign: "center" } }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "Center" }}>Member Name</th>
                    <th style={{ textAlign: "Center" }}>End Date</th>
                  </tr>
                </thead>
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
