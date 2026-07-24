import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { marketplaceStore } from '../../lib/store';
import { navigateTo } from '../../lib/navigation';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Truck, 
  DollarSign, 
  Clock, 
  Percent, 
  CreditCard, 
  MapPin,
  Sparkles,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

const STEPS = [
  'Account Creation',
  'Business & Store Info',
  'Address & Delivery',
  'KYC & Tax Details',
  'Bank & Payments',
  'Operations',
  'Commission Plan',
  'Documents',
  'Terms & Submit'
];

const COMMISSION_PLANS = [
  { 
    name: 'Basic Plan', 
    commission: '5% Commission', 
    products: '10 Products Max', 
    payout: 'Bi-Weekly Payouts',
    badge: 'Starter',
    description: 'Ideal for new individual sellers testing products with zero upfront cost.'
  },
  { 
    name: 'Standard Plan', 
    commission: '3% Commission', 
    products: '100 Products Max', 
    payout: 'Weekly Payouts',
    badge: 'Most Popular',
    description: 'Best for growing retail stores seeking higher visibility & search ranking boost.'
  },
  { 
    name: 'Premium Plan', 
    commission: '1% Commission', 
    products: 'Unlimited Products', 
    payout: 'Daily Payouts',
    badge: 'Pro Seller',
    description: 'Maximum growth with lowest marketplace fees and dedicated account support.'
  },
  { 
    name: 'Enterprise Plan', 
    commission: 'Custom Commission', 
    products: 'Unlimited + API Sync', 
    payout: 'Instant Settlement',
    badge: 'Enterprise',
    description: 'Tailored for large manufacturers & distributors needing custom integrations.'
  }
];

