export const NavbarItems = [
  {
    name: "Attendance",
    icon: "fa-duotone fa-thin fa-clipboard-user",
    location: "/attendance/portal",
  },
  {
    name: "Notification",
    icon: "fa-duotone fa-solid fa-bell",
  },
];

export const NavbarItemStyles = {
  container:
    "w-11 h-11 group flex justify-center items-center gap-2 cursor-pointer rounded-full bg-white shadow hover:w-40 transition-all duration-500 ease-in-out",
  icon: "ps-2 text-xl text-gray-700",
  text: "max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-30 group-hover:opacity-100 transition-all duration-500 ease-in-out",
};
