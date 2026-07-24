import { useState, useEffect } from 'react';
import { marketplaceStore, useMarketplaceData, Seller } from './store';

export function useActiveSellerStore() {
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());

  const getStoredName = () => {
    const name = localStorage.getItem('activeSellerStoreName');
    if (name) return name;
    return sellers[sellers.length - 1]?.storeName || 'City Square Mart';
  };

  const getStoredId = () => {
    const id = localStorage.getItem('activeSellerId');
    if (id) return id;
    return sellers[sellers.length - 1]?.id || '1';
  };

  const [activeSellerStoreName, setActiveSellerStoreName] = useState<string>(getStoredName);
  const [activeSellerId, setActiveSellerId] = useState<string>(getStoredId);

  useEffect(() => {
    const currentName = localStorage.getItem('activeSellerStoreName');
    const currentId = localStorage.getItem('activeSellerId');

    if (!currentName && sellers.length > 0) {
      const defaultSeller = sellers[sellers.length - 1] || sellers[0];
      localStorage.setItem('activeSellerStoreName', defaultSeller.storeName);
      localStorage.setItem('activeSellerId', defaultSeller.id);
      setActiveSellerStoreName(defaultSeller.storeName);
      setActiveSellerId(defaultSeller.id);
    } else if (currentName && currentName !== activeSellerStoreName) {
      setActiveSellerStoreName(currentName);
    }
    if (currentId && currentId !== activeSellerId) {
      setActiveSellerId(currentId);
    }
  }, [sellers]);

  useEffect(() => {
    const handleSellerChanged = () => {
      const name = localStorage.getItem('activeSellerStoreName') || sellers[sellers.length - 1]?.storeName || 'City Square Mart';
      const id = localStorage.getItem('activeSellerId') || sellers[sellers.length - 1]?.id || '1';
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
