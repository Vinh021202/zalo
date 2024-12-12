import { Style } from "@/app/style/stylelogin";
import CoursePlayer from "@/app/Utils/CoursePlayer";
import Ratings from "@/app/Utils/Ratings";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { format } from "timeago.js";
import CourseContainetList from "../Course/CourseContainetList";
import { AiOutlineClose } from "react-icons/ai";
import { Elements } from "@stripe/react-stripe-js";
import ChekOutForm from "../Payment/ChekOutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSilce";
import Image from "next/image";
import Avatar02 from "../../../public/asstes/avatar2.jpg";
import { VscVerifiedFilled } from "react-icons/vsc";

type Props = {
  data: any;
  clientSecret: string;
  stripePromise: any;
  setRoute: any;
  setOpen: any;
};

const CourseDetails = ({ data, clientSecret, stripePromise, setRoute, setOpen: openAuthModal }: Props) => {
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState<boolean>(false); // Track purchase status
  const [loading, setLoading] = useState<boolean>(false); // Track loading state

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  useEffect(() => {
    if (user && user?.courses?.find((item: any) => item._id === data._id)) {
      setIsPurchased(true); // Check if the course is purchased
    }
  }, [user, data]);

  const discountPercentenge = ((data?.estimatedPrice - data?.price) / data?.estimatedPrice) * 100;
  const discountPercentengePrice = discountPercentenge.toFixed(0);

  const handleOrder = async (e: any) => {
    if (user) {
      setLoading(true);
      try {
        setOpen(true);
      } catch (error) {
        console.error("Error during order:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setRoute("Login");
      openAuthModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    // Reload the page or fetch updated data after payment success
    setIsPurchased(true); // Mark the course as purchased
  };

  return (
    <div>
      <div className="w-[90%] md:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse md:flex-row">
          <div className="w-full md:w-[65%] md:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data.ratings} />
                <h5 className="text-black dark:text-white">{data.reviews?.length} đánh giá</h5>
              </div>
              <h5 className="text-black dark:text-white">{data.purchased} Học Viên</h5>
            </div>
            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              bạn sẽ học được gì từ khóa học này
            </h1>
            <div>
              {data?.benefits?.map((item: any, index: number) => (
                <div className="w-full flex md:items-center py-2 text-black dark:text-white" key={index}>
                  <div className="w-[15px] mr-1">
                    <IoMdCheckmarkCircleOutline size={20} />
                  </div>
                  <p className="pl-2">{item.title}</p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className="text-[25px] font-Poppins font-600 text-black dark:text-white">
              những điều kiện tiên quyết để bắt đầu khóa học này là gì
            </h1>
            {data?.benefits?.map((item: any, index: number) => (
              <div className="w-full flex md:items-center py-2 text-black dark:text-white" key={index}>
                <div className="w-[15px] mr-1">
                  <IoMdCheckmarkCircleOutline size={20} />
                </div>
                <p className="pl-2">{item.title}</p>
              </div>
            ))}
            <br />
            <br />
            <div>
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">Tổng quan khóa học</h1>
              <CourseContainetList data={data?.courseData} isDemo={true} />
            </div>
            <br />
            <br />
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">Chi tiết khóa học</h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data?.description}
              </p>
            </div>
            <br />
            <br />
            <div className="w-full">
              <div className="md:flex items-center">
                <Ratings rating={data?.ratings} />
                <h5 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                  {Number.isInteger(data?.ratings) ? data?.ratings.toFixed(1) : data?.ratings.toFixed(2)} Đánh giá khóa học ° {data?.reviews?.length} Đánh giá
                </h5>
              </div>
              <br />
              {(data?.reviews && [...data.reviews].reverse()).map((item: any, index: number) => (
                <div className="w-full pb-6" key={index}>
                  <div className="flex items-start mb-4">
                    <div className="w-[50px] h-[50px]">
                      <Image
                        src={item?.avatar ? item?.avatar?.url : Avatar02}
                        width={50}
                        height={50}
                        alt="User Avatar"
                        className="w-[50px] h-[50px] rounded-full object-cover"
                      />
                    </div>
                    <div className="pl-4 flex flex-col w-full">
                      <div className="flex items-center mb-2">
                        <h5 className="text-[18px] pr-2 text-black dark:text-white">{item.user.name}</h5>
                        <Ratings rating={item.rating} />
                      </div>
                      <p className="text-black dark:text-white mb-2">{item.comment}</p>
                      <small className="text-[#000000d1] dark:text-[#ffffff83]">{format(item.createdAt)}</small>
                    </div>
                  </div>
                  {item.commentReplies.map((i: any, index: number) => (
                    <div key={index} className="w-full flex ml-12 my-5">
                      <div className="w-[50px] h-[50px]">
                        <Image
                          src={i.user.avatar ? i.user.avatar.url : Avatar02}
                          width={50}
                          height={50}
                          alt="User Avatar"
                          className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                      </div>
                      <div className="pl-4 flex flex-col w-full">
                        <div className="flex items-center mb-2">
                          <h5 className="text-[20px]">{i.user.name}</h5>
                          {i.user.role === "admin" && (
                            <VscVerifiedFilled className="text-[#50c750] ml-2 text-[20px]" />
                          )}
                        </div>
                        <p className="text-black dark:text-white mb-2">{i.comment}</p>
                        <small className="text-[#ffffff83]">{format(i.createdAt)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-[35%] relative">
            <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
              <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
              <div className="flex items-center">
                <h3 className="pt-5 text-[25px] text-black dark:text-white">
                  {data.price === 0 ? "free" : data.price + "$"}
                </h3>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-[#fff]">
                  {data.estimatedPrice}$
                </h5>
                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                  {discountPercentengePrice}% Off
                </h4>
              </div>
              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    className={`${Style.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    href={`/course-access/${data._id}`}
                  >
                    Vào khóa học
                  </Link>
                ) : (
                  <div
                    className={`${Style.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    onClick={handleOrder}
                  >
                    Mua ngay {data.price}$
                  </div>
                )}
              </div>
              <br />
              <p className="pb-1 text-black dark:text-white">. mã nguồn bao gồm</p>
              <p className="pb-1 text-black dark:text-white">. truy cập trọn đời</p>
              <p className="pb-1 text-black dark:text-white">. giấy chứng nhận hoàn thành</p>
              <p className="pb-3 md:pb-1 text-black dark:text-white">. Hỗ trợ cao cấp</p>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
          <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3">
            <div className="w-full flex justify-end">
              <AiOutlineClose size={40} className="text-black cursor-pointer" onClick={() => setOpen(false)} />
            </div>
            <div className="w-full">
              {stripePromise && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <ChekOutForm setOpen={setOpen} data={data} user={user} onPaymentSuccess={handlePaymentSuccess} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
