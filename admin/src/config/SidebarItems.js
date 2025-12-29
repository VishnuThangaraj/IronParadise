export const AdminSidebarItems = [
  {
    section: "GENERAL",
    items: [
      { name: "Dashboard", location: "/home", icon: "fa-light fa-house" },
      {
        name: "Attendance",
        location: "/attendance",
        icon: "fa-light fa-calendar-circle-user",
      },
      {
        name: "Events",
        location: "/events/view",
        icon: "fa-light fa-calendars",
      },
    ],
  },
  {
    section: "APPLICATIONS",
    items: [
      {
        name: "Enquires",
        location: "/enquiry",
        icon: "fa-light fa-messages-question",
      },
      {
        name: "Trainers",
        icon: "fa-light fa-dumbbell",
        location: "/trainer",
        childrens: [
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
        icon: "fa-light fa-user",
        location: "/member",
        childrens: [
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
        icon: "fa-light fa-folder-heart",
        location: "/plan",
        childrens: [
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
        name: "Subscription Plans",
        icon: "fa-light fa-crown",
        location: "/subscription",
        childrens: [
          {
            name: "Plans List",
            location: "/subscription/list",
          },
          {
            name: "Add New Plan",
            location: "/subscription/add",
          },
        ],
      },
      {
        name: "Subscription Paylist",
        icon: "fa-light fa-money-check",
        location: "/payment",
      },
      {
        name: "Messages",
        icon: "fa-regular fa-envelopes",
        location: "/message",
      },
    ],
  },
];
