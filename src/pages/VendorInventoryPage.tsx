import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, Package, AlertCircle } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function VendorInventoryPage() {
  const [search, setSearch] = useState('');
  const inventory = useMarketplaceData('globalInventory', () => marketplaceStore.getGlobalInventory());

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.vendor.toLowerCase().includes(search.toLowerCase())
  );

  const outOfStock = inventory.filter(item => item.stock === 0 || item.status === 'Out of Stock').length;
  const lowStock = inventory.filter(item => (item.stock > 0 && item.stock <= 10) || item.status === 'Low Stock').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Global Vendor Inventory</h1>
          <p className="text-slate-500 mt-1">Monitor product stock levels across all active vendors.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-red-50/50 border-red-100">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertCircle className="w-6 h-6" /></div>
               <div>
                  <h3 className="text-2xl font-bold text-red-900">{outOfStock}</h3>
                  <p className="text-sm font-medium text-red-600">Total Out of Stock</p>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-amber-50/50 border-amber-100">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Package className="w-6 h-6" /></div>
               <div>
                  <h3 className="text-2xl font-bold text-amber-900">{lowStock}</h3>
                  <p className="text-sm font-medium text-amber-600">Total Low Stock</p>
               </div>
            </CardContent>
         </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
           <CardTitle>Inventory Master List</CardTitle>
           <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by vendor or product..." className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none" />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4 font-medium">Product</th>
                      <th className="px-6 py-4 font-medium">Vendor</th>
                      <th className="px-6 py-4 font-medium">Current Stock</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredInventory.map((item) => (
                     <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-900">{item.name}</div>
                           <div className="text-xs text-slate-500">{item.id}</div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="font-medium text-blue-600 cursor-pointer hover:underline">{item.vendor}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">{item.stock} Units</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 
                            item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.status}
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
