'use client'

import React from 'react'
import Heading from '@/app/Utils/Heading';
import TeacherProtected from '@/app/hooks/teacherProtected';
import TeacherSidebar from "../../components/Teacher/sidebar/TeacherSidebar"
import TeacherDashHero from '@/app/components/Teacher/TeacherDashHero';
import CoursesAnalytics from '@/app/components/Teacher/Analytics/CoursesAnalytics';



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
              <TeacherDashHero />
              <CoursesAnalytics />
            </div>
          </div>
        </TeacherProtected>
      </div>
    );
  };

export default page