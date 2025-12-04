'use client';

import { configureStore } from '@reduxjs/toolkit';
import { propertyApi } from './api/propertyApi';
import { feedbackApi } from './api/feedbackApi';
import { authApi } from './api/authApi';
import { analysisApi } from './api/analysisApi';
import { contactApi } from './api/contactApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [propertyApi.reducerPath]: propertyApi.reducer,
      [feedbackApi.reducerPath]: feedbackApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [analysisApi.reducerPath]: analysisApi.reducer,
      [contactApi.reducerPath]: contactApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(propertyApi.middleware)
        .concat(feedbackApi.middleware)
        .concat(authApi.middleware)
        .concat(analysisApi.middleware)
        .concat(contactApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];


