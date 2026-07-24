import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { PagePlaceholder } from '../PagePlaceholder';
import { Users, Store, Bike, ShoppingCart, Box, DollarSign, LifeBuoy, AlertCircle, LogOut, ChevronDown, ArrowLeft, FileText } from 'lucide-react';

import { SellerDashboardPage } from './SellerDashboardPage';
import { SellerProductsPage } from './SellerProductsPage';
import { SellerOrdersPage } from './SellerOrdersPage';
import { SellerInventoryPage } from './SellerInventoryPage';
import { SellerKYCPage } from './SellerKYCPage';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';
import { navigateTo } from '../../lib/navigation';

// Specialized Sidebar items for Seller Panel
const sellerNavGroups = [
  {
    title: 'STORE MANAGEMENT',
    items: [
      { name: 'Dashboard', icon: Store },
      { name: 'My Products', icon: Box, hasSubmenu: true, subItems: ['Add Product', 'Approved Products', 'Pending Approvals'] },
      { name: 'Inventory & Stock', icon: Box },
      { name: 'KYC & Verification', icon: FileText },
    ]
  },
  {
    title: 'ORDERS',
    items: [
      { name: 'New Orders', icon: ShoppingCart },
      { name: 'Processing & Dispatch', icon: Bike },
      { name: 'Returns & Refunds', icon: AlertCircle },
    ]
  },
  {
    title: 'FINANCE',
    items: [
      { name: 'Earnings & Commission', icon: DollarSign },
      { name: 'Withdrawals', icon: DollarSign },
    ]
  },
  {
    title: 'SUPPORT',
    items: [
      { name: 'Raise Ticket', icon: LifeBuoy },
    ]
  }
];

export function SellerPanel() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { activeSellerStoreName, activeSellerId, sellers, changeSeller } = useActiveSellerStore();

  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const pendingOrdersCount = orders.filter(o => o.store === activeSellerStoreName && o.status === 'Pending').length;

  useEffect(() => {
    const syncSellerTabFromUrl = () => {
      if (window.location.pathname === '/seller') {
        const searchParams = new URLSearchParams(window.location.search);
        const tabParam = searchParams.get('tab');
        if (tabParam) {
          setActivePage(tabParam);
        } else {
          setActivePage('Dashboard');
        }
      }
    };

    syncSellerTabFromUrl();
    window.addEventListener('popstate', syncSellerTabFromUrl);
    return () => window.removeEventListener('popstate', syncSellerTabFromUrl);
  }, []);

  const handleSellerNavigate = (page: string) => {
    setActivePage(page);
    if (window.location.pathname === '/seller') {
      const url = `/seller?tab=${encodeURIComponent(page)}`;
      window.history.pushState({ tab: page }, '', url);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative overflow-x-hidden">
      {/* Sidebar Backdrop overlay for mobile devices */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Custom sidebar rendering for Seller context */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-white/10 bg-slate-900/50">
          <Store className="w-6 h-6 text-emerald-500 shrink-0" />
          <span className="ml-3 font-bold text-white tracking-tight">Seller Portal</span>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-8rem)] custom-scrollbar">
          {sellerNavGroups.map((group, i) => (
            <div key={i} className="mb-6">
              <h3 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{group.title}</h3>
              <div className="space-y-1">
                {group.items.map(item => (
                  <button
                    key={item.name}
                    onClick={() => {
                      handleSellerNavigate(item.name);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activePage === item.name || (item.subItems && item.subItems.includes(activePage))
                        ? 'bg-blue-600/10 text-blue-500 font-medium'
                        : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${activePage === item.name ? 'text-blue-500' : 'text-slate-400'}`} />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Seller Logout Button */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-slate-900/90 sticky bottom-0">
          <button
            onClick={() => {
              localStorage.removeItem('activeSellerId');
              localStorage.removeItem('activeSellerStoreName');
              sessionStorage.removeItem('sellerAuth');
              navigateTo('/vendor-login');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Seller Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header isSeller onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {activePage !== 'Dashboard' && (
                <div className="mb-4 flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-3 px-4 shadow-xs">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button 
                      onClick={() => {
                        if (window.history.length > 1) {
                          window.history.back();
                        } else {
                          handleSellerNavigate('Dashboard');
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200 cursor-pointer shadow-xs"
                      title="Go Back"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-600" />
                      <span>Back</span>
                    </button>

                    <span className="text-slate-300 font-light">|</span>

                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 truncate">
                      <button 
                        onClick={() => handleSellerNavigate('Dashboard')} 
                        className="hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        Seller Dashboard
                      </button>
                      <span>/</span>
                      <span className="font-bold text-slate-900 truncate">{activePage}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSellerNavigate('Dashboard')}
                    className="hidden sm:block text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-emerald-200/60"
                  >
                    Dashboard
                  </button>
                </div>
             )}

             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 mb-6 shadow-xs">
                <div className="flex items-start gap-3">
                   <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
                     <Store className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-emerald-950 text-base">
                        Managing Store: <span className="text-blue-700 underline underline-offset-2">{activeSellerStoreName}</span>
                      </h3>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Your store status is <span className="font-bold uppercase tracking-wider text-emerald-800">Active</span>. You have {pendingOrdersCount} new order(s) pending.
                      </p>
                   </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                   <span className="text-xs font-bold text-slate-600 hidden md:inline">Active Store:</span>
                   <span className="px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 shadow-xs">
                     {activeSellerStoreName}
                   </span>
                </div>
             </div>
             
             {activePage === 'Dashboard' ? (
                <SellerDashboardPage />
             ) : (activePage === 'My Products' || activePage === 'Approved Products' || activePage === 'Pending Approvals' || activePage === 'Add Product') ? (
                <SellerProductsPage initialTab={activePage} />
             ) : (activePage === 'New Orders' || activePage === 'Processing & Dispatch') ? (
                <SellerOrdersPage />
             ) : activePage === 'Inventory & Stock' ? (
                <SellerInventoryPage />
             ) : activePage === 'KYC & Verification' ? (
                <SellerKYCPage />
             ) : (
                <PagePlaceholder pageName={activePage} />
             )}
          </div>
        </main>
      </div>
    </div>
  );
}
