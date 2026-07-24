import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { PagePlaceholder } from './pages/PagePlaceholder';
import { SettingsPage } from './pages/SettingsPage';
import { AddProductPage } from './pages/AddProductPage';
import { AllProductsPage } from './pages/AllProductsPage';
import { BrandsPage } from './pages/BrandsPage';
import { VariantsPage } from './pages/VariantsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SubCategoriesPage } from './pages/SubCategoriesPage';
import { AttributesPage } from './pages/AttributesPage';
import { OrdersPage } from './pages/OrdersPage';
import { DispatchManagementPage } from './pages/DispatchManagementPage';

import { AddSellerPage } from './pages/AddSellerPage';

import { ViewCustomersPage } from './pages/ViewCustomersPage';
import { CustomerAddressesPage } from './pages/CustomerAddressesPage';
import { CustomerTransactionsPage } from './pages/CustomerTransactionsPage';
import { WalletTransactionsPage } from './pages/WalletTransactionsPage';

import { ManageReturnRequestsPage } from './pages/ManageReturnRequestsPage';
import { ReturnReasonsPage } from './pages/ReturnReasonsPage';
import { ReferralsPage } from './pages/ReferralsPage';
import { CommissionReportPage } from './pages/CommissionReportPage';
import { WithdrawalsPage } from './pages/WithdrawalsPage';

import { VendorRegistrationPage } from './pages/vendor/VendorRegistrationPage';
import { VendorLoginPage } from './pages/vendor/VendorLoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { SellerPanel } from './pages/vendor/SellerPanel';
import { CustomerRegistrationPage } from './pages/CustomerRegistrationPage';
import { AllSellersPage } from './pages/AllSellersPage';
import { VendorInventoryPage } from './pages/VendorInventoryPage';
import { TaxSettingsPage } from './pages/TaxSettingsPage';
import { VendorRegistrationsPage } from './pages/VendorRegistrationsPage';
import { POSDashboardPage } from './pages/POSDashboardPage';

import { AnalyticsPage } from './pages/AnalyticsPage';
import { SupportPage } from './pages/SupportPage';

import { CampaignsPage } from './pages/CampaignsPage';
import { AddCampaignPage } from './pages/AddCampaignPage';
import { CouponsPage } from './pages/CouponsPage';
import { AddCouponPage } from './pages/AddCouponPage';
import { AssignedOrdersPage } from './pages/AssignedOrdersPage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { EarningsPage } from './pages/EarningsPage';
import { ZonesPage } from './pages/ZonesPage';
import { AllStoresPage } from './pages/AllStoresPage';
import { AddStorePage } from './pages/AddStorePage';
import { WarehousesPage } from './pages/WarehousesPage';
import { ManagePartnersPage } from './pages/ManagePartnersPage';

