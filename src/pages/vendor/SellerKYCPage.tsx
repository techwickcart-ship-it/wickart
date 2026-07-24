import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { FileText, Eye, UploadCloud, ShieldCheck, CheckCircle2, Clock, AlertCircle, Building2, CreditCard, X, Save } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';

export function SellerKYCPage() {
  const { activeSellerStoreName, activeSellerId } = useActiveSellerStore();
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());
  
  const currentSeller = sellers.find(s => 
    String(s.id) === String(activeSellerId) || 
    (s.storeName && s.storeName.trim().toLowerCase() === activeSellerStoreName.trim().toLowerCase())
  ) || {
    id: activeSellerId || '1',
    name: activeSellerStoreName,
    email: '',
    storeName: activeSellerStoreName,
    phone: '',
    status: 'Active' as const,
    orders: 0,
    revenue: '₹0.00',
    rating: 5.0,
    gstin: '27ABCDE1234F1Z5',
    documents: {},
    bankDetails: {
      accountName: 'Store Account',
      bankName: 'HDFC Bank',
      accountNumber: '50100012345678',
      ifscCode: 'HDFC0000060'
    }
  };

  const [documents, setDocuments] = useState<Record<string, { fileName: string; fileData?: string; uploadedAt?: string; status?: string }>>(
    currentSeller?.documents || {
      'Aadhaar Front': { fileName: 'aadhaar_front.png', uploadedAt: '22 Jul 2026', status: 'Verified' },
      'Aadhaar Back': { fileName: 'aadhaar_back.png', uploadedAt: '22 Jul 2026', status: 'Verified' },
      'PAN Card': { fileName: 'pan_card.png', uploadedAt: '22 Jul 2026', status: 'Verified' },
      'GST Certificate': { fileName: 'gst_certificate.pdf', uploadedAt: '22 Jul 2026', status: 'Verified' },
      'Cancelled Cheque': { fileName: 'cancelled_cheque.png', uploadedAt: '22 Jul 2026', status: 'Verified' }
    }
  );

  const [previewDoc, setPreviewDoc] = useState<{ title: string; fileName: string; fileData?: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Bank & Tax details state
  const [bankDetails, setBankDetails] = useState({
    bankName: currentSeller?.bankDetails?.bankName || 'HDFC Bank',
    accountName: currentSeller?.bankDetails?.accountName || currentSeller?.name || 'Store Account',
    accountNumber: currentSeller?.bankDetails?.accountNumber || '50100012345678',
    ifscCode: currentSeller?.bankDetails?.ifscCode || 'HDFC0000060'
  });

  const [gstin, setGstin] = useState(currentSeller?.gstin || '27ABCDE1234F1Z5');

  const handleFileUpload = (docName: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      
      const updatedDocs = {
        ...documents,
        [docName]: {
          fileName: file.name,
          fileData: dataUrl,
          uploadedAt: today,
          status: 'Under Verification'
        }
      };

      setDocuments(updatedDocs);

      // Save directly to marketplaceStore for this seller
      if (currentSeller) {
        const allSellers = marketplaceStore.getSellers();
        const updatedSellers = allSellers.map(s => s.id === currentSeller.id ? { ...s, documents: updatedDocs } : s);
        marketplaceStore.saveSellers(updatedSellers);

        // Also update vendorRegistrations if applicable
        const regList = marketplaceStore.getVendorRegistrations();
        const updatedRegs = regList.map(r => r.phone === currentSeller.phone || r.email.toLowerCase() === currentSeller.email.toLowerCase()
          ? { ...r, documents: updatedDocs }
          : r
        );
        marketplaceStore.saveVendorRegistrations(updatedRegs);
      }

      setNotification(`${docName} uploaded successfully and submitted for admin KYC verification!`);
      setTimeout(() => setNotification(null), 5000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBankAndTax = () => {
    if (!currentSeller) return;
    const allSellers = marketplaceStore.getSellers();
    const updatedSellers = allSellers.map(s => s.id === currentSeller.id ? { 
      ...s, 
      gstin: gstin,
      bankDetails: bankDetails
    } : s);
    marketplaceStore.saveSellers(updatedSellers);

    setNotification('Bank settlement details & GSTIN updated successfully!');
    setTimeout(() => setNotification(null), 5000);
  };

  const docTypes = [
    { title: 'Aadhaar Front', desc: 'Front page showing clear photo & 12-digit Aadhaar number', required: true },
    { title: 'Aadhaar Back', desc: 'Back page showing residential / business address clearly', required: true },
    { title: 'PAN Card', desc: 'Official Business / Proprietor Permanent Account Number card', required: true },
    { title: 'GST Certificate', desc: 'Form GST REG-06 Registration Certificate (All 3 pages)', required: false },
    { title: 'Cancelled Cheque', desc: 'Cheque with printed store/owner name for bank verification', required: true }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] bg-emerald-900 border border-emerald-800 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
           <ShieldCheck className="w-5 h-5 text-emerald-400" />
           <span className="font-medium text-sm">{notification}</span>
           <button onClick={() => setNotification(null)} className="ml-4 text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
           </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-indigo-900/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Merchant Verification
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">KYC & Document Verification</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Manage your government IDs, business tax registration (GSTIN), and settlement bank account. Uploaded documents are reviewed by Wikcart compliance administrators.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-right">
          <p className="text-[11px] text-slate-300 font-medium">Merchant Verification Status</p>
          <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-end mt-0.5">
            <CheckCircle2 className="w-4 h-4" /> Approved & Active Seller
          </p>
        </div>
      </div>

      {/* KYC Documents Grid */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Uploaded Merchant Documents (Visible to KYC Compliance Team)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docTypes.map(({ title, desc, required }) => {
              const doc = documents[title];
              const isUploaded = Boolean(doc?.fileName || doc?.fileData);
              const status = doc?.status || (isUploaded ? 'Verified' : 'Pending Upload');

              return (
                <div 
                  key={title} 
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isUploaded 
                      ? 'bg-slate-50/80 border-slate-200 hover:border-indigo-300 hover:shadow-xs' 
                      : 'bg-amber-50/30 border-amber-200/80'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl ${isUploaded ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
                          {required && <span className="text-[10px] text-red-500 font-bold">*Required</span>}
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        status === 'Under Verification' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mt-2">{desc}</p>

                    {isUploaded && (
                      <div className="mt-3 p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-0.5">
                        <p className="font-bold text-slate-800 truncate font-mono text-[11px]">
                          📄 {doc?.fileName || `${title.toLowerCase().replace(/\s+/g, '_')}.png`}
                        </p>
                        {doc?.uploadedAt && (
                          <p className="text-[10px] text-slate-400">Uploaded on {doc.uploadedAt}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {isUploaded && (
                      <button
                        type="button"
                        onClick={() => setPreviewDoc({
                          title,
                          fileName: doc?.fileName || `${title.toLowerCase().replace(/\s+/g, '_')}.png`,
                          fileData: doc?.fileData
                        })}
                        className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview Document
                      </button>
                    )}

                    <label className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isUploaded 
                        ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200' 
                        : 'flex-1 bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-sm'
                    }`}>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{isUploaded ? 'Re-upload' : 'Upload File'}</span>
                      <input 
                        type="file" 
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(title, file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bank Settlement & Tax Details */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            Bank Payout Settlement Account & Tax Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name *</label>
              <input 
                type="text" 
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Holder Name *</label>
              <input 
                type="text" 
                value={bankDetails.accountName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Number *</label>
              <input 
                type="text" 
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code *</label>
              <input 
                type="text" 
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:border-blue-500 outline-none uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN Number (Goods & Services Tax ID)</label>
              <input 
                type="text" 
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:border-blue-500 outline-none uppercase"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSaveBankAndTax}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Settlement Details
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

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

            <div className="border rounded-2xl p-4 bg-slate-50 flex items-center justify-center min-h-[240px]">
              {previewDoc.fileData && previewDoc.fileData.startsWith('data:image') ? (
                <img src={previewDoc.fileData} alt={previewDoc.title} className="max-h-[320px] object-contain rounded-xl shadow-xs" />
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
                <ShieldCheck className="w-4 h-4" /> Verified by Wikcart Compliance
              </span>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
