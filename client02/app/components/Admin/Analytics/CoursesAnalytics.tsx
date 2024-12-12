import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Label,
  YAxis,
  LabelList,
} from "recharts";
import Loader from "../../Loader/Loader";
import { Style } from "@/app/style/stylelogin";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";

type Props = {};

const CoursesAnalytics = (props: Props) => {
  const { data, isLoading, isError } = useGetCoursesAnalyticsQuery({});

//   const analyticsData = [
//     { name: "Vinh 2023", uv: 3 },
//     { name: "Vinh 2024", uv: 2 },
//     { name: "Vinh 2025", uv: 5 },
//     { name: "Vinh 2026", uv: 7 },
//     { name: "Vinh 2027", uv: 2 },
//     { name: "Vinh 2028", uv: 5 },
//     { name: "Vinh 2029", uv: 7 },
//   ];
const analyticsData: any = [];

// // Kiểm tra nếu `data` và `data.courses` tồn tại
// if (data?.courses) {
//     data.courses.forEach((item: any) => {
//       analyticsData.push({
//         name: item.name,       // Sử dụng tên khóa học làm nhãn
//         uv: item.purchased,    // Sử dụng số lượng khóa học đã mua
//       });
//     });
//   }

if (data?.courses?.last12Months) {
  data.courses.last12Months.forEach((item: any) => {
    analyticsData.push({ name: item.month, uv: item.count });
  });
}
  


  // Tính toán giá trị minValue
  const minValue = 0;


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-screen">
          <div className="mt-[50px]">
            <h1 className={`${Style.title} px-5 !text-start`}>
              Phân tích khóa học
            </h1>
            <p className={`${Style.Label} px-5`}>
              Dữ liệu phân tích 12 tháng gần đây{" "}
            </p>
          </div>

          <div className="w-full h-[90%] flex items-center justify-center">
            <ResponsiveContainer width="90%" height="50%">
              <BarChart width={150} height={300} data={analyticsData}>
                <XAxis dataKey="name">
                  <Label offset={0} position="insideBottom" />
                </XAxis>
                <YAxis domain={[minValue, "auto"]} />
                <Bar dataKey="uv" fill="#3faf82">
                  <LabelList dataKey="uv" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default CoursesAnalytics;
