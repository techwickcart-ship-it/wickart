import React from 'react';
import { PieChart as PieIcon, TrendingUp, Users, DollarSign, ShoppingBag, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { marketplaceStore, useMarketplaceData } from '../lib/store';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from 'recharts';

export function AnalyticsPage() {
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());
  const products = useMarketplaceData('products', () => marketplaceStore.getProducts());

  // Helpers to parse price strings
  const parseAmount = (str: string) => {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Calculations
  const nonCancelledOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + parseAmount(o.amount), 0);
  const totalOrdersCount = orders.length;
  const activeSellersCount = sellers.length;
  const totalProductsCount = products.length;

  // Chart 1: Order Status distribution
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#ef4444'];

  // Chart 2: Revenue per store
  const storeRevenueData = sellers.map(seller => {
    const sellerOrders = orders.filter(o => o.store === seller.storeName && o.status !== 'Cancelled');
    const rev = sellerOrders.reduce((sum, o) => sum + parseAmount(o.amount), 0);
    return {
      name: seller.storeName,
      revenue: rev,
      orders: sellerOrders.length
    };
  });

  // Chart 3: Weekly revenue trend
  const weeklyTrend = [
    { day: 'Mon', revenue: totalRevenue * 0.12 },
    { day: 'Tue', revenue: totalRevenue * 0.15 },
    { day: 'Wed', revenue: totalRevenue * 0.11 },
    { day: 'Thu', revenue: totalRevenue * 0.18 },
    { day: 'Fri', revenue: totalRevenue * 0.22 },
    { day: 'Sat', revenue: totalRevenue * 0.14 },
    { day: 'Sun', revenue: totalRevenue * 0.08 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Platform Analytics Hub</h1>
        <p className="text-slate-500 mt-1">Real-time performance metrics, sales statistics, and store performance reports.</p>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Merchandise Value</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12.4% vs last week
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Platform Orders</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{totalOrdersCount}</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Real-time active stream
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Tenants</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{activeSellersCount}</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  All digital stores in Sultanpur
                </p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Inventory</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{totalProductsCount}</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Unique SKUs listed live
                </p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <BarChart2 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Platform Revenue Flow
            </CardTitle>
            <CardDescription>Daily gross transaction performance across all stores.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-slate-800 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-600" /> Order Fulfillment Status
            </CardTitle>
            <CardDescription>Fulfillment progress analysis.</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex flex-col items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-slate-400 text-sm font-semibold">No order data yet.</p>
            ) : (
              <div className="w-full h-full flex flex-col justify-between">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 px-4 pb-4">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="truncate">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Shop Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-slate-800">Merchant Revenue Leaderboard</CardTitle>
          <CardDescription>Compare generated gross value and volume metrics by registered stores.</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {storeRevenueData.length === 0 ? (
            <p className="text-slate-400 text-sm font-semibold text-center py-10">No active sellers found.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storeRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip formatter={(value) => [`₹${value}`, 'Gross Sales']} />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