export function VendorRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCommissionPlan, setSelectedCommissionPlan] = useState('Standard Plan');
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Rajesh Kumar',
    ownerName: 'Rajesh Kumar',
    mobile: '+91 9876543210',
    email: 'rajesh.store@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    referralCode: 'VENDOR200',
    legalName: 'Rajesh Enterprises Pvt Ltd',
    businessType: 'Proprietorship',
    category: 'Electronics & Gadgets',
    storeName: 'City Square Mart',
    storeTimings: 'Fixed Timings (9 AM - 8 PM)',
    storeDesc: 'Leading retailer for premium electronics, home appliances and accessories.',
    address1: 'Shop #12, City Square Mall, MG Road',
    address2: 'Near Central Railway Station',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    deliveryRadius: '10 KM',
    deliveryMode: 'Platform Express Logistics',
    shippingCharge: 'Flat ₹49 per order',
    aadhaar: '1234 5678 9012',
    pan: 'ABCDE1234F',
    gstin: '27ABCDE1234F1Z5',
    fssai: '11521000001234',
    taxPreference: 'GST Registered Regular',
    invoicePrefix: 'CSM-INV-',
    accountHolder: 'Rajesh Enterprises',
    bankName: 'HDFC Bank',
    branch: 'Fort Branch, Mumbai',
    accountNumber: '50100012345678',
    ifsc: 'HDFC0000060',
    upiId: 'rajesh@hdfcbank',
    payoutCycle: 'Weekly Every Monday',
    operatingDays: 'Mon-Sat (6 Days)',
    orderCapacity: '50 orders/day',
    returnPolicy: '7 Days Returnable',
    dispatchLeadTime: 'Within 24 Hours',
    supportPhone: '+91 9876543210',
    signature: 'Rajesh Kumar'
  });

  const [uploadedDocsDetails, setUploadedDocsDetails] = useState<Record<string, { fileName: string; fileData?: string; uploadedAt?: string; status?: string }>>({
    'Aadhaar Front': { fileName: 'aadhaar_front.png', uploadedAt: '22 Jul 2026', status: 'Uploaded' },
    'Aadhaar Back': { fileName: 'aadhaar_back.png', uploadedAt: '22 Jul 2026', status: 'Uploaded' },
    'PAN Card': { fileName: 'pan_card.png', uploadedAt: '22 Jul 2026', status: 'Uploaded' },
    'GST Certificate': { fileName: 'gst_certificate.pdf', uploadedAt: '22 Jul 2026', status: 'Uploaded' }
  });
  const [storeLogo, setStoreLogo] = useState<string>('');
  const [storeBanner, setStoreBanner] = useState<string>('');

  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({
    'Aadhaar Front': true,
    'Aadhaar Back': true,
    'PAN Card': true,
    'GST Certificate': true,
    'Cancelled Cheque': false
  });

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleDocumentFile = (docName: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      setUploadedDocsDetails(prev => ({
        ...prev,
        [docName]: {
          fileName: file.name,
          fileData: dataUrl,
          uploadedAt: today,
          status: 'Uploaded'
        }
      }));
      setUploadedDocs(prev => ({ ...prev, [docName]: true }));
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setStoreLogo(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setStoreBanner(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[550px] text-center animate-in fade-in duration-500 py-12 px-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Vendor Application Submitted!</h1>
        <p className="text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
          Thank you for choosing <strong className="text-slate-900">Wikcart</strong>. Your vendor registration details, selected plan (<strong className="text-blue-600">{selectedCommissionPlan}</strong>), and KYC documents are under automated admin verification.
        </p>
        
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md w-full mb-8 text-left space-y-2 text-sm text-slate-700">
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Store Name:</span>
            <span className="font-bold">{formData.storeName || 'City Square Mart'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Selected Plan:</span>
            <span className="font-bold text-blue-600">{selectedCommissionPlan}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Referral Reward:</span>
            <span className="font-bold text-emerald-600">₹200 Bonus Eligible</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Approval Status:</span>
            <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs border border-amber-200">Pending Admin Audit</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={() => navigateTo('/vendor-login')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer">
            Go to Vendor Login
          </button>
          <button onClick={() => navigateTo('/')} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-all cursor-pointer">
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 py-8 px-4 sm:px-6">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Become a Seller on Wikcart</h1>
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-200">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>
        <p className="text-slate-500 mt-1">Complete the streamlined seller onboard process to start receiving orders.</p>
      </div>

      {/* Interactive Step Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto pb-2 custom-scrollbar gap-2">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`flex items-center gap-2 shrink-0 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  isCurrent 
                    ? 'bg-blue-600 text-white shadow-sm font-bold' 
                    : isCompleted 
                    ? 'bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 font-medium'
                }`}
                title={`Jump to ${step}`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent ? 'bg-white text-blue-600' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                }`}>
                  {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                </div>
                <span className="text-xs whitespace-nowrap">{step}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Card className="min-h-[520px] flex flex-col shadow-lg border-slate-200/60 overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-100 px-6 py-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                {currentStep + 1}
              </span>
              {STEPS[currentStep]}
            </CardTitle>
          </div>
          {currentStep === 6 && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Select Your Commission Plan
            </span>
          )}
        </CardHeader>

        <CardContent className="flex-1 p-6 md:p-8">
          {/* STEP 1: Account Creation */}
          {currentStep === 0 && (
            <div className="space-y-6 max-w-2xl">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-full text-emerald-600 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-800 text-sm">Have a Referral Code?</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">Sign up using an existing vendor's referral code to instantly get ₹200 credited to your vendor wallet upon account approval!</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Full Name *</label>
                  <input type="text" value={formData.fullName} onChange={e => updateField('fullName', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="Rajesh Kumar" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Business Owner Name *</label>
                  <input type="text" value={formData.ownerName} onChange={e => updateField('ownerName', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="Rajesh Kumar" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Mobile Number *</label>
                  <input type="text" value={formData.mobile} onChange={e => updateField('mobile', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="+91 9876543210" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Email Address *</label>
                  <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="seller@example.com" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Password *</label>
                  <input type="password" value={formData.password} onChange={e => updateField('password', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Confirm Password *</label>
                  <input type="password" value={formData.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="••••••••" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Referral Code (Optional)</label>
                  <input type="text" value={formData.referralCode} onChange={e => updateField('referralCode', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none uppercase tracking-wider" placeholder="e.g. VENDOR200" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Business & Store Info */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Legal Business Name *</label>
                  <input type="text" value={formData.legalName} onChange={e => updateField('legalName', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Business Type</label>
                  <select value={formData.businessType} onChange={e => updateField('businessType', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
                    <option>Individual Seller</option>
                    <option>Proprietorship</option>
                    <option>Partnership Firm</option>
                    <option>Private Limited Company</option>
                    <option>LLP</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Primary Category</label>
                  <select value={formData.category} onChange={e => updateField('category', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
                    <option>Electronics & Gadgets</option>
                    <option>Fashion & Apparel</option>
                    <option>Grocery & Supermarket</option>
                    <option>Home & Kitchen</option>
                    <option>Beauty & Health</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Store Display Name *</label>
                  <input type="text" value={formData.storeName} onChange={e => updateField('storeName', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="e.g. City Square Mart" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Operating Timings</label>
                  <select value={formData.storeTimings} onChange={e => updateField('storeTimings', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
                    <option>Fixed Timings (9 AM - 8 PM)</option>
                    <option>Open 24 Hours</option>
                    <option>Custom Schedule</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Store Description</label>
                  <textarea rows={3} value={formData.storeDesc} onChange={e => updateField('storeDesc', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="Briefly describe what your store sells..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors relative">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} className="hidden" />
                  {storeLogo ? (
                    <div className="flex flex-col items-center gap-1">
                      <img src={storeLogo} alt="Logo Preview" className="w-12 h-12 rounded-lg object-cover border" />
                      <span className="text-[10px] font-bold text-emerald-600">Logo Uploaded ✓ (Click to change)</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-blue-500 mb-1.5" />
                      <span className="text-xs font-bold text-slate-700">Upload Store Logo</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG up to 2MB</span>
                    </>
                  )}
                </label>

                <label className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors relative">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleBannerUpload(e.target.files[0])} className="hidden" />
                  {storeBanner ? (
                    <div className="flex flex-col items-center gap-1">
                      <img src={storeBanner} alt="Banner Preview" className="w-20 h-10 rounded-lg object-cover border" />
                      <span className="text-[10px] font-bold text-emerald-600">Banner Uploaded ✓ (Click to change)</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-blue-500 mb-1.5" />
                      <span className="text-xs font-bold text-slate-700">Upload Store Banner</span>
                      <span className="text-[10px] text-slate-400">1200x400 PNG/JPG</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Address & Delivery */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Store Address Line 1 *</label>
                  <input type="text" value={formData.address1} onChange={e => updateField('address1', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Landmark / Line 2</label>
                  <input type="text" value={formData.address2} onChange={e => updateField('address2', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">City *</label>
                  <input type="text" value={formData.city} onChange={e => updateField('city', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">State & Pincode *</label>
                  <div className="flex gap-2">
                    <input type="text" value={formData.state} onChange={e => updateField('state', e.target.value)} className="w-2/3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" />
                    <input type="text" value={formData.postalCode} onChange={e => updateField('postalCode', e.target.value)} className="w-1/3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" />
                  </div>
                </div>

                <div className="md:col-span-2 bg-blue-50/50 border border-blue-200/80 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Map Location Pinned</p>
                      <p className="text-[11px] text-slate-500">Lat: 18.9388° N, Long: 72.8353° E (Mumbai Fort)</p>
                    </div>
                  </div>
                  <button type="button" className="text-xs font-bold text-blue-600 bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50">
                    Change Pin
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Delivery Radius</label>
                  <select value={formData.deliveryRadius} onChange={e => updateField('deliveryRadius', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
                    <option>2 KM (Express Neighborhood)</option>
                    <option>5 KM (City Standard)</option>
                    <option>10 KM (Metropolitan Area)</option>
                    <option>Pan India Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Fulfillment Mode</label>
                  <select value={formData.deliveryMode} onChange={e => updateField('deliveryMode', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
                    <option>Platform Express Logistics</option>
                    <option>Self-Ship Merchant Delivery</option>
                    <option>Hybrid Mode</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: KYC & Tax Details */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-2xl">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Personal Identity KYC
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Aadhaar Card Number *</label>
                    <input type="text" value={formData.aadhaar} onChange={e => updateField('aadhaar', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none" placeholder="12-digit number" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">PAN Card Number *</label>
                    <input type="text" value={formData.pan} onChange={e => updateField('pan', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none uppercase" placeholder="ABCDE1234F" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" /> Tax & Business Registration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">GSTIN Number</label>
                    <input type="text" value={formData.gstin} onChange={e => updateField('gstin', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none uppercase" placeholder="27ABCDE1234F1Z5" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">FSSAI License (If Food/Grocery)</label>
                    <input type="text" value={formData.fssai} onChange={e => updateField('fssai', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none" placeholder="14-digit license number" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Tax Registration Category</label>
                    <select value={formData.taxPreference} onChange={e => updateField('taxPreference', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none">
                      <option>GST Registered Regular</option>
                      <option>Composition Scheme</option>
                      <option>Unregistered / Exempt Small Seller</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Tax Invoice Prefix</label>
                    <input type="text" value={formData.invoicePrefix} onChange={e => updateField('invoicePrefix', e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none uppercase" placeholder="e.g. INV-2026-" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Bank & Payments */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Bank Account Holder Name *</label>
                  <input type="text" value={formData.accountHolder} onChange={e => updateField('accountHolder', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="Must match bank records" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Bank Name *</label>
                  <input type="text" value={formData.bankName} onChange={e => updateField('bankName', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="e.g. HDFC Bank" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Branch Name</label>
                  <input type="text" value={formData.branch} onChange={e => updateField('branch', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="e.g. Fort Branch" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Account Number *</label>
                  <input type="text" value={formData.accountNumber} onChange={e => updateField('accountNumber', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="501000..." />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">IFSC Code *</label>
                  <input type="text" value={formData.ifsc} onChange={e => updateField('ifsc', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none uppercase" placeholder="HDFC0000060" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">UPI VPA ID (Optional)</label>
                  <input type="text" value={formData.upiId} onChange={e => updateField('upiId', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="name@bank" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Preferred Payout Settlement Cycle</label>
                  <select value={formData.payoutCycle} onChange={e => updateField('payoutCycle', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
                    <option>Weekly Every Monday</option>
                    <option>Bi-Weekly (1st & 15th)</option>
                    <option>Daily Express Payout (1% Fee)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Operations */}
          {currentStep === 5 && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Operational Days</label>
                  <select value={formData.operatingDays} onChange={e => updateField('operatingDays', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
                    <option>Mon-Sat (6 Days)</option>
                    <option>Mon-Fri (5 Days)</option>
                    <option>All 7 Days Open</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Order Processing Capacity</label>
                  <select value={formData.orderCapacity} onChange={e => updateField('orderCapacity', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
                    <option>20 orders/day</option>
                    <option>50 orders/day</option>
                    <option>200+ orders/day</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Return Policy for Customers</label>
                  <select value={formData.returnPolicy} onChange={e => updateField('returnPolicy', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
                    <option>7 Days Returnable</option>
                    <option>15 Days Replacement Only</option>
                    <option>Non-Returnable (Hygiene Goods)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Dispatch Lead Time</label>
                  <select value={formData.dispatchLeadTime} onChange={e => updateField('dispatchLeadTime', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none">
                    <option>Within 24 Hours</option>
                    <option>Same Day Dispatch (Cutoff 2 PM)</option>
                    <option>48 Hours</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Customer Support Phone / Helpline</label>
                  <input type="text" value={formData.supportPhone} onChange={e => updateField('supportPhone', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none" placeholder="+91 9876543210" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Commission Plan (FULLY SELECTABLE & INTERACTIVE) */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto mb-2">
                <h3 className="text-lg font-bold text-slate-900">Choose Your Seller Commission Tier</h3>
                <p className="text-xs text-slate-500 mt-1">Select the plan that best matches your product catalog size and sales volume.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {COMMISSION_PLANS.map((plan) => {
                  const isSelected = selectedCommissionPlan === plan.name;
                  return (
                    <div 
                      key={plan.name} 
                      onClick={() => setSelectedCommissionPlan(plan.name)}
                      className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-500/10 shadow-md scale-[1.01]' 
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/80 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{plan.name}</h4>
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {plan.badge}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-blue-600 block">{plan.commission}</span>
                          <span className="text-[11px] text-slate-500">{plan.products}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{plan.description}</p>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" /> {plan.payout}
                        </span>
                        {isSelected && (
                          <span className="font-bold text-blue-600 flex items-center gap-1">
                            Selected Plan <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: Documents */}
          {currentStep === 7 && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Required Verification Documents</h3>
                <p className="text-xs text-slate-500 mb-4">Please upload scanned clear copies or photos (PNG, JPG, PDF - Max 10MB each).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Aadhaar Front', req: true },
                  { name: 'Aadhaar Back', req: true },
                  { name: 'PAN Card', req: true },
                  { name: 'GST Certificate', req: false },
                  { name: 'Cancelled Cheque', req: true }
                ].map((doc) => {
                  const docInfo = uploadedDocsDetails[doc.name];
                  const isUploaded = !!docInfo?.fileName;
                  return (
                    <div key={doc.name} className="border rounded-2xl p-4 flex justify-between items-center bg-slate-50 border-slate-200">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`p-2 rounded-xl shrink-0 ${isUploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800">{doc.name} {doc.req && <span className="text-red-500">*</span>}</p>
                          <p className="text-[10px] text-slate-500 truncate font-mono">{isUploaded ? docInfo.fileName : 'Not uploaded yet'}</p>
                        </div>
                      </div>
                      <label className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                        isUploaded 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                      }`}>
                        <input 
                          type="file" 
                          accept=".png,.jpg,.jpeg,.pdf" 
                          onChange={(e) => e.target.files?.[0] && handleDocumentFile(doc.name, e.target.files[0])} 
                          className="hidden" 
                        />
                        {isUploaded ? 'Replace ✓' : 'Upload File'}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 9: Terms & Submit */}
          {currentStep === 8 && (
            <div className="space-y-6 max-w-2xl">
              <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Registration Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div><strong>Store Name:</strong> {formData.storeName || 'City Square Mart'}</div>
                  <div><strong>Selected Plan:</strong> <span className="text-blue-600 font-bold">{selectedCommissionPlan}</span></div>
                  <div><strong>Mobile:</strong> {formData.mobile}</div>
                  <div><strong>Category:</strong> {formData.category}</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Declarations & Agreements</h4>
                {[
                  'I confirm all business & KYC information provided is true and accurate.',
                  'I agree to platform commission rules & payout terms for my selected plan.',
                  'I agree to Wikcart seller marketplace terms & privacy policies.',
                  'I authorize Wikcart team to perform automated KYC and GST verification.'
                ].map((term, i) => (
                  <label key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-xs font-semibold text-slate-700">{term}</span>
                  </label>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 mb-1 block">Digital Signature (Type Full Name) *</label>
                <input 
                  type="text" 
                  value={formData.signature} 
                  onChange={e => updateField('signature', e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium" 
                  placeholder="e.g. Rajesh Kumar" 
                />
              </div>
            </div>
          )}
        </CardContent>

        {/* Step Navigation Bar */}
        <div className="border-t border-slate-100 p-4 bg-slate-50/80 flex justify-between items-center rounded-b-xl">
          <button 
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-5 py-2.5 text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {currentStep === STEPS.length - 1 ? (
            <button 
              type="button"
              onClick={() => {
                marketplaceStore.addVendorRegistration({
                  name: formData.fullName || formData.ownerName || 'New Vendor',
                  businessName: formData.storeName || formData.legalName || 'New Business',
                  phone: formData.mobile || '',
                  email: formData.email || '',
                  plan: selectedCommissionPlan,
                  category: formData.category,
                  city: formData.city,
                  state: formData.state,
                  address: `${formData.address1}, ${formData.address2}`.trim(),
                  pincode: formData.postalCode,
                  gstin: formData.gstin,
                  pan: formData.pan,
                  businessType: formData.businessType,
                  storeDesc: formData.storeDesc,
                  storeTimings: formData.storeTimings,
                  storeLogo: storeLogo,
                  storeBanner: storeBanner,
                  bankDetails: {
                    accountName: formData.accountHolder,
                    bankName: formData.bankName,
                    accountNumber: formData.accountNumber,
                    ifscCode: formData.ifsc
                  },
                  documents: uploadedDocsDetails,
                  status: 'Pending'
                });
                setIsSubmitted(true);
              }}
              className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Submit Registration</span>
              <Check className="w-4 h-4" />
            </button>
          ) : (
            <button 
              type="button"
              onClick={nextStep}
              className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Save & Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
