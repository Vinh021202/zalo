"use client";

import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../Utils/NavItems";
import { ThemeSwitcher } from "../Utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../Utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "./Auth/Verification";
import Image from "next/image";
import avatar from "../../public/asstes/avatar.png";
import { useSession } from "next-auth/react";
import {
  useLogOutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSilce";
import Loader from "./Loader/Loader";
import Logo from "../../public/asstes/logo.jpg";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, setRoute, open, route }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data } = useSession();
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const {
    data: userData,
    isLoading,
    refetch,
  } = useLoadUserQuery(undefined, {});
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () => {
        setActive(window.scrollY > 80);
      });
    }
    if (!isLoading) {
      // Nếu đã có userData
      if (!userData) {
        if (data) {
          socialAuth({
            email: data?.user?.email,
            name: data?.user?.name,
            avatar: data?.user?.image,
          });
          refetch(); // Gọi lại API để làm mới dữ liệu
        }
      }

      // Nếu dữ liệu là null nhưng thao tác login thành công
      if (data === null) {
        if (isSuccess) {
          toast.success("Login Successfully");
        }
      }

      // Nếu không có dữ liệu và không có userData => logout
      if (data === null && !isLoading && !userData) {
        setLogout(true);
      }
    }
  }, [data, userData, isLoading, isSuccess]);

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      setOpenSidebar(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full relative">
          <div
            className={`${
              active
                ? "dark:bg-opacity-50 backdrop-blur-md fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
                : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80px] dark:shadow"
            }`}
          >
            <div className="w-[95%] md:w-[92%] m-auto py-2 h-full">
              <div className="w-full h-[80px] flex items-center justify-between p-3">
                <Link
                  href={"/"}
                  className={`text-[25px] font-Poppins font-[500] text-black dark:text-white flex items-center justify-center`} // Sử dụng flex và align-items: center
                >
                  <Image
                    src={Logo}
                    width={40}
                    height={20}
                    alt="Logo"
                    className="rounded-xl mr-3" // Thêm một chút khoảng cách giữa logo và chữ
                  />
                  Eng-EDU
                </Link>
                <div className="flex items-center">
                  <NavItems activeItem={activeItem} isMobile={false} />
                  <ThemeSwitcher />
                  <div className="md:hidden">
                    <HiOutlineMenuAlt3
                      size={25}
                      className="cursor-pointer dark:text-white text-black"
                      onClick={() => setOpenSidebar(true)}
                    />
                  </div>
                  {userData ? (
                    <Link
                      href={
                        userData.user.role === "admin"
                          ? "/admin"
                          : userData.user.role === "Teacher"
                          ? "/teacher"
                          : "/profile"
                      }
                    >
                      <Image
                        src={
                          userData.user.avatar
                            ? userData.user.avatar.url
                            : avatar
                        }
                        alt="User Avatar"
                        height={40}
                        width={40}
                        className="rounded-full border-2 border-[#ffc107] hover:shadow-lg transition-all cursor-pointer"
                        title={
                          userData.user.name
                            ? `${userData.user.name} - ${userData.user.role}`
                            : "User Profile"
                        }
                      />
                    </Link>
                  ) : (
                    <HiOutlineUserCircle
                      size={30}
                      className="cursor-pointer hidden md:block dark:text-white text-black"
                      onClick={() => setOpen(true)}
                      title="Đăng nhập / Đăng ký"
                    />
                  )}
                </div>
              </div>
            </div>

            {openSidebar && (
              <div
                className="fixed w-full h-screen top-0 left-0 z-[99999] bg-[#00000024] dark:bg-opacity-50"
                onClick={handleClose}
                id="screen"
              >
                <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 top-0 right-0 transition-all duration-300">
                  <NavItems activeItem={activeItem} isMobile={true} />
                  {userData ? (
                    <Link
                      href={
                        userData.user.role === "admin"
                          ? "/admin"
                          : userData.user.role === "teacher"
                          ? "/teacher"
                          : "/profile"
                      }
                    >
                      <Image
                        src={
                          userData.user.avatar
                            ? userData.user.avatar.url
                            : avatar
                        }
                        alt="User Avatar"
                        height={40}
                        width={40}
                        className="rounded-full border-2 border-[#ffc107] hover:shadow-lg transition-all cursor-pointer"
                        title={
                          userData.user.name
                            ? `${userData.user.name} - ${userData.user.role}`
                            : "User Profile"
                        }
                      />
                    </Link>
                  ) : (
                    <HiOutlineUserCircle
                      size={30}
                      className="cursor-pointer hidden md:block dark:text-white text-black"
                      onClick={() => setOpen(true)}
                      title="Đăng nhập / Đăng ký"
                    />
                  )}
                  <p className="text-[16px] px-4 mt-4 text-black dark:text-white">
                    Đại Học Công Nghiệp IUH
                  </p>
                </div>
              </div>
            )}
          </div>

          {route === "Login" && open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
              refetch={refetch}
            />
          )}
          {route === "Sign-Up" && open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
          {route === "Verification" && open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Header;
