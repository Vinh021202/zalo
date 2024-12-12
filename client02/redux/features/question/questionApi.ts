import { apiSlice } from "../api/apiSilce";

export const questionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuestions: builder.query({
      query: () => ({
        url: "get-all-questions",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    // submitTest: builder.mutation({
    //   query: (data) => ({
    //     url: "submit-test",
    //     method: "PUT",
        // body: data,
    //     credentials: "include", // Đảm bảo gửi cookie nếu cần
    //   }),
    //   invalidatesTags: ["user"], // Xác định tag để invalid cache
    // }),
  }),
});

export const { useGetAllQuestionsQuery, useSubmitTestMutation } = questionApi;
