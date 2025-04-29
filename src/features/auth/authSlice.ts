import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User, UserRole } from "@/lib/types";
import { auth } from "@/api/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null;
const token = localStorage.getItem("token");

const initialState: AuthState = {
  user: user || null,
  token: token || null,
  isAuthenticated: user ? true : false,
  loading: true,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { userNumber: string; password: string }, thunkAPI) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await auth.post("/login", credentials);
      // const {
      //   data: { user },
      // } = await auth.get("/current-user");

      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.accessToken);

      return {
        accessToken: response.data.accessToken,
        user: response.data.user,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (credentials: { userNumber: string; password: string }, thunkAPI) => {
    try {
      const response = await auth.post("/refresh", {
        userNumber: credentials.userNumber,
        password: credentials.password,
      });

      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // const {
      //   data: { user },
      // } = await auth.get("/current-user");

      return {
        accessToken: response.data.accessToken,
        user: response.data.user,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to refresh token"); // "Failed to refresh token" | null
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // await auth.post("/logout");

    return {};
  } catch (error: any) {
    return thunkAPI.rejectWithValue("Logout failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        console.log(action.payload);
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = (action.payload as string) || "You have to login again";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {} = authSlice.actions;
export default authSlice.reducer;
