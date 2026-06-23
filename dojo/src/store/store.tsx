// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../components/hooks/useAuth";

//Rehydrate from localStorage
const persistedAuth = localStorage.getItem("auth");

const preloadedState = persistedAuth
  ? {
      auth: {
        ...JSON.parse(persistedAuth),
        isAuthenticated: true,
        loading: false,
      },
    }
  : undefined;

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
