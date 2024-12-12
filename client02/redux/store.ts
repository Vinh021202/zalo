'use client';

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSilce";
import authSilce from "./features/auth/authSilce";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSilce, // 
    },
    devTools: false,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat()
});

// gọi lại chức năng mã thông báo cho mỗi trang
const initializeApp = async () => {
    // await store.dispatch(apiSlice.endpoints.refreshToken.initiate({}, {forceRefetch: true}));

    await store.dispatch(apiSlice.endpoints.loadUser.initiate({}, {forceRefetch: true}));
};
initializeApp();
