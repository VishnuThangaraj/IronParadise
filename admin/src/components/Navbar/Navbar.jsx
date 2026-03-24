import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/joy/Tooltip";

import styles from "./Navbar.module.scss";
import ProfileImage from "../../../public/images/admin_image.webp";

import { selectUser } from "@/redux/auth/authSelectors";

import ProfileCard from "@/components/Modal/ProfileCard.jsx";

import { NavbarItems, NavbarItemStyles } from "@/config/NavbarItems";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [openProfile, setOpenProfile] = useState(false);

  return (
    <div
      className={`${styles.navbar} w-100 flex justify-between border-b-2 border-gray-200 primary-bg px-5`}
    >
      <div className="nav_left_hold">
        <div className="font-bold">Welcome to IronParadise 👋🏼</div>
        <div className="">Here's what's happening with your gym today.</div>
      </div>
      <div className="nav_right_hold flex justify-center">
        <div className="flex justify-center gap-4 items-center me-4">
          {NavbarItems.map((nav_item, index) => {
            return (
              <div
                key={`nav_icons-${index}`}
                className={NavbarItemStyles.container}
                onClick={() => {
                  if (nav_item.location)
                    return navigate(`${nav_item.location}`);
                  return console.log("No Operation");
                }}
              >
                <i className={`${nav_item.icon} ${NavbarItemStyles.icon}`}></i>
                <span className={NavbarItemStyles.text}>{nav_item.name}</span>
              </div>
            );
          })}
        </div>

        {/* Profile */}
        <div className="flex justify-between gap-3 border-l-2 border-gray-200">
          <div className="relative w-10 h-10 ms-4">
            <div className="relative w-10 h-10">
              <img
                src={ProfileImage}
                className="rounded-lg"
                alt="administrator_image"
              />
            </div>
          </div>

          <div className="admin_name_hold flex flex-col justify-center text-sm">
            <Tooltip title="Click to View Profile" variant="solid">
              <div
                className="font-semibold cursor-pointer"
                onClick={() => setOpenProfile(true)}
              >
                {user.name} <i className="ms-1 fa-solid fa-chevron-down"></i>
              </div>
            </Tooltip>
            <div className="text-gray-500">
              {user.role.slice(0, 1).toUpperCase() + user.role.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/*Profile Card*/}
      <ProfileCard open={openProfile} setOpen={setOpenProfile} />
    </div>
  );
};

export default Navbar;
