import { apiSlice } from "../api/apiSilce";  // Kiểm tra tên import đúng

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({  // Truyền trực tiếp data thay vì { data }
        url: "create-course",
        method: "POST",
        body: data,  // Gửi dữ liệu trực tiếp
        credentials: "include" as const,
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({  // Truyền trực tiếp data thay vì { data }
        url: "get-admin-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    deleteCourses: builder.mutation({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "PUT",
        credentials: "include" as const, // Đảm bảo gửi cookie cùng request
      }),
    }),
    editCourses: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const, // Đảm bảo gửi cookie cùng request
      }),
    }),
    getUserAllCourses: builder.query({
      query: () => ({  // Truyền trực tiếp data thay vì { data }
        url: "get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCoursesDetails: builder.query({
      query: (id) => ({  // Truyền trực tiếp data thay vì { data }
        url: `get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCoursesContent: builder.query({
      query: (id: any) => ({  // Truyền trực tiếp data thay vì { data }
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: 'add-question',
        body: {
          question, courseId, contentId // Đúng chính tả
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addAnswerInQuestion: builder.mutation({
      query: ({ answer, questionId, courseId, contentId }) => ({
        url: 'add-answer',
        body: {
          answer, questionId, courseId, contentId // Đúng chính tả
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addReviewInCourse: builder.mutation({
      query: ({ review, rating, courseId }: any) => ({
        url: `add-review/${courseId}`,
        body: {
          review, rating, courseId // Đúng chính tả
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addReplyInReview: builder.mutation({
      query: ({ reviewId, courseId, comment}: any) => ({
        url: `add-reply`,
        body: {
          comment, courseId, reviewId // Đúng chính tả
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addUserToCourse: builder.mutation({
      query: ({ courseId, userId }) => ({
        url: `add-user-to-course/${courseId}`,
        method: "POST",
        body: { userId }, // Gửi userId trong body
        credentials: "include" as const,
      }),
    }),
  }),

});

export const { useCreateCourseMutation, useGetAllCoursesQuery, useDeleteCoursesMutation, useEditCoursesMutation,
  useGetUserAllCoursesQuery, useGetCoursesDetailsQuery, useGetCoursesContentQuery, useAddNewQuestionMutation,
  useAddAnswerInQuestionMutation, useAddReviewInCourseMutation, useAddReplyInReviewMutation,useAddUserToCourseMutation } = courseApi;
