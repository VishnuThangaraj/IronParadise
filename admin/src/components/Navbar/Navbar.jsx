import { Avatar } from "antd";
import { useContext } from "react";
import Input from "@mui/joy/Input";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";

import {
  IconSearch,
  IconMoon,
  IconBellFilled,
  IconChevronDown,
} from "@tabler/icons-react";

import { AuthContext } from "../../context/AuthContext";

import "./Navbar.scss";

export const Navbar = () => {
  const { user } = useContext(AuthContext);
  return (
    <div
      id="navbar"
      className="flex justify-between border-b-2 border-gray-200"
    >
      <div className="flex flex-col">
        <div className="font-bold text-lg">Welcome {user?.name} 🖐🏼</div>
        <div className="text-base">
          Here&apos;s what&apos;s happening with your gym today.
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {" "}
        <Input
          placeholder="Search"
          size="lg"
          startDecorator={
            <div className="pe-3 border-e-2 border-gray-200">
              <IconSearch stroke={1.5} size={22} />
            </div>
          }
          sx={{
            width: 250,
            border: "none",
            borderColor: "gray",
            borderRadius: 10,
          }}
        />
        <Stack
          spacing={2}
          direction="row"
          className="border-e-2 ms-4 border-gray-200 pe-3 me-2"
        >
          <div className="rounded-full bg-white p-2 shadow-md cursor-pointer">
            <IconMoon className="text-gray-400" stroke={2} size={25} />
          </div>
          <div className="rounded-full bg-white p-2 shadow-md cursor-pointer">
            <Badge color="warning" badgeContent={5}>
              <IconBellFilled className="text-gray-400" stroke={2} size={25} />
            </Badge>
          </div>
        </Stack>
        <Stack spacing={2} direction="row">
          <Avatar shape="square" size="large" src="images/logoAvatar.png" />
          <div className="flex flex-col justify-around">
            <div className="flex text-sm font-bold">
              Administration <IconChevronDown className="ms-1" size={19} />
            </div>
            <div className="text-sm text-gray-500">Admin</div>
          </div>
        </Stack>
      </div>
    </div>
  );
};
