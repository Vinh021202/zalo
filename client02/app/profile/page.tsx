'use client'

import React, { FC, useState } from 'react'
import Heading from '../Utils/Heading';
import Header from '../components/Header';
import Protected from '../hooks/useProtected';
import Profile from "../components/profile/profile";
import { useSelector } from 'react-redux';
import Footer from '../components/Footer';



interface Props {}

const Page:FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const {user} = useSelector((state:any) => state.auth);


    return ( 
        <div className='min-h-screen'>
        <Protected>
        <Heading
        title={`${user?.name} profile - Học Trực Tuyến`}
        description="nền tảng để học sinh học tập và nhận sự trợ giúp từ giáo viên" 
        keyword="Lập trình, MERN, Redux, Học máy"
      />

      <Header
         open={open}
         setOpen={setOpen} // Đảm bảo setOpen được truyền vào
         activeItem={activeItem}
         setRoute={setRoute}
         route={route}
      />
      <Profile  user={user} />
      <Footer />
      </Protected>
        </div>
    )
}

export default Page