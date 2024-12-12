'use client'

import React from 'react'
import CreateCourse from "../../components/Admin/Course/CreateCourse"
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/Utils/Heading';
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import DashboadrHero from "../../components/Admin/DashboardHeader";

type Props = {}

const page = (props: Props) => {
    return (
      <div>
        <AdminProtected>
          <Heading
            title="Học Trực Tuyến"
            description="nền tảng để học sinh học tập và nhận sự trợ giúp từ giáo viên"
            keyword="Lập trình, MERN, Redux, Học máy"
          />
          <div className="flex h-min-screen">
            <div className="1500px:w-[20%] w-1/5">
              <AdminSidebar />
            </div>
            <div className="w-[85%] ">
              <DashboadrHero />
              <CreateCourse />
            </div>
          </div>
        </AdminProtected>
      </div>
    );
  };

export default page