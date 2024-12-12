"use client";
import React from "react";
import Heading from "../Utils/Heading";
import TeacherSidebar from "../components/Teacher/sidebar/TeacherSidebar"
import TeacherProtected from "../hooks/teacherProtected";
import AllCourse from "../components/Teacher/Course/AllCourse";
type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <TeacherProtected>
        <Heading
          title="Học Trực Tuyến - Teacher"
          description="nền tảng để học sinh học tập và nhận sự trợ giúp từ giáo viên"
          keyword="Lập trình, MERN, Redux, Học máy"
        />
        <div className="flex min-h-min">
          <div className="1500px:w-[20%] w-1/5">
            <TeacherSidebar />
          </div>
          <div className="w-[85%] ">
            {/* <TeacherDashHero isDashboard ={true} /> */}
            <AllCourse />
          </div>
        </div>
      </TeacherProtected>
    </div>
  );
};

export default page;
