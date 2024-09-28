import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
    name: "login",
    initialState: {
        loggedIn: JSON.parse(localStorage.getItem("user")) || null,
    },
    reducers: {
        loggedInUser: (state, action) => {
            state.loggedIn = action.payload
        },
        logOutUser: (state) => {
            state.loggedIn = null
        }
    }
})

export const { loggedInUser, logOutUser } = UserSlice.actions
export default UserSlice.reducer