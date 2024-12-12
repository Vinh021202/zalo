import Ratings from "@/app/Utils/Ratings";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";

type Props = {
  item: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {

  return (
    <Link
      href={!isProfile ? `/course/${item._id}` : `course-access/${item._id}`}
    >
      <div className="group w-full min-h-[35vh] dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg p-4 shadow-sm dark:shadow-inner transition-transform transform hover:scale-105">
        <div className="relative w-full h-[200px] overflow-hidden rounded-lg">
          <Image
            src={item.thumbnail?.url}
            width={500}
            height={300}
            style={{ objectFit: "cover" }}
            className="rounded-lg w-full h-full transition-all group-hover:opacity-80"
            alt={item.name}
          />
        </div>

        <h1 className="font-Poppins text-[18px] text-black dark:text-white mt-3 font-semibold group-hover:text-crimson">
          {item.name}
        </h1>

        <div className="w-full flex items-center justify-between pt-2">
          <Ratings rating={item?.ratings} />
          <h5 className={`text-black dark:text-white ${isProfile && "hidden md:inline"}`}>
            {item.purchased} Học viên
          </h5>
        </div>

        <div className="w-full flex items-center justify-between pt-3">
          <div className="flex items-center">
            <h3 className="text-black dark:text-white font-semibold">
              {item?.price === 0 ? "Miễn phí" : item?.price + "$"}
            </h3>
            {item?.estimatedPrice && (
              <h5 className="pl-3 text-[14px] mt-[-5px] line-through opacity-80 text-gray-500 dark:text-gray-400">
                {item?.estimatedPrice}$
              </h5>
            )}
          </div>

          <div className="flex items-center">
            <AiOutlineUnorderedList size={20} className="text-gray-500 dark:text-white" />
            <h5 className="pl-2 text-black dark:text-white">
              {item?.courseData?.length} Bài giảng
            </h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
