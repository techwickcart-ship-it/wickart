import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';

export function RevenueChart() {
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());

  // Generate dynamic date timeline for the past 14 days
  const chartData = React.useMemo(() => {
    const daysMap = new Map<string, { date: string; revenue: number; orders: number }>();
    const today = new Date();

    // Create 14 day baseline
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      daysMap.set(label, { date: label, revenue: 0, orders: 0 });
    }

    // Populate actual orders
    orders.forEach(ord => {
      if (ord.status === 'Cancelled') return;
      const numAmt = parseFloat(ord.amount.replace(/[^0-9.]/g, '')) || 0;

      // Try matching by formatted date
      let matchedKey: string | undefined;
      for (const key of daysMap.keys()) {
        if (ord.date && (ord.date.includes(key) || ord.date.toLowerCase().includes(key.toLowerCase()))) {
          matchedKey = key;
          break;
        }
      }

      if (!matchedKey && ord.date) {
        try {
          const parsed = new Date(ord.date);
          if (!isNaN(parsed.getTime())) {
            const label = parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            if (daysMap.has(label)) {
              matchedKey = label;
            }
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      // If order date falls within the 14 days
      if (matchedKey && daysMap.has(matchedKey)) {
        const item = daysMap.get(matchedKey)!;
        item.revenue += numAmt;
        item.orders += 1;
      } else if (daysMap.size > 0) {
        // Fallback to today / most recent slot for live new orders
        const keysArray = Array.from(daysMap.keys());
        const lastKey = keysArray[keysArray.length - 1];
        const item = daysMap.get(lastKey)!;
        item.revenue += numAmt;
        item.orders += 1;
      }
    });

    return Array.from(daysMap.values());
  }, [orders]);

  const totalChartRev = chartData.reduce((acc, d) => acc + d.revenue, 0);
  const totalChartOrders = chartData.reduce((acc, d) => acc + d.orders, 0);

  return (
    <Card className="col-span-1 lg:col-span-2 border border-slate-200">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-2 border-b border-slate-100">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold text-slate-900">Revenue & Order Volume</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Last 14 days: <strong className="text-slate-800">₹{totalChartRev.toLocaleString('en-IN')}</strong> revenue from <strong className="text-slate-800">{totalChartOrders}</strong> orders
          </CardDescription>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-slate-600 font-bold">Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-500"></div>
            <span className="text-xs text-slate-600 font-bold">Revenue</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[280px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} 
                dy={10}
              />
              <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748B' }} 
                tickFormatter={(val) => val >= 1000 ? `₹${(val/1000).toFixed(0)}k` : `₹${val}`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748B' }} 
                allowDecimals={false}
              />
              <Tooltip 
                formatter={(val: any, name: any) => [
                  name === 'revenue' ? `₹${Number(val).toLocaleString('en-IN')}` : val,
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#14B8A6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#14B8A6' }}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="orders" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fill="none" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
