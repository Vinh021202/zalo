"use client";
import React from "react";

import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import AdminProtected from "@/app/hooks/adminProtected";
import DashboadrHero from "../../components/Admin/DashboardHero";
import Heading from "@/app/Utils/Heading";
import EidtCategories  from "../../components/Admin/Customization/EditCategories"

type Props = {};


const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Học Trực Tuyến"
          description="nền tảng để học sinh học tập và nhận sự trợ giúp từ giáo viên"
          keyword="Lập trình, MERN, Redux, Học máy"
        />
        <div className="flex h-[200vh]">
          <div className="1500px:w-[20%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%] ">
            <DashboadrHero />
            <EidtCategories />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
