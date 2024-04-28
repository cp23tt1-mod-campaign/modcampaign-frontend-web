import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayName: "",
  role: "",
  profileImage: "",
  userList: [],
  pagination: {},
};

const defaultUserState = initialState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setDefaultUserState: (state) => {
      Object.assign(state, defaultUserState);
    },
    setUserDisplayName: (state, action) => {
      state.displayName = action.payload;
    },
    setUserRole: (state, action) => {
      state.role = action.payload;
    },
    setUserProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
  },
});

export const {
  setDefaultUserState,
  setUserDisplayName,
  setUserProfileImage,
  setUserRole,
  setUserList,
  setPagination,
} = userSlice.actions;

export default userSlice.reducer;
