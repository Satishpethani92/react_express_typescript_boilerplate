import { configureStore } from "@reduxjs/toolkit";
import AuthReducer, { AuthInitialState } from "./authSlice";

export interface ReduxStore {
  auth: AuthInitialState;
}

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
