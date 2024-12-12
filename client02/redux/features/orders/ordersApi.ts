import { apiSlice } from "../api/apiSilce";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => ({
        url: 'get-orders', // Corrected the URL quote
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getStripePublishablekey: builder.query({
      query: () => ({
        url: 'payment/stripepublishablekey', // Đường dẫn API cho khóa Publishable
        method: "GET", // Phương thức yêu cầu
        credentials: "include" as const, // Bao gồm cookie để xác thực
      }),
    }),
    
    createPaymentIntent: builder.mutation({
      query: (amount) => ({
        url: 'payment', // Đường dẫn API để tạo Payment Intent
        method: "POST", // Phương thức POST để gửi dữ liệu
        body: {
          amount, // Gửi số tiền qua body
        },
        credentials: "include" as const, // Bao gồm cookie để xác thực
      }),
    }),
    createOrder: builder.mutation({
      query: ({courseId, payment_info}) => ({
        url: 'create-order', // Đường dẫn API để tạo Payment Intent
        method: "POST", // Phương thức POST để gửi dữ liệu
        body: {
          courseId, 
          payment_info, // Gửi số tiền qua body
        },
        credentials: "include" as const, // Bao gồm cookie để xác thực
      }),
    }),
  }),
});

export const { useGetAllOrdersQuery, useGetStripePublishablekeyQuery, useCreatePaymentIntentMutation,useCreateOrderMutation} = ordersApi; // Corrected the query name
