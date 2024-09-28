import { createSlice } from "@reduxjs/toolkit";

export const ActiveSlice = createSlice({
  name: "single",
  initialState: {
    active: JSON.parse(localStorage.getItem("active")) || null,
  },
  reducers: {
    ActiveSingle: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const { ActiveSingle } = ActiveSlice.actions;
export default ActiveSlice.reducer;
