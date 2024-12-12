import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";
import {
  useDeleteCoursesMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { Style } from "@/app/style/stylelogin";
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {};

const AllCourse = (props: Props) => {
  const { theme } = useTheme();
  const { isLoading, data, refetch,error } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [open, setOpen] = useState(false);
  const [courseId, setCourseID] = useState("");
  const [deleteCourse, { isSuccess, error: deleteError }] = useDeleteCoursesMutation();  

  // Khai báo state rows để lưu trữ dữ liệu
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    // Kiểm tra nếu data và data.course tồn tại trước khi gọi forEach
    if (data?.courses && Array.isArray(data.courses)) {
      const newRows = data.courses.map((item: any) => ({
        id: item._id,
        title: item.name,
        purchased: item.purchased,
        ratings: item.ratings,
        created_at: format(item.createdAt),
      }));
      setRows(newRows); // Cập nhật rows vào state
    } else {
    }
  }, [data]); // Khi data thay đổi thì cập nhật rows


  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "  ",
      headerName: " Edit",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <Link
            href={`/admin/edit-course/${params.row.id}`}
            className="flex items-center justify-center w-full h-full "
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <FiEdit2
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            />
          </Link>
        );
      },
    },
    {
      field: " ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setOpen(!open);
                setCourseID(params.row.id);
              }}
            >
              <AiOutlineDelete className="dark:text-white text-black" />
            </Button>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success("Course Deleted Successfully");
    }
    if (deleteError) {  // Sử dụng deleteError thay vì error
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, deleteError]);

  //   const rows:any =[];
  // {
  //     data && data.forEach((item:any) => {
  //         rows.push({
  //             id: item.id,
  //             title: item.title,
  //             purchased: item.purchased,
  //             ratings: item.ratings,
  //             created_at: item.created_at,
  //         })
  //     });
  //   }

  const handleDelete = async () => {
    const id = courseId;
    await deleteCourse(id);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              },
              "& .MuiDataGrid-columnHeaders": {
                fontWeight: "bold",
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1F2A40" : "#F8F9FF",
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: theme === "dark" ? "#2A3E5B" : "#F0F4FF",
                  cursor: "pointer",
                },
                borderBottom:
                  theme === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(0, 0, 0, 0.1)",
              },
              "& .MuiDataGrid-cell": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-footerContainer": {
                background:
                  theme === "dark"
                    ? "linear-gradient(90deg, #3e4396, #6a74d1)"
                    : "linear-gradient(90deg, #A4A9FC, #D3D8FF)",
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              },
              "& .MuiCheckbox-root": {
                color:
                  theme === "dark"
                    ? `rgba(183, 235, 222, 1) !important`
                    : `rgba(0, 0, 0, 0.7) !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: theme === "dark" ? "#fff !important" : "#000 !important",
              },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title" // Sửa thành aria-labelledby
              aria-describedby="modal-modal-description" // Sửa thành aria-describedby
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2">
                <h1 className={`${Style.title}`} id="modal-modal-title">
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
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllCourse;
