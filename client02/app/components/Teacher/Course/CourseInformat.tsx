import React, { FC, useEffect, useState } from "react";
import { Style } from "@/app/style/stylelogin";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: any) => void;
};

const CourseInformat: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);

  const { data:categoriesReload } = useGetHeroDataQuery("Categories", {});
  const { data:levelsReload } = useGetHeroDataQuery("Levels", {});

  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);


  useEffect(() => {
    if (categoriesReload) {
      setCategories(categoriesReload.layout.categories);
    }
    if(levelsReload) {
      setLevels(levelsReload.layout.levels);

    }
  }, [categoriesReload,levelsReload]);
  


  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
   
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      };
      reader.readAsDataURL(file); // Sử dụng readAsDataURL để hiển thị ảnh
    }
  };

  const handleFileChangDemoUrl = (e:any) => {
    const file = e.target.files?.[0]; // Lấy tệp đầu tiên trong danh sách tệp
    console.log("File", file);
    
    if(file) {
      const reader = new FileReader();
      reader.onload= ()=> {
       
        setCourseInfo({...courseInfo,demoUrl:reader.result})
      }
      reader.readAsDataURL(file); // Đọc tệp video dưới dạng Data URL

    }
  }

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      };
      reader.readAsDataURL(file); // Sử dụng readAsDataURL
    }
  };


  


  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit} className={`${Style.Label}`}>
        <div>
          <label htmlFor="">Tên khóa học</label>
          <input
            type="name"
            name=""
            required
            value={courseInfo.name}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            id="name"
            placeholder="Lập trình, MERN, Redux, Học máy"
            className={`${Style.input}`}
          />
        </div>
        <br />
        <div className="mb-5">
          <label className={`${Style.Label}`}>Mô tả khóa học</label>
          <textarea
            name=""
            id=""
            cols={30}
            rows={10}
            placeholder="Viết điều gì đó tuyệt vời..."
            className={`${Style.input} `}
            value={courseInfo.description}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          ></textarea>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${Style.Label}`}>Mô tả giá tiền</label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.price}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              id="price"
              placeholder="29"
              className={`${Style.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${Style.Label}`}>
              Ước lượng giá tiền (tùy chọn)
            </label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.estimatedPrice}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
              id="estimatedprice"
              placeholder="79"
              className={`${Style.input}`}
            />
          </div>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${Style.Label}`}>Thẻ khoá học</label>
            <input
              type="text"
              name=""
              required
              value={courseInfo.tags}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, tags: e.target.value })
              }
              id="tags"
              placeholder="Lập trình, MERN, Redux, Học máy"
              className={`${Style.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${Style.Label} w-[50%] `}>
              danh mục khóa học
            </label>
            <select name=""
             id=""
              className={`${Style.input}`}
              value={courseInfo.category}
              onChange={(e :any) => setCourseInfo({...courseInfo, category: e.target.value})}
              >
              <option value="" className={Style.option}>
                Chọn danh mục
              </option>
              {categories.map((item: any) => (
                <option
                  value={item.title}
                  key={item._id}
                  className={Style.option}
                >
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="">
          {/* <label className={`${Style.Label}`}>Thẻ khoá học</label>
          <input
            type="text"
            name=""
            required
            value={courseInfo.tags}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, tags: e.target.value })
            }
            id="tags"
            placeholder="Lập trình, MERN, Redux, Học máy"
            className={`${Style.input}`}
          /> */}
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${Style.Label}`}>Cấp độ khoá học</label>
            <select name=""
             id=""
              className={`${Style.input}`}
              value={courseInfo.level}
              onChange={(e :any) => setCourseInfo({...courseInfo, level: e.target.value})}
              >
              <option value="" className={Style.option}>
                Chọn danh mục
              </option>
              {levels.map((item: any) => (
                <option
                  value={item.levelName}
                  key={item._id}
                  className={Style.option}
                >
                  {item.levelName}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className={`${Style.Label} w-[50%]`}>thử nghiệm URL</label>
             <input
                      type="file"
                      accept="video/*"
                      id={courseInfo.demoUrl}
                      className={Style.input}
                      onChange={(e)=>handleFileChangDemoUrl(e)}
                  />
                  
          </div>
        </div>
        <br />
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center transition ${
              dragging
                ? "bg-blue-500 border-dashed border-blue-700"
                : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt=""
                className="max-h-full w-full object-cover"
              />
            ) : (
              <span className="text-black dark:text-white">
                Kéo và thả hình thu nhỏ của bạn vào đây hoặc nhấp để duyệt
              </span>
            )}
          </label>
        </div>
        <br />
        <div className="w-full flex items-center justify-center">
          <input
            type="submit"
            value="Next"
            className="w-full md:w-[80px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default CourseInformat;
