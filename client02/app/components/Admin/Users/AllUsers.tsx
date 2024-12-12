import React, { useState, useEffect, FC } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal, Select, MenuItem } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useDeleteUsersMutation, useGetAllUsersQuery, useUpdateUsersRoleMutation } from "@/redux/features/user/userApi";
import { Style } from "@/app/style/stylelogin";
import toast from "react-hot-toast";

const AllUsers: FC = () => {
  const { theme } = useTheme();
  const { isLoading, data } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
  const [userId, setUserID] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteUser] = useDeleteUsersMutation();
  const [updateUserRole] = useUpdateUsersRoleMutation();
  const [rows, setRows] = useState<any[]>([]);
  const [editRole, setEditRole] = useState<{ id: string; role: string } | null>(null);

  useEffect(() => {
    if (data?.users && Array.isArray(data.users)) {
      const newRows = data.users.map((item: any) => ({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        courses: item.courses.length,
        created_at: format(item.createdAt),
      }));
      setRows(newRows);
    } else {
      console.error("Dữ liệu users không tồn tại hoặc không phải là mảng");
    }
  }, [data]);

  const handleRoleUpdate = async () => {
    console.log('====================================');
    console.log("Edit Role: " , editRole);
    console.log('====================================');
    if (editRole) {
      try {
        await updateUserRole({ id: editRole.id, role: editRole.role });
        toast.success("Role updated successfully");
        setEditRole(null);
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === editRole.id ? { ...row, role: editRole.role } : row
          )
        );
      } catch {
        toast.error("Failed to update role");
      }
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params: any) => {
        return editRole?.id === params.row.id ? (
          <Box display="flex" gap={1}>
            <Select
              value={editRole.role}
              onChange={(e) => setEditRole({ ...editRole, role: e.target.value })}
              fullWidth
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Teacher">Teacher</MenuItem>
            </Select>
            <Button variant="contained" color="primary" onClick={handleRoleUpdate}>
              Đồng ý
            </Button>
            <Button variant="outlined" color="error" onClick={() => setEditRole(null)}>
              Hủy
            </Button>
          </Box>
        ) : (
          <Button
            variant="text"
            onClick={() => setEditRole({ id: params.row.id, role: params.row.role })}
          >
            {params.row.role}
          </Button>
        );
      },
    },
    { field: "courses", headerName: "Purchased Courses", flex: 0.8 },
    { field: "created_at", headerName: "Created At", flex: 0.7 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      renderCell: (params: any) => {
        return (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setOpen(!open);
              setUserID(params.row.id);
            }}
          >
            <AiOutlineDelete className="dark:text-white text-black" />
          </Button>
        );
      },
    },
  ];

  const handleDelete = async () => {
    await deleteUser(userId);
    setOpen(false);
    toast.success("User deleted successfully");
    setRows((prevRows) => prevRows.filter((row) => row.id !== userId));
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
                padding: "10px",
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
            <DataGrid rows={rows} columns={columns} />
          </Box>

          {open && (
            <Modal open={open} onClose={() => setOpen(!open)}>
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2">
                <h1 className={`${Style.title}`}>Bạn có chắc chắn muốn xóa người dùng này không?</h1>
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

export default AllUsers;
