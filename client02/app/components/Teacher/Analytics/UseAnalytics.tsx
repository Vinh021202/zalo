import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetUserAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { Style } from "@/app/style/stylelogin";

type Props = {
  isDashboard?: boolean;
};

const UseAnalytics = ({ isDashboard }: Props) => {
  const { data, isLoading } = useGetUserAnalyticsQuery({});

  // const analyticsData = [
  //   { name: "Vinh 2023", count: 440 },
  //   { name: "Vinh 2024", count: 8200 },
  //   { name: "Vinh 2025", count: 4033 },
  //   { name: "Vinh 2026", count: 4502 },
  //   { name: "Vinh 2027", count: 2024 },
  //   { name: "Vinh 2028", count: 3454 },
  //   { name: "Vinh 2029", count: 356 },
  //   { name: "Vinh 2030", count: 5667 },
  //   { name: "Vinh 2031", count: 1320 },
  //   { name: "Vinh 2032", count: 6525 },
  //   { name: "Vinh 2033", count: 5480 },
  //   { name: "Vinh 2034", count: 485 },
  // ];

  const analyticsData: any = [];



  if (data?.users?.last12Months) {
    data.users.last12Months.forEach((item: any) => {
      analyticsData.push({ name: item.month, count: item.count });
    });
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div
        className={`${
          isDashboard
            ? "mt-[20px] bg-white dark:bg-[#111C43] shadow-lg pb-6 rounded-lg"
            : "mt-[50px]"
        }`}
      >
        {/* Tiêu đề và mô tả */}
        <div className={`${isDashboard ? "ml-6 mb-4" : "px-5"}`}>
          <h1
            className={`${
              isDashboard ? "text-lg font-semibold" : "text-2xl font-bold"
            } text-gray-800 dark:text-white`}
          >
            Phân tích người dùng
          </h1>
          {!isDashboard && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Dữ liệu phân tích 12 tháng gần đây
            </p>
          )}
        </div>
      
        {/* Biểu đồ */}
        <div
          className={`w-full ${
            isDashboard ? "h-[35vh]" : "h-[70vh]"
          } flex items-center justify-center px-4`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analyticsData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 10,
              }}
            >
              <XAxis
                dataKey="name"
                tick={{ fill: "#8884d8", fontSize: 12 }}
                axisLine={{ stroke: "#ccc" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8884d8", fontSize: 12 }}
                axisLine={{ stroke: "#ccc" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
                itemStyle={{ color: "#333" }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#4d62d9"
                fillOpacity={0.3}
                fill="#4d62d9"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      )}
    </>
  );
};

export default UseAnalytics;
