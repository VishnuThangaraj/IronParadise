import {
  LuHouse,
  LuUserCheck,
  LuCalendarCheck,
  LuMessageSquare,
  LuDumbbell,
  LuUsers,
  LuFolderHeart,
  LuCrown,
  LuCreditCard,
  LuMail,
} from "react-icons/lu";

export const AdminSidebarItems = [
  {
    section: "GENERAL",

    items: [
      {
        name: "Dashboard",
        location: "/home",
        icon: LuHouse,
      },
      {
        name: "Attendance",
        location: "/attendance",
        icon: LuUserCheck,
      },
      {
        name: "Events",
        location: "/events/view",
        icon: LuCalendarCheck,
      },
    ],
  },
  {
    section: "APPLICATIONS",
    items: [
      {
        name: "Enquires",
        location: "/enquiry/list",
        icon: LuMessageSquare,
      },
      {
        name: "Trainers",
        icon: LuDumbbell,
        location: "/trainer",
        children: [
          {
            name: "Trainers List",
            location: "/trainer/list",
          },
          {
            name: "Trainers Payroll",
            location: "/trainer/payroll",
          },
          {
            name: "Add New Trainer",
            location: "/trainer/add",
          },
        ],
      },
      {
        name: "Members",
        icon: LuUsers,
        location: "/member",
        children: [
          {
            name: "Members List",
            location: "/member/list",
          },
          {
            name: "Add New Member",
            location: "/member/add",
          },
        ],
      },
      {
        name: "Fitness Plans",
        icon: LuFolderHeart,
        location: "/plan",
        children: [
          {
            name: "Diet Plans List",
            location: "/plan/diet/list",
          },
          {
            name: "Add Diet Plans",
            location: "/plan/diet/add",
          },
          {
            name: "Workout Plans List",
            location: "/plan/workout/list",
          },
          {
            name: "Add Workout Plans",
            location: "/plan/workout/add",
          },
        ],
      },
      {
        name: "Membership Plans",

        icon: LuCrown,
        location: "/membership",
        children: [
          {
            name: "Plans List",
            location: "/membership/list",
          },
          {
            name: "Add New Plan",
            location: "/membership/add",
          },
        ],
      },
      {
        name: "Membership Paylist",
        icon: LuCreditCard,
        location: "/payment",
      },
      {
        name: "Messages",
        icon: LuMail,
        location: "/message",
      },
    ],
  },
];
