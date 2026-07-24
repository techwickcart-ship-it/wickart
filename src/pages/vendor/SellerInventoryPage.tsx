import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Search, Edit2, AlertCircle, TrendingDown, CheckCircle2, Package } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';

export function SellerInventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});
  const [toastMsg, setToastMsg] = useState('');

  const products = useMarketplaceData('products', () => marketplaceStore.getProducts());
  const { activeSellerStoreName, activeSellerId } = useActiveSellerStore();
  
  const sellerProducts = products.filter(p => {
    const vendorMatch = Boolean(p.vendor && p.vendor.trim().toLowerCase() === activeSellerStoreName.trim().toLowerCase());
    const idMatch = Boolean(p.sellerId && String(p.sellerId) === String(activeSellerId));
    return vendorMatch || idMatch;
  });

  // Generate dynamic inventory items from real vendor products
  const inventoryItems = sellerProducts.map(p => {
    // Generate stock or retrieve from local state override
    const override = stockUpdates[String(p.id)];
    const stock = override !== undefined ? override : (p.id % 4 === 0 ? 0 : p.id % 3 === 0 ? 6 : 15 + (p.id * 3) % 30);
    const threshold = 10;
    const status = stock === 0 ? 'Out of Stock' : stock <= threshold ? 'Low Stock' : 'In Stock';
    return {
      rawId: p.id,
      id: `PRD-${p.id}`,
      name: p.name,
      sku: `${p.name.substring(0, 3).toUpperCase()}-${p.id}`,
      stock,
      threshold,
      status,
      price: p.price
    };
  });

  const outOfStockCount = inventoryItems.filter(item => item.status === 'Out of Stock').length;
  const lowStockCount = inventoryItems.filter(item => item.status === 'Low Stock').length;

  const handleSaveStock = (rawId: number | string, newStockVal: number) => {
    setStockUpdates(prev => ({ ...prev, [String(rawId)]: newStockVal }));
    setToastMsg(`Stock updated to ${newStockVal} units.`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filtered = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {toastMsg && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory & Stock</h1>
          <p className="text-slate-500 mt-1">
            Manage real-time inventory and stock threshold alerts for <strong className="text-slate-800">{activeSellerStoreName}</strong>.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-red-50/50 border-red-100">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="p-3 bg-red-100 text-red-600 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
               <div>
                  <h3 className="text-2xl font-black text-red-900">{outOfStockCount}</h3>
                  <p className="text-sm font-bold text-red-600">Out of Stock Items</p>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-amber-50/50 border-amber-100">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><TrendingDown className="w-6 h-6" /></div>
               <div>
                  <h3 className="text-2xl font-black text-amber-900">{lowStockCount}</h3>
                  <p className="text-sm font-bold text-amber-600">Low Stock Alerts</p>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-emerald-50/50 border-emerald-100">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Package className="w-6 h-6" /></div>
               <div>
                  <h3 className="text-2xl font-black text-emerald-900">{inventoryItems.length}</h3>
                  <p className="text-sm font-bold text-emerald-600">Total Tracked Items</p>
               </div>
            </CardContent>
         </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/30">
           <CardTitle className="font-bold text-slate-800">
             Stock Levels for "{activeSellerStoreName}"
           </CardTitle>
           <div className="relative w-full sm:w-auto">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Search by SKU or Name..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9 pr-4 py-2 w-full sm:w-64 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none font-medium text-slate-700" 
             />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                   <tr>
                      <th className="px-6 py-4">Product Name & SKU</th>
                      <th className="px-6 py-4">Current Stock</th>
                      <th className="px-6 py-4">Alert Threshold</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Update Quantity</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                   {filtered.length === 0 ? (
                     <tr>
                       <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                         No inventory items found for {activeSellerStoreName}.
                       </td>
                     </tr>
                   ) : filtered.map((item) => (
                     <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-900">{item.name}</div>
                           <div className="text-xs text-slate-400 font-mono">{item.sku} • {item.price}</div>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-900 text-base">{item.stock} units</td>
                        <td className="px-6 py-4 text-slate-500">{item.threshold} units</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                            item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <input 
                               type="number" 
                               id={`stock-input-${item.rawId}`}
                               defaultValue={item.stock} 
                               className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500" 
                             />
                             <button 
                               onClick={() => {
                                 const el = document.getElementById(`stock-input-${item.rawId}`) as HTMLInputElement;
                                 if (el) {
                                   handleSaveStock(item.rawId, parseInt(el.value) || 0);
                                 }
                               }}
                               className="px-3.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                             >
                               Save
                             </button>
                           </div>
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