import { StorefrontApp } from './pages/storefront/StorefrontApp';
import { marketplaceStore, useMarketplaceData } from './lib/store';
import { Store, ShieldAlert, User, ChevronUp, ChevronDown, Check, Sparkles, ShoppingCart, Package, ArrowLeft } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => sessionStorage.getItem('adminAuth') === 'true');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);

  // Subscribe to reactive store states
  const companyName = useMarketplaceData('companyName', () => marketplaceStore.getCompanyName());
  const products = useMarketplaceData('products', () => marketplaceStore.getProducts());
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());

  // Listen to path changes natively and from intercepted link clicks
  useEffect(() => {
    // Automatically and safely trigger Supabase synchronization on application load
    marketplaceStore.syncAllFromSupabase().catch(console.error);

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);

      if (window.location.pathname === '/admin') {
        const searchParams = new URLSearchParams(window.location.search);
        const pageParam = searchParams.get('page');
        if (pageParam) {
          setActivePage(pageParam);
        } else {
          setActivePage('Dashboard');
        }
      }
    };

    // Initial check on mount
    handleLocationChange();

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('/')) {
          e.preventDefault();
          window.history.pushState(null, '', href);
          setCurrentPath(href);
          if (href === '/admin') {
            const searchParams = new URLSearchParams(window.location.search);
            const pageParam = searchParams.get('page');
            setActivePage(pageParam || 'Dashboard');
          }
        }
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    document.addEventListener('click', handleAnchorClick);

    // Code Protection & Anti-Inspect Security Handler
    const handleContextMenu = (e: MouseEvent) => {
      const isProtected = localStorage.getItem('wikcart_code_protection') !== 'false';
      if (isProtected) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isProtected = localStorage.getItem('wikcart_code_protection') !== 'false';
      if (!isProtected) return;

      // Block F12 (Inspect)
      if (e.key === 'F12') {
        e.preventDefault();
      }

      // Block Ctrl+Shift+I / Cmd+Opt+I (Developer Tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
      }

      // Block Ctrl+Shift+J / Cmd+Opt+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
      }

      // Block Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }

      // Block Ctrl+S / Cmd+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Custom path navigator for programmatic redirection
    const handleCustomNavigate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail === 'string') {
        window.history.pushState(null, '', customEvent.detail);
        setCurrentPath(customEvent.detail);
      }
    };
    window.addEventListener('navigate', handleCustomNavigate);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleAnchorClick);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('navigate', handleCustomNavigate);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  const handleAdminNavigate = (newPage: string) => {
    setActivePage(newPage);
    if (window.location.pathname === '/admin') {
      const url = `/admin?page=${encodeURIComponent(newPage)}`;
      window.history.pushState({ page: newPage }, '', url);
    }
  };

  const LogoText = () => (
    <div className="font-bold text-xl tracking-tight text-slate-900 flex items-center cursor-pointer" onClick={() => navigateTo('/')}>
      <span className="text-blue-600 mr-1">{companyName.substring(0, Math.ceil(companyName.length / 2))}</span>
      <span>{companyName.substring(Math.ceil(companyName.length / 2))}</span>
    </div>
  );

  // Router rendering switch board
  const renderContent = () => {
    if (currentPath === '/seller') {
      return <SellerPanel />;
    }

    if (currentPath === '/vendor-registration') {
      return (
        <div className="min-h-screen bg-slate-50">
          <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
            <LogoText />
            <button onClick={() => navigateTo('/')} className="text-sm font-medium text-slate-500 hover:text-slate-900">Back to Store</button>
          </div>
          <VendorRegistrationPage />
        </div>
      );
    }

    if (currentPath === '/vendor-login') {
      return (
        <div className="min-h-screen bg-slate-50">
          <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
            <LogoText />
            <button onClick={() => navigateTo('/')} className="text-sm font-medium text-slate-500 hover:text-slate-900">Back to Store</button>
          </div>
          <VendorLoginPage />
        </div>
      );
    }

    if (currentPath === '/customer-registration') {
      return (
        <div className="min-h-screen bg-slate-50">
          <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
            <LogoText />
            <button onClick={() => navigateTo('/')} className="text-sm font-medium text-slate-500 hover:text-slate-900">Back to Store</button>
          </div>
          <CustomerRegistrationPage />
        </div>
      );
    }

    if (currentPath !== '/admin') {
      return <StorefrontApp />;
    }

    // Admin Authenticated View
    if (!isAdminAuthenticated) {
      return <AdminLoginPage onLogin={() => {
        sessionStorage.setItem('adminAuth', 'true');
        setIsAdminAuthenticated(true);
      }} />;
    }

    const handleAdminLogout = () => {
      sessionStorage.removeItem('adminAuth');
      setIsAdminAuthenticated(false);
    };

    return (
      <div className="flex min-h-screen bg-slate-50 relative overflow-x-hidden">
        <Sidebar 
          activePage={activePage} 
          onNavigate={handleAdminNavigate} 
          mobileOpen={isAdminSidebarOpen}
          onClose={() => setIsAdminSidebarOpen(false)}
          onLogout={handleAdminLogout}
        />
        {isAdminSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setIsAdminSidebarOpen(false)}
          />
        )}
        <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
          <Header 
            onSettingsClick={() => handleAdminNavigate('General Settings')} 
            onMenuClick={() => setIsAdminSidebarOpen(true)}
            onLogout={handleAdminLogout}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
            {activePage !== 'Dashboard' && (
              <div className="mb-6 flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-3 px-4 shadow-xs animate-in fade-in duration-300">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button 
                    onClick={() => {
                      if (window.history.length > 1) {
                        window.history.back();
                      } else {
                        handleAdminNavigate('Dashboard');
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
                      onClick={() => handleAdminNavigate('Dashboard')} 
                      className="hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      Dashboard
                    </button>
                    <span>/</span>
                    <span className="font-bold text-slate-900 truncate">{activePage}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAdminNavigate('Dashboard')}
                  className="hidden sm:block text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-blue-200/60"
                >
                  Dashboard
                </button>
              </div>
            )}

            {activePage === 'Dashboard' ? (
              <Dashboard onNavigate={handleAdminNavigate} />
            ) : activePage === 'All Products' || activePage === 'Products' ? (
              <AllProductsPage onNavigate={handleAdminNavigate} />
            ) : activePage === 'Add Product' ? (
              <AddProductPage onNavigate={handleAdminNavigate} />
            ) : activePage === 'Brands' ? (
              <BrandsPage />
            ) : activePage === 'Variants' ? (
              <VariantsPage />
            ) : activePage === 'All Categories' ? (
              <CategoriesPage />
            ) : activePage === 'Sub Categories' ? (
              <SubCategoriesPage />
            ) : activePage === 'Attributes' ? (
              <AttributesPage />
            ) : activePage === 'Orders' ? (
              <OrdersPage />
            ) : activePage === 'Dispatch Management' ? (
              <DispatchManagementPage />
            ) : activePage === 'Warehouses' || activePage === 'Warehouses Management' ? (
              <WarehousesPage />
            ) : activePage === 'Add Seller' ? (
              <AddSellerPage />
            ) : activePage === 'Add Customer' ? (
              <CustomerRegistrationPage />
            ) : activePage === 'All Sellers' ? (
              <AllSellersPage />
            ) : activePage === 'Vendor Inventory' ? (
              <VendorInventoryPage />
            ) : activePage === 'View Customers' ? (
              <ViewCustomersPage />
            ) : activePage === 'Addresses' ? (
              <CustomerAddressesPage />
            ) : activePage === 'Transactions' ? (
              <CustomerTransactionsPage />
            ) : activePage === 'Wallet Transactions' ? (
              <WalletTransactionsPage />
            ) : activePage === 'Manage Return Requests' ? (
              <ManageReturnRequestsPage />
            ) : activePage === 'Reasons For return' ? (
              <ReturnReasonsPage />
            ) : activePage === 'Referral System' ? (
              <ReferralsPage />
            ) : activePage === 'Campaigns' ? (
              <CampaignsPage onNavigate={handleAdminNavigate} />
            ) : activePage === 'Coupons' ? (
              <CouponsPage onNavigate={handleAdminNavigate} />
            ) : activePage === 'Assigned Orders' ? (
              <AssignedOrdersPage />
            ) : activePage === 'Manage Partners' ? (
              <ManagePartnersPage />
            ) : activePage === 'Live Tracking' ? (
              <LiveTrackingPage />
            ) : activePage === 'Earnings' ? (
              <EarningsPage />
            ) : activePage === 'Zones' ? (
              <ZonesPage />
            ) : activePage === 'Analytics' ? (
              <AnalyticsPage />
            ) : activePage === 'Support' ? (
              <SupportPage />
            ) : activePage === 'Add New Campaign' ? (
              <AddCampaignPage onBack={() => handleAdminNavigate('Campaigns')} />
            ) : activePage === 'Add Coupon' ? (
              <AddCouponPage onBack={() => handleAdminNavigate('Coupons')} />
            ) : activePage === 'All Stores' ? (
              <AllStoresPage />
            ) : activePage === 'Add Store' ? (
              <AddStorePage onNavigate={handleAdminNavigate} />
            ) : activePage === 'Commission Report' ? (
              <CommissionReportPage />
            ) : activePage === 'Withdrawals' ? (
              <WithdrawalsPage />
            ) : activePage === 'Tax Settings' ? (
              <TaxSettingsPage />
            ) : activePage === 'General Settings' ? (
              <SettingsPage />
            ) : activePage === 'POS Dashboard' ? (
              <POSDashboardPage />
            ) : activePage === 'Vendor Registration Form' ? (
              <VendorRegistrationsPage />
            ) : (
              <PagePlaceholder pageName={activePage} />
            )}
          </main>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {renderContent()}

      {/* FLOATING PORTAL SWITCHER BAR */}
      <div className="fixed bottom-6 left-6 z-[99] animate-in slide-in-from-bottom-6 duration-500">
        <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 max-w-sm sm:max-w-md">
          {/* Header Bar */}
          <button 
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="w-full px-5 py-3.5 flex items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 to-slate-900 font-semibold text-sm cursor-pointer hover:bg-slate-800/85 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Multi-Portal Panel Switcher</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-blue-600/50 text-blue-200 px-2 py-0.5 rounded-full border border-blue-500/30">Active</span>
              {isSwitcherOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {/* Expanded Drawer */}
          {isSwitcherOpen && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {/* Storefront Button */}
                <button 
                  onClick={() => { navigateTo('/'); setIsSwitcherOpen(false); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    currentPath === '/' 
                      ? 'bg-blue-600/20 border-blue-500 text-white' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <Store className="w-5 h-5 mb-1.5 text-blue-400" />
                  <span className="text-xs font-bold block">Storefront</span>
                  <span className="text-[9px] opacity-60 mt-0.5">{products.length} Items</span>
                </button>

                {/* Admin Button */}
                <button 
                  onClick={() => { navigateTo('/admin'); setIsSwitcherOpen(false); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    currentPath === '/admin' 
                      ? 'bg-amber-600/20 border-amber-500 text-white' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <ShieldAlert className="w-5 h-5 mb-1.5 text-amber-400" />
                  <span className="text-xs font-bold block">Admin Dashboard</span>
                  <span className="text-[9px] opacity-60 mt-0.5">{sellers.length} Sellers</span>
                </button>

                {/* Seller Button */}
                <button 
                  onClick={() => { navigateTo('/seller'); setIsSwitcherOpen(false); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    currentPath === '/seller' 
                      ? 'bg-emerald-600/20 border-emerald-500 text-white' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <User className="w-5 h-5 mb-1.5 text-emerald-400" />
                  <span className="text-xs font-bold block">Seller Panel</span>
                  <span className="text-[9px] opacity-60 mt-0.5">{orders.length} Orders</span>
                </button>
              </div>

              {/* Utility Subsections */}
              <div className="space-y-2 border-t border-slate-800/80 pt-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">Logins & Account Flows</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button 
                    onClick={() => { navigateTo('/customer-registration'); setIsSwitcherOpen(false); }}
                    className={`py-2 px-3 rounded-lg border text-left flex items-center justify-between ${
                      currentPath === '/customer-registration' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-900/30 border-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Customer Portal</span>
                    {currentPath === '/customer-registration' && <Check className="w-3 h-3 text-blue-400" />}
                  </button>
                  <button 
                    onClick={() => { navigateTo('/vendor-login'); setIsSwitcherOpen(false); }}
                    className={`py-2 px-3 rounded-lg border text-left flex items-center justify-between ${
                      currentPath === '/vendor-login' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-900/30 border-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Vendor Login</span>
                    {currentPath === '/vendor-login' && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                  <button 
                    onClick={() => { navigateTo('/vendor-registration'); setIsSwitcherOpen(false); }}
                    className={`py-2 px-3 rounded-lg border text-left flex items-center justify-between ${
                      currentPath === '/vendor-registration' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-900/30 border-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Vendor Signup</span>
                    {currentPath === '/vendor-registration' && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                  <button 
                    onClick={() => { navigateTo('/admin'); setIsSwitcherOpen(false); }}
                    className="py-2 px-3 rounded-lg border border-slate-900 bg-slate-900/30 text-slate-400 hover:text-white text-left flex items-center justify-between"
                  >
                    <span>Admin Login Screen</span>
                  </button>
                </div>
              </div>

              {/* Admin login bypass button */}
              <div className="bg-slate-900 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-200">Admin Bypass Mode</p>
                  <p className="text-[10px] text-slate-400">Force authenticate Admin panel</p>
                </div>
                <button
                  onClick={() => {
                    if (isAdminAuthenticated) {
                      sessionStorage.removeItem('adminAuth');
                      setIsAdminAuthenticated(false);
                    } else {
                      sessionStorage.setItem('adminAuth', 'true');
                      setIsAdminAuthenticated(true);
                      navigateTo('/admin');
                    }
                  }}
                  className={`py-1.5 px-3 rounded-lg font-bold text-xs transition-colors ${
                    isAdminAuthenticated 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isAdminAuthenticated ? 'De-authorize' : 'Authenticate'}
                </button>
              </div>

              {/* Real-time sync statistics banner */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80">
                <span className="flex items-center gap-1"><Package className="w-3 h-3 text-slate-600" /> {products.length} Products</span>
                <span className="flex items-center gap-1"><ShoppingCart className="w-3 h-3 text-slate-600" /> {orders.length} Live Orders</span>
                <span className="flex items-center gap-1"><Store className="w-3 h-3 text-slate-600" /> {sellers.length} Stores</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
