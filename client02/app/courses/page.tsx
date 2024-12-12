'use client';

import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import Header from '../components/Header';
import Heading from '../Utils/Heading';
import { Style } from '../style/stylelogin';
import CourseCard from '../components/Course/CourseCard';
import { useSearchParams } from 'next/navigation';
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import Footer from '../components/Footer';
import { useLoadUserQuery, useRefreshTokenQuery } from '@/redux/features/api/apiSilce';

type Props = {
};

const Page: React.FC<Props> = () => {
  const searchParams = useSearchParams();
  const search = searchParams?.get('title'); // Lấy từ khóa tìm kiếm từ URL
  const { data, isLoading } = useGetAllCoursesQuery({});
  const { data: categoriesData } = useGetHeroDataQuery('Categories', {}); // Lấy danh mục
  const { data: levelsData } = useGetHeroDataQuery('Levels', {}); // Lấy cấp độ
  const [route, setRoute] = useState('Login');
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All'); // Trạng thái tìm kiếm theo cấp độ
  const { data: user, isLoading: isUserLoading } = useLoadUserQuery({}); // Lấy thông tin người dùng

  useEffect(() => {
    // Bắt đầu với tất cả khóa học
    let filteredCourses = data?.courses || [];
  
    // Kiểm tra dữ liệu người dùng và các khóa học đã đăng ký
    if (user?.user.courses) {
      // Trích xuất danh sách ID khóa học mà người dùng đã đăng ký
      const userCourseIds = user.user.courses.map((course: any) =>
        typeof course === 'object' ? course._id : course // Đảm bảo lấy _id nếu course là object
      );
  
  
      // Lọc ra các khóa học mà người dùng chưa đăng ký
      filteredCourses = filteredCourses.filter(
        (course: any) => !userCourseIds.includes(course._id)
      );
  
    }
  
    // Lọc theo từ khóa tìm kiếm
    if (search) {
      filteredCourses = filteredCourses.filter((course: any) =>
        course.name.toLowerCase().includes(search.toLowerCase())
      );
  
    }
  
    // Lọc theo danh mục hoặc cấp độ
    if (category !== 'All' && level !== 'All') {
      filteredCourses = filteredCourses.filter(
        (course: any) => course.category === category || course.level === level
      );
    } else if (category !== 'All') {
      filteredCourses = filteredCourses.filter((course: any) => course.category === category);
    } else if (level !== 'All') {
      filteredCourses = filteredCourses.filter((course: any) => course.level === level);
    }
  
  
    // Cập nhật danh sách khóa học sau khi lọc
    setCourses(filteredCourses);
  }, [data, user, category, level, search]);
  
  const categories = categoriesData?.layout?.categories;
  const levels = levelsData?.layout?.levels;

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <div className="w-[95%] md:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title={'Tất cả các khóa học - Elearning'}
              description={'Elearning là một cộng đồng lập trình.'}
              keyword={'cộng đồng lập trình, kỹ năng lập trình, hiểu biết chuyên sâu, cộng tác, tăng trưởng'}
            />
            <div className="w-full flex flex-col items-start">
              {/* Bộ lọc danh mục */}
              <div className="w-full flex items-center flex-wrap mb-5">
                <div
                  className={`h-[35px] ${
                    category === 'All' ? 'bg-red-600' : 'bg-blue-600'
                  } m-3 px-4 rounded-full flex items-center justify-center font-Poppins cursor-pointer`}
                  onClick={() => setCategory('All')}
                >
                  Tất Cả
                </div>
                {categories &&
                  categories.map((item: any, index: number) => (
                    <div key={index}>
                      <div
                        className={`h-[35px] ${
                          category === item.title ? 'bg-red-600' : 'bg-blue-600'
                        } m-3 px-4 rounded-full flex items-center justify-center font-Poppins cursor-pointer`}
                        onClick={() => setCategory(item.title)}
                      >
                        {item.title}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Bộ lọc cấp độ */}
              <div className="w-full flex items-center flex-wrap mb-5">
                <div
                  className={`h-[35px] ${
                    level === 'All' ? 'bg-red-600' : 'bg-blue-600'
                  } m-3 px-4 rounded-full flex items-center justify-center font-Poppins cursor-pointer`}
                  onClick={() => setLevel('All')}
                >
                  Tất Cả Cấp Độ
                </div>
                {levels &&
                  levels.map((item: any, index: number) => (
                    <div key={index}>
                      <div
                        className={`h-[35px] ${
                          level === item.levelName ? 'bg-red-600' : 'bg-blue-600'
                        } m-3 px-4 rounded-full flex items-center justify-center font-Poppins cursor-pointer`}
                        onClick={() => setLevel(item.levelName)}
                      >
                        {item.levelName}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Kết quả tìm kiếm */}
            {courses && courses.length === 0 && (
              <p className={`${Style.Label} justify-center min-h-[50vh] flex-center`}>
                {search
                  ? 'Không tìm thấy khóa học nào!!'
                  : 'Không tìm thấy khóa học nào trong danh mục này. Vui lòng thử khóa học khác!'}
              </p>
            )}

            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[35px] mb-12">
              {courses &&
                courses.map((item: any, index: number) => (
                  <CourseCard item={item} key={index} />
                ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;
