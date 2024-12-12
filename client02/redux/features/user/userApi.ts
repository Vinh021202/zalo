import {apiSlice} from "../api/apiSilce";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation({
            query:(avatar)=> ({
                url:"update-user-avatar",
                method: "PUT",
                body:{avatar},
                credentials: "include" as const,
            }),
        }),
        editProfile: builder.mutation({
            query:({name})=> ({
                url:"update-user-info",
                method: "PUT",
                body:{name,},
                credentials: "include" as const,
            }),
        }),
        updatePassword: builder.mutation({
            query:({oldPassword, newPassword})=> ({
                url:"update-user-password",
                method: "PUT",
                body:{
                    oldPassword,
                    newPassword,
                },
                credentials: "include" as const,
            }),
        }),
        getAllUsers: builder.query({
            query: () => ({  // Truyền trực tiếp data thay vì { data }
              url: "get-users",
              method: "GET",
              credentials: "include" as const,
            }),
          }),
          updateUsersRole: builder.mutation({
            query: ({ id, role }) => ({
              url: "update-user-role",
              method: "PUT",
              body: {
                id,
                role,
              },
              credentials: "include" as const, // Đảm bảo gửi cookie cùng request
            }),
          }),
          deleteUsers: builder.mutation({
            query: (id) => ({
              url: `delete-user/${id}`,
              method: "PUT",
              credentials: "include" as const, // Đảm bảo gửi cookie cùng request
            }),
          }),
          getAllUserByCourse: builder.query({
            query: (id) => ({
              url: `get-users-by-course/${id}`,
              method: "GET",
              credentials: "include" as const, // Đảm bảo gửi cookie cùng request
            }),
          }),          
          getUsersByIds: builder.mutation({
            query: (ids) => ({
              url: "get-users-by-ids",
              method: "POST",
              body: { ids },
              credentials: "include" as const,
            }),
          }),
    })
});

export const {useUpdateAvatarMutation, useEditProfileMutation, 
    useUpdatePasswordMutation,useGetAllUsersQuery,useUpdateUsersRoleMutation,useDeleteUsersMutation,useGetAllUserByCourseQuery,useGetUsersByIdsMutation } = userApi;