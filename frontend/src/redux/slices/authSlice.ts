import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { authService } from "../../services/authService";
import { storeAuthSession, storeAuthUser, type AuthSession, type AuthUser } from "../../utils/authStorage";

interface LoginCredentials { email: string; password: string }
export interface AuthResponse { token: string; refreshToken: string; user: AuthUser }
interface ProfileResponse { user: AuthUser }
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
}

const errorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message ?? fallback : fallback;

export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const session = (await authService.login(data)).data as AuthResponse;
    storeAuthSession(session);
    return session;
  } catch (error: unknown) {
    return rejectWithValue(errorMessage(error, "Login failed"));
  }
});

export const registerUser = createAsyncThunk<unknown, Record<string, unknown>, { rejectValue: string }>("auth/register", async (data, { rejectWithValue }) => {
  try { return (await authService.register(data)).data; }
  catch (error: unknown) { return rejectWithValue(errorMessage(error, "Registration failed")); }
});

export const getProfile = createAsyncThunk<ProfileResponse, void, { rejectValue: string }>("auth/profile", async (_, { rejectWithValue }) => {
  try {
    const profile = (await authService.getProfile()).data as ProfileResponse;
    storeAuthUser(profile.user);
    return profile;
  } catch (error: unknown) {
    return rejectWithValue(errorMessage(error, "Unable to load profile"));
  }
});

const initialState: AuthState = { user: null, token: null, refreshToken: null, initialized: false, loading: false, error: null, otpSent: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreSession: (state, action: PayloadAction<AuthSession>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.initialized = true;
    },
    authenticateSession: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.initialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.initialized = true;
    },
    clearError: (state) => { state.error = null; },
    setOtpSent: (state, action: PayloadAction<boolean>) => { state.otpSent = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken; state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? "Login failed"; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; state.otpSent = true; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? "Registration failed"; })
      .addCase(getProfile.fulfilled, (state, action) => { state.user = action.payload.user; })
      .addCase(getProfile.rejected, (state, action) => {
        // The interceptor alone handles definitive invalidation; transient failures retain auth.
        state.error = action.payload ?? "Unable to load profile";
      });
  },
});

export const { authenticateSession, clearError, logout, restoreSession, setOtpSent } = authSlice.actions;
export default authSlice.reducer;
