import {useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Tooltip from "@mui/joy/Tooltip";

import styles from "./Navbar.module.scss";
import LogoutImage from "../../../public/images/logout_icon.webp";
import ProfileImage from "../../../public/images/admin_image.webp";

import {selectUser} from "@/redux/auth/authSelectors";

import ProfileCard from "@/components/Modal/ProfileCard.jsx";

import {NavbarItems, NavbarItemStyles} from "@/config/NavbarItems";
import LogoutModal from "@/components/Modal/LogoutModal.jsx";


const Navbar = () => {
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const [openLogout, setOpenLogout] = useState(false);
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
                    <div className="relative w-10 h-10 group cursor-pointer ms-4">
                        <Tooltip title="Click to Logout" variant="solid">
                            <div className="relative w-10 h-10">
                                <img
                                    src={ProfileImage}
                                    className="absolute inset-0 w-full h-full rounded-lg transition-opacity duration-300 group-hover:opacity-0"
                                    alt="administrator_image"
                                />

                                <img
                                    src={LogoutImage}
                                    className="absolute inset-0 w-full h-full rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    alt="logout_image"
                                    onClick={() => setOpenLogout(true)}
                                />
                            </div>
                        </Tooltip>
                    </div>

                    <div className="admin_name_hold flex flex-col justify-center text-sm">
                        <div className="font-semibold cursor-pointer" onClick={() => setOpenProfile(true)}>
                            {user.name} <i className="ms-1 fa-solid fa-chevron-down"></i>
                        </div>
                        <div className="text-gray-500">
                            {user.role.slice(0, 1).toUpperCase() + user.role.slice(1)}
                        </div>
                    </div>
                </div>
            </div>

            {/*Logout Modal*/}
            <LogoutModal open={openLogout} setOpen={setOpenLogout}/>

            {/*Profile Card*/}
            <ProfileCard open={openProfile} setOpen={setOpenProfile}/>
        </div>
    );
};

export default Navbar;
