import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userActionsReducer from './slices/userActionsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    userActions: userActionsReducer,
  },
});

export default store;
