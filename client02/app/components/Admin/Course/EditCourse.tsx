"use client";
import React, { FC, useEffect, useState } from "react";
import CourseInformat from "./CourseInformat";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {  useEditCoursesMutation, useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = {
  id:string;
};

const EditCourse:FC<Props> = ({id}) => {

  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [editCourse, {isSuccess,error}] = useEditCoursesMutation();

  const editCourseData = data && data.courses.find((i:any) => i._id === id);

  useEffect(() => {
    if(editCourseData){
      setCourseInfo({
        name: editCourseData.name,
        description: editCourseData.description,
        price: editCourseData?.price,
        category: editCourseData.category,
        estimatedPrice: editCourseData?.estimatedPrice,
        tags: editCourseData.tags,
        thumbnail: editCourseData?.thumbnail?.url,
        level: editCourseData.level,
        demoUrl: editCourseData.demoUrl,
        
      })
      setBebefits(editCourseData.benefits || []);
      setPrerequisites(editCourseData.prerequisites || []);
      setCourseContentData(editCourseData.courseData || []);
     
    }
  },[editCourseData])
  

  

  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    category: "",
    demoUrl: "",
    thumbnail: "",
  });

  const [benefits, setBebefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      videoLength: "",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    },
  ]);

  const [courseData, setCourseData] = useState({});


  const handleSubmit = async () => {
    // Format benefits array
    const formattedBenefits = benefits.map((benefits) => ({
      title: benefits.title,
    }));
    // Format prerequisites
    const formattedPrerequisites = prerequisites.map((prerequisites) => ({
      title: prerequisites.title,
    }));
    // Format course content array
    const formattedCourseContentData = courseContentData.map((courseContent) => ({
      videoUrl: courseContent.videoUrl,
      title: courseContent.title,
      description: courseContent.description,
      videoLength: courseContent.videoLength,
      videoSection: courseContent.videoSection,
      links: courseContent.links.map((link) => ({
        title: link.title,
        url: link.url,
      })),
      suggestion: courseContent.suggestion,
    }));
  
    // Prepare our data object
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      category: courseInfo.category,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContentData,
    };
  
    // Update courseData state
    setCourseData(data);  // Cập nhật courseData trước khi gửi
  
  };
  


  

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course Update successfully");
      redirect("/admin/courses");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  const handleCourseCreate = async (e: any) => {
    const data = courseData;
    await editCourse({id:editCourseData?._id,data});
  };

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformat
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBebefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
            isEdit={true}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div> 
    </div>
  );
};

export default EditCourse;
