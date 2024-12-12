import { apiSlice } from "../api/apiSilce";

export const layoutApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHeroData: builder.query({
            query:(type) => ({
                url:`get-layout/${type}`,
                method:"GET",
                credentials: "include" as const,
            })
        }),
        editLayout: builder.mutation({
            query: ({ type, image, title, subTitle, faq, categories }) => ({
              url: 'edit-layout',
              method: "POST",
              body: { type, image, title, subTitle, faq, categories },
              credentials: "include" as const, // Đảm bảo gửi cookie cùng request
            }),
          }),
    })
});
export const {useGetHeroDataQuery, useEditLayoutMutation} = layoutApi;