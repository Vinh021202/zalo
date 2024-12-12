import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSilce";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_UPI,
    credentials: "include",
  }),
  tagTypes: ["User"], // Định nghĩa tag
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "refresh",
        method: "GET",
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accesstoken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    submitTest: builder.mutation({
      query: (data) => ({
        url: "submit-test",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"], // Làm mới cache
    }),
  }),
});

export const {
  useRefreshTokenQuery,
  useLoadUserQuery,
  useSubmitTestMutation,
} = apiSlice;
