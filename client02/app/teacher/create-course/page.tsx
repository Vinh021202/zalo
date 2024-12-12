'use client'

import React from 'react'
import CreateCourse from "../../components/Admin/Course/CreateCourse"
import TeacherProtected from '@/app/hooks/teacherProtected';
import Heading from '@/app/Utils/Heading';
import TeacherSidebar from "../../components/Teacher/sidebar/TeacherSidebar";
import DashboadrHero from "../../components/Admin/DashboardHeader";

type Props = {}

const page = (props: Props) => {
    return (
      <div>
        <TeacherProtected>
          <Heading
            title="Học Trực Tuyến"
            description="nền tảng để học sinh học tập và nhận sự trợ giúp từ giáo viên"
            keyword="Lập trình, MERN, Redux, Học máy"
          />
          <div className="flex h-[200vh]">
            <div className="1500px:w-[20%] w-1/5">
              <TeacherSidebar />
            </div>
            <div className="w-[85%] ">
              <DashboadrHero />
              <CreateCourse />
            </div>
          </div>
        </TeacherProtected>
      </div>
    );
  };

export default page