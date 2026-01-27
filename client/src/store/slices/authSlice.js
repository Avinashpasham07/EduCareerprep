import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { userApi } from '../../services/api';

const API_URL = ''; // handled by api instance

const getErrorMessage = (err) => err.response?.data?.message || err.message || 'Request failed';

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post(`/auth/register`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue({ message: getErrorMessage(err) });
  }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post(`/auth/login`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue({ message: getErrorMessage(err) });
  }
});

export const refreshTokens = createAsyncThunk('auth/refresh', async (token, { rejectWithValue }) => {
  try {
    const res = await api.post(`/auth/refresh`, { token });
    return res.data;
  } catch (err) {
    return rejectWithValue({ message: getErrorMessage(err) });
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const res = await userApi.getProfile();
    return res.data;
  } catch (err) {
    return rejectWithValue({ message: getErrorMessage(err) });
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    updateUser(state, action) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('accessToken', action.payload.tokens.accessToken);
        localStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload?.message || 'Registration failed'; })
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('accessToken', action.payload.tokens.accessToken);
        localStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload?.message || 'Login failed'; })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // Optional: clear user if session invalid
      });
  }
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
