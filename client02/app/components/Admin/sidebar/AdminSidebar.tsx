"use client"

import { Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MenuItem, ProSidebar, Menu } from "react-pro-sidebar";
import {
  ArrowBackIosIcon,
  ArrowForwardIosIcon,
  BarChartOutlinedIcon,
  ExitToAppIcon,
  GroupsIcon,
  HomeOutlinedIcon,
  ManageHistoryIcon,
  MapOutlinedIcon,
  OndemandVideoIcon,
  PeopleOutlinedIcon,
  QuizIcon,
  ReceiptOutlinedIcon,
  SettingsIcon,
  VideoCallIcon,
  WebIcon,
  WysiwygIcon,
} from "./icon";
import Image from "next/image";
import avatarDefault from "../../../../public/asstes/avatar.png";

interface itemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: any;
}

const Item: FC<itemProps> = ({ title, to, icon, selected, setSelected}) => {
  return (

    <MenuItem
    active={selected === title}
    onClick={() => setSelected(title)}
    icon={icon}
    className="menu-item"
  >
    <Link href={to} passHref>
      <Typography
        className="!text-[15px] !font-Poppins cursor-pointer hover:underline"
        component="a" // Đảm bảo hiển thị dưới dạng liên kết
      >
        {title}
      </Typography>
    </Link>
  </MenuItem>
  
  );
};

const Sidebar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setlogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return null;
  }

  const logoutHandler = () => {
    setlogout(true);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: theme === "dark"
            ? "linear-gradient(180deg, #1a1f37 0%, #1c253c 100%)"
            : "linear-gradient(180deg, #ffffff 0%, #f4f6fa 100%)",
          boxShadow: theme === "dark"
            ? "0 4px 15px 0 rgba(0,0,0,0.3)"
            : "0 4px 15px 0 rgba(0,0,0,0.05)",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          margin: "5px 0",
          transition: "all 0.3s ease",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: theme === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(63,81,181,0.05)",
            transform: "translateX(5px)",
          },
        },
        "& .pro-inner-item.active": {
          backgroundColor: theme === "dark"
            ? "rgba(91,111,230,0.2)"
            : "rgba(63,81,181,0.1)",
          "& .pro-icon": {
            color: theme === "dark" ? "#5b6fe6" : "#3f51b5",
          },
        },
        "& .pro-menu-item": {
          color: theme === "dark" ? "#ffffffc1" : "#333",
        },
        "& .pro-menu-item.active": {
          color: theme === "dark" ? "#ffffff" : "#3f51b5",
        },
        "& .pro-sidebar": {
          height: "100vh !important",
          overflowY: "auto",
        },
      }}
      className={`transition-all duration-300 ${isCollapsed ? "w-[5rem]" : "w-[16rem]"}`}
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          transition: "all 0.3s ease-in-out",
          width: isCollapsed ? "5rem" : "16rem",
          overflowY: "auto",
        }}
      >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              position: "sticky",
              top: 0,
              background: "inherit",
              zIndex: 1,
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Link href="/">
                  <h3 className="text-[22px] font-semibold tracking-wide dark:text-white text-gray-800 hover:opacity-90 transition-opacity">
                    ELearning
                  </h3>
                </Link>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hover:bg-opacity-10 hover:bg-gray-600 rounded-full transition-all duration-200"
                >
                  <ArrowBackIosIcon className="text-gray-600 dark:text-gray-300 w-5 h-5" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={2}
              style={{
                position: "sticky",
                top: "4rem",
                background: "inherit",
                zIndex: 1,
                paddingBottom: "1.5rem",
              }}
              className="transition-all duration-300"
            >
              <div className="relative group">
                <Image
                  alt="profile-user"
                  width={90}
                  height={90}
                  src={user.avatar ? user.avatar.url : avatarDefault}
                  className="rounded-full transition-transform duration-300 group-hover:scale-105"
                  style={{
                    border: `3px solid ${theme === "dark" ? "#5b6fe6" : "#3f51b5"}`,
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>
              <Typography
                variant="subtitle1"
                className="mt-3 font-semibold text-base tracking-wide"
                sx={{
                  color: theme === "dark" ? "#e3e4ff" : "#3f51b5",
                }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="caption"
                className="text-sm opacity-80"
                sx={{ color: theme === "dark" ? "#aaa" : "#666" }}
              >
                {user?.role}
              </Typography>
            </Box>
          )}

          <Box
            paddingLeft={isCollapsed ? undefined : "10%"}
            className="mt-6 space-y-1"
          >
            <Item
              title="Dashboard"
              to="/admin"
              icon={<HomeOutlinedIcon className="w-5 h-5" />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Typography
              variant="h5"
              sx={{ m: "20px 0 10px 25px" }}
              className="!text-[13px] tracking-wider uppercase font-semibold opacity-60"
            >
              {!isCollapsed && "Data"}
            </Typography>

            <Item
              title="Users"
              to="/admin/users"
              icon={<GroupsIcon className="w-5 h-5" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices"
              to="/admin/invoices"
              icon={<ReceiptOutlinedIcon className="w-5 h-5" />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Typography
              variant="h5"
              sx={{ m: "20px 0 10px 25px" }}
              className="!text-[13px] tracking-wider uppercase font-semibold opacity-60"
            >
              {!isCollapsed && "Content"}
            </Typography>
            <Item
              title="Live Courses"
              to="/admin/courses"
              icon={<OndemandVideoIcon className="w-5 h-5" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "20px 0 10px 25px" }}
              className="!text-[13px] tracking-wider uppercase font-semibold opacity-60"
            >
              {!isCollapsed && "Customization"}
            </Typography>

            <Item
              title="Hero"
              to="/admin/hero"
              icon={<WebIcon className="w-5 h-5" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ"
              to="/admin/faq"
              icon={<QuizIcon className="w-5 h-5" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Categories"
              to="/admin/categories"
              icon={<WysiwygIcon className="w-5 h-5" />}
              selected={selected}
              setSelected={setSelected}
            />


            <Typography
              variant="h5"
              sx={{ m: "20px 0 10px 25px" }}
              className="!text-[13px] tracking-wider uppercase font-semibold opacity-60"
            >
              {!isCollapsed && "Analytics"}
            </Typography>

            <Item
              title="Courses Analytics"
              to="/admin/courses-analytics"
              icon={<BarChartOutlinedIcon className="w-5 h-5" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Orders Analytics"
              to="/admin/orders-analytics"
              icon={<MapOutlinedIcon className="w-5 h-5" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Users Analytics" 
              to="/admin/users-analytics"
              icon={<ManageHistoryIcon className="w-5 h-5" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "20px 0 10px 25px" }}
              className="!text-[13px] tracking-wider uppercase font-semibold opacity-60"
            >
              {!isCollapsed && "Extras"}
            </Typography>

            <Item
              title="Settings"
              to="/admin/settings"
              icon={<SettingsIcon className="w-5 h-5" />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <div onClick={logoutHandler} className="mt-4">
              <Item
                title="Logout"
                to="/"
                icon={<ExitToAppIcon className="w-5 h-5" />}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;