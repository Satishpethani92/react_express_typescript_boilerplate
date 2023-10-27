import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LoginDto } from "../types/auth.dto";
import { ReduxStore } from ".";

export declare type AuthInitialState = {
  user: LoginDto | null;
};

const initialState: AuthInitialState = {
  user: null,
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginDto>) => {
      state.user = action.payload;
    },
    logout: (state, action) => {
      state.user = null;
    },
  },
});

export const getUser = (state: ReduxStore) => state.auth.user;

export const getRole = (state: ReduxStore) => state.auth.user?.role;

export const { setUser, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
