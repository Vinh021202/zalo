"use client"; // Đảm bảo chính xác
import Link from "next/link";
import React from "react";

export const navItemsData = [
  { name: "Trang Chủ", url: "/" },
  { name: "Khóa học", url: "/courses" },
  { name: "Về Chúng tôi", url: "/about" },
  { name: "Chính sách", url: "/policy" },
  { name: "Câu hỏi thường gặp", url: "/faq" },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      {/* Hiển thị navItems nếu isMobile là true */}
      {isMobile ? (
        <div className="md:hidden mt-5 bg-white dark:bg-gray-900 shadow-lg rounded-lg animate-slide-down">
          {/* Header hoặc logo */}
          <div className="w-full text-center py-6 border-b border-gray-200 dark:border-gray-700">
            <Link href="/" passHref>
              <span className="text-[25px] font-Poppins font-semibold text-black dark:text-white">
                Học Trực Tuyến
              </span>
            </Link>
          </div>

          {/* Các mục menu */}
          {navItemsData.map((item, index) => (
            <Link href={item.url} key={index}>
              <span
                className={`block py-4 px-6 text-[18px] font-Poppins font-medium ${
                  activeItem === index
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg"
                    : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                } transition-all`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="hidden md:flex space-x-6">
          {navItemsData.map((item, index) => (
            <Link href={item.url} key={index}>
              <span
                className={`text-[18px] font-Poppins font-medium px-4 py-2 transition-all ${
                  activeItem === index
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600"
                    : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
