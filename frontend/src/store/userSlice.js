import { createSlice } from "@reduxjs/toolkit";
const storedUser = localStorage.getItem("user");

const initialState = 
  {
    user: storedUser ? JSON.parse(storedUser) : null,
  };
  

  export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      updateUser: (state, action) => {
        // Save user to localStorage whenever it's updated
        localStorage.setItem("user", JSON.stringify(action.payload));
        state.user = action.payload;
      },
    logoutUser: (state) => {
      state.user = null;
    }
  },
});
export const { updateUser, logoutUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
