import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Search, Filter, Eye, CheckCircle2, XCircle, Truck, Package, Clock, Phone, MapPin, User, AlertCircle } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';

export function SellerOrdersPage() {
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const { activeSellerStoreName } = useActiveSellerStore();

  const storeOrders = orders.filter(o => 
    o.store && o.store.trim().toLowerCase() === activeSellerStoreName.trim().toLowerCase()
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOrder = storeOrders.find(o => o.id === selectedOrderId) || storeOrders[0] || null;

  const handleUpdateStatus = (id: string, newStatus: any) => {
    const list = marketplaceStore.getOrders();
    const updated = list.map(o => o.id === id ? { ...o, status: newStatus } : o);
    marketplaceStore.saveOrders(updated);
  };

  const filtered = storeOrders.filter(o => {
    const matchesTab = activeTab === 'All' || o.status === activeTab;
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.phone && o.phone.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 mt-1">
            Accept, dispatch, and track orders placed for <strong className="text-slate-800">{activeSellerStoreName}</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Order List */}
         <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="border-b border-slate-100 p-0">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3 bg-slate-50/40">
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar w-full sm:w-auto">
                      {(['All', 'Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                            activeTab === tab 
                              ? 'bg-blue-600 text-white shadow-xs' 
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="relative w-full sm:w-48">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Search orders..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 w-full bg-white border border-slate-200 rounded-lg text-xs font-medium focus:border-blue-500 outline-none" 
                      />
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 {filtered.length === 0 ? (
                   <div className="p-12 text-center text-slate-400 space-y-2">
                     <Package className="w-8 h-8 mx-auto text-slate-300" />
                     <p className="font-bold text-slate-700">No orders found for {activeSellerStoreName}</p>
                     <p className="text-xs text-slate-400">Orders placed by customers on the storefront will automatically appear here.</p>
                   </div>
                 ) : (
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600">
                         <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider">
                            <tr>
                               <th className="px-6 py-4">Order & Customer</th>
                               <th className="px-6 py-4">Amount & Items</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 font-medium">
                            {filtered.map((order) => (
                              <tr 
                                key={order.id} 
                                className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedOrder?.id === order.id ? 'bg-blue-50/50' : ''}`}
                                onClick={() => setSelectedOrderId(order.id)}
                              >
                                 <td className="px-6 py-4">
                                    <div className="font-bold text-blue-600">{order.id}</div>
                                    <div className="text-xs text-slate-900 font-bold mt-0.5">{order.customer}</div>
                                    <div className="text-[11px] text-slate-400">{order.date}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{order.amount}</div>
                                    <div className="text-xs text-slate-500 font-medium">
                                      {Array.isArray(order.items) 
                                        ? order.items.map((i: any) => `${i.name} (x${i.qty})`).join(', ')
                                        : (typeof order.items === 'string' ? order.items : '1 Order Item')}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                   <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                      order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                      order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border border-red-100' :
                                      order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                      'bg-blue-50 text-blue-700 border border-blue-100'
                                   }`}>
                                      {order.status}
                                   </span>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                   <button 
                                      onClick={() => setSelectedOrderId(order.id)}
                                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                                   >
                                      View Details
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

         {/* Order Details Panel */}
         <div className="space-y-4">
            {selectedOrder ? (
              <Card className="sticky top-20 shadow-md border-slate-200">
                 <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">Selected Order</p>
                          <CardTitle className="text-lg font-black text-slate-900">{selectedOrder.id}</CardTitle>
                       </div>
                       <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          selectedOrder.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          selectedOrder.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-blue-100 text-blue-800'
                       }`}>
                          {selectedOrder.status}
                       </span>
                    </div>
                 </CardHeader>

                 <CardContent className="p-5 space-y-5">
                    {/* Customer Info */}
                    <div>
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-500" /> Customer Information
                       </h4>
                       <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs font-medium">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Name:</span>
                            <span className="font-bold text-slate-900">{selectedOrder.customer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Phone:</span>
                            <span className="font-bold text-blue-600">{selectedOrder.phone || '+91 98210 54321'}</span>
                          </div>
                          <div className="pt-2 border-t border-slate-200/60">
                             <span className="text-slate-500 block mb-1">Delivery Address:</span>
                             <span className="text-slate-800 font-semibold leading-relaxed block">
                               {selectedOrder.address || '123 Civil Lines, Sultanpur, UP - 228001'}
                             </span>
                          </div>
                       </div>
                    </div>

                    {/* Items List */}
                    <div>
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-slate-500" /> Ordered Items
                       </h4>
                       <div className="p-3.5 border border-slate-200 rounded-xl text-xs bg-white shadow-xs font-medium">
                          {Array.isArray(selectedOrder.items) ? (
                             <div className="space-y-2">
                               {selectedOrder.items.map((item: any, idx: number) => (
                                 <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
                                   <div>
                                     <span className="font-bold text-slate-800">{item.name}</span>
                                     <span className="text-slate-400 font-bold ml-2">x{item.qty}</span>
                                   </div>
                                   <span className="font-black text-slate-900">{item.price}</span>
                                 </div>
                               ))}
                             </div>
                          ) : (
                             <p className="font-bold text-slate-950">{typeof selectedOrder.items === 'string' ? selectedOrder.items : '1 Order Item'}</p>
                          )}
                          <div className="text-slate-500 font-bold mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm">
                            <span>Total Payable</span>
                            <span className="text-blue-600 font-black text-base">{selectedOrder.amount}</span>
                          </div>
                       </div>
                    </div>

                    {/* Workflow Actions */}
                    {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && (
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                         {selectedOrder.status === 'Pending' && (
                           <button 
                             onClick={() => handleUpdateStatus(selectedOrder.id, 'Confirmed')}
                             className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                           >
                             <CheckCircle2 className="w-4 h-4" /> Accept Order
                           </button>
                         )}

                         {selectedOrder.status === 'Confirmed' && (
                           <button 
                             onClick={() => handleUpdateStatus(selectedOrder.id, 'Out for Delivery')}
                             className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                           >
                             <Truck className="w-4 h-4" /> Dispatch Order
                           </button>
                         )}

                         {selectedOrder.status === 'Out for Delivery' && (
                           <button 
                             onClick={() => handleUpdateStatus(selectedOrder.id, 'Delivered')}
                             className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                           >
                             <CheckCircle2 className="w-4 h-4" /> Mark as Delivered
                           </button>
                         )}

                         <button 
                           onClick={() => handleUpdateStatus(selectedOrder.id, 'Cancelled')}
                           className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                         >
                           <XCircle className="w-3.5 h-3.5" /> Cancel / Reject Order
                         </button>
                      </div>
                    )}
                 </CardContent>
              </Card>
            ) : (
              <Card className="p-8 text-center text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-600">No order selected</p>
                <p className="text-xs">Click on any order row to view details.</p>
              </Card>
            )}
         </div>
      </div>
    </div>
  );
}
