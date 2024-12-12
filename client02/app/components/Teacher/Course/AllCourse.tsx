import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal } from "@mui/material";
import { AiOutlineDelete, AiOutlineUser } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";
import {
  useDeleteCoursesMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import { useSelector } from "react-redux";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { Style } from "@/app/style/stylelogin";
import toast from "react-hot-toast";
import Link from "next/link";

const AllCourse = () => {
  const { theme } = useTheme();
  const { user } = useSelector((state: any) => state.auth); // Lấy thông tin user từ Redux
  const { isLoading, data, refetch, error } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [open, setOpen] = useState(false);
  const [courseId, setCourseID] = useState("");
  const [deleteCourse, { isSuccess, error: deleteError }] =
    useDeleteCoursesMutation();

  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    if (data?.courses && Array.isArray(data.courses) && user?._id) {
      const newRows = data.courses
        .filter((item: any) => item.creator === user._id) // Lọc khóa học theo creator
        .map((item: any) => ({
          id: item._id,
          title: item.name,
          purchased: item.purchased,
          ratings: item.ratings,
          created_at: format(item.createdAt),
        }));
      setRows(newRows);
    }
  }, [data, user]);

  const columns = [
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: " ",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: any) => (
        <Link
          href={`/teacher/edit-course/${params.row.id}`}
          className="flex items-center justify-center w-full h-full"
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <FiEdit2
            className={`${theme === "dark" ? "text-white" : "text-black"}`}
          />
        </Link>
      ),
    },
    {
      field: "  ",
      headerName: "Users",
      flex: 0.2,
      renderCell: (params: any) => (
        <Link
          href={`/teacher/users-course/${params.row.id}`}
          className="flex items-center justify-center w-full h-full"
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <AiOutlineUser
            className={`${theme === "dark" ? "text-white" : "text-black"}`}
          />
        </Link>
      ),
    },
    {
      field: "   ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            setOpen(!open);
            setCourseID(params.row.id);
          }}
        >
          <AiOutlineDelete className="dark:text-white text-black" />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success("Course Deleted Successfully");
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, deleteError]);

  const handleDelete = async () => {
    const id = courseId;
    await deleteCourse(id);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="m-5">
          <h1
            className="font-bold mb-5"
            style={{ color: theme === "dark" ? "#e3e4ff" : "#3f51b5" }}
          >
            Danh Sách Khoá Học
          </h1>
          <div
            className="data-grid-container"
            style={{
              height: "80vh",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: theme === "dark" ? "#1F2A40" : "#F8F9FF",
            }}
          >
            <DataGrid rows={rows} columns={columns}
               sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#3f51b5", // Màu nền header
                  color: "##3f51b5", // Màu chữ header
                  fontSize: "16px",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: "#3f51b5", // Màu nền footer
                  color: "#ffffff", // Màu chữ footer
                },
                "& .MuiDataGrid-root": {
                  border: "none", // Loại bỏ đường viền của bảng
                },
                "& .MuiDataGrid-row": {
                  backgroundColor: theme === "dark" ? "#2e3b55" : "#ffffff", // Màu nền hàng
                  "&:hover": {
                    backgroundColor: theme === "dark" ? "#3a4a6b" : "#f1f1f1", // Màu hover
                  },
                },
              }}
            />
          </div>
          {open && (
            <Modal open={open} onClose={() => setOpen(!open)}>
              <div
                className="absolute top-[50%] left-[50%] -translate-x-1/2 p-6 bg-white rounded-lg shadow-lg"
              >
                <h1 className={`${Style.title}`}>
                  Bạn có chắc chắn muốn xóa khóa học này không?
                </h1>
                <div className="flex w-full items-center justify-between mb-6">
                  <div
                    className={`${Style.button} !w-[120px] h-[30px] bg-[#57c7a3]`}
                    onClick={() => setOpen(!open)}
                  >
                    Hủy
                  </div>
                  <div
                    className={`${Style.button} !w-[120px] h-[30px] bg-[#d63f]`}
                    onClick={handleDelete}
                  >
                    Xoá
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};

export default AllCourse;
