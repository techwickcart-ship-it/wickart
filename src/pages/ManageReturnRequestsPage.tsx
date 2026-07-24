import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, RotateCcw, Check, X, Eye, Wallet } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

interface ReturnRequest {
  id: string;
  orderId: string;
  customer: string;
  reason: string;
  date: string;
  amount: number;
  status: 'Pending Approval' | 'Approved & Refunded' | 'Rejected';
}

const INITIAL_RETURNS: ReturnRequest[] = [
  { id: 'RET-001', orderId: '#ORD-9821', customer: 'Alok Nath', reason: 'Damaged Product on arrival', date: '06 Jun 2026', amount: 350, status: 'Pending Approval' },
  { id: 'RET-002', orderId: '#ORD-9810', customer: 'Priya Desai', reason: 'Wrong Item Delivered', date: '05 Jun 2026', amount: 220, status: 'Approved & Refunded' },
  { id: 'RET-003', orderId: '#ORD-9750', customer: 'Rohan Sharma', reason: 'Quality Issue', date: '01 Jun 2026', amount: 180, status: 'Rejected' },
];

export function ManageReturnRequestsPage() {
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(INITIAL_RETURNS);
  const [search, setSearch] = useState('');
  const [selectedReq, setSelectedReq] = useState<ReturnRequest | null>(null);

  const handleApproveReturn = (req: ReturnRequest) => {
    // 1. Credit wallet
    const custs = marketplaceStore.getCustomers();
    const cust = custs.find(c => c.name.toLowerCase() === req.customer.toLowerCase());

    marketplaceStore.creditCustomerWallet(
      req.customer,
      cust?.phone || '',
      req.amount,
      `Refund for Approved Return Request ${req.id} (${req.orderId})`
    );

    // 2. Update local state
    setReturnRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved & Refunded' } : r));
    alert(`✅ Return Request ${req.id} Approved!\n\n₹${req.amount} has been credited back to ${req.customer}'s wallet.`);
  };

  const handleRejectReturn = (id: string) => {
    setReturnRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
  };

  const filtered = returnRequests.filter(r => 
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.orderId.toLowerCase().includes(search.toLowerCase()) ||
    r.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Return Requests & Refunds</h1>
          <p className="text-slate-500 mt-1">Review customer return requests and auto-refund approved returns directly into customer wallets.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
           <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-blue-600" /> Return Requests
           </CardTitle>
           <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search orders, customers..." 
               className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none" 
             />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4 font-medium">Req ID</th>
                      <th className="px-6 py-4 font-medium">Order ID</th>
                      <th className="px-6 py-4 font-medium">Customer / Date</th>
                      <th className="px-6 py-4 font-medium">Reason</th>
                      <th className="px-6 py-4 font-medium">Refund Amt</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filtered.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50">
                         <td className="px-6 py-4 font-bold text-slate-900">{req.id}</td>
                         <td className="px-6 py-4 font-bold text-blue-600">{req.orderId}</td>
                         <td className="px-6 py-4">
                            <div className="text-slate-900 font-bold">{req.customer}</div>
                            <div className="text-xs text-slate-500">{req.date}</div>
                         </td>
                         <td className="px-6 py-4 text-slate-700">{req.reason}</td>
                         <td className="px-6 py-4 font-black text-emerald-600">₹{req.amount.toFixed(2)}</td>
                         <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                             req.status === 'Pending Approval' ? 'bg-amber-100 text-amber-700' :
                             req.status === 'Approved & Refunded' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                           }`}>
                             {req.status === 'Approved & Refunded' && <Wallet className="w-3 h-3 text-emerald-600" />}
                             {req.status}
                           </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setSelectedReq(req)} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors" title="View Details">
                                <Eye className="w-4 h-4" />
                              </button>
                              {req.status === 'Pending Approval' && (
                                <>
                                  <button onClick={() => handleApproveReturn(req)} className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-2xs cursor-pointer" title="Approve & Refund to Wallet">
                                    <Check className="w-3.5 h-3.5" /> Approve & Refund
                                  </button>
                                  <button onClick={() => handleRejectReturn(req.id)} className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors cursor-pointer" title="Reject">
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>

      {/* Details modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                 <h3 className="font-bold text-lg text-slate-900">Return Request Details ({selectedReq.id})</h3>
                 <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-2 text-sm">
                 <p><span className="font-bold text-slate-700">Order ID:</span> {selectedReq.orderId}</p>
                 <p><span className="font-bold text-slate-700">Customer:</span> {selectedReq.customer}</p>
                 <p><span className="font-bold text-slate-700">Date:</span> {selectedReq.date}</p>
                 <p><span className="font-bold text-slate-700">Refund Amount:</span> ₹{selectedReq.amount}</p>
                 <p><span className="font-bold text-slate-700">Reason:</span> {selectedReq.reason}</p>
                 <p><span className="font-bold text-slate-700">Status:</span> {selectedReq.status}</p>
              </div>
              <div className="pt-2">
                 <button onClick={() => setSelectedReq(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm">
                    Close
                 </button>
              </div>
           </div>
        </div>
      )}
      
    </div>
  );
}
