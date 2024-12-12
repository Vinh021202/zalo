import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
    token: "",
    user: "",
    count: 0, // Thêm thuộc tính count

    };

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers: {
        userRegistration: (state,action : PayloadAction<{token: string}>) => {
        state.token = action.payload.token;
    },
        userLoggedIn: (state,action: PayloadAction<{accesstoken:string, user:string}>) => {
            state.token = action.payload.accesstoken;
            state.user = action.payload.user;
        },
        userLoggedOut: (state) =>{
            state.token = "";
            state.user = "";
        },
        incrementCount(state) {
            state.count += 1;
        },
        
    }
}
)
export const {userRegistration, userLoggedIn, userLoggedOut,incrementCount} = authSlice.actions;

export default authSlice.reducer;