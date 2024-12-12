'use client'

import Heading from '@/app/Utils/Heading'
import React from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected';
import TeacherSidebar from "../../../components/Teacher/sidebar/TeacherSidebar"
import TeacherDashHero from '@/app/components/Teacher/TeacherDashHero';
import AllUsers from '@/app/components/Teacher/Users/AllUsers';
import { useParams } from 'next/navigation';

type Props = {}

const page = (props: Props) => {

  const params = useParams(); // Sử dụng useParams trực tiếp

  if (!params || !params.id) {
    return <div>Loading...</div>; // Hiển thị trạng thái loading khi chưa có id
  }

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

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
             
              <AllUsers id={id}/>
            </div>
          </div>
        </TeacherProtected>
      </div>
    )
}

export default page