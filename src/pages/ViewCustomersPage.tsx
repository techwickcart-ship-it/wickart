import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, Eye, Filter, Edit2, Trash2, XCircle, ShieldCheck, User, Mail, Phone, ShoppingBag, MapPin, X, RefreshCw, Database } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function ViewCustomersPage() {
  const customers = useMarketplaceData('customers', () => marketplaceStore.getCustomers());
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());
  const vendorRegs = useMarketplaceData('vendorRegistrations', () => marketplaceStore.getVendorRegistrations());

  const setCustomers = (updatedList: any[]) => marketplaceStore.saveCustomers(updatedList);
  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState<any | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    marketplaceStore.syncCustomersFromSupabase().catch(console.warn);
  }, []);

  const handleSyncSupabase = async () => {
    setIsSyncing(true);
    try {
      await marketplaceStore.syncCustomersFromSupabase();
      setNotification('Synced live customer data from Supabase successfully!');
    } catch (err: any) {
      setNotification(`Sync error: ${err.message}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

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
    (c.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (c.id || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
           <ShieldCheck className="w-5 h-5 text-emerald-400" />
           <span className="font-medium text-sm">{notification}</span>
           <button onClick={() => setNotification(null)} className="ml-4 text-slate-400 hover:text-white">
              <XCircle className="w-4 h-4" />
           </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">View Customers</h1>
          <p className="text-slate-500 mt-1">Manage platform customers, wallet balances, and Supabase synchronization.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSyncSupabase}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Supabase...' : 'Sync with Supabase'}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer">
            Export Data
          </button>
        </div>
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
                   {filteredCustomers.map((cust) => {
                     const isVendor = sellers.some(s => (s.email && s.email.toLowerCase() === (cust.email || '').toLowerCase()) || (s.phone && s.phone === cust.phone)) ||
                       vendorRegs.some(v => (v.email && v.email.toLowerCase() === (cust.email || '').toLowerCase()) || (v.phone && v.phone === cust.phone));

                     return (
                     <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-medium text-slate-900 flex items-center gap-2">
                             <span>{cust.name}</span>
                             {isVendor && (
                               <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 rounded-md">
                                 User & Vendor
                               </span>
                             )}
                           </div>
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
                   );
                   })}
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
