import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";

type Props = {
  user: any; // Thông tin người dùng được truyền từ component cha
};

const Course = ({ user }: Props) => {
  const { data, isLoading } = useGetAllCoursesQuery({});
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);

  useEffect(() => {
    if (data?.courses && user) {
      // Lọc các khóa học chưa đăng ký và cùng level
      const courseIdUser = user.courses;
      const userCourseIds = courseIdUser.map((course: any) => course._id);
      const filteredCourses = data.courses.filter(
        (course: any) =>
          course.level === user.level && 
          !userCourseIds.includes(course._id)
      );
      
      
      setRecommendedCourses(filteredCourses);
    }
  }, [data, user]);

  if (isLoading) return <p>Loading courses...</p>;

  return (
    <>
      <div className={`w-[90%] 800px:w-[80%] m-auto`}>
        <h1 className="text-center font-Poppins text-[20px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#000] font-[700] tracking-tight">
          Khóa Học Thích Hợp
        </h1>
        <p className="text-center text-[16px] text-gray-500 dark:text-gray-300">
          Dựa trên cấp độ của bạn, chúng tôi đề xuất các khóa học phù hợp nhất.
        </p>
        <br />
        <br />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] md-12 border-0">
          {recommendedCourses.length > 0 ? (
            recommendedCourses.map((item: any, index: number) => (
              <CourseCard item={item} key={index} />
            ))
          ) : (
            <h2 className="text-center">Không có khóa học gợi ý.</h2>
          )}
        </div>
      </div>
    </>
  );
};

export default Course;
