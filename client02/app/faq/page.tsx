"use client";

import React, { useState } from "react";
import Heading from "../Utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FQA from "../components/FQA/FQA";


type Props = {};
const Page: React.FC<Props> = () => { 
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(4);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen">
      <Heading
        title="Câu hỏi thường gặp - Học trực tuyến"
        description="Elearning là một hệ thống quản lý học tập giúp các bạn"
        keyword="kiến thức, kinh nghiệm"
      />
      <Header
        open={open}
        setOpen={setOpen} // Đảm bảo setOpen được truyền vào
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <FQA />
      <Footer />
    </div>
  );
};

export default Page;
