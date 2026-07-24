import React, { useState } from 'react';
import { Truck, Search, Eye, X, User, Phone, MapPin, Package, Bike } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { marketplaceStore, useMarketplaceData, Order } from '../lib/store';

export function AssignedOrdersPage() {
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const deliveryPartners = useMarketplaceData('deliveryPartners', () => marketplaceStore.getDeliveryPartners());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter assigned orders
  const assignedOrders = orders.filter(o => 
    (o.status === 'Out for Delivery' || o.deliveryPartnerId || o.deliveryPartnerName) &&
    (
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.deliveryPartnerName && o.deliveryPartnerName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assigned Orders</h1>
          <p className="text-slate-500 mt-1">Track and manage orders dispatched to delivery personnel.</p>
        </div>
      </div>

      <Card className="border border-slate-200">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Courier..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 font-medium" 
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            Total Assigned: {assignedOrders.length}
          </span>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse text-sm text-slate-600">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Delivery Partner</th>
                  <th className="px-6 py-4">Customer & Address</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {assignedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      <Bike className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No assigned orders currently found.
                    </td>
                  </tr>
                ) : assignedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                    <td 
                      onClick={() => setSelectedOrder(order)}
                      className="px-6 py-4 font-bold text-blue-600 cursor-pointer hover:underline"
                    >
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Bike className="w-4 h-4 text-indigo-600 shrink-0" />
                        {order.deliveryPartnerName || 'Ravi Kumar (Assigned)'}
                      </div>
                      <div className="text-xs text-slate-400">Verified Express Rider</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{order.customer}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">{order.address || 'Civil Lines, Sultanpur, UP'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-bold text-xs uppercase tracking-wider">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg border border-slate-200 shadow-2xl bg-white flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-5 flex flex-row items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900">{selectedOrder.id}</CardTitle>
                  <p className="text-xs text-slate-500">{selectedOrder.date}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                <p className="text-slate-400 font-bold uppercase tracking-wider">Customer Details</p>
                <p className="text-slate-900 font-bold text-sm">{selectedOrder.customer}</p>
                <p className="text-slate-600">{selectedOrder.phone || '+91 98210 54321'}</p>
                <p className="text-slate-600">{selectedOrder.address || 'Civil Lines, Sultanpur, UP'}</p>
              </div>

              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1 text-xs">
                <p className="text-indigo-600 font-bold uppercase tracking-wider">Courier Partner</p>
                <p className="text-slate-900 font-bold">{selectedOrder.deliveryPartnerName || 'Ravi Kumar'}</p>
                <p className="text-slate-600">Status: <span className="font-bold text-indigo-700">{selectedOrder.status}</span></p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-bold">
                <span>Total Amount:</span>
                <span className="text-blue-600 text-base">{selectedOrder.amount}</span>
              </div>
            </CardContent>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
