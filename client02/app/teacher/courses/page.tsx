'use client'
import TeacherProtected from '@/app/hooks/teacherProtected'
import Heading from '@/app/Utils/Heading'
import React from 'react'
import DashboadrHero from "../../components/Teacher/TeacherDashHero";
import AllCourse from "../../components/Teacher/Course/AllCourse"
import TeacherSidebar from '@/app/components/Teacher/sidebar/TeacherSidebar';

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
          <div className="flex h-screen">
            <div className="1500px:w-[20%] w-1/5">
              <TeacherSidebar />
            </div>
            <div className="w-[85%] ">
              <DashboadrHero />
              <AllCourse />
            </div>
          </div>
        </TeacherProtected>
      </div>
    )
}

export default page