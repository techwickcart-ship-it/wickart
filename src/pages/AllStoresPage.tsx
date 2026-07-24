import React, { useState } from 'react';
import { Store, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function AllStoresPage() {
  const [search, setSearch] = useState('');
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());

  const toggleStatus = (id: string, currentStatus: 'Active' | 'Pending' | 'Suspended') => {
    const nextStatus: 'Active' | 'Pending' | 'Suspended' = currentStatus === 'Active' ? 'Suspended' : 'Active';
    const list = marketplaceStore.getSellers();
    const updated = list.map(s => s.id === id ? { ...s, status: nextStatus } : s);
    marketplaceStore.saveSellers(updated);
  };

  const filteredStores = sellers.filter(s => 
    s.storeName.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Sultanpur Store Directory</h1>
          <p className="text-slate-500 mt-1">View and manage all registered physical stores and digital tenants.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/20">
          <CardTitle className="flex items-center gap-2 font-bold text-slate-800"><Store className="w-5 h-5 text-blue-600"/> Verified Stores</CardTitle>
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search stores..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-64 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-all font-medium text-slate-700" 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredStores.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <p className="font-bold">No registered stores found</p>
              <p className="text-sm mt-1">Add a new seller to list their store automatically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm text-slate-600 font-medium">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                    <th className="px-6 py-4">Store ID</th>
                    <th className="px-6 py-4">Store Name</th>
                    <th className="px-6 py-4">Owner Name</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
                  {filteredStores.map((store) => (
                    <tr key={store.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-400 font-bold">#{store.id}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">{store.storeName}</td>
                      <td className="px-6 py-4 text-slate-800">{store.name}</td>
                      <td className="px-6 py-4">
                         <button 
                           onClick={() => toggleStatus(store.id, store.status)}
                           className={`px-3 py-1 rounded-full font-bold text-xs border transition-colors ${
                             store.status === 'Active' 
                               ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                               : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                           }`}
                         >
                           {store.status}
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
