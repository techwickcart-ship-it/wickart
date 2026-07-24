import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Wallet, Search, PlusCircle, MinusCircle, Plus, Users, X } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function WalletTransactionsPage() {
  const walletTransactions = useMarketplaceData('walletTransactions', () => marketplaceStore.getWalletTransactions());
  const customers = useMarketplaceData('customers', () => marketplaceStore.getCustomers());
  
  const [search, setSearch] = useState('');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.name || 'Alok Nath');
  const [topUpAmount, setTopUpAmount] = useState('500');
  const [topUpReason, setTopUpReason] = useState('Admin Promotional Wallet Credit');

  // Calculate dynamic outstanding balance from customer wallets
  const outstandingBal = customers.reduce((acc, c) => acc + (Number(c.walletBalance) || 0), 0);

  const displayOutstanding = outstandingBal.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR'
  });

  const handleAddTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.name === selectedCustomer || c.id === selectedCustomer);
    const amt = parseFloat(topUpAmount) || 0;
    if (amt <= 0) return;

    marketplaceStore.creditCustomerWallet(
      cust?.name || selectedCustomer,
      cust?.phone || '',
      amt,
      topUpReason || 'Manual Wallet Top-Up'
    );

    setShowTopUpModal(false);
    setTopUpAmount('500');
    alert(`₹${amt} credited to ${cust?.name || selectedCustomer}'s wallet!`);
  };

  const filteredTxns = walletTransactions.filter(txn => 
    txn.customer?.toLowerCase().includes(search.toLowerCase()) ||
    txn.desc?.toLowerCase().includes(search.toLowerCase()) ||
    txn.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Wallet Transactions</h1>
          <p className="text-slate-500 mt-1">Audit customer wallet credits, debits, refunds, and top-up usage.</p>
        </div>
        <button 
          onClick={() => setShowTopUpModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
        >
           <Plus className="w-4 h-4" /> Credit Customer Wallet
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/10">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-blue-100 font-medium mb-1">Total Outstanding Wallet Balance</p>
                     <h3 className="text-3xl font-bold">{displayOutstanding}</h3>
                     <p className="text-xs text-blue-200 mt-2">Active across {customers.length} platform customers</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                     <Wallet className="w-6 h-6 text-white" />
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="md:col-span-2">
            <CardHeader className="pb-3 border-b border-slate-100">
               <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Users className="w-4 h-4 text-blue-600" /> Live Customer Wallet Balances
               </div>
            </CardHeader>
            <CardContent className="p-4">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {customers.slice(0, 6).map(c => (
                    <div key={c.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                       <div>
                          <div className="font-bold text-xs text-slate-900">{c.name}</div>
                          <div className="text-[11px] text-slate-500">{c.phone || c.id}</div>
                       </div>
                       <div className="text-right">
                          <div className="font-black text-sm text-emerald-600">₹{(Number(c.walletBalance) || 0).toFixed(2)}</div>
                          <div className="text-[10px] text-slate-400">Code: {c.referralCode || 'N/A'}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
           <CardTitle>Transaction History & Audit Log</CardTitle>
           <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search customer, ID, desc..." 
               className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none" 
             />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4 font-medium">Txn ID / Date</th>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Details</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Closing Bal.</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredTxns.length === 0 ? (
                      <tr>
                         <td colSpan={5} className="text-center py-8 text-slate-400">
                            No wallet transactions found.
                         </td>
                      </tr>
                   ) : filteredTxns.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-50">
                         <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{txn.id}</div>
                            <div className="text-xs text-slate-500">{txn.date}</div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="font-bold text-blue-600">{txn.customer}</div>
                            {txn.phone && <div className="text-xs text-slate-400">{txn.phone}</div>}
                         </td>
                         <td className="px-6 py-4 text-slate-700 font-medium">{txn.desc}</td>
                         <td className="px-6 py-4">
                            <div className={`flex items-center gap-1.5 font-bold ${txn.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                               {txn.type === 'Credit' ? <PlusCircle className="w-4 h-4" /> : <MinusCircle className="w-4 h-4" />}
                               {txn.amount}
                            </div>
                         </td>
                         <td className="px-6 py-4 font-bold text-slate-900">{txn.closingBal}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal for manual top-up */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                   <Wallet className="w-5 h-5 text-emerald-600" /> Credit Customer Wallet
                </h3>
                <button onClick={() => setShowTopUpModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                   <X className="w-5 h-5" />
                </button>
             </div>
             <form onSubmit={handleAddTopUp} className="space-y-4 pt-2">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Select Customer</label>
                   <select 
                     value={selectedCustomer} 
                     onChange={(e) => setSelectedCustomer(e.target.value)}
                     className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                   >
                      {customers.map(c => (
                         <option key={c.id} value={c.name}>{c.name} ({c.phone}) - Current: ₹{(Number(c.walletBalance)||0).toFixed(2)}</option>
                      ))}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Amount to Credit (₹)</label>
                   <input 
                     type="number" 
                     value={topUpAmount}
                     onChange={(e) => setTopUpAmount(e.target.value)}
                     className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                     placeholder="500"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Description / Reason</label>
                   <input 
                     type="text" 
                     value={topUpReason}
                     onChange={(e) => setTopUpReason(e.target.value)}
                     className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                     placeholder="e.g. Promotional Bonus"
                   />
                </div>
                <div className="pt-2 flex gap-3">
                   <button type="button" onClick={() => setShowTopUpModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors">
                      Cancel
                   </button>
                   <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md">
                      Add Credit
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
