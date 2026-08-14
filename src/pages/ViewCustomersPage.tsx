import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { 
  Search, Eye, Filter, Edit2, Trash2, XCircle, ShieldCheck, User, Mail, Phone, 
  ShoppingBag, MapPin, X, RefreshCw, Database, KeyRound, AlertTriangle, CheckCircle2, Wallet, UserCheck
} from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function ViewCustomersPage() {
  const customers = useMarketplaceData('customers', () => marketplaceStore.getCustomers());
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());
  const vendorRegs = useMarketplaceData('vendorRegistrations', () => marketplaceStore.getVendorRegistrations());

  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState<any | null>(null);
  const [editingCust, setEditingCust] = useState<any | null>(null);
  const [deletingCust, setDeletingCust] = useState<any | null>(null);
  const [pwdResetCust, setPwdResetCust] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    marketplaceStore.syncCustomersFromSupabase().catch(console.warn);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSyncSupabase = async () => {
    setIsSyncing(true);
    try {
      await marketplaceStore.syncCustomersFromSupabase();
      showToast('Synced live customer data from Supabase successfully!');
    } catch (err: any) {
      showToast(`Sync error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const approveCustomer = (id: string) => {
    marketplaceStore.updateCustomer(id, { status: 'Active' });
    showToast(`Approval complete for customer ${id}. Account status is now Active.`);
  };

  const handleOpenEdit = (cust: any) => {
    setEditingCust({
      id: cust.id,
      name: cust.name || '',
      email: cust.email || '',
      phone: cust.phone || '',
      walletBalance: cust.walletBalance !== undefined ? cust.walletBalance : 0,
      status: cust.status || 'Active',
      referralCode: cust.referralCode || '',
      houseNo: cust.houseNo || '',
      street: cust.street || '',
      city: cust.city || 'Sultanpur',
      state: cust.state || 'Uttar Pradesh',
      pincode: cust.pincode || '228001',
      landmark: cust.landmark || ''
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCust) return;
    setIsSubmitting(true);
    try {
      const fullAddress = [editingCust.houseNo, editingCust.street, editingCust.landmark, editingCust.city, editingCust.pincode]
        .filter(Boolean)
        .join(', ');

      marketplaceStore.updateCustomer(editingCust.id, {
        ...editingCust,
        address: fullAddress || editingCust.address,
        walletBalance: Number(editingCust.walletBalance) || 0
      });

      showToast(`Customer "${editingCust.name}" updated successfully.`);
      setEditingCust(null);
    } catch (err: any) {
      showToast(`Error updating customer: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCust) return;
    setIsSubmitting(true);
    try {
      await marketplaceStore.deleteCustomer(deletingCust.id);
      showToast(`Customer "${deletingCust.name}" (ID: ${deletingCust.id}) deleted successfully.`);
      setDeletingCust(null);
    } catch (err: any) {
      showToast(`Error deleting customer: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenPwdReset = (cust: any) => {
    setPwdResetCust(cust);
    setNewPassword(Math.random().toString(36).slice(-8).toUpperCase());
  };

  const handleSavePassword = () => {
    if (!pwdResetCust || !newPassword.trim()) return;
    marketplaceStore.updateCustomer(pwdResetCust.id, {
      password: newPassword.trim(),
      password_hash: newPassword.trim()
    });
    showToast(`Password for ${pwdResetCust.name} updated to "${newPassword.trim()}".`);
    setPwdResetCust(null);
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
           <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
           <span className="font-medium text-sm">{notification}</span>
           <button onClick={() => setNotification(null)} className="ml-4 text-slate-400 hover:text-white cursor-pointer">
              <XCircle className="w-4 h-4" />
           </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">View Customers</h1>
          <p className="text-slate-500 mt-1">Manage platform customers, edit profiles, adjust wallets, and sync with Supabase.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSyncSupabase}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync with Supabase'}</span>
          </button>
          <button 
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customers, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `wikcart_customers_${new Date().toISOString().slice(0, 10)}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
              showToast('Customer data exported successfully.');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Export Data
          </button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 p-0">
          <div className="flex items-center justify-between px-6 py-4">
            <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customers by name, phone, email..."
                  className="pl-9 pr-4 py-1.5 w-72 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 transition-colors outline-none"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[360px]">
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
                   {filteredCustomers.length === 0 ? (
                     <tr>
                       <td colSpan={6} className="text-center py-12 text-slate-400">
                         No customers found. Register new customers via the Customer Registration page.
                       </td>
                     </tr>
                   ) : (
                   filteredCustomers.map((cust) => {
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
                           <div className="text-xs text-slate-500 font-mono">{cust.id}</div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="text-slate-900 font-medium text-xs">{cust.email}</div>
                           <div className="text-slate-500 text-xs mt-0.5">{cust.phone}</div>
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
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${
                            cust.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            cust.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                             {cust.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-1.5">
                              {cust.status === 'Pending Approval' && (
                                <button 
                                  onClick={() => approveCustomer(cust.id)} 
                                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors border bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 cursor-pointer"
                                  title="Approve Customer"
                                >
                                  Approve
                                </button>
                              )}
                              <button 
                                onClick={() => handleOpenPwdReset(cust)} 
                                className="px-2.5 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                                title="Reset / Change Password"
                              >
                                Reset Pwd
                              </button>
                              <button 
                                onClick={() => setSelectedCust(cust)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                                title="View Customer Profile"
                              >
                                 <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleOpenEdit(cust)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" 
                                title="Edit Customer Details"
                              >
                                 <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setDeletingCust(cust)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
                                title="Delete Customer"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                   );
                   })
                   )}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Profile View Modal */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
                  {selectedCust.name ? selectedCust.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCust.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Customer ID: {selectedCust.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCust(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Email Address</span>
                <span className="font-bold text-slate-800 truncate block">{selectedCust.email || 'N/A'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Phone Number</span>
                <span className="font-bold text-slate-800">{selectedCust.phone || 'N/A'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Wallet Balance</span>
                <span className="font-bold text-emerald-600 text-sm">₹{(Number(selectedCust.walletBalance) || 0).toFixed(2)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Account Status</span>
                <span className="font-bold text-emerald-600">{selectedCust.status || 'Active'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Referral Code</span>
                <span className="font-mono font-bold text-blue-600">{selectedCust.referralCode || 'None'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Referred By</span>
                <span className="font-mono font-bold text-slate-700">{selectedCust.referredByCode || 'None'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
                <span className="text-slate-400 block font-medium">Delivery Address</span>
                <span className="font-semibold text-slate-800 block mt-0.5">
                  {selectedCust.address || [selectedCust.houseNo, selectedCust.street, selectedCust.landmark, selectedCust.city, selectedCust.state, selectedCust.pincode].filter(Boolean).join(', ') || 'No address specified'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  const cust = selectedCust;
                  setSelectedCust(null);
                  handleOpenEdit(cust);
                }}
                className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
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

      {/* Edit Customer Modal */}
      {editingCust && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Customer</h3>
                  <p className="text-xs text-slate-500 font-mono">ID: {editingCust.id}</p>
                </div>
              </div>
              <button onClick={() => setEditingCust(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCust.name}
                    onChange={(e) => setEditingCust({ ...editingCust, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editingCust.email}
                    onChange={(e) => setEditingCust({ ...editingCust, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={editingCust.phone}
                    onChange={(e) => setEditingCust({ ...editingCust, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Wallet Balance (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCust.walletBalance}
                    onChange={(e) => setEditingCust({ ...editingCust, walletBalance: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Account Status</label>
                  <select
                    value={editingCust.status}
                    onChange={(e) => setEditingCust({ ...editingCust, status: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">House / Flat No.</label>
                  <input
                    type="text"
                    value={editingCust.houseNo}
                    onChange={(e) => setEditingCust({ ...editingCust, houseNo: e.target.value })}
                    placeholder="e.g. Flat 302"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Street / Area</label>
                  <input
                    type="text"
                    value={editingCust.street}
                    onChange={(e) => setEditingCust({ ...editingCust, street: e.target.value })}
                    placeholder="e.g. Civil Lines"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={editingCust.city}
                    onChange={(e) => setEditingCust({ ...editingCust, city: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Pincode</label>
                  <input
                    type="text"
                    value={editingCust.pincode}
                    onChange={(e) => setEditingCust({ ...editingCust, pincode: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCust(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Customer Confirmation Modal */}
      {deletingCust && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Customer?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
              <p className="text-slate-700 font-medium">Customer: <strong className="text-slate-900">{deletingCust.name}</strong></p>
              <p className="text-slate-500">ID: <span className="font-mono">{deletingCust.id}</span></p>
              <p className="text-slate-500">Email: {deletingCust.email}</p>
              <p className="text-slate-500">Phone: {deletingCust.phone}</p>
              <p className="text-slate-500">Wallet Balance: ₹{(Number(deletingCust.walletBalance) || 0).toFixed(2)}</p>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete this customer from the local marketplace and synced database?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCust(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {pwdResetCust && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
                <p className="text-xs text-slate-500">Customer: {pwdResetCust.name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:border-amber-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setNewPassword(Math.random().toString(36).slice(-8).toUpperCase())}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Generate
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                You can provide this new temporary password to the customer for their next login.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPwdResetCust(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePassword}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
