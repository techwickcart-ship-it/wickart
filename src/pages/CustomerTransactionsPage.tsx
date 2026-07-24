import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function CustomerTransactionsPage() {
  const transactions = useMarketplaceData('transactions', () => marketplaceStore.getTransactions());
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Transactions</h1>
          <p className="text-slate-500 mt-1">View all payment history and transaction records.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
           <CardTitle>History</CardTitle>
           <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input type="text" placeholder="Search ID..." className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none" />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4 font-medium">Txn ID / Date</th>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Type / Method</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {transactions.map((txn) => (
                     <tr key={txn.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                           <div className="font-medium text-slate-900">{txn.id}</div>
                           <div className="text-xs text-slate-500">{txn.date}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-blue-600">{txn.customer}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-1.5">
                              {txn.type === 'Payment' ? <ArrowDownRight className="w-4 h-4 text-emerald-500" /> : <ArrowUpRight className="w-4 h-4 text-amber-500" />}
                              <span className="font-medium text-slate-700">{txn.type}</span>
                           </div>
                           <div className="text-xs text-slate-500 ml-5">{txn.method}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">{txn.amount}</td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${txn.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {txn.status}
                           </span>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
