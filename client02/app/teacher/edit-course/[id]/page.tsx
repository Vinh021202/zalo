'use client';

import TeacherProtected from '@/app/hooks/teacherProtected';
import Heading from '@/app/Utils/Heading';
import React from 'react';
import TeacherSidebar from '../../../components/Teacher/sidebar/TeacherSidebar';
import TeacherDashHero from '../../../components/Teacher/TeacherDashHero';
// import CreateCourse from '../../../components/Admin/Course/CreateCourse';
import EditCourse from '../../../components/Teacher/Course/EditCourse';
import { useParams } from 'next/navigation'; // Import useParams từ next/navigation

const Page = () => { 
  const params = useParams(); // Sử dụng useParams trực tiếp

  if (!params || !params.id) {
    return <div>Loading...</div>; // Hiển thị trạng thái loading khi chưa có id
  }

  // Lấy phần tử đầu tiên của mảng nếu params.id là một mảng
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

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
          <div className="w-[85%]">
            <TeacherDashHero />
            {/* Truyền id vào component EditCourse */}
            <EditCourse id={id} />
          </div>
        </div>
      </TeacherProtected>
    </div>
  );
};

export default Page;
