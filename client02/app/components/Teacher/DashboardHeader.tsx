"use client";
import { ThemeSwitcher } from "@/app/Utils/ThemeSwitcher";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationsApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdNotificationsOutline } from "react-icons/io";
import socketIO from "socket.io-client";
import { format } from "timeago.js";

const ENDPOINT =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "http://localhost:8000";
const socketId = socketIO(ENDPOINT, {
  transports: ["websocket"], // Sử dụng WebSocket transport
});

type Props = {
  open?: boolean;
  setOpen?: any;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationStatusMutation();
  const [notifications, setNotifications] = useState<any>([]);
  // const [audio] = useState(
  //     new Audio (
  //         "https://res.cloudinary.com/decydvr5h/video/upload/v1733338168/nohgmhkjbgigxjkqum1r.mp4"
  //     )
  // );

  // const playerNotificationSound = () => {
  //     audio.play();
  // }

  useEffect(() => {
    if (data?.notifications && Array.isArray(data.notifications)) {
      const array = [];
      for (let i = 0; i < data.notifications.length; i++) {
        array.push(data.notifications[0]);
      }
      setNotifications(array);
    } else {
      console.warn(
        "No notifications found or data.notifications is not an array"
      );
      setNotifications([]); // Đặt thông báo rỗng nếu không có dữ liệu
    }

    if (isSuccess) {
      refetch();
    }
  }, [data, isSuccess]);

  // useEffect(() => {
  //     if(data){
  //         setNotifications(
  //             data.notifications.filter((item:any) => item.status === "unred")
  //         );
  //     }if(isSuccess){
  //         refetch();
  //     }
  // },[data, isSuccess])


  useEffect(() => {
    socketId.on("connect", (data) => {
      refetch();
      // playerNotificationSound();
      console.log("Socket connected successfully");
    });

    socketId.on("connect_error", (error) => {
      console.log("Socket connection error:", error);
    });

    socketId.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socketId.off("connect");
      socketId.off("disconnect");
      socketId.disconnect();
    };
  }, []);

  const handleNotificationStatusChange = async (id: string) => {
    try {
      await updateNotificationStatus(id).unwrap(); // Gọi API để đánh dấu là đã đọc

      // Loại bỏ thông báo đã đọc khỏi danh sách
      setNotifications((prevNotifications: any[]) =>
        prevNotifications.filter((notification) => notification._id !== id)
      );

      toast.success("Notification marked as read!");
    } catch (error) {
      toast.error("Failed to mark notification as read.");
    }
  };

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          {notifications && notifications.length}
        </span>
      </div>
      {open && (
        <div className="w- [350px] h-[50vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-10 rounded">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Thông báo
          </h5>
          {notifications && notifications.map((item: any, index: number) => (
  <div
    key={item} // Ensure a unique key
    className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#00000001]"
  >
    <div className="w-full flex items-center justify-between p-2">
      <p className="text-black dark:text-white">{item.title}</p>
      <p
        className="text-black dark:text-white cursor-pointer"
        onClick={() => handleNotificationStatusChange(item._id)}
      >
        đã đọc
      </p>
    </div>
    <p className="px-2 text-black dark:text-white">{item.message}</p>
    <p className="p-2 text-black dark:text-white text-[14px]">
      {format(item.createdAt)}
    </p>
  </div>
))}


          {/* <div className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-bdark:border-b-[#ffffff47] border-b-[#00000001]">
                    <div className="w-full flex items-center justify-between p-2">
                        <p className="text-black dark:text-white">
                        Đã nhận được câu hỏi mới
                     </p>
                        <p className="text-black dark:text-white cursor-pointer">
                         đã đọc
                    </p>
                    </div>
                    <p className="px-2 text-black dark:text-white">
                          Khoá học hiện tại đã hoành thành chưa ạ
                    </p>
                    <p className="p-2 text-black dark:text-white text-[14px]">
                        5 ngày trước
                        </p>
                    </div>
                     */}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
