import React from 'react';
import { 
  Building2, 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  Star,
  AlertCircle,
  ArrowRight,
  Wallet,
  Download
} from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const products = useMarketplaceData('products', () => marketplaceStore.getProducts());
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());
  const customers = useMarketplaceData('customers', () => marketplaceStore.getCustomers());
  const deliveryPartners = useMarketplaceData('deliveryPartners', () => marketplaceStore.getDeliveryPartners());
  const vendorRegistrations = useMarketplaceData('vendorRegistrations', () => marketplaceStore.getVendorRegistrations());
  const globalInventory = useMarketplaceData('globalInventory', () => marketplaceStore.getGlobalInventory());

  // Dynamic KPI Metric calculations
  const totalOrderRevenue = orders.reduce((acc, o) => {
    if (o.status === 'Cancelled') return acc;
    const revVal = parseFloat(o.amount.replace(/[^0-9.]/g, '')) || 0;
    return acc + revVal;
  }, 0);

  const totalSellerRevenue = sellers.reduce((acc, s) => {
    const revVal = parseFloat(s.revenue.replace(/[^0-9.]/g, '')) || 0;
    return acc + revVal;
  }, 0);

  const totalRevenueNum = Math.max(totalOrderRevenue, totalSellerRevenue);
  const totalRevenue = `₹${totalRevenueNum.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const activeOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Out for Delivery').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const listedProductsCount = products.length;
  const activeSellersCount = sellers.filter(s => s.status === 'Active' || !s.status).length;

  const totalWalletNum = customers.reduce((acc, c) => acc + (c.walletBalance || 0), 0) || 45200;
  const totalWalletBalance = `₹${totalWalletNum.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  // Dynamic Alerts & Action Items
  const unassignedOrders = orders.filter(o => (o.status === 'Pending' || o.status === 'Confirmed') && !o.deliveryPartnerId);
  const pendingVendorApps = vendorRegistrations.filter(v => v.status === 'Pending').length + sellers.filter(s => s.status === 'Pending').length;
  const lowStockCount = products.filter(p => (p as any).stock !== undefined && (p as any).stock < 10).length + globalInventory.filter(i => i.stock < 10).length;
  const activeDeliveryCount = deliveryPartners.filter(dp => dp.status === 'Active').length;

  // CSV Report Exporter
  const handleDownloadReport = () => {
    const reportData = [
      ['Marketplace Executive Summary'],
      ['Generated Date', new Date().toLocaleString()],
      ['Total Revenue', totalRevenue],
      ['Total Orders', orders.length],
      ['Active Orders', activeOrdersCount],
      ['Delivered Orders', deliveredCount],
      ['Registered Sellers', sellers.length],
      ['Listed Products', listedProductsCount],
      ['Total Customers', customers.length],
      ['Active Delivery Partners', activeDeliveryCount],
      [],
      ['Recent Orders Breakdown'],
      ['Order ID', 'Customer', 'Store', 'Amount', 'Status', 'Date'],
      ...orders.slice(0, 20).map(o => [o.id, o.customer, o.store, o.amount, o.status, o.date])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + reportData.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wikcart_marketplace_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:px-8 sm:py-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden">
        <div className="z-10 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome Back, <span className="text-blue-600">Admin</span>
          </h1>
          <p className="text-slate-500 max-w-xl text-sm">
            Here's what's happening with your marketplace today. You have <strong className="text-slate-900">{sellers.length}</strong> registered sellers and <strong className="text-slate-900">{activeOrdersCount}</strong> live active orders.
          </p>
        </div>
        
        {/* Abstract decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none hidden md:block"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 -bottom-10 w-32 h-32 bg-teal-100/50 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="z-10 flex gap-3">
          <button 
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-blue-600/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <StatCard 
          title="Total Revenue" 
          value={totalRevenue} 
          subtitle="Combined store earnings"
          icon={TrendingUp}
          highlightColor="teal"
          trend={{ value: 14.2, isPositive: true }}
        />
        <StatCard 
          title="Active Orders" 
          value={String(activeOrdersCount)} 
          subtitle={`${deliveredCount} delivered successfully`}
          icon={ShoppingCart}
          highlightColor="blue"
        />
        <StatCard 
          title="Active Vendors" 
          value={String(activeSellersCount)} 
          subtitle={`${sellers.length} total stores`}
          icon={Building2}
          highlightColor="amber"
          trend={{ value: sellers.length > 0 ? 25 : 0, isPositive: true }}
        />
        <StatCard 
          title="Listed Products" 
          value={String(listedProductsCount)} 
          subtitle="Catalog active items"
          icon={Package}
          highlightColor="slate"
        />
        <StatCard 
          title="Wallet Credits" 
          value={totalWalletBalance} 
          subtitle="Referral & bonus credits"
          icon={Wallet}
          highlightColor="teal"
          trend={{ value: 12.5, isPositive: true }}
        />
      </div>

      {/* Dynamic Alerts Row */}
      <div className="grid grid-cols-1 gap-6">
         <Card className="border-rose-100 shadow-sm shadow-rose-100/50">
            <CardHeader className="bg-rose-50/50 border-b border-rose-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                     <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                     <CardTitle className="text-rose-900">Alerts & Action Items</CardTitle>
                     <p className="text-sm text-rose-600/80 mt-0.5">Real-time dynamic system notifications</p>
                  </div>
                </div>
                <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {(unassignedOrders.length > 0 ? 1 : 0) + (pendingVendorApps > 0 ? 1 : 0) + (lowStockCount > 0 ? 1 : 0) + (activeDeliveryCount === 0 ? 1 : 0)} Action Items
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-rose-100/50">
                  {/* Unassigned orders alert */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${unassignedOrders.length > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                        <p className="text-sm font-medium text-slate-800">
                          {unassignedOrders.length > 0 
                            ? `${unassignedOrders.length} order(s) pending delivery partner assignment.` 
                            : 'All active orders are assigned to delivery partners.'}
                        </p>
                     </div>
                     <button 
                      onClick={() => onNavigate && onNavigate('Dispatch Management')}
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                     >
                        View Dispatch <ArrowRight className="w-3.5 h-3.5" />
                     </button>
                  </div>

                  {/* Pending Vendor Registrations alert */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${pendingVendorApps > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                        <p className="text-sm font-medium text-slate-800">
                          {pendingVendorApps > 0 
                            ? `${pendingVendorApps} seller application(s) pending verification & approval.` 
                            : 'All seller onboarding applications processed.'}
                        </p>
                     </div>
                     <button 
                      onClick={() => onNavigate && onNavigate('Vendor Registration Form')}
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                     >
                        View Onboarding <ArrowRight className="w-3.5 h-3.5" />
                     </button>
                  </div>

                  {/* Low Stock alert */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${lowStockCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                        <p className="text-sm font-medium text-slate-800">
                          {lowStockCount > 0 
                            ? `${lowStockCount} product(s) low on stock (< 10 units remaining).` 
                            : 'Inventory levels healthy across catalog.'}
                        </p>
                     </div>
                     <button 
                      onClick={() => onNavigate && onNavigate('Vendor Inventory')}
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                     >
                        View Inventory <ArrowRight className="w-3.5 h-3.5" />
                     </button>
                  </div>

                  {/* Delivery partner fleet status */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${activeDeliveryCount > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <p className="text-sm font-medium text-slate-800">
                          {activeDeliveryCount > 0 
                            ? `${activeDeliveryCount} delivery partners active and available for dispatch.` 
                            : 'No active delivery partners configured.'}
                        </p>
                     </div>
                     <button 
                      onClick={() => onNavigate && onNavigate('Manage Partners')}
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                     >
                        Manage Fleet <ArrowRight className="w-3.5 h-3.5" />
                     </button>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Charts & Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        
        {/* Dynamic Top Sellers Column */}
        <Card className="col-span-1 lg:col-span-1 border border-slate-200">
          <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Top Sellers</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Ranked by revenue & order volume</p>
            </div>
            <button 
              onClick={() => onNavigate && onNavigate('All Sellers')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              View All
            </button>
          </CardHeader>
          <CardContent className="p-5">
            {sellers.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                <div>
                  <p className="text-sm font-bold text-slate-700">No stores registered yet</p>
                  <p className="text-xs text-slate-400">Add sellers to see store performance metrics.</p>
                </div>
                <button 
                  onClick={() => onNavigate && onNavigate('Add Seller')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  + Add First Seller
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {sellers.slice(0, 5).map((seller, i) => {
                  const sellerOrders = orders.filter(o => o.store === seller.storeName || o.store === seller.name).length || seller.orders || 0;
                  return (
                    <div key={seller.id || i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3 min-w-0">
                        {seller.storeLogo ? (
                          <img src={seller.storeLogo} alt={seller.storeName} className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0 border border-slate-200">
                            {(seller.storeName || seller.name || 'ST').substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p 
                            onClick={() => onNavigate && onNavigate('All Sellers')}
                            className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer truncate"
                          >
                            {seller.storeName || seller.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500 font-medium">{sellerOrders} Orders</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <div className="flex items-center text-amber-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs ml-1 font-semibold">{seller.rating || 4.5}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-slate-900">{seller.revenue || '₹0'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {sellers.length > 0 && (
              <button 
                onClick={() => onNavigate && onNavigate('All Sellers')}
                className="w-full mt-6 py-2.5 text-xs text-blue-600 font-bold hover:bg-blue-50 border border-blue-200/60 rounded-xl transition-colors cursor-pointer"
              >
                View All Sellers ({sellers.length})
              </button>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

