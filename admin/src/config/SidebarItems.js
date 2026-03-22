export const AdminSidebarItems = [
    {
        section: "GENERAL",

        items: [
            {name: "Dashboard", location: "/home", icon: "fa-chisel fa-regular fa-house"},
            {
                name: "Attendance",
                location: "/attendance",
                icon: "fa-duotone fa-regular fa-calendar-circle-user",
            },
            {
                name: "Events",
                location: "/events/view",
                icon: "fa-regular fa-solid fa-calendars",
            },
        ],
    },
    {
        section: "APPLICATIONS",
        items: [
            {
                name: "Enquires",
                location: "/enquiry/list",
                icon: "fa-regular fa-solid fa-messages-question",
            },
            {
                name: "Trainers",
                icon: "fa-duotone fa-light fa-dumbbell",
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
                icon: "fa-chisel fa-regular fa-user",
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
                icon: "fa-duotone fa-light fa-folder-heart",
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

                icon: "fa-chisel fa-regular fa-crown",
                location: "/subscription",
                children: [
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
                name: "Membership Paylist",
                icon: "fa-duotone fa-light fa-money-check",
                location: "/payment",
            },
            {
                name: "Messages",
                icon: "fa-duotone fa-light fa-envelopes",
                location: "/message",
            },
        ],
    },
];
