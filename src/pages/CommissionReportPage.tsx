import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, Download, DollarSign, Store, Calendar, FileText, Printer, Filter } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function CommissionReportPage() {
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const [search, setSearch] = useState('');

  // Date Filter state
  const [datePreset, setDatePreset] = useState<'All' | 'Today' | 'ThisMonth' | 'LastMonth' | 'Custom'>('All');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const parseAmount = (str: string) => {
    if (!str) return 0;
    const num = parseFloat(String(str).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Preset Date Handlers
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

  // Helper to parse order date string to standard timestamp or YYYY-MM-DD
  const parseOrderDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;

    // Fallback for custom formats like "24 Jul 2026, 10:30 AM"
    try {
      const clean = dateStr.split(',')[0].trim(); // "24 Jul 2026"
      const parsed = new Date(clean);
      if (!isNaN(parsed.getTime())) return parsed;
    } catch (e) {
      // ignore
    }
    return null;
  };

  // Dynamic report data filtered by date range
  const reportData = useMemo(() => {
    let startTimestamp = fromDate ? new Date(fromDate + 'T00:00:00').getTime() : null;
    let endTimestamp = toDate ? new Date(toDate + 'T23:59:59').getTime() : null;

    return sellers.map((seller, index) => {
      const sellerOrders = orders.filter(o => {
        if (o.store !== seller.storeName || o.status === 'Cancelled') return false;

        if (startTimestamp || endTimestamp) {
          const oDate = parseOrderDate(o.date);
          if (!oDate) return true; // Keep if undated
          const t = oDate.getTime();
          if (startTimestamp && t < startTimestamp) return false;
          if (endTimestamp && t > endTimestamp) return false;
        }

        return true;
      });

      const totalSalesNum = sellerOrders.reduce((sum, o) => sum + parseAmount(o.amount), 0);
      const commissionNum = totalSalesNum * 0.10; // Flat 10% platform commission

      const periodLabel = fromDate && toDate 
        ? `${fromDate} to ${toDate}`
        : datePreset === 'ThisMonth' ? 'This Month'
        : datePreset === 'LastMonth' ? 'Last Month'
        : datePreset === 'Today' ? 'Today'
        : 'All Time';

      return {
        id: seller.id || String(index + 1),
        store: seller.storeName,
        ordersCount: sellerOrders.length,
        totalSales: totalSalesNum,
        commission: commissionNum,
        period: periodLabel
      };
    });
  }, [sellers, orders, fromDate, toDate, datePreset]);

  const totalGrossSales = useMemo(() => reportData.reduce((sum, r) => sum + r.totalSales, 0), [reportData]);
  const totalAdminCommission = useMemo(() => reportData.reduce((sum, r) => sum + r.commission, 0), [reportData]);
  const totalOrdersCount = useMemo(() => reportData.reduce((sum, r) => sum + r.ordersCount, 0), [reportData]);

  const filteredReports = reportData.filter(r => 
    r.store.toLowerCase().includes(search.toLowerCase())
  );

  // CSV Export Trigger
  const handleExportCSV = () => {
    const headers = ['Store Name', 'Fulfillment Period', 'Orders Count', 'Gross Sales Volume (INR)', 'Admin Cut 10% (INR)'];
    const rows = filteredReports.map(r => [
      `"${r.store.replace(/"/g, '""')}"`,
      `"${r.period}"`,
      r.ordersCount,
      r.totalSales.toFixed(2),
      r.commission.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const filename = `Wikcart_Commission_Report_${fromDate || 'All'}_to_${toDate || 'Present'}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Seller Commission Report</h1>
          <p className="text-slate-500 mt-1">View and audit platform service revenue from registered merchant stores with custom date range filters.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrintPDF} 
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Report</span>
          </button>
          <button 
            onClick={handleExportCSV} 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <Card className="print:hidden border-slate-200 bg-slate-50/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-blue-600" /> Date Filter & Report Presets
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Presets */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              {[
                { id: 'All', label: 'All Time' },
                { id: 'Today', label: 'Today' },
                { id: 'ThisMonth', label: 'This Month' },
                { id: 'LastMonth', label: 'Last Month' },
                { id: 'Custom', label: 'Custom' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePresetChange(p.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    datePreset === p.id 
                      ? 'bg-slate-900 text-white font-bold shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom Range Picker inputs */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setDatePreset('Custom');
                  }}
                  className="pl-8 pr-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
                />
              </div>
              <span className="text-xs text-slate-400 font-bold">to</span>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setDatePreset('Custom');
                  }}
                  className="pl-8 pr-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
                />
              </div>

              {(fromDate || toDate) && (
                <button 
                  onClick={() => handlePresetChange('All')}
                  className="text-xs font-bold text-red-600 hover:underline cursor-pointer ml-1"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="border-emerald-100 shadow-sm shadow-emerald-50 text-emerald-900 bg-emerald-50/20">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">Cumulative Admin Commission (10%)</p>
                     <h3 className="text-3xl font-black text-emerald-950">₹{totalAdminCommission.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                     <p className="text-xs text-emerald-600 mt-1 font-semibold">Net platform service revenue</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
                     <DollarSign className="w-6 h-6" />
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="border-blue-100 shadow-sm text-blue-900 bg-blue-50/20">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">Filtered Gross Sales Volume</p>
                     <h3 className="text-3xl font-black text-blue-950">₹{totalGrossSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                     <p className="text-xs text-blue-600 mt-1 font-semibold">Total merchandise sales</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl text-blue-700">
                     <Store className="w-6 h-6" />
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="border-slate-200 shadow-sm text-slate-900 bg-slate-50/40">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Fulfilled Orders</p>
                     <h3 className="text-3xl font-black text-slate-900">{totalOrdersCount}</h3>
                     <p className="text-xs text-slate-500 mt-1 font-semibold">Across {sellers.length} merchant stores</p>
                  </div>
                  <div className="p-3 bg-slate-200/60 rounded-xl text-slate-700">
                     <FileText className="w-6 h-6" />
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
      
      {/* Commission Report Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/20">
           <div>
             <CardTitle className="font-bold text-slate-800 text-lg">Platform Commission Invoices</CardTitle>
             <p className="text-xs text-slate-400 font-medium mt-0.5">
               Active Period: <span className="font-bold text-slate-700">{fromDate && toDate ? `${fromDate} to ${toDate}` : datePreset}</span>
             </p>
           </div>
           
           <div className="relative w-full sm:w-auto">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Search store name..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="pl-9 pr-4 py-2 w-full sm:w-64 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-all font-medium text-slate-700" 
             />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600 font-medium">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                   <tr>
                      <th className="px-6 py-4">Store Name</th>
                      <th className="px-6 py-4">Fulfillment Period</th>
                      <th className="px-6 py-4 text-right">Fulfillment Orders</th>
                      <th className="px-6 py-4 text-right">Gross Sales Volume</th>
                      <th className="px-6 py-4 text-right">Admin Cut (10%)</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                   {filteredReports.length === 0 ? (
                     <tr>
                       <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                         No commission records found matching the selected date range and store search.
                       </td>
                     </tr>
                   ) : (
                     filteredReports.map((row) => (
                       <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                               <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                 <Store className="w-4 h-4" />
                               </div>
                               <span className="font-bold text-slate-900">{row.store}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs font-semibold">{row.period}</td>
                          <td className="px-6 py-4 text-right font-semibold">{row.ordersCount}</td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900">₹{row.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4 text-right font-black text-emerald-600">₹{row.commission.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                       </tr>
                     ))
                   )}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
