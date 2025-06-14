import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { createLogger } from 'redux-logger';

const logger = createLogger();

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(logger),
});

export default store;