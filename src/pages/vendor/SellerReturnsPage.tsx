import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Search, RotateCcw, Check, X, Eye, AlertCircle, ShoppingBag, ArrowUpRight, HelpCircle, CheckCircle2, Clock } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';

export function SellerReturnsPage() {
  const { activeSellerStoreName } = useActiveSellerStore();
  const [search, setSearch] = useState('');
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending Approval' | 'Approved & Refunded' | 'Rejected'>('All');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const rawReturns = useMarketplaceData('returnRequests', () => marketplaceStore.getReturnRequests());

  // Filter returns relevant to this store
  const storeReturns = rawReturns.filter(r => {
    if (!r.store || r.store === activeSellerStoreName || r.store === 'Main Store' || r.store === 'City Square Mart') {
      return true;
    }
    return r.store.toLowerCase() === activeSellerStoreName.toLowerCase();
  });

  const handleApproveReturn = (req: any) => {
    // 1. Credit wallet to customer
    const custs = marketplaceStore.getCustomers();
    const cust = custs.find(c => c.name.toLowerCase() === req.customer.toLowerCase());

    marketplaceStore.creditCustomerWallet(
      req.customer,
      cust?.phone || req.customerPhone || '',
      req.amount,
      `Store Refund for Return Request ${req.id} (${req.orderId}) - ${activeSellerStoreName}`
    );

    // 2. Update store
    const list = marketplaceStore.getReturnRequests();
    const updated = list.map(r => r.id === req.id ? { ...r, status: 'Approved & Refunded' as const } : r);
    marketplaceStore.saveReturnRequests(updated);

    setActionSuccess(`Return request ${req.id} approved! ₹${req.amount} refunded back to customer.`);
    setTimeout(() => setActionSuccess(null), 4000);
    if (selectedReq?.id === req.id) {
      setSelectedReq({ ...selectedReq, status: 'Approved & Refunded' });
    }
  };

  const handleRejectReturn = (id: string) => {
    const list = marketplaceStore.getReturnRequests();
    const updated = list.map(r => r.id === id ? { ...r, status: 'Rejected' as const } : r);
    marketplaceStore.saveReturnRequests(updated);
    setActionSuccess(`Return request ${id} marked as rejected.`);
    setTimeout(() => setActionSuccess(null), 4000);
    if (selectedReq?.id === id) {
      setSelectedReq({ ...selectedReq, status: 'Rejected' });
    }
  };

  const filtered = storeReturns.filter(r => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.id.toLowerCase().includes(s) ||
      r.orderId.toLowerCase().includes(s) ||
      r.customer.toLowerCase().includes(s) ||
      r.reason.toLowerCase().includes(s)
    );
  });

  const pendingCount = storeReturns.filter(r => r.status === 'Pending Approval').length;
  const approvedCount = storeReturns.filter(r => r.status === 'Approved & Refunded').length;
  const totalRefundAmount = storeReturns
    .filter(r => r.status === 'Approved & Refunded')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-rose-600" />
            Returns & Refund Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review and inspect customer return requests for {activeSellerStoreName}. Approve genuine cases to issue direct wallet refunds.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {actionSuccess}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Action</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-950 mt-2">{pendingCount}</p>
          <p className="text-xs text-amber-700 mt-0.5">Requires vendor verification</p>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Approved Returns</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-950 mt-2">{approvedCount}</p>
          <p className="text-xs text-emerald-700 mt-0.5">Refunded back to customer</p>
        </div>

        <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Total Refund Value</span>
            <RotateCcw className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-950 mt-2">₹{totalRefundAmount.toFixed(2)}</p>
          <p className="text-xs text-blue-700 mt-0.5">Total refunded for your store</p>
        </div>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {(['All', 'Pending Approval', 'Approved & Refunded', 'Rejected'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search orders, customers..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Req ID</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Order</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Customer / Date</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Return Reason</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Refund Amount</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.length > 0 ? (
                  filtered.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 font-mono text-xs">{req.id}</td>
                      <td className="px-4 sm:px-6 py-4 font-bold text-blue-600">{req.orderId}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-slate-900 font-bold">{req.customer}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{req.date}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-slate-700 font-medium max-w-xs block truncate" title={req.reason}>
                          {req.reason}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-black text-slate-900 font-mono">
                        ₹{Number(req.amount).toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            req.status === 'Approved & Refunded'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.status === 'Approved & Refunded' && <Check className="w-3 h-3" />}
                          {req.status === 'Rejected' && <X className="w-3 h-3" />}
                          {req.status === 'Pending Approval' && <Clock className="w-3 h-3" />}
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReq(req)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                            title="Inspect details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {req.status === 'Pending Approval' && (
                            <>
                              <button
                                onClick={() => handleApproveReturn(req)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                                title="Approve & Refund Customer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleRejectReturn(req.id)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors border border-rose-200 cursor-pointer"
                                title="Reject Return"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      <RotateCcw className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-700">No return requests found</p>
                      <p className="text-xs text-slate-400 mt-1">There are currently no returns matching your active filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Inspect Modal */}
      {selectedReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-blue-600" />
                Return Request Details ({selectedReq.id})
              </h3>
              <button
                onClick={() => setSelectedReq(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">Order Number:</span>
                <span className="font-bold text-blue-600">{selectedReq.orderId}</span>
              </div>

              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">Customer:</span>
                <span className="font-bold text-slate-900">{selectedReq.customer}</span>
              </div>

              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">Claimed Amount:</span>
                <span className="font-bold text-slate-900 font-mono text-base">₹{Number(selectedReq.amount).toFixed(2)}</span>
              </div>

              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">Request Date:</span>
                <span className="font-semibold text-slate-700">{selectedReq.date}</span>
              </div>

              <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-rose-900 uppercase">Customer Return Reason</span>
                <p className="text-xs text-rose-800 leading-relaxed font-medium">{selectedReq.reason}</p>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">Current Status:</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedReq.status === 'Approved & Refunded'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedReq.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedReq.status}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              {selectedReq.status === 'Pending Approval' ? (
                <>
                  <button
                    onClick={() => handleRejectReturn(selectedReq.id)}
                    className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Reject Claim
                  </button>
                  <button
                    onClick={() => handleApproveReturn(selectedReq)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Approve & Refund ₹{Number(selectedReq.amount).toFixed(2)}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
