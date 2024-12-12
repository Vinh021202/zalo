import { Style } from "@/app/style/stylelogin";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";

type Props = {};

const EditHero: FC<Props> = (props: Props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const { data,refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data && data.layout) {
      const banner = data.layout.banner;
      setTitle(banner.title);
      setSubTitle(banner.subTitle);
      setImage(banner.image?.url); // Đảm bảo sử dụng URL hình ảnh
    }
    if (isSuccess) {
      toast.success("Hero updated successfully!");
      refetch()
    }
    if(error){
      if("data" in error){
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data,isSuccess,error,refetch]); 
  
  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB!");
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleEdit = async (e: any) => {
    await editLayout({
      type : "Banner",
      image,
      title,
      subTitle,
    });
  };

  return (
    <>
      <div className="w-full 1000px:flex items-center justify-between">
        <div className="container flex flex-col lg:flex-row justify-between items-center h-full px-4 lg:px-8 py-16 lg:py-32">
          {/* <div className="100px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70%] 1000px:pt-[0] z-10"> */}

          <div className="image-section w-full lg:w-[40%] flex justify-center items-center overflow-hidden  relative">
            {/* <div className="image-section w-full lg:w-[40%] flex justify-center items-center overflow-hidden hero_animation rounded-full relative"> */}

            <img
              src={image}
              alt="Banner"
              className="object-cover rounded-full hero_animation"
              width={1200} // Adjust width as needed
              height={800} // Adjust height as needed
            />
            <input
              type="file"
              id="banner"
              accept="image/*"
              onChange={handleUpdate}
              className="hidden"
            />
            <label
              htmlFor="banner"
              className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow cursor-pointer hover:bg-blue-700 transition"
            >
              <AiOutlineCamera className="text-lg" />
            </label>
          </div>

          <div className="text-section lg:w-[55%] flex flex-col items-center mt-10 lg:mt-0">
            <textarea
              className="dark:text-white text-[#000000c7] text-[40px] pw-3 w-full 1000px:text-[100px] font-[600] font-Josefin py-2 1000px:leading-[85px] 1500px:w-[70%]"
              placeholder="Cải thiện trải nghiệm học tập trực tuyến của bạn tốt hơn ngay lập tức"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={4}
            />
            <br />
            <textarea
              className="dark:text-white text-[#000000c7] text-[25px] pw-3 w-full 1000px:text-[80px] font-[100] font-Josefin py-2 1000px:leading-[85px] 1500px:w-[70%]"
              placeholder="Chúng tôi có hơn 40k khóa học trực tuyến và hơn 500 nghìn sinh viên đăng ký trực tuyến. Tìm thấy
                    Các khóa học mong muốn của bạn từ họ"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
            ></textarea>
            <br />
            <br />
            <br />
            <div
              className={`${
                Style.button
              } !w-[100px] !min-h-[40px] dark:text-white text-black bg-[#cccccc34] ${
                data?.layout?.banner?.title !== title ||
                data?.layout?.banner?.subTitle !== subTitle ||
                data?.layout?.banner?.image?.url !== image
                  ? "!cursor-pointer !bg-[#42d383]"
                  : "!cursor-not-allowed"
              } !rounded absolute bottom-12 right-12`}
              onClick={
                data?.layout?.banner?.title !== title ||
                data?.layout?.banner?.subTitle !== subTitle ||
                data?.layout?.banner?.image?.url !== image
                  ? handleEdit
                  : () => null
              }
            >
              {isLoading ? "Saving..." : "Save"}
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
};

export default EditHero;
