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

   // const [audio] = useState(
  //     new Audio (
  //         "https://res.cloudinary.com/decydvr5h/video/upload/v1733338168/nohgmhkjbgigxjkqum1r.mp4"
  //     )
  // );

  // const playerNotificationSound = () => {
  //     audio.play();
  // }

  // useEffect(() => {
  //   if (data?.notifications && Array.isArray(data.notifications)) {
  //     const array = [];
  //     for (let i = 0; i < data.notifications.length; i++) {
  //       array.push(data.notifications[0]);
  //     }
  //     setNotifications(array);
  //   } else {
  //     console.warn(
  //       "No notifications found or data.notifications is not an array"
  //     );
  //     setNotifications([]); // Đặt thông báo rỗng nếu không có dữ liệu
  //   }

  //   if (isSuccess) {
  //     console.log("Refetching data due to successful update...");
  //     refetch();
  //   }
  // }, [data, isSuccess]);

  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationStatusMutation();
  const [notifications, setNotifications] = useState<any>([]);

  useEffect(() => {
    if (data) {
      setNotifications(
        data.notifications.filter((item: any) => item.status === "unread")
      );
    }
    if (isSuccess) {
      refetch();
    }
  }, [data, isSuccess]);

  useEffect(() => {
    socketId.on("connect", (data) => {
      refetch();
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

      setNotifications((prevNotifications: any[]) =>
        prevNotifications.filter((notification) => notification._id !== id)
      );

      toast.success("Notification marked as read!");
    } catch (error) {
      console.error("Failed to update notification status:", error);
      toast.error("Failed to mark notification as read.");
    }
  };

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 z-50">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          {notifications.length}
        </span>
      </div>
      {open && (
        <div className="w-[350px] h-[50vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 right-0 z-10 rounded-lg overflow-auto">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3 border-b dark:border-[#ffffff47] border-[#00000001]">
            Thông báo
          </h5>
          <div className="p-3 space-y-2">
            {notifications.map((item: any, index: number) => (
              <div
                key={item._id} // Ensure a unique key
                className={`${
                  item.status === "unread"
                    ? "bg-[#f8f8f8] dark:bg-[#2d3a4ea1]"
                    : "bg-[#e0e0e0] dark:bg-[#4b4f5d]"
                } font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#00000001] rounded p-2 mb-2 hover:bg-[#ddd] dark:hover:bg-[#393f4b] transition duration-200`}
              >
                <div className="w-full flex items-center justify-between">
                  <p className="text-black dark:text-white font-semibold">{item.title}</p>
                  <p
                    className="text-black dark:text-white cursor-pointer text-sm font-semibold"
                    onClick={() => handleNotificationStatusChange(item._id)}
                  >
                    {item.status === "unread" ? "Đánh dấu là đã đọc" : "Đã đọc"}
                  </p>
                </div>
                <p className="px-2 text-black dark:text-white">{item.message}</p>
                <p className="p-2 text-black dark:text-white text-[14px]">
                  {format(item.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
