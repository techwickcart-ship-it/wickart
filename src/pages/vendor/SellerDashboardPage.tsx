import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { ShoppingCart, DollarSign, Package, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';

export function SellerDashboardPage() {
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const products = useMarketplaceData('products', () => marketplaceStore.getProducts());

  const { activeSellerStoreName, activeSellerId } = useActiveSellerStore();

  // Filter dynamic metrics for the logged-in store
  const storeOrders = orders.filter(o => 
    o.store && o.store.trim().toLowerCase() === activeSellerStoreName.trim().toLowerCase()
  );

  const storeProducts = products.filter(p => {
    const vendorMatch = Boolean(p.vendor && p.vendor.trim().toLowerCase() === activeSellerStoreName.trim().toLowerCase());
    const idMatch = Boolean(p.sellerId && String(p.sellerId) === String(activeSellerId));
    return vendorMatch || idMatch;
  });

  const totalSalesVal = storeOrders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => {
      const num = parseFloat(o.amount.replace(/[^0-9.]/g, '')) || 0;
      return acc + num;
    }, 0);

  const pendingOrders = storeOrders.filter(o => o.status === 'Pending');
  const deliveredOrders = storeOrders.filter(o => o.status === 'Delivered');

  const stats = [
    { title: 'Total Sales', value: `₹ ${totalSalesVal.toLocaleString('en-IN')}`, change: deliveredOrders.length > 0 ? '+14.5%' : 'Live', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'New Orders', value: String(pendingOrders.length), change: pendingOrders.length > 0 ? `${pendingOrders.length} Pending` : 'Up to date', icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Active Products', value: String(storeProducts.length), change: storeProducts.length > 0 ? 'Catalog Active' : 'No Items Yet', icon: Package, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Order Fulfillment', value: storeOrders.length > 0 ? `${Math.round((deliveredOrders.length / (storeOrders.length || 1)) * 100)}%` : '100%', change: 'Normal', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Dynamic Header Welcome Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold mb-3 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Real-time Vendor Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Dashboard for <span className="text-blue-400">{activeSellerStoreName}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Track customer bookings, live catalog listings, and order fulfillment specifically for your registered business.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-2">
          <a href="/seller" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('nav_vendor', { detail: 'My Products' })); }} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md">
            Manage Products ({storeProducts.length})
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mt-1">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{stat.change}</span>
                <span className="text-slate-400 ml-2">For {activeSellerStoreName}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overview & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="min-h-[300px]">
           <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
               <TrendingUp className="w-8 h-8" />
             </div>
             <h3 className="font-bold text-slate-900 text-lg mb-1">Live Performance Overview</h3>
             <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
               Showing real-time sales for <strong className="text-slate-800">{activeSellerStoreName}</strong>. You have received <strong className="text-blue-600">{storeOrders.length} order(s)</strong> total.
             </p>
             <div className="mt-6 flex items-center gap-4 text-xs font-bold text-slate-600">
               <span className="bg-slate-100 px-3 py-1.5 rounded-lg">Catalog: {storeProducts.length} Items</span>
               <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">Status: Active Seller</span>
             </div>
           </CardContent>
         </Card>

         <Card className="min-h-[300px]">
           <CardContent className="p-6">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-900">Recent Store Orders</h3>
               <span className="text-xs font-bold text-slate-500">{storeOrders.length} Orders</span>
             </div>
             
             {storeOrders.length === 0 ? (
               <div className="py-12 text-center text-slate-400 space-y-2">
                 <ShoppingCart className="w-8 h-8 mx-auto text-slate-300" />
                 <p className="text-sm font-semibold text-slate-600">No customer orders placed yet for {activeSellerStoreName}.</p>
                 <p className="text-xs text-slate-400">When customers place orders on the storefront for your store, they will appear here in real time.</p>
               </div>
             ) : (
               <div className="space-y-3">
                   {storeOrders.slice(0, 5).map(o => (
                      <div key={o.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl hover:bg-slate-100/70 transition-colors border border-slate-100">
                         <div>
                            <p className="font-bold text-blue-600 text-sm">{o.id}</p>
                            <p className="text-xs text-slate-500 font-medium">{o.customer} • <strong className="text-slate-800">{o.amount}</strong></p>
                         </div>
                         <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${
                           o.status === 'Pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                           o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                           'bg-blue-100 text-blue-700 border border-blue-200'
                         }`}>{o.status}</span>
                      </div>
                   ))}
               </div>
             )}
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
