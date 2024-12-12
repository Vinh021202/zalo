"use client"

import React, { FC, useState, useEffect, use } from 'react';
import { apiSlice, useLoadUserQuery } from "@/redux/features/api/apiSilce"; // API lấy thông tin user
import Heading from './Utils/Heading';
import Header from "./components/Header";
import Hero from './Route/Hero';
import Courses from "./components/Route/Courses";
import Revies from "./components/Route/Revies";
import FQA from "./components/FQA/FQA";
import Footer from "./components/Footer";
import TestModal from "./components/TestModal"; // Import TestModal
import { useSelector } from 'react-redux';
import ChatBox from './components/Chatbox/ChatBox'; // Import ChatBox

interface Props {}

const Page: FC<Props> = (props) => {
 // Lấy count từ Redux



  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  const [openTestModal, setOpenTestModal] = useState(false); // Quản lý trạng thái TestModal
  const [count, setCount] = useState(useSelector((state: any) => state.auth.count)); // Đếm số lần nộp bài kiểm tra
  const [route, setRoute] = useState("Login");
  const [isChatBoxOpen, setChatBoxOpen] = useState(false); // Trạng thái cho ChatBox
  
  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip:false,
  });
  const userRedux = useSelector((state: any) => state.auth.user);

  // Kiểm tra điều kiện để hiển thị modal
  useEffect(() => {
    
    
    if (userData && userData.user) { // Kiểm tra userData.user tồn tại
      if (userData.user.role === "user" && userData.user.isTest === false && count === 0) {
        setOpenTestModal(true);
        userData.count === 1;
        apiSlice.util.invalidateTags([{ type: "User", id: "loadUser(undefined)" }]);
        refetch(); // Tải lại dữ liệu từ server
        
      }
    }
  }, [userData, count]);
  
  return (
    <div>
      <Heading
        title="Học Trực Tuyến"
        description="nền tảng để học sinh học tập và nhận sự trợ giúp từ giáo viên"
        keyword="Lập trình, MERN, Redux, Học máy"
      />

      <Header open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route} />
      <Hero />
      <Courses user={userData?.user}/>
      <br />
      <br />
      <Revies />
      <FQA />
      <Footer />

      {/* Thông báo ChatBox */}
      {!isChatBoxOpen && ( // Chỉ hiển thị nút 💬 khi ChatBox chưa mở
        <div style={{
          position: "fixed",
          bottom: "80px", // Cách nút chat một chút để tránh chồng lên
          right: "20px",
          zIndex: 1000,
          fontSize: "16px",
          color: "#333",
        }}>
          <p className='font-Poppins text-black dark:text-white font-[16px]'>Hãy chat với chúng tôi nếu bạn thắc mắc!</p>
        </div>
      )}

      {/* Nút ChatBox 💬 */}
      {!isChatBoxOpen && ( // Chỉ hiển thị nút 💬 khi ChatBox chưa mở
        <button
          onClick={() => setChatBoxOpen(true)} // Khi nhấn vào, mở ChatBox và ẩn 💬
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            zIndex: 1000,
          }}
        >
          💬
        </button>
      )}

      {/* Hiển thị ChatBox khi isChatBoxOpen là true */}
      {isChatBoxOpen && (
        <div className="chatBoxContainer">
          {/* Truyền dữ liệu userData vào ChatBox */}
          <ChatBox onClose={() => setChatBoxOpen(false)} userData={userData} />
        </div>
      )}


      {/* TestModal */}
      {openTestModal && (
        <TestModal
          open={openTestModal}
          setOpen={setOpenTestModal}
          onTestCompleted={() => setCount(1)} // Đánh dấu đã hoàn thành bài kiểm tra
          count={count}
          setCount={setCount}
          refetch={refetch}
          user={userData}
        />
      )}
    </div>
  );
};

export default Page;
