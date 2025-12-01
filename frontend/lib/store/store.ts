'use client';

import { configureStore } from '@reduxjs/toolkit';
import { propertyApi } from './api/propertyApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [propertyApi.reducerPath]: propertyApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(propertyApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];


