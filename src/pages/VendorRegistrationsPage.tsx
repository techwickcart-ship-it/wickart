import React, { useState } from 'react';
import { Eye, Search, Check, X, ShieldCheck, XCircle, FileText, Building2, CreditCard } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { marketplaceStore, useMarketplaceData, VendorRegistration } from '../lib/store';

export function VendorRegistrationsPage() {
  const registrations = useMarketplaceData('vendorRegistrations', () => marketplaceStore.getVendorRegistrations());
  const [search, setSearch] = useState('');
  const [selectedReg, setSelectedReg] = useState<VendorRegistration | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; fileName: string; fileData?: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const approveVendor = (id: string) => {
    const list = marketplaceStore.getVendorRegistrations();
    const updated = list.map(r => r.id === id ? { ...r, status: 'Approved' as const } : r);
    marketplaceStore.saveVendorRegistrations(updated);

    // Also update seller status
    const target = updated.find(r => r.id === id);
    if (target) {
      const sellers = marketplaceStore.getSellers();
      const existing = sellers.find(s => s.email.toLowerCase() === target.email.toLowerCase() || s.phone === target.phone);
      if (existing) {
        const updatedSellers = sellers.map(s => s.id === existing.id ? { 
          ...s, 
          status: 'Active' as const,
          plan: target.plan,
          category: target.category,
          city: target.city,
          address: target.address,
          gstin: target.gstin,
          storeLogo: target.storeLogo,
          storeBanner: target.storeBanner,
          bankDetails: target.bankDetails,
          documents: target.documents
        } : s);
        marketplaceStore.saveSellers(updatedSellers);
      } else {
        marketplaceStore.addSeller({
          name: target.name,
          email: target.email,
          phone: target.phone,
          storeName: target.businessName,
          status: 'Active',
          plan: target.plan,
          category: target.category,
          city: target.city,
          address: target.address,
          gstin: target.gstin,
          storeLogo: target.storeLogo,
          storeBanner: target.storeBanner,
          bankDetails: target.bankDetails,
          documents: target.documents
        });
      }
    }

    setNotification(`Vendor ${id} approved successfully! Login credentials activated.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const rejectVendor = (id: string) => {
    const list = marketplaceStore.getVendorRegistrations();
    const updated = list.map(r => r.id === id ? { ...r, status: 'Rejected' as const } : r);
    marketplaceStore.saveVendorRegistrations(updated);

    const target = updated.find(r => r.id === id);
    if (target) {
      const sellers = marketplaceStore.getSellers();
      const existing = sellers.find(s => s.email.toLowerCase() === target.email.toLowerCase() || s.phone === target.phone);
      if (existing) {
        const updatedSellers = sellers.map(s => s.id === existing.id ? { ...s, status: 'Suspended' as const } : s);
        marketplaceStore.saveSellers(updatedSellers);
      }
    }

    setNotification(`Vendor ${id} registration rejected.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredRegistrations = registrations.filter(reg =>
    reg.businessName.toLowerCase().includes(search.toLowerCase()) ||
    reg.name.toLowerCase().includes(search.toLowerCase()) ||
    reg.email.toLowerCase().includes(search.toLowerCase()) ||
    reg.phone.includes(search) ||
    reg.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          <h1 className="text-2xl font-bold text-slate-900">Vendor Registrations</h1>
          <p className="text-slate-500 mt-1">Review and approve vendor registration requests submitted across the platform.</p>
        </div>
        <button onClick={() => window.open('/vendor-registration', '_blank')} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition text-sm shadow-sm">
          Open Public Registration Form
        </button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendor registrations..." 
              className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 font-medium" 
            />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[350px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="px-6 py-4 font-medium">Reg ID</th>
                  <th className="px-6 py-4 font-medium">Business / Owner</th>
                  <th className="px-6 py-4 font-medium">Contact Details</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      No vendor registrations found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-500 font-mono text-xs">{reg.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-blue-600">{reg.businessName}</div>
                        <div className="text-slate-500 text-xs">{reg.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900 font-medium">{reg.phone}</div>
                        <div className="text-slate-500 text-xs">{reg.email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{reg.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full font-semibold text-xs border ${
                          reg.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          reg.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => setSelectedReg(reg)}
                            title="View Details" 
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {reg.status !== 'Approved' && (
                            <button 
                              onClick={() => approveVendor(reg.id)}
                              title="Approve Vendor" 
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {reg.status !== 'Rejected' && (
                            <button 
                              onClick={() => rejectVendor(reg.id)}
                              title="Reject Vendor" 
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Details & KYC Documents Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{selectedReg.businessName}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    selectedReg.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    selectedReg.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {selectedReg.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Application ID: {selectedReg.id} • Registered Date: {selectedReg.date}</p>
              </div>
              <button onClick={() => setSelectedReg(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Store Branding Section */}
            {(selectedReg.storeLogo || selectedReg.storeBanner) && (
              <div className="border rounded-2xl overflow-hidden bg-slate-50 border-slate-200">
                {selectedReg.storeBanner ? (
                  <img src={selectedReg.storeBanner} alt="Banner" className="w-full h-24 object-cover" />
                ) : (
                  <div className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600" />
                )}
                <div className="p-3 flex items-center gap-3">
                  {selectedReg.storeLogo ? (
                    <img src={selectedReg.storeLogo} alt="Logo" className="w-12 h-12 rounded-xl object-cover border-2 border-white -mt-6 shadow-md bg-white" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg border-2 border-white -mt-6 shadow-md">
                      {selectedReg.businessName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedReg.businessName}</h4>
                    <p className="text-xs text-slate-500">{selectedReg.category || 'General Store'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* General Info Grid */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" /> Business & Contact Profile
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Owner Full Name</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedReg.name}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Business Type</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedReg.businessType || 'Proprietorship'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Mobile Number</span>
                  <span className="font-bold text-slate-800">{selectedReg.phone}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Email Address</span>
                  <span className="font-bold text-slate-800 truncate block">{selectedReg.email}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
                  <span className="text-slate-400 block font-medium">Operating Address</span>
                  <span className="font-bold text-slate-800">{selectedReg.address || 'Shop #12, MG Road'}, {selectedReg.city || 'Mumbai'}, {selectedReg.pincode || '400001'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">GSTIN</span>
                  <span className="font-mono font-bold text-slate-800">{selectedReg.gstin || '27ABCDE1234F1Z5'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">PAN Number</span>
                  <span className="font-mono font-bold text-slate-800">{selectedReg.pan || 'ABCDE1234F'}</span>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Bank Settlement Account
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
                <div>
                  <span className="text-slate-400 block">Bank Name</span>
                  <span className="font-bold text-slate-800">{selectedReg.bankDetails?.bankName || 'HDFC Bank'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Account Holder</span>
                  <span className="font-bold text-slate-800">{selectedReg.bankDetails?.accountName || selectedReg.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Account Number</span>
                  <span className="font-mono font-bold text-slate-800">{selectedReg.bankDetails?.accountNumber || '50100012345678'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">IFSC Code</span>
                  <span className="font-mono font-bold text-slate-800">{selectedReg.bankDetails?.ifscCode || 'HDFC0000060'}</span>
                </div>
              </div>
            </div>

            {/* Submitted Verification Documents Section */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" /> Submitted Verification Documents (KYC)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Aadhaar Front',
                  'Aadhaar Back',
                  'PAN Card',
                  'GST Certificate',
                  'Cancelled Cheque'
                ].map((docName) => {
                  const doc = selectedReg.documents?.[docName];
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

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button 
                onClick={() => setSelectedReg(null)} 
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold text-xs"
              >
                Close
              </button>
              {selectedReg.status === 'Pending' && (
                <button 
                  onClick={() => { approveVendor(selectedReg.id); setSelectedReg(null); }}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" /> Approve Registration & KYC
                </button>
              )}
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

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Document Verified
              </span>
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
