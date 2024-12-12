'use client';

import React, { useState, useEffect, FC } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Modal } from '@mui/material';
import { AiOutlineDelete } from 'react-icons/ai';
import { useTheme } from 'next-themes';
import Loader from '../../Loader/Loader';
import { format } from 'timeago.js';
import {
  useDeleteUsersMutation,
  useGetUsersByIdsMutation,
  useGetAllUserByCourseQuery,
} from '@/redux/features/user/userApi';
import { Style } from '@/app/style/stylelogin';
import toast from 'react-hot-toast';

type Props = {
  id: string;
};

const AllUsers: FC<Props> = ({ id }: Props) => {
  const { theme } = useTheme();
  const { isLoading: isCourseLoading, data: dataCourse } = useGetAllUserByCourseQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [getUsersByIds] = useGetUsersByIdsMutation();
  const [deleteUser] = useDeleteUsersMutation();

  const [userId, setUserID] = useState('');
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (dataCourse?.course?.registeredUsers) {
        const registeredUserIds = dataCourse.course.registeredUsers.map((user: any) => user._id);

        try {
          const response = await getUsersByIds(registeredUserIds).unwrap();
          const users = response.users;

          const newRows = users.map((user: any) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'N/A',
            created_at: format(user.createdAt),
          }));

          setRows(newRows);
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
      }
    };

    fetchUsers();
  }, [dataCourse, getUsersByIds]);

  const handleDelete = async () => {
    try {
      await deleteUser(userId).unwrap();
      setRows((prevRows) => prevRows.filter((row) => row.id !== userId));
      toast.success('User deleted successfully');
      setOpen(false);
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      toast.error('Failed to delete user');
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'created_at', headerName: 'Created At', flex: 0.7 },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.5,
      renderCell: (params: any) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setOpen(true);
            setUserID(params.row.id);
          }}
        >
          <AiOutlineDelete className="dark:text-white text-black" />
        </Button>
      ),
    },
  ];

  if (isCourseLoading) return <Loader />;

  return (
    <div className="mt-[120px]">
      <Box m="20px">
        <Box
          m="40px 0 0 0"
          height="80vh"
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
              outline: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            },
            '& .MuiDataGrid-columnHeaders': {
              fontWeight: 'bold',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: theme === 'dark' ? '#1F2A40' : '#F8F9FF',
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: theme === 'dark' ? '#2A3E5B' : '#F0F4FF',
                cursor: 'pointer',
              },
              borderBottom:
                theme === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
            },
            '& .MuiDataGrid-cell': {
              color: theme === 'dark' ? '#fff' : '#000',
              padding: '10px',
            },
            '& .MuiDataGrid-footerContainer': {
              background:
                theme === 'dark'
                  ? 'linear-gradient(90deg, #3e4396, #6a74d1)'
                  : 'linear-gradient(90deg, #A4A9FC, #D3D8FF)',
              color: theme === 'dark' ? '#fff' : '#000',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <DataGrid rows={rows} columns={columns} />
        </Box>

        {open && (
          <Modal open={open} onClose={() => setOpen(false)}>
            <Box className="absolute top-[50%] left-[50%] -translate-x-1/2">
              <h1 className={`${Style.title}`}>Bạn có chắc chắn muốn xóa người dùng này không?</h1>
              <div className="flex w-full items-center justify-between mb-6">
                <div
                  className={`${Style.button} !w-[120px] h-[30px] bg-[#57c7a3]`}
                  onClick={() => setOpen(false)}
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
    </div>
  );
};

export default AllUsers;
