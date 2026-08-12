import { useState, useEffect } from 'react';
import { marketplaceStore, useMarketplaceData, Seller } from './store';

export function useActiveSellerStore() {
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());

  const getStoredName = () => {
    return localStorage.getItem('activeSellerStoreName') || '';
  };

  const getStoredId = () => {
    return localStorage.getItem('activeSellerId') || '';
  };

  const [activeSellerStoreName, setActiveSellerStoreName] = useState<string>(getStoredName);
  const [activeSellerId, setActiveSellerId] = useState<string>(getStoredId);

  useEffect(() => {
    const currentName = localStorage.getItem('activeSellerStoreName') || '';
    const currentId = localStorage.getItem('activeSellerId') || '';

    if (currentName !== activeSellerStoreName) {
      setActiveSellerStoreName(currentName);
    }
    if (currentId !== activeSellerId) {
      setActiveSellerId(currentId);
    }
  }, [sellers]);

  useEffect(() => {
    const handleSellerChanged = () => {
      const name = localStorage.getItem('activeSellerStoreName') || '';
      const id = localStorage.getItem('activeSellerId') || '';
      setActiveSellerStoreName(name);
      setActiveSellerId(id);
    };

    window.addEventListener('storage', handleSellerChanged);
    window.addEventListener('seller_changed', handleSellerChanged);
    return () => {
      window.removeEventListener('storage', handleSellerChanged);
      window.removeEventListener('seller_changed', handleSellerChanged);
    };
  }, [sellers]);

  const changeSeller = (seller: Seller) => {
    localStorage.setItem('activeSellerId', seller.id);
    localStorage.setItem('activeSellerStoreName', seller.storeName);
    setActiveSellerStoreName(seller.storeName);
    setActiveSellerId(seller.id);
    window.dispatchEvent(new Event('seller_changed'));
  };

  return {
    activeSellerStoreName,
    activeSellerId,
    sellers,
    changeSeller
  };
}
