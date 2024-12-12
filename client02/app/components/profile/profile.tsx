"use client";
import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogOutQuery } from "../../../redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Course/CourseCard";
import { useGetAllCoursesQuery, useGetUserAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useLoadUserQuery, useRefreshTokenQuery } from '@/redux/features/api/apiSilce';

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [logout, setLogout] = useState(false);
  const [courses, setCourses] = useState([]);
  const { data, refetch,isLoading } = useGetUserAllCoursesQuery(undefined, {});
  const {data:userReload , refetch:refetchUser } = useLoadUserQuery({});

  if(!user === userReload) {
    refetchUser();
    user = userReload;
  }
  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });
  const [active, setActive] = useState(1);

  const logOutHandler = async () => {
    try {
      await signOut();
      setLogout(true);
    } catch (err) {
      // add anything to handle error
      console.error("Error during logout:", err);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  useEffect(() => {
    refetch();
    if (data) {
      const filteredCourses = user.courses
        .map((userCourse: any) =>
          data.courses.find((course: any) => course._id === userCourse._id)
        )
        .filter((course: any) => course !== undefined);
      setCourses(filteredCourses);
      
     
    }
  }, [data]);

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[300px] px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90  border bg-white dark:border-[#ffffff1d] border-[#ffffff15] rounded-[5px] shadow-xl dark:shadow-sm mt-[80px] mb-[80px] sticky
                 ${scroll ? "top-[120px]" : "top-[30px]"} left-[30px]`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>
      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo avatar={avatar} user={user} />
        </div>
      )}
      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ChangePassword />
        </div>
      )}
      {active === 3 && (
        <div className="w-full pl-7 px-2 md:px-10 md:pl-8 mt-[80px]">
          <div
            className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px]
                             lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-3 xl:gap-[35px] "
          >
            {courses &&
              courses.map((item: any, index: number) => (
                
                <CourseCard
                  item={item._doc}
                  key={index}
                  isProfile={true}
                />
              ))}
          </div>
          {courses.length === 0 && (
            <h1 className="text-center text-[18px] font-Poppins">
              Bạn không có bất kỳ khóa học đã mua nào
            </h1>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
