'use client'

import Heading from '@/app/Utils/Heading'
import React from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected';
import TeacherSidebar from "../../components/Teacher/sidebar/TeacherSidebar"
import TeacherDashHero from '@/app/components/Teacher/TeacherDashHero';
import AllUsers from '@/app/components/Teacher/Users/AllUsers';

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
              <TeacherSidebar  />
            </div>
            <div className="w-[85%] ">
             
              <AllUsers />
            </div>
          </div>
        </TeacherProtected>
      </div>
    )
}

export default page