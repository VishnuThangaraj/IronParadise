import { Button } from "antd";
import { toast } from "sonner";
import Modal from "@mui/joy/Modal";
import Divider from "@mui/joy/Divider";
import { useContext, useState } from "react";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

import { WarningOutlined } from "@ant-design/icons";
import {
  IconLayoutGrid,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";

import "./Sidebar.scss";

const sidebarGeneral = [
  { name: "Dashboard", location: "home", icon: "fa-light fa-house" },
  {
    name: "Attendance",
    location: "attendance",
    icon: "fa-light fa-calendar-circle-user",
  },
  { name: "Events", location: "event", icon: "fa-thin fa-calendars" },
];

const sidebarApplications = [
  {
    name: "Trainers",
    icon: "fa-thin fa-dumbbell",
    location: "trainer",
    childrens: [
      {
        name: "Trainers List",
        location: "trainer/list",
      },
      {
        name: "Add New Trainer",
        location: "trainer/add",
      },
    ],
  },
  {
    name: "Members",
    icon: "fa-thin fa-user",
    location: "member",
    childrens: [
      {
        name: "Members List",
        location: "member/list",
      },
      {
        name: "Add New Member",
        location: "member/add",
      },
    ],
  },
];

export const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation().pathname;

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const logoutAdmin = async () => {
    await logout();
    toast.info("User logged out successfully!");
  };

  return (
    <div
      id="sidebar"
      className="bg-black py-6 rounded-tr-3xl rounded-br-3xl px-5"
    >
      <div className="flex gap-2 items-center justify-center w-full">
        <img src="images/logoWhite.png" alt="Iron Paradise" width={170} />
        <IconLayoutGrid stroke={1.8} color="white" size={23} />
      </div>
      <div className="flex flex-col gap-1 justify-between text-white mt-3">
        <div className="text-left w-full">
          <div className="mb-3 mt-5 text-sm font-bold">GENERAL</div>
          <div className="flex flex-col text-left gap-1">
            {sidebarGeneral.map((list, index) => (
              <div
                key={`side-general-${index}`}
                className={`p-2 cursor-pointer transition-all duration-300 w-full rounded-xl ${
                  location.slice(1) === list.location
                    ? "text-white bg-gray-800"
                    : "text-gray-300 hover:text-white hover:ps-3 hover:bg-gray-800"
                }`}
                onClick={() =>
                  location.slice(1) !== list.location &&
                  navigate(`/${list.location}`)
                }
              >
                <i className={`pe-4 text-lg ${list.icon}`}></i>
                {list.name}
              </div>
            ))}
          </div>
        </div>
        <div className="text-left w-full">
          <div className="mb-3 mt-5 text-sm font-bold">APPLICATIONS</div>
          <div className="flex flex-col text-left gap-1">
            {sidebarApplications.map((list, index) => (
              <div key={`side-applications-${index}`} className="relative">
                <div
                  className={`flex items-center p-2 cursor-pointer transition-all duration-300 w-full rounded-xl ${
                    location.slice(1).startsWith(list.location)
                      ? "text-white bg-gray-800"
                      : "text-gray-300 hover:text-white hover:ps-2"
                  }`}
                  onClick={() => toggleExpand(index)}
                >
                  <i className={`pe-4 text-lg ${list.icon}`}></i>
                  {list.name}
                  {expanded === index ? (
                    <IconChevronDown className="ml-auto" />
                  ) : (
                    <IconChevronRight className="ml-auto" />
                  )}
                </div>
                {expanded === index && (
                  <div className="pl-6 relative">
                    <div className="absolute left-[-1.5rem] top-0 h-full w-[2px] bg-gray-800"></div>
                    {list.childrens.map((child, childIndex) => (
                      <div
                        key={`side-children-${childIndex}`}
                        className={`p-2 cursor-pointer transition-all duration-300 w-full rounded-xl ${
                          location.slice(1) === child.location
                            ? "text-white"
                            : "text-gray-300 hover:text-white hover:ps-3"
                        }`}
                        onClick={() => navigate(`/${child.location}`)}
                      >
                        {child.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Logout Confirmation */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningOutlined />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to Logout from this device?
          </DialogContent>
          <DialogActions>
            <Button
              className="rounded-md"
              variant="solid"
              color="danger"
              onClick={logoutAdmin}
            >
              Logout
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
};
