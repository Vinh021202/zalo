import { useGetCoursesContentQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/Utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import Header from "../Header";
import CourseContainerList from "./CourseContainetList";

type Props = {
  id: string;
  user: any;
};

const CourseContent = ({ id, user }: Props) => {
  const { data: contentData, isLoading, refetch } = useGetCoursesContentQuery(id, {refetchOnMountOrArgChange: true});
  const data = contentData?.content;
  const [activeVideo, setAciveVideo] = useState(0);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("login");

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
    activeItem={1}
    open={open}
    setOpen={setOpen}
    route={route}
    setRoute={setRoute}
/>
<div className="h-[200vh] grid md:grid-cols-10 gap-4">
    <Heading
        title={data[activeVideo]?.title}
        description="anything"
        keyword={data[activeVideo]?.tags}
    />

    {/* CourseContentMedia chiếm 8 phần, CourseContainerList chiếm 2 phần */}
    <div className="md:col-span-10 col-span-3">
        <div className="grid md:grid-cols-11 ">
            <div className="col-span-8"> {/* CourseContentMedia chiếm 8 phần */}
                <CourseContentMedia
                    data={data}
                    id={id}
                    activeVideo={activeVideo}
                    setAciveVideo={setAciveVideo}
                    user={user}
                    refetch= {refetch}
                />
            </div>
            <div className="hidden md:block col-span-2"> {/* CourseContainerList chiếm 2 phần */}
                <CourseContainerList
                    setActiveVideo={setAciveVideo}
                    data={data}
                    activeVideo={activeVideo}
                />
            </div>
        </div>
    </div>
</div>
        </>
      )}
    </>
  );
};

export default CourseContent;
