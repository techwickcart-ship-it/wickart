import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, Eye, Filter, Edit2, Trash2, XCircle, ShieldCheck, User, Mail, Phone, ShoppingBag, MapPin, X } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function ViewCustomersPage() {
  const customers = useMarketplaceData('customers', () => marketplaceStore.getCustomers());
  const setCustomers = (updatedList: any[]) => marketplaceStore.saveCustomers(updatedList);
  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState<any | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const approveCustomer = (id: string) => {
    setCustomers(customers.map(c => 
      c.id === id ? { ...c, status: 'Active' } : c
    ));
    setNotification(`Approval complete. ID and Password sent to Customer ${id} via WhatsApp.`);
    setTimeout(() => setNotification(null), 5000);
  };
  
  const resetCustomerPassword = (id: string) => {
    const newPwd = Math.random().toString(36).slice(-8); // Random password
    setNotification(`Password reset for ${id}. New Password: ${newPwd}. Details sent via WhatsApp.`);
    setTimeout(() => setNotification(null), 8000);
  };
  
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] bg-emerald-900 border border-emerald-800 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
           <ShieldCheck className="w-5 h-5 text-emerald-400" />
           <span className="font-medium text-sm">{notification}</span>
           <button onClick={() => setNotification(null)} className="ml-4 text-emerald-400 hover:text-white">
              <XCircle className="w-4 h-4" />
           </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">View Customers</h1>
          <p className="text-slate-500 mt-1">Manage platform customers and their details.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          Export Data
        </button>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 p-0">
          <div className="flex items-center justify-between px-6 py-4">
            <CardTitle>All Customers</CardTitle>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customers..."
                  className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 transition-colors outline-none"
                />
              </div>
              <button className="p-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4 font-medium">Customer Info</th>
                      <th className="px-6 py-4 font-medium">Contact</th>
                      <th className="px-6 py-4 font-medium">Wallet Balance</th>
                      <th className="px-6 py-4 font-medium">Referral Code</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredCustomers.map((cust) => (
                     <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-medium text-slate-900">{cust.name}</div>
                           <div className="text-xs text-slate-500">{cust.id}</div>
                        </td>
                        <td className="px-6 py-4">
                           <div>{cust.email}</div>
                           <div className="text-slate-500">{cust.phone}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-600">
                           ₹{(Number(cust.walletBalance) || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                           <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md">
                              {cust.referralCode || 'N/A'}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${
                            cust.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            cust.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                             {cust.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              {cust.status === 'Pending Approval' ? (
                                <button onClick={() => approveCustomer(cust.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                                  Approve
                                </button>
                              ) : (
                                <button onClick={() => resetCustomerPassword(cust.id)} className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200">
                                  Reset Pwd
                                </button>
                              )}
                              <button 
                                onClick={() => setSelectedCust(cust)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer" 
                                title="View Customer Profile & Orders"
                              >
                                 <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
                                 <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                                 <Trash2 className="w-4 h-4" />
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

      {/* Customer Profile Modal */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
                  {selectedCust.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCust.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Customer ID: {selectedCust.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCust(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Email Address</span>
                <span className="font-bold text-slate-800 truncate block">{selectedCust.email}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Phone Number</span>
                <span className="font-bold text-slate-800">{selectedCust.phone}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Account Status</span>
                <span className="font-bold text-emerald-600">{selectedCust.status}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Total Orders</span>
                <span className="font-bold text-blue-600 text-sm">{selectedCust.orders} Completed Orders</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
                <span className="text-slate-400 block font-medium">Default Delivery Address</span>
                <span className="font-bold text-slate-800">Flat 402, Green Valley Apartments, MG Road, City Center, 400001</span>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button 
                onClick={() => setSelectedCust(null)} 
                className="px-5 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
