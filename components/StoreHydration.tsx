import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

export const StoreHydration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrateStore = async () => {
      await useAuthStore.persist.rehydrate();
      setHydrated(true);
    };

    hydrateStore();
  }, []);

  if (!hydrated) {
    // You can return a loading indicator here if you want
    return null;
  }

  return <>{children}</>;
};