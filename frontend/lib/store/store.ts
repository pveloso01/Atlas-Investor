'use client';

import { configureStore } from '@reduxjs/toolkit';
import { propertyApi } from './api/propertyApi';
import { feedbackApi } from './api/feedbackApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [propertyApi.reducerPath]: propertyApi.reducer,
      [feedbackApi.reducerPath]: feedbackApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(propertyApi.middleware)
        .concat(feedbackApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];


