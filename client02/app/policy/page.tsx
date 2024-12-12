"use client";

import React, { useState } from "react";
import Heading from "../Utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Policy from "./Policy"

type Props = {};
const Page: React.FC<Props> = () => { 
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(3);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="Chính sách - Học trực tuyến"
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

      <Policy />
      <Footer />
    </div>
  );
};

export default Page;
