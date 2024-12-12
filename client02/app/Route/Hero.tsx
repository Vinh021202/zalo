import Image from "next/image";
import React, { FC, useState } from "react";
import { BiSearch } from "react-icons/bi";
import client1 from "../../public/asstes/client-1.jpg";
import client2 from "../../public/asstes/client-2.jpg";
import client3 from "../../public/asstes/client3.jpg";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Loader from "../components/Loader/Loader";
import { useRouter } from "next/navigation";

type Props = {};

const Hero: FC<Props> = (props) => {
  const { data, isLoading } = useGetHeroDataQuery("Banner", {});
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search.trim() === "") {
      return; // Không tìm kiếm nếu trống
    }
    router.push(`/courses?title=${search.trim()}`); // Điều hướng với từ khóa
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="hero-container flex items-center min-h-screen relative bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 dark:from-gray-900 dark:to-black">
          <div className="absolute inset-0">
            <Image
              src={data?.layout?.banner.image?.url || "/default-hero.jpg"}
              alt="Hero background"
              fill
              className="object-cover opacity-20 dark:opacity-30"
              priority
            />
          </div>

          <div className="relative container mx-auto flex flex-col lg:flex-row justify-between items-center h-full px-6 lg:px-12 py-16">
            {/* Phần hình ảnh */}
            <div className="image-section w-full lg:w-[40%] flex justify-center items-center overflow-hidden rounded-full border-4 border-white shadow-xl animate-fade-in hero_animation">
              <Image
                src={data?.layout?.banner.image?.url || "/default-hero.jpg"}
                alt="Hero image"
                width={400}
                height={400}
                className="object-cover rounded-full"
                priority
              />
            </div>

            {/* Phần nội dung */}
            <div className="text-section lg:w-[55%] flex flex-col items-center mt-10 lg:mt-0 text-center lg:text-left">
              <h1 className="dark:text-white text-[#ffffff] text-[40px] lg:text-[60px] font-bold font-Josefin leading-tight mb-6 animate-slide-in">
                {data?.layout?.banner.title || "Khám Phá Khóa Học"}
              </h1>
              <p className="dark:text-gray-300 text-gray-100 text-lg lg:text-xl font-medium mb-8 max-w-2xl">
                {data?.layout?.banner.subTitle ||
                  "Cùng chúng tôi xây dựng tương lai với các khóa học hấp dẫn."}
              </p>

              {/* Thanh tìm kiếm */}
              <div className="w-full lg:w-[60%] h-[60px] flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <input
                  type="search"
                  placeholder="Tìm kiếm khóa học..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-grow px-4 text-gray-700 dark:text-white bg-transparent outline-none"
                />
                <button
                  className="w-16 h-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-r-lg flex justify-center items-center hover:opacity-90 transition-all"
                  onClick={handleSearch}
                >
                  <BiSearch size={24} />
                </button>
              </div>

              {/* Tin cậy từ khách hàng */}
              <div className="flex items-center mt-8 space-x-4">
                <Image
                  src={client3}
                  alt="Client image"
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-white shadow-lg transform hover:scale-110 transition-all"
                />
                <Image
                  src={client1}
                  alt="Client image"
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-white shadow-lg transform hover:scale-110 transition-all"
                />
                <Image
                  src={client2}
                  alt="Client image"
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-white shadow-lg transform hover:scale-110 transition-all"
                />
                <p className="text-white text-lg font-medium">
                  Hơn 500K người tin tưởng chúng tôi.{" "}
                  <a
                    href="/courses"
                    className="text-yellow-300 font-bold underline hover:text-yellow-400"
                  >
                    Xem ngay!
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
