import React, { useState, useEffect } from 'react';
import { navigateTo } from '../../lib/navigation';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Package,
  Users,
  Store,
  MapPin,
  Megaphone,
  CreditCard,
  MessageSquare,
  Settings,
  ShieldCheck,
  Bike,
  PieChart,
  Tag,
  Headset,
  ChevronDown,
  RotateCcw,
  LogOut,
  Building2
} from 'lucide-react';

const navGroups = [
  {
    title: 'OVERVIEW',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard },
      { name: 'POS Dashboard', icon: CreditCard },
    ]
  },
  {
    title: 'ORDER MANAGEMENT',
    items: [
      { name: 'Orders', icon: ShoppingCart },
      { name: 'Return Requests', icon: RotateCcw, hasSubmenu: true, subItems: ['Manage Return Requests', 'Reasons For return'] },
      { name: 'Dispatch Management', icon: Truck },
      { name: 'Warehouses', icon: Building2 },
    ]
  },
  {
    title: 'CATALOG',
    items: [
      { name: 'Categories', icon: Tag, hasSubmenu: true, subItems: ['All Categories', 'Sub Categories'] },
      { name: 'Products', icon: Package, hasSubmenu: true, subItems: ['All Products', 'Add Product', 'Attributes', 'Variants'] },
      { name: 'Brands', icon: ShieldCheck },
    ]
  },
  {
    title: 'PEOPLE',
    items: [
      { name: 'Customers', icon: Users, hasSubmenu: true, subItems: ['View Customers', 'Add Customer', 'Addresses', 'Transactions', 'Wallet Transactions', 'Referral System'] },
      { name: 'Seller Management', icon: Store, hasSubmenu: true, subItems: ['All Sellers', 'Add Seller', 'Vendor Registration Form', 'Vendor Inventory', 'Seller Approvals', 'Verification (KYC)', 'Subscriptions', 'Commission Report', 'Withdrawals'] },
      { name: 'Stores', icon: Store, hasSubmenu: true, subItems: ['All Stores', 'Add Store'] },
      { name: 'Delivery Boys', icon: Bike, hasSubmenu: true, subItems: ['Manage Partners', 'Assigned Orders', 'Live Tracking', 'Earnings', 'Zones'] },
    ]
  },
  {
    title: 'MARKETING',
    items: [
      { name: 'Campaigns', icon: Megaphone },
      { name: 'Coupons', icon: Tag },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { name: 'Analytics', icon: PieChart },
      { name: 'Support', icon: Headset },
      { name: 'Settings', icon: Settings, hasSubmenu: true, subItems: ['General Settings', 'Tax Settings', 'Payment Gateways'] },
    ]
  }
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  mobileOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export function Sidebar({ activePage, onNavigate, mobileOpen, onClose, onLogout }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'Categories': true,
    'Products': true
  });
  const [companyName, setCompanyName] = useState('Hyperlocal');

  useEffect(() => {
    const handleSettingsUpdate = () => {
      const name = localStorage.getItem('companyName');
      if (name) setCompanyName(name);
    };

    handleSettingsUpdate();
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleItemClick = (pageName: string) => {
    onNavigate(pageName);
    onClose?.();
  };

  return (
    <aside className={cn(
      "fixed top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col z-50 shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out md:translate-x-0 md:flex",
      mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0 sticky top-0 bg-slate-900/95 backdrop-blur z-10 cursor-pointer" onClick={() => handleItemClick('Dashboard')}>
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl">
            {companyName.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-lg tracking-tight truncate max-w-[150px]" title={companyName}>{companyName}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {group.title}
            </div>
            <nav className="space-y-0.5">
              {group.items.map((item, i) => {
                const Icon = item.icon;
                const isOpen = openMenus[item.name];
                const isParentActive = activePage === item.name || (item.subItems && item.subItems.includes(activePage));
                
                return (
                  <div key={i}>
                    <button
                      onClick={() => {
                        if (item.hasSubmenu) {
                          toggleMenu(item.name);
                        } else {
                          handleItemClick(item.name);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors outline-none",
                        isParentActive && !item.hasSubmenu
                          ? "bg-blue-600 text-white font-medium shadow-sm" 
                          : isParentActive
                          ? "text-white"
                          : "hover:bg-slate-800 hover:text-white text-slate-400"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 shrink-0", isParentActive ? "text-blue-200" : "text-slate-400")} />
                      <span className="truncate">{item.name}</span>
                      {item.hasSubmenu && (
                        <ChevronDown 
                          className={cn(
                            "w-4 h-4 ml-auto opacity-50 shrink-0 transition-transform duration-200",
                            isOpen && "rotate-180"
                          )} 
                        />
                      )}
                    </button>
                    
                    {/* Submenu */}
                    {item.hasSubmenu && isOpen && item.subItems && (
                      <div className="mt-1 mb-2 space-y-1 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                        {item.subItems.map((sub, j) => {
                          const isSubActive = activePage === sub;
                          return (
                            <button
                              key={j}
                              onClick={() => handleItemClick(sub)}
                              className={cn(
                                "w-full flex text-left pl-10 pr-3 py-2 text-sm rounded-lg transition-colors outline-none",
                                isSubActive
                                  ? "text-white bg-slate-800/80 font-medium"
                                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                              )}
                            >
                              <span className="truncate">{sub}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Admin Logout Button */}
      <div className="p-3 border-t border-slate-800 shrink-0 sticky bottom-0 bg-slate-900/95 backdrop-blur z-10">
        <button
          onClick={() => {
            sessionStorage.removeItem('adminAuth');
            if (onLogout) {
              onLogout();
            } else {
              navigateTo('/admin');
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Admin Logout</span>
        </button>
      </div>
    </aside>
  );
}
