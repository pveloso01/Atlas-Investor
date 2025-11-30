import React from 'react';
import { useAppDispatch, useAppSelector, useAppStore } from '../hooks';
import { configureStore } from '@reduxjs/toolkit';
import { propertyApi } from '../api/propertyApi';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';

describe('hooks', () => {
  const createTestStore = () => {
    return configureStore({
      reducer: {
        [propertyApi.reducerPath]: propertyApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(propertyApi.middleware),
    });
  };

  describe('useAppDispatch', () => {
    it('returns dispatch function with correct type', () => {
      const store = createTestStore();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useAppDispatch(), { wrapper });
      
      expect(typeof result.current).toBe('function');
      expect(result.current).toBe(store.dispatch);
    });
  });

  describe('useAppSelector', () => {
    it('returns selected state with correct type', () => {
      const store = createTestStore();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useAppSelector((state) => state), { wrapper });
      
      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty(propertyApi.reducerPath);
    });

    it('selects specific state slice', () => {
      const store = createTestStore();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(
        () => useAppSelector((state) => state[propertyApi.reducerPath]),
        { wrapper }
      );
      
      expect(result.current).toBeDefined();
    });
  });

  describe('useAppStore', () => {
    it('returns store with correct type', () => {
      const store = createTestStore();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useAppStore(), { wrapper });
      
      expect(result.current).toBe(store);
      expect(result.current.getState).toBeDefined();
      expect(result.current.dispatch).toBeDefined();
    });

    it('can use store methods', () => {
      const store = createTestStore();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useAppStore(), { wrapper });
      
      // Test that we can call getState
      const state = result.current.getState();
      expect(state).toBeDefined();
      
      // Test that we can call dispatch
      expect(typeof result.current.dispatch).toBe('function');
    });
  });
});

