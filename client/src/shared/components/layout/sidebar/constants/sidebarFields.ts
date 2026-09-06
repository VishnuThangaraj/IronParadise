import {
  LuLayoutDashboard,
  LuCalendarCheck2,
  LuCalendar,
  LuMessageSquareQuote,
  LuDumbbell,
  LuUsers,
  LuFlame,
  LuCrown,
  LuCreditCard,
  LuMail,
} from "react-icons/lu";
import type { ElementType } from "react";

export interface SidebarChildItemType {
  name: string;
  location: string;
  badge?: string;
}

export interface SidebarItemType {
  name: string;
  location: string;
  icon?: ElementType | string;
  badge?: string;
  children?: SidebarChildItemType[];
}

export const GeneralSidebarItems: SidebarItemType[] = [
  {
    name: "Dashboard",
    location: "/dashboard",
    icon: LuLayoutDashboard,
  },
  {
    name: "Attendance",
    location: "/attendance",
    icon: LuCalendarCheck2,
  },
  {
    name: "Events",
    location: "/events",
    icon: LuCalendar,
  },
];

export const AdminSidebarItems: SidebarItemType[] = [
  {
    name: "Enquiries",
    location: "/enquiry/list",
    icon: LuMessageSquareQuote,
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
    icon: LuFlame,
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
];

export const TrainerSidebarItems: SidebarItemType[] = [
  {
    name: "Messages",
    icon: LuMail,
    location: "/message",
  },
];

export const MemberSidebarItems: SidebarItemType[] = [
  {
    name: "Messages",
    icon: LuMail,
    location: "/message",
  },
];
