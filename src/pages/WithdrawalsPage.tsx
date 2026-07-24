import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, CheckCircle2, XCircle, Clock, Calendar, Download, Printer, Filter, DollarSign, Building2, ShieldCheck } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function WithdrawalsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const withdrawals = useMarketplaceData('withdrawals', () => marketplaceStore.getWithdrawals());
  const [notification, setNotification] = useState<string | null>(null);

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

  const parseWithdrawalDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;

    try {
      const clean = dateStr.split(',')[0].trim();
      const parsed = new Date(clean);
      if (!isNaN(parsed.getTime())) return parsed;
    } catch (e) {
      // ignore
    }
    return null;
  };

  // Filtered withdrawals
  const filteredWithdrawals = useMemo(() => {
    let startTimestamp = fromDate ? new Date(fromDate + 'T00:00:00').getTime() : null;
    let endTimestamp = toDate ? new Date(toDate + 'T23:59:59').getTime() : null;

    return withdrawals.filter(w => {
      // Tab status check
      if (activeTab !== 'All' && w.status !== activeTab) return false;

      // Store search
      if (search && !w.store.toLowerCase().includes(search.toLowerCase()) && !w.id.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Date range check
      if (startTimestamp || endTimestamp) {
        const wDate = parseWithdrawalDate(w.date);
        if (wDate) {
          const t = wDate.getTime();
          if (startTimestamp && t < startTimestamp) return false;
          if (endTimestamp && t > endTimestamp) return false;
        }
      }

      return true;
    });
  }, [withdrawals, activeTab, search, fromDate, toDate]);

  // Statistics
  const totalRequested = useMemo(() => filteredWithdrawals.reduce((sum, w) => sum + parseAmount(w.requestedAmt), 0), [filteredWithdrawals]);
  const totalApproved = useMemo(() => filteredWithdrawals.filter(w => w.status === 'Approved').reduce((sum, w) => sum + parseAmount(w.requestedAmt), 0), [filteredWithdrawals]);
  const totalPending = useMemo(() => filteredWithdrawals.filter(w => w.status === 'Pending').reduce((sum, w) => sum + parseAmount(w.requestedAmt), 0), [filteredWithdrawals]);

  // Action Handlers
  const handleApprove = (id: string) => {
    const list = marketplaceStore.getWithdrawals();
    const updated = list.map(w => w.id === id ? { ...w, status: 'Approved' } : w);
    marketplaceStore.saveWithdrawals(updated);
    setNotification(`Withdrawal ${id} approved and payout processed successfully!`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleReject = (id: string) => {
    const list = marketplaceStore.getWithdrawals();
    const updated = list.map(w => w.id === id ? { ...w, status: 'Rejected' } : w);
    marketplaceStore.saveWithdrawals(updated);
    setNotification(`Withdrawal ${id} rejected.`);
    setTimeout(() => setNotification(null), 5000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Request ID', 'Date', 'Store Name', 'Amount Requested (INR)', 'Bank Account', 'Status'];
    const rows = filteredWithdrawals.map(w => [
      `"${w.id}"`,
      `"${w.date}"`,
      `"${w.store.replace(/"/g, '""')}"`,
      parseAmount(w.requestedAmt).toFixed(2),
      `"${(w.account || '').replace(/"/g, '""')}"`,
      `"${w.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const filename = `Wikcart_Withdrawals_Report_${fromDate || 'All'}_to_${toDate || 'Present'}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
           <ShieldCheck className="w-5 h-5 text-emerald-400" />
           <span className="font-medium text-sm">{notification}</span>
           <button onClick={() => setNotification(null)} className="ml-4 text-slate-400 hover:text-white">
              <XCircle className="w-4 h-4" />
           </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Withdrawal Requests & Payouts</h1>
          <p className="text-slate-500 mt-1">Manage seller wallet withdrawal requests, audit payout settlements, and apply date range filters.</p>
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
            <Filter className="w-4 h-4 text-blue-600" /> Date Range & Payout Filters
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
        <Card className="border-blue-100 shadow-sm text-blue-900 bg-blue-50/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">Total Requested Amount</p>
                <h3 className="text-3xl font-black text-blue-950">₹{totalRequested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                <p className="text-xs text-blue-600 mt-1 font-semibold">{filteredWithdrawals.length} total request(s)</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl text-blue-700">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 shadow-sm text-emerald-900 bg-emerald-50/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">Approved & Paid Out</p>
                <h3 className="text-3xl font-black text-emerald-950">₹{totalApproved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                <p className="text-xs text-emerald-600 mt-1 font-semibold">Settled directly to seller bank accounts</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100 shadow-sm text-amber-900 bg-amber-50/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">Pending Approval</p>
                <h3 className="text-3xl font-black text-amber-950">₹{totalPending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                <p className="text-xs text-amber-600 mt-1 font-semibold">Awaiting admin review</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl text-amber-700">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card with Tabs */}
      <Card>
        <CardHeader className="border-b border-slate-100 p-0 bg-slate-50/30">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-6 py-4 gap-3">
            <div className="flex gap-4 border-b sm:border-b-0 border-slate-200 pb-2 sm:pb-0 overflow-x-auto">
              {['All', 'Pending', 'Approved', 'Rejected'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-bold pb-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-slate-500 border-transparent hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by store name or ID..." 
                className="pl-9 pr-4 py-1.5 w-full sm:w-64 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:border-blue-500 outline-none" 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[350px]">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                   <tr>
                      <th className="px-6 py-4">Req ID & Date</th>
                      <th className="px-6 py-4">Store Name</th>
                      <th className="px-6 py-4 text-right">Amount Requested</th>
                      <th className="px-6 py-4">Bank Settlement Account</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right print:hidden">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredWithdrawals.length === 0 ? (
                     <tr>
                       <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                         No withdrawal requests found matching your filters.
                       </td>
                     </tr>
                   ) : (
                     filteredWithdrawals.map((row) => (
                       <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                             <div className="font-mono font-bold text-slate-900 text-xs">{row.id}</div>
                             <div className="text-xs text-slate-400">{row.date}</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-blue-600">{row.store}</td>
                          <td className="px-6 py-4 text-right font-black text-slate-900">{row.requestedAmt}</td>
                          <td className="px-6 py-4">
                             <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-700 inline-flex items-center gap-1">
                               <Building2 className="w-3.5 h-3.5 text-slate-400" />
                               {row.account}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                               row.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                               row.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                               'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {row.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                              {row.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {row.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                              {row.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right print:hidden">
                             <div className="flex items-center justify-end gap-2">
                               {row.status === 'Pending' ? (
                                 <>
                                   <button 
                                     onClick={() => handleApprove(row.id)}
                                     className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer" 
                                     title="Approve & Mark Paid"
                                   >
                                     <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                   </button>
                                   <button 
                                     onClick={() => handleReject(row.id)}
                                     className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition-colors flex items-center gap-1 cursor-pointer" 
                                     title="Reject Request"
                                   >
                                     <XCircle className="w-3.5 h-3.5" /> Reject
                                   </button>
                                 </>
                               ) : (
                                 <span className="text-xs text-slate-400 font-medium">Completed</span>
                               )}
                             </div>
                          </td>
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
