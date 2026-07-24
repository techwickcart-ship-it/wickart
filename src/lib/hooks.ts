import { useState, useEffect, useRef } from 'react';
import { marketplaceStore } from './store';

// Custom React hooks for dynamic subscription
export function useMarketplaceData<T>(key: string, getter: () => T): T {
  const [data, setData] = useState<T>(() => getter());

  // Use a ref to keep track of the latest getter function to avoid hook dependency re-runs
  const getterRef = useRef(getter);
  useEffect(() => {
    getterRef.current = getter;
  });

  useEffect(() => {
    const handleUpdate = () => {
      setData(getterRef.current());
    };

    // Ensure immediate freshness on component mount
    handleUpdate();

    window.addEventListener(`store_${key}_updated`, handleUpdate);
    window.addEventListener('settingsUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(`store_${key}_updated`, handleUpdate);
      window.removeEventListener('settingsUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [key]);

  return data;
}
