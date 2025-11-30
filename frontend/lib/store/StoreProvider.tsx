'use client';

import { useRef, useMemo } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use useMemo to initialize store only once
  const store = useMemo<AppStore>(() => {
    return makeStore();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}


