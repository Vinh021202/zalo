import { Style } from "@/app/style/stylelogin";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BsLink45Deg, BsPencil } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  handleSubmit: any;
};

const CourseContent: FC<Props> = ({
  active,
  setActive,
  courseContentData,
  setCourseContentData,
  handleSubmit: handleCourseSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData.length).fill(false)
  );

  const [activeSection, setActiveSection] = useState(1);

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleCollapseToggle = (index: number) => {
    const updatedCollapsed = [...isCollapsed];
    updatedCollapsed[index] = !updatedCollapsed[index];
    setIsCollapsed(updatedCollapsed);
  };

  const handRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = [...courseContentData]; // Sao chép dữ liệu hiện tại

    // Kiểm tra nếu links tồn tại và là mảng
    if (updatedData[index]?.links && Array.isArray(updatedData[index].links)) {
      updatedData[index].links.splice(linkIndex, 1); // Xóa phần tử tại linkIndex
      setCourseContentData(updatedData); // Cập nhật state
    } else {
      console.error(
        `Links không tồn tại tại index ${index} hoặc không phải là mảng`
      );
    }
  };

  const handleAssignmentFileChange = (e: any, index: number) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedData = [...courseContentData];
        updatedData[index].assignmentFile = reader.result as string; // Chuyển đổi file PDF thành chuỗi Base64
        setCourseContentData(updatedData); // Lưu lại state
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng Base64
    }
  };


  // hàm xử lý video
  const handleVideoFileChange = (e: any, index: number) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định (nếu có)
  
    const file = e.target.files?.[0]; // Lấy tệp đầu tiên từ input
    if (file) {
      const reader = new FileReader();
  
      reader.onload = () => {
        // Cập nhật videoUrl sau khi tệp được đọc dưới dạng Data URL
        const updatedData = [...courseContentData];
        updatedData[index].videoUrl = reader.result as string; // Chuyển đổi kết quả FileReader thành chuỗi
        setCourseContentData(updatedData); // Cập nhật dữ liệu vào state
      };
  
      reader.readAsDataURL(file); // Đọc tệp video dưới dạng Data URL
    }
  };
  

  const handleAddLink = (index: number) => {
    const updatedData = [...courseContentData]; // Sao chép dữ liệu hiện tại

    // Kiểm tra và khởi tạo 'links' nếu chưa tồn tại
    if (!updatedData[index].links) {
      updatedData[index].links = [];
    }

    // Thêm liên kết mới vào 'links'
    updatedData[index].links.push({ title: "", url: "" });

    // Cập nhật state với dữ liệu mới
    setCourseContentData(updatedData);
  };

  const newContentHandler = (item: any) => {
    if (
      item.title === "" ||
      item.assignmentFile ==="" ||
      item.description === "" ||
      item.videoUrl === "" ||
      item.links[0].title === "" ||
      item.links[0].url === ""
      ) {
      toast.error("Please fill all the fields first");
    } else {
      let newVideoSection = "";

      if (courseContentData.length > 0) {
        const lastVideoSection =
          courseContentData[courseContentData.length - 1].videoSection;

        //sử dụng phần video cuối cùng nếu có. mặt khác sử dụng đầu vào của người dùng
        if (lastVideoSection) {
          newVideoSection = lastVideoSection;
        }
      }
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: newVideoSection,
        links: [{ title: "", url: "" }],
        assignmentFile:"",
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const addNewSection = () => {
    if (
      courseContentData[courseContentData.length - 1].title == "" ||
      courseContentData[courseContentData.length - 1].description == "" ||
      courseContentData[courseContentData.length - 1].videoUrl == "" ||
      courseContentData[courseContentData.length - 1].links[0].title == "" ||
      courseContentData[courseContentData.length - 1].links[0].url == ""
    ) {
      toast.error("Pleasse fill all the fields first");
    } else {
      setActiveSection(activeSection + 1);
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: `Untitled Section ${activeSection}`,
        links: [{ title: "", url: "" }],
        assignmentFile:""
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      courseContentData[courseContentData.length - 1].title == "" ||
      courseContentData[courseContentData.length - 1].description == "" ||
      courseContentData[courseContentData.length - 1].videoUrl == "" ||
      courseContentData[courseContentData.length - 1].links[0].title == "" ||
      courseContentData[courseContentData.length - 1].links[0].url == ""
    ) {
      toast.error("section can't be empty");
    } else {
      setActive(active + 1);
      handleCourseSubmit();
    }
  };

  console.log("editt", courseContentData);

  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <form onSubmit={handleSubmit}>
        {courseContentData?.map((item, index) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1]?.videoSection;

          return (
            <div
              key={index} // Unique key
              className={`w-full bg-[#cdc8c817] p-4 ${
                showSectionInput ? "mt-10" : "mb-0"
              }`}
            >
              {showSectionInput && (
                <>
                  <div className="flex w-full items-center">
                    <input
                      type="text"
                      className={`text-[20px] ${
                        item.videoSection == "Untitled selection"
                          ? "w-[170px]"
                          : "w-min"
                      }font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-none `}
                      value={item.videoSection}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].videoSection = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                    <BsPencil className="cursor-pointer dark:text-white text-black" />
                  </div>
                  <br />
                </>
              )}
              <div className="flex w-full items-center justify-between my-0">
                {isCollapsed[index] ? (
                  <p className="font-Poppins dark:text-white text-black">
                    {index + 1} {item.title}
                  </p>
                ) : (
                  <></>
                )}

                <div className="flex items-center justify-center">
                  {/* Delete button */}
                  <AiOutlineDelete
                    className={`dark:text-white text-[20px] mr-2 text-black ${
                      index > 0 ? "cursor-pointer" : "cursor-no-drop"
                    }`}
                    onClick={() => {
                      if (index > 0) {
                        const updatedData = [...courseContentData];
                        updatedData.splice(index, 1);
                        setCourseContentData(updatedData);
                      }
                    }}
                  />

                  {/* Collapse/Expand button */}
                  <MdOutlineKeyboardArrowDown
                    className="dark:text-white text-black cursor-pointer"
                    style={{
                      transform: isCollapsed[index]
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                    onClick={() => handleCollapseToggle(index)}
                  />
                </div>
              </div>
              {!isCollapsed[index] && (
                <>
                  <div className="my-3">
                    <label className={Style.Label}>Video tiêu đề</label>
                    <input
                      type="text"
                      placeholder="kế hoạch dự án...."
                      className={Style.input}
                      value={item.title}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].title = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className={Style.Label}>Video Url</label>
                    <input
                      type="file"
                      accept="video/*"
                      id={item.videoUrl}
                      className={Style.input}
                      onChange={(e) => handleVideoFileChange(e, index)}
                    />
                    {/* <input
                          type="text"
                          placeholder="sddgr"
                          className={Style.input}
                          value={item.videoUrl}
                          onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index].videoUrl = e.target.value;
                            setCourseContentData(updatedData);
                          }}
                        /> */}
                  </div>

                      <div className="mb-3"> 
                        <label className={Style.Label}>Tải bài tập (PDF)</label> 
                        <input type="file" accept="application/pdf" className={Style.input} onChange={(e) => handleAssignmentFileChange(e, index)} /> 
                        {item.assignmentFile && ( <p className="mt-2 text-sm text-green-600"> File đã tải: {item.assignmentFile} </p> )} </div>

                  <div className="mb-3">
                    <label className={Style.Label}>
                      Độ dài video (trong vài phút)
                    </label>
                    <input
                      type="number"
                      placeholder="20"
                      className={Style.input}
                      value={item.videoLength}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].videoLength = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className={Style.Label}>Mô tả video</label>
                    <textarea
                      rows={8}
                      cols={30}
                      placeholder="sddgr"
                      className={`${Style.input} !h-min py-2`}
                      value={item.description}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].description = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>
                  <br />
                  {item?.links.map((link: any, linkIndex: number) => (
                    <div key={linkIndex} className="mb-3 block">
                      <div className="w-full flex items-center justify-between">
                        <label className={Style.Label}>
                          link {linkIndex + 1}
                        </label>
                        <AiOutlineDelete
                          className={`  dark:text-white text-black text-[28px] ${
                            linkIndex === 0
                              ? "cursor-no-drop"
                              : "cursor-pointer"
                          } `}
                          onClick={() =>
                            linkIndex === 0
                              ? null
                              : handRemoveLink(index, linkIndex)
                          }
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Mã nguồn...[kế hoạch dự án]"
                        className={Style.input}
                        value={link.title}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].links[linkIndex].title =
                            e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Mã nguồn URL...[kế hoạch dự án]"
                        className={Style.input}
                        value={link.url}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].links[linkIndex].url =
                            e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                  ))}
                  {/* button add link */}
                  <br />
                  <div className="indline-block mb-4">
                    <p
                      className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                      onClick={() => handleAddLink(index)}
                    >
                      <BsLink45Deg className="mr-2" /> Thêm link
                    </p>
                  </div>
                </>
              )}
              <br />
              {/* add new container */}
              {index === courseContentData.length - 1 && (
                <div>
                  <p
                    className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                    onClick={(e: any) => newContentHandler(item)}
                  >
                    <AiOutlinePlusCircle className="mr-2" /> Thêm nội dung mới
                  </p>
                </div>
              )}
            </div>
          );
        })}
        <br />
        <div
          className="flex items-center text-[20px] dark:text-white text-black cursor-pointer"
          onClick={() => addNewSection()}
        >
          <AiOutlinePlusCircle className="mr-2" /> Thêm Phần mới
        </div>
      </form>
      <br />
      <div className="w-full flex items-center justify-between">
        <div
          className="w-[40%] h-[40px] bg-[#37a39a] text-center justify-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}
        >
          Trước đó
        </div>
        <div
          className="w-[40%] h-[40px] bg-[#37a39a] text-center justify-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => handleOptions()}
        >
          Kế tiếp
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};

export default CourseContent;
