// src/store/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "../utils/loginApi";
import type { LoginResponse, PermissionAccess, UserRole } from "../constants/types";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  employeeid: string;
  role: UserRole;
  userType?: string;
  hq: string;
  factory: string;
  department: string;
  status: boolean;
  permissions?: Record<string, PermissionAccess>;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const persistAuthState = (state: AuthState) => {
  localStorage.setItem("auth", JSON.stringify({
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
  }));

  if (state.user) {
    localStorage.setItem("user", JSON.stringify(state.user));
  }
  if (state.accessToken) {
    localStorage.setItem("access_token", state.accessToken);
  }
  if (state.refreshToken) {
    localStorage.setItem("refresh_token", state.refreshToken);
  }
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
};

// ✅ Async thunk for login
export const login = createAsyncThunk<LoginResponse, { email: string; password: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);

// ✅ Async thunk for logout
export const logout = createAsyncThunk<void, void, { state: { auth: AuthState } }>(
  "auth/logout",
  async (_, { getState }) => {
    const { auth } = getState();
    try {
      if (auth.refreshToken && auth.accessToken) {
        await authAPI.logout(auth.refreshToken, auth.accessToken);
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  }
);

export const refreshCurrentUser = createAsyncThunk<
  User,
  void,
  { state: { auth: AuthState } }
>(
  "auth/refreshCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const accessToken = auth.accessToken || localStorage.getItem("access_token");

    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    try {
      const user = await authAPI.getCurrentUser(accessToken);
      return user as User;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to refresh current user");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // 🔹 Login reducers
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.isAuthenticated = true;
      state.loading = false;

      persistAuthState(state);
    });
    builder.addCase(login.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    });

    // 🔹 Logout reducers
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;

      //clear localStorage
      localStorage.removeItem("auth");
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    });

    builder.addCase(refreshCurrentUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(refreshCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      persistAuthState(state);
    });
    builder.addCase(refreshCurrentUser.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
