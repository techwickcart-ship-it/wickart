import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, User, Settings, Store, LogOut, ArrowLeft, X, Package, ShoppingBag } from 'lucide-react';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';
import { navigateTo } from '../../lib/navigation';
import { marketplaceStore } from '../../lib/store';

interface HeaderProps {
  isSeller?: boolean;
  onSettingsClick?: () => void;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export function Header({ isSeller = false, onSettingsClick, onMenuClick, onLogout }: HeaderProps) {
  const { activeSellerStoreName } = useActiveSellerStore();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    if (isSeller) {
      localStorage.removeItem('activeSellerId');
      localStorage.removeItem('activeSellerStoreName');
      sessionStorage.removeItem('sellerAuth');
      navigateTo('/vendor-login');
    } else {
      sessionStorage.removeItem('adminAuth');
      navigateTo('/admin');
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo(isSeller ? '/seller' : '/admin');
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    if (isSeller) {
      navigateTo('/seller');
    } else {
      navigateTo(`/admin?page=AllProductsPage`);
    }
  };

  const trimmed = query.trim().toLowerCase();
  const products = marketplaceStore.getProducts();
  const sellers = marketplaceStore.getSellers();
  const orders = marketplaceStore.getOrders();

  const matchedProducts = trimmed ? products.filter(p => p.name.toLowerCase().includes(trimmed) || (p.vendor && p.vendor.toLowerCase().includes(trimmed))).slice(0, 4) : [];
  const matchedSellers = trimmed ? sellers.filter(s => s.name.toLowerCase().includes(trimmed) || s.storeName.toLowerCase().includes(trimmed)).slice(0, 3) : [];
  const matchedOrders = trimmed ? orders.filter(o => o.id.toLowerCase().includes(trimmed) || o.customer.toLowerCase().includes(trimmed) || o.store.toLowerCase().includes(trimmed)).slice(0, 3) : [];

  const hasAdminResults = matchedProducts.length > 0 || matchedSellers.length > 0 || matchedOrders.length > 0;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200/80 cursor-pointer shadow-xs"
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Active Search Component with Search Button */}
        <div ref={searchRef} className="hidden sm:flex items-center relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input 
              type="text" 
              placeholder={isSeller ? `Search ${activeSellerStoreName}...` : "Search stores, orders, products..."} 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="pl-9 pr-20 py-2 w-64 lg:w-80 bg-slate-100 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-medium text-slate-800"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-14 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Quick Search Results Dropdown */}
          {isOpen && trimmed.length > 0 && (
            <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 p-2 text-xs divide-y divide-slate-100">
              {hasAdminResults ? (
                <>
                  {matchedProducts.length > 0 && (
                    <div className="p-2 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 mb-1">
                        <Package className="w-3 h-3 text-blue-600" /> Products
                      </span>
                      {matchedProducts.map(p => (
                        <div 
                          key={p.id}
                          onClick={() => {
                            setIsOpen(false);
                            navigateTo('/admin?page=AllProductsPage');
                          }}
                          className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <img src={p.image} alt={p.name} className="w-7 h-7 rounded object-cover border" />
                            <span className="font-bold text-slate-800 truncate">{p.name}</span>
                          </div>
                          <span className="font-bold text-slate-900">{p.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isSeller && matchedSellers.length > 0 && (
                    <div className="p-2 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 mb-1">
                        <Store className="w-3 h-3 text-purple-600" /> Stores & Vendors
                      </span>
                      {matchedSellers.map(s => (
                        <div 
                          key={s.id}
                          onClick={() => {
                            setIsOpen(false);
                            navigateTo('/admin?page=AllSellersPage');
                          }}
                          className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <span className="font-bold text-slate-800">{s.storeName} ({s.name})</span>
                          <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold">{s.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedOrders.length > 0 && (
                    <div className="p-2 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 mb-1">
                        <ShoppingBag className="w-3 h-3 text-emerald-600" /> Orders
                      </span>
                      {matchedOrders.map(o => (
                        <div 
                          key={o.id}
                          onClick={() => {
                            setIsOpen(false);
                            navigateTo(isSeller ? '/seller' : '/admin?page=Orders');
                          }}
                          className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <div>
                            <span className="font-bold text-slate-800 block">{o.id} - {o.customer}</span>
                            <span className="text-[10px] text-slate-400">{o.store}</span>
                          </div>
                          <span className="font-bold text-slate-900">{o.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-slate-500">
                  No records match "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button 
           onClick={() => navigateTo('/')}
           className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
        >
           View Storefront
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2 border-r border-slate-200 pr-2 sm:pr-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          <button onClick={onSettingsClick} className="hidden sm:block p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 p-1 pr-2 rounded-full hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              {isSeller ? <Store className="w-4 h-4" /> : 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-800 leading-none">{isSeller ? activeSellerStoreName : 'Admin User'}</p>
              <p className="text-xs text-slate-500 mt-1">{isSeller ? 'Seller Account' : 'Super Admin'}</p>
            </div>
          </div>

          {/* Explicit Logout Button */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200/80 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
