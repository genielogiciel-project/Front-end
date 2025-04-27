import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth } from "../api/api";
import { User } from "../lib/types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { userNumber: string; password: string }, thunkAPI) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await auth.post("/login", credentials);
      // const {
      //   data: { user },
      // } = await auth.get("/current-user");

      return { accessToken: response.data.accessToken, user: response.data.user };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      const response = await auth.post("/refresh");
      const {
        data: { user },
      } = await auth.get("/current-user");

      return { accessToken: response.data.accessToken, user };
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to refresh token"); // "Failed to refresh token" | null
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 500));
    await auth.post("/logout");
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
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.loading = false;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, _) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
