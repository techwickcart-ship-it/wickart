import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, Edit2, ShieldCheck, ShieldAlert, Store, XCircle, Eye, Building2, CreditCard, FileText, X } from 'lucide-react';
import { marketplaceStore, useMarketplaceData, Seller } from '../lib/store';

export function AllSellersPage() {
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());
  const [search, setSearch] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; fileName: string; fileData?: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const toggleStatus = (id: string, currentStatus: string) => {
    const nextStatus: 'Active' | 'Pending' | 'Suspended' = currentStatus === 'Active' ? 'Suspended' : 'Active';
    const list = marketplaceStore.getSellers();
    const updated = list.map(s => s.id === id ? { ...s, status: nextStatus } : s);
    marketplaceStore.saveSellers(updated);
  };
  
  const approveVendor = (id: string) => {
    const list = marketplaceStore.getSellers();
    const updated = list.map(s => s.id === id ? { ...s, status: 'Active' as const } : s);
    marketplaceStore.saveSellers(updated);
    setNotification(`Approval complete. ID and Password sent to Vendor ${id} via WhatsApp.`);
    setTimeout(() => setNotification(null), 5000);
  };
  
  const unblockVendor = (id: string) => {
    const list = marketplaceStore.getSellers();
    const updated = list.map(s => s.id === id ? { ...s, status: 'Active' as const } : s);
    marketplaceStore.saveSellers(updated);
    setNotification(`Vendor ${id} has been activated. They can now login.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const resetVendorPassword = (id: string) => {
    const newPwd = Math.random().toString(36).slice(-8); // Random password
    setNotification(`Password reset for ${id}. New Password: ${newPwd}. Details sent via WhatsApp.`);
    setTimeout(() => setNotification(null), 8000);
  };
  
  const filteredSellers = sellers.filter(s => 
    s.storeName.toLowerCase().includes(search.toLowerCase()) || 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Marketplace Seller Directory</h1>
          <p className="text-slate-500 mt-1">Manage vendor accounts across the platform. Activate, suspend, or approve vendors.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/20">
           <CardTitle className="flex items-center gap-2 font-bold text-slate-800"><Store className="w-5 h-5 text-blue-600"/> Vendor Roster</CardTitle>
           <div className="relative w-full sm:w-auto">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               value={search} 
               onChange={(e) => setSearch(e.target.value)} 
               placeholder="Search by store, owner or ID..." 
               className="pl-9 pr-4 py-2 w-full sm:w-64 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-all font-medium text-slate-700" 
             />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left text-sm text-slate-600 font-medium">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                   <tr>
                      <th className="px-6 py-4">Store Name</th>
                      <th className="px-6 py-4">Owner Name</th>
                      <th className="px-6 py-4">Contact Info</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredSellers.map((seller) => (
                     <tr key={seller.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-900">{seller.storeName}</div>
                           <div className="text-xs text-slate-400 font-mono">ID: {seller.id}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{seller.name}</td>
                        <td className="px-6 py-4 text-slate-500">
                           <div>{seller.email}</div>
                           <div className="text-xs text-slate-400 mt-0.5">{seller.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            seller.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                            seller.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {seller.status === 'Active' ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                            {seller.status}
                          </span>
                          <div className="text-xs text-slate-400 font-semibold">Joined Jun 2026</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <button
                               onClick={() => setSelectedSeller(seller)}
                               title="View Store & KYC Details"
                               className="px-2.5 py-1.5 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors border border-blue-200 flex items-center gap-1 cursor-pointer"
                             >
                               <Eye className="w-3.5 h-3.5" /> Details
                             </button>
                             {seller.status === 'Pending' ? (
                               <button 
                                 onClick={() => approveVendor(seller.id)}
                                 className="px-3 py-1.5 text-xs font-bold rounded-xl transition-colors border bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 cursor-pointer"
                               >
                                 Approve & Send Status
                               </button>
                             ) : seller.status === 'Suspended' ? (
                               <button 
                                 onClick={() => unblockVendor(seller.id)}
                                 className="px-3 py-1.5 text-xs font-bold rounded-xl transition-colors border bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                               >
                                 Unblock Account
                               </button>
                             ) : (
                               <>
                                 <button 
                                   onClick={() => toggleStatus(seller.id, seller.status)}
                                   className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors border cursor-pointer ${
                                      seller.status === 'Active' 
                                        ? 'bg-white border-red-200 text-red-600 hover:bg-red-50' 
                                        : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                   }`}
                                 >
                                   {seller.status === 'Active' ? 'Deactivate' : 'Activate'}
                                 </button>
                                 <button 
                                   onClick={() => resetVendorPassword(seller.id)} 
                                   className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                                 >
                                   Reset Pwd
                                 </button>
                               </>
                             )}
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>

      {/* Seller & KYC Details Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{selectedSeller.storeName}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    selectedSeller.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    selectedSeller.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {selectedSeller.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Seller ID: {selectedSeller.id}</p>
              </div>
              <button onClick={() => setSelectedSeller(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Store Branding */}
            {(selectedSeller.storeLogo || selectedSeller.storeBanner) && (
              <div className="border rounded-2xl overflow-hidden bg-slate-50 border-slate-200">
                {selectedSeller.storeBanner ? (
                  <img src={selectedSeller.storeBanner} alt="Banner" className="w-full h-24 object-cover" />
                ) : (
                  <div className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600" />
                )}
                <div className="p-3 flex items-center gap-3">
                  {selectedSeller.storeLogo ? (
                    <img src={selectedSeller.storeLogo} alt="Logo" className="w-12 h-12 rounded-xl object-cover border-2 border-white -mt-6 shadow-md bg-white" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg border-2 border-white -mt-6 shadow-md">
                      {selectedSeller.storeName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedSeller.storeName}</h4>
                    <p className="text-xs text-slate-500">{selectedSeller.category || 'General Store'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Business Info */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" /> Seller Profile
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Owner Full Name</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedSeller.name}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Mobile Number</span>
                  <span className="font-bold text-slate-800">{selectedSeller.phone}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Email Address</span>
                  <span className="font-bold text-slate-800 truncate block">{selectedSeller.email}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Commission Plan</span>
                  <span className="font-bold text-blue-600">{selectedSeller.plan || 'Standard'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
                  <span className="text-slate-400 block font-medium">Operating Address</span>
                  <span className="font-bold text-slate-800">{selectedSeller.address || 'Commercial Hub, Main Street'}, {selectedSeller.city || 'Mumbai'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">GSTIN</span>
                  <span className="font-mono font-bold text-slate-800">{selectedSeller.gstin || '27ABCDE1234F1Z5'}</span>
                </div>
              </div>
            </div>

            {/* Bank Info */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Settlement Bank Account
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
                <div>
                  <span className="text-slate-400 block">Bank Name</span>
                  <span className="font-bold text-slate-800">{selectedSeller.bankDetails?.bankName || 'HDFC Bank'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Account Holder</span>
                  <span className="font-bold text-slate-800">{selectedSeller.bankDetails?.accountName || selectedSeller.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Account Number</span>
                  <span className="font-mono font-bold text-slate-800">{selectedSeller.bankDetails?.accountNumber || '50100012345678'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">IFSC Code</span>
                  <span className="font-mono font-bold text-slate-800">{selectedSeller.bankDetails?.ifscCode || 'HDFC0000060'}</span>
                </div>
              </div>
            </div>

            {/* Submitted Documents */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" /> Verification Documents (KYC)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Aadhaar Front',
                  'Aadhaar Back',
                  'PAN Card',
                  'GST Certificate',
                  'Cancelled Cheque'
                ].map((docName) => {
                  const doc = selectedSeller.documents?.[docName];
                  const fileName = doc?.fileName || `${docName.toLowerCase().replace(/\s+/g, '_')}.png`;

                  return (
                    <div key={docName} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800">{docName}</p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">{fileName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreviewDoc({
                          title: docName,
                          fileName: fileName,
                          fileData: doc?.fileData
                        })}
                        className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" /> Preview
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button 
                onClick={() => setSelectedSeller(null)} 
                className="px-5 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{previewDoc.title}</h3>
                <p className="text-xs text-slate-400 font-mono">{previewDoc.fileName}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border rounded-2xl p-4 bg-slate-50 flex items-center justify-center min-h-[220px]">
              {previewDoc.fileData && previewDoc.fileData.startsWith('data:image') ? (
                <img src={previewDoc.fileData} alt={previewDoc.title} className="max-h-[300px] object-contain rounded-xl shadow-xs" />
              ) : (
                <div className="text-center space-y-3 py-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{previewDoc.fileName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Verified Document File</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
