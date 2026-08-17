import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DollarSign, TrendingUp, Percent, Wallet, Calendar, Download, Printer, Filter, ShoppingBag, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';

export function SellerEarningsPage() {
  const { activeSellerStoreName, activeSellerId } = useActiveSellerStore();
  const [datePreset, setDatePreset] = useState<'All' | 'Today' | 'ThisMonth' | 'LastMonth' | 'Custom'>('All');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [search, setSearch] = useState('');

  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());

  const currentSeller = sellers.find(s => s.id === activeSellerId || s.storeName === activeSellerStoreName);
  const walletBalance = currentSeller?.walletBalance || 0;

  // Filter orders for active seller
  const sellerOrders = useMemo(() => {
    return orders.filter(o => {
      if (o.store && o.store.toLowerCase() === activeSellerStoreName.toLowerCase()) return true;
      if (!o.store || o.store === 'Main Store' || o.store === 'City Square Mart') return true;
      return false;
    });
  }, [orders, activeSellerStoreName]);

  const parseAmount = (str: string) => {
    if (!str) return 0;
    const num = parseFloat(String(str).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const handlePresetChange = (preset: 'All' | 'Today' | 'ThisMonth' | 'LastMonth' | 'Custom') => {
    setDatePreset(preset);
    const today = new Date();

    if (preset === 'All') {
      setFromDate('');
      setToDate('');
    } else if (preset === 'Today') {
      const dateStr = today.toISOString().split('T')[0];
      setFromDate(dateStr);
      setToDate(dateStr);
    } else if (preset === 'ThisMonth') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const dateStr = today.toISOString().split('T')[0];
      setFromDate(firstDay);
      setToDate(dateStr);
    } else if (preset === 'LastMonth') {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
      setFromDate(firstDayLastMonth);
      setToDate(lastDayLastMonth);
    }
  };

  const filteredOrders = useMemo(() => {
    return sellerOrders.filter(o => {
      if (search) {
        const s = search.toLowerCase();
        if (!o.id.toLowerCase().includes(s) && !o.customer.toLowerCase().includes(s)) {
          return false;
        }
      }
      return true;
    });
  }, [sellerOrders, search]);

  // Financial calculations
  const totalGrossRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + parseAmount(o.amount), 0);
  }, [filteredOrders]);

  const commissionRate = 0.10; // 10% standard admin fee
  const totalAdminCommission = totalGrossRevenue * commissionRate;
  const netStoreEarnings = totalGrossRevenue - totalAdminCommission;

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Gross Amount (₹)', 'Admin Commission (10%)', 'Net Seller Earning (₹)', 'Status'];
    const rows = filteredOrders.map(o => {
      const gross = parseAmount(o.amount);
      const comm = gross * commissionRate;
      const net = gross - comm;
      return [
        o.id,
        o.date,
        o.customer,
        gross.toFixed(2),
        comm.toFixed(2),
        net.toFixed(2),
        o.status
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeSellerStoreName.replace(/\s+/g, '_')}_earnings_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Earnings & Commission Breakdown
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time financial performance and commission statement for <strong className="text-slate-700">{activeSellerStoreName}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Store Earnings */}
        <div className="p-5 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-500/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Net Store Earnings</span>
            <div className="p-2 bg-white/10 rounded-xl">
              <TrendingUp className="w-4 h-4 text-emerald-100" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-3">₹{netStoreEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-emerald-100/90 mt-1 flex items-center gap-1">
            <span>After 10% marketplace commission deduction</span>
          </p>
        </div>

        {/* Total Gross Sales */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Order Value</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">₹{totalGrossRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-slate-400 mt-1">Across {filteredOrders.length} processed customer orders</p>
        </div>

        {/* Admin Commission */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admin Commission (10%)</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-900 mt-3">₹{totalAdminCommission.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-purple-600 mt-1">Platform service fee</p>
        </div>

        {/* Active Wallet Balance */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wallet Balance</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-950 mt-3">₹{Number(walletBalance).toFixed(2)}</p>
          <p className="text-xs text-amber-700 mt-1">Available for immediate withdrawal</p>
        </div>
      </div>

      {/* Date Filter & Search Controls */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              {(['All', 'Today', 'ThisMonth', 'LastMonth', 'Custom'] as const).map(preset => (
                <button
                  key={preset}
                  onClick={() => handlePresetChange(preset)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    datePreset === preset
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {preset === 'ThisMonth' ? 'This Month' : preset === 'LastMonth' ? 'Last Month' : preset}
                </button>
              ))}
            </div>

            {datePreset === 'Custom' && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
                <span className="text-xs text-slate-400">to</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>
            )}

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search orders or customer..."
                className="w-full pl-3 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Order ID</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Date & Time</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Customer</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Gross Order Value</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Admin Fee (10%)</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Net Payout</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => {
                    const gross = parseAmount(order.amount);
                    const fee = gross * commissionRate;
                    const net = gross - fee;

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 sm:px-6 py-4 font-bold text-blue-600 font-mono">{order.id}</td>
                        <td className="px-4 sm:px-6 py-4 text-slate-500 text-xs">{order.date}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className="font-bold text-slate-900">{order.customer}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 font-mono">
                          ₹{gross.toFixed(2)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-bold text-purple-700 font-mono">
                          -₹{fee.toFixed(2)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-black text-emerald-700 font-mono text-sm">
                          +₹{net.toFixed(2)}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      <DollarSign className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-700">No order settlements found</p>
                      <p className="text-xs text-slate-400 mt-1">Processed orders will appear here with automated commission breakdowns.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
