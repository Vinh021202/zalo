import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { Style } from "@/app/style/stylelogin";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";

type Props = {};

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] =
    useEditLayoutMutation();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setCategories(data.layout.categories);
    }
    if(layoutSuccess){
        refetch()
        toast.success("FAQ update successfully");
    }
    if(error){
        if("data" in error){
            const errorData = error as any;
            toast.error(errorData?.data?.message);
          }
    }
  }, [data,layoutSuccess,error, refetch]);

  const handleCategoriesAdd = (id: any, value: string) => {
    setCategories((prevCategory) =>
      prevCategory.map((i:any) => (i._id === id ? { ...i, title: value } : i))
    );
  };

  const newCategoriesHandler = () =>{
    if(categories[categories.length -1 ].title === ""){
        toast.error("Categories title cannot be empty");
    }else {
        setCategories((prevCategory:any) => [...prevCategory, {title:""}])
    }
  };

  const areQuestionsUnchanged = (
    originalCategories: any[],
    newCategories: any[]
  ) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyQuestionEmpty = (categories: any[]) => {
    return categories.some((q) => q.title === "");
  };

  const handleEdit = async () => {
    if(!areQuestionsUnchanged(data.layout.categories,categories) && !isAnyQuestionEmpty(categories)) {
        await editLayout({
            type:"Categories",
            categories,
        })
    }
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${Style.title}`}>All Categories</h1>
          {categories &&
            categories.map((item: any, index: number) => {
              return (
                <div key={item} className="py-3">
                  <div className="flex items-center w-full justify-center">
                    <input
                      className={`${Style.input} !w-[unset] !border-none !text-[20px]`}
                      value={item.title}
                      onChange={(e) =>
                        handleCategoriesAdd(item._id, e.target.value)
                      }
                      placeholder="Nhập tiêu đề danh mục"
                    />
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer"
                      onClick={() => {
                        setCategories((prevCategory: any) =>
                          prevCategory.filter((i: any) => i._id !== item._id)
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <br/>
            <br/>
            <br/>
            <div className="w-full flex justify-center">
                <IoMdAddCircleOutline 
                    className="dark:text-white text-black text-[18px] cursor-pointer"
                    onClick={newCategoriesHandler}
                />
            </div>
              <div
              className={`${
                Style.button
              } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
                data?.layout?.faq &&
                !areQuestionsUnchanged(data.layout.categories, categories) &&
                !isAnyQuestionEmpty(categories)
                  ? "!cursor-pointer !bg-[#42d383]"
                  : "!cursor-not-allowed"
              } !rounded absolute bottom-12 right-12`}
              onClick={handleEdit}
            >
              {isLoading ? "Saving..." : "Save"}
            </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;
