import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import {
  Save, UploadCloud, Building2, Scale, Image as ImageIcon, Database, Check,
  AlertTriangle, RefreshCw, Play, Laptop, HelpCircle, Trash2, ShieldCheck,
  Lock, EyeOff, CheckCircle, Key, CreditCard, Phone, Mail, MapPin, Globe,
  MessageCircle, Smartphone, ExternalLink, ShieldAlert, Sparkles, Layers
} from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';
import { getSupabaseCredentials, reinitSupabaseClient, clearSupabaseCache } from '../lib/supabase';

interface SettingsPageProps {
  initialTab?: 'contact' | 'media' | 'payments' | 'general' | 'policies' | 'database' | 'data' | 'security';
}

export function SettingsPage({ initialTab = 'contact' }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'contact' | 'media' | 'payments' | 'general' | 'policies' | 'database' | 'data' | 'security'>(initialTab);
  const [companyName, setCompanyName] = useState(() => marketplaceStore.getCompanyName());
  const [dataCleanMsg, setDataCleanMsg] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // 1. CONTACT INFO STATE
  const [contactInfo, setContactInfo] = useState(() => marketplaceStore.getContactInfo());

  // 2. MEDIA & ASSETS STATE
  const [mediaAssets, setMediaAssets] = useState(() => marketplaceStore.getMediaAssets());

  // 3. PAYMENT GATEWAYS STATE
  const [paymentGateways, setPaymentGateways] = useState(() => marketplaceStore.getPaymentGateways());

  // 4. POLICIES STATE
  const [policies, setPolicies] = useState(() => marketplaceStore.getPolicies());

  // Anti-Copy & Security Settings
  const [codeProtection, setCodeProtection] = useState(() => localStorage.getItem('wikcart_code_protection') !== 'false');
  const [stealthMode, setStealthMode] = useState(() => localStorage.getItem('wikcart_stealth_mode') !== 'false');

  const toggleCodeProtection = (val: boolean) => {
    setCodeProtection(val);
    localStorage.setItem('wikcart_code_protection', val ? 'true' : 'false');
    window.dispatchEvent(new Event('storage'));
  };

  const toggleStealthMode = (val: boolean) => {
    setStealthMode(val);
    localStorage.setItem('wikcart_stealth_mode', val ? 'true' : 'false');
    window.dispatchEvent(new Event('storage'));
  };

  // Supabase states
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => getSupabaseCredentials().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => getSupabaseCredentials().anonKey);

  const handleSaveCredentials = async () => {
    reinitSupabaseClient(supabaseUrlInput.trim(), supabaseKeyInput.trim());
    setStatusMessage('Supabase credentials saved. Re-testing connection...');
    await handleTestConnection();
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    setCompanyName(marketplaceStore.getCompanyName());
    setContactInfo(marketplaceStore.getContactInfo());
    setMediaAssets(marketplaceStore.getMediaAssets());
    setPaymentGateways(marketplaceStore.getPaymentGateways());
    setPolicies(marketplaceStore.getPolicies());
  }, []);

  useEffect(() => {
    if (activeTab === 'database') {
      handleTestConnection();
    }
  }, [activeTab]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setStatusMessage('Pinging Cloud Database and checking schema...');
    try {
      const status = await marketplaceStore.checkSupabaseStatus();
      setDbStatus(status);
      if (status.connected) {
        setStatusMessage('Cloud Database connection verified! Tables are active.');
      } else {
        setStatusMessage('Could not connect to Cloud Database. Check credentials.');
      }
    } catch (err: any) {
      setDbStatus({
        connected: false,
        url: 'https://...',
        error: err.message || String(err),
        tables: {
          delivery_partners: { status: 'Error' },
          coupons: { status: 'Error' }
        }
      });
      setStatusMessage('Exception occurred during connection check.');
    } finally {
      setIsTesting(false);
    }
  };

  const handlePushData = async () => {
    setIsSyncing(true);
    setStatusMessage('Syncing local offline cache to Cloud Database tables...');
    try {
      await marketplaceStore.pushLocalDataToSupabase();
      const status = await marketplaceStore.checkSupabaseStatus();
      setDbStatus(status);
      setStatusMessage('Local data successfully pushed and merged with Cloud Database!');
    } catch (err: any) {
      setStatusMessage(`Sync failed: ${err.message || err}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullData = async () => {
    setIsFetching(true);
    setStatusMessage('Fetching latest records from Cloud Database...');
    try {
      await marketplaceStore.syncAllFromSupabase();
      const status = await marketplaceStore.checkSupabaseStatus();
      setDbStatus(status);
      setStatusMessage('Latest records pulled from Cloud Database successfully!');
    } catch (err: any) {
      setStatusMessage(`Fetch failed: ${err.message || err}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleClearCacheAndSync = async () => {
    setIsSyncing(true);
    setStatusMessage('Clearing cached credentials and forcing full data synchronization with Supabase...');
    try {
      clearSupabaseCache();
      setSupabaseUrlInput(getSupabaseCredentials().url);
      setSupabaseKeyInput(getSupabaseCredentials().anonKey);
      await marketplaceStore.pushLocalDataToSupabase();
      await marketplaceStore.syncAllFromSupabase();
      const status = await marketplaceStore.checkSupabaseStatus();
      setDbStatus(status);
      setStatusMessage('Cache cleared and local records successfully saved & synchronized to Supabase!');
    } catch (err: any) {
      setStatusMessage(`Clear & Sync failed: ${err.message || err}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Global Save Handler
  const handleSaveAll = () => {
    marketplaceStore.saveCompanyName(companyName);
    marketplaceStore.saveContactInfo(contactInfo);
    marketplaceStore.saveMediaAssets(mediaAssets);
    marketplaceStore.savePaymentGateways(paymentGateways);
    marketplaceStore.savePolicies(policies);
    setSaveSuccessMsg('Platform business settings, contact details, media assets, payment gateways, and policies saved successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Helper to handle file uploads for media assets
  const handleFileUpload = (field: keyof typeof mediaAssets, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setMediaAssets((prev: any) => ({ ...prev, [field]: result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Business & Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure contact details, logos & media assets, payment gateways (PhonePe, Razorpay, etc.), policies, and database sync.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {saveSuccessMsg}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 bg-white p-2 border border-slate-200/80 rounded-2xl shadow-xs">
            <div className="hidden lg:block px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              General & Business
            </div>

            {/* Option A: Contact Info */}
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Contact Information</span>
            </button>

            {/* Option B: Media and Assets */}
            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Media & Assets</span>
            </button>

            {/* Option C: Payment Gateway */}
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Payment Gateways</span>
            </button>

            <div className="hidden lg:block px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System & Maintenance
            </div>

            <button
              onClick={() => setActiveTab('policies')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'policies'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Scale className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Legal & Policies</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Database Connection</span>
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'data'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Clean Dummy Data</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Security & Protection</span>
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 space-y-6 min-w-0">

          {/* TAB 1: CONTACT INFORMATION */}
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    Contact Information & Customer Helpdesk
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Configure store physical address, communication hotlines, emails, WhatsApp support, and Help Center links.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Store Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> Store Physical Address *
                    </label>
                    <textarea
                      rows={3}
                      value={contactInfo.storeAddress}
                      onChange={e => setContactInfo({ ...contactInfo, storeAddress: e.target.value })}
                      placeholder="Enter registered store location, street, landmark, city, state, pincode..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-blue-600" /> Primary Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.mobileNumber}
                        onChange={e => setContactInfo({ ...contactInfo, mobileNumber: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    {/* Alternate Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Alternate Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.alternateMobileNumber}
                        onChange={e => setContactInfo({ ...contactInfo, alternateMobileNumber: e.target.value })}
                        placeholder="+91 9876543211"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    {/* Official Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600" /> Official Email Address *
                      </label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
                        placeholder="business@wikcart.in"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    {/* Support Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-purple-600" /> Customer Support Email *
                      </label>
                      <input
                        type="email"
                        value={contactInfo.supportEmail}
                        onChange={e => setContactInfo({ ...contactInfo, supportEmail: e.target.value })}
                        placeholder="support@wikcart.in"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    {/* Support Hotline Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" /> Support Hotline Number
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.supportNumber}
                        onChange={e => setContactInfo({ ...contactInfo, supportNumber: e.target.value })}
                        placeholder="1800-123-4567 / +91 9876543210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Support Number
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.whatsappNumber}
                        onChange={e => setContactInfo({ ...contactInfo, whatsappNumber: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Help Center Link */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-600" /> Help Center / Knowledge Base Link
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={contactInfo.helpCenterLink}
                        onChange={e => setContactInfo({ ...contactInfo, helpCenterLink: e.target.value })}
                        placeholder="https://wikcart.in/help"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={handleSaveAll}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Contact Information</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: MEDIA AND ASSETS */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    Platform Media, Logos & Mobile App Badges
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Upload and manage high-resolution assets: Logo, Favicon, Login Background, Google Play Store Badge, Apple Store Badge, and App Mockup.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">

                  {/* Company Name */}
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Platform Brand / Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Wikcart SuperStore"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Assets Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* 1. Platform Logo */}
                    <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Platform Main Logo</span>
                        <span className="text-[10px] text-slate-400 font-medium">Rec: 512x512 PNG/SVG</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                          {mediaAssets.logo ? (
                            <img src={mediaAssets.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-blue-200">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload Logo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => e.target.files?.[0] && handleFileUpload('logo', e.target.files[0])}
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Or paste image URL"
                            value={mediaAssets.logo}
                            onChange={e => setMediaAssets({ ...mediaAssets, logo: e.target.value })}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Favicon */}
                    <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">2. Browser Favicon</span>
                        <span className="text-[10px] text-slate-400 font-medium">Rec: 64x64 ICO/PNG</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                          {mediaAssets.favicon ? (
                            <img src={mediaAssets.favicon} alt="Favicon" className="w-10 h-10 object-contain" />
                          ) : (
                            <Globe className="w-8 h-8 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-purple-200">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload Favicon</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => e.target.files?.[0] && handleFileUpload('favicon', e.target.files[0])}
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Or paste favicon URL"
                            value={mediaAssets.favicon}
                            onChange={e => setMediaAssets({ ...mediaAssets, favicon: e.target.value })}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Login Page Background Image */}
                    <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">3. Login Background Banner</span>
                        <span className="text-[10px] text-slate-400 font-medium">Rec: 1920x1080 JPEG</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                          {mediaAssets.loginBgImage ? (
                            <img src={mediaAssets.loginBgImage} alt="Login Bg" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-blue-200">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload Background</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => e.target.files?.[0] && handleFileUpload('loginBgImage', e.target.files[0])}
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Or paste background image URL"
                            value={mediaAssets.loginBgImage}
                            onChange={e => setMediaAssets({ ...mediaAssets, loginBgImage: e.target.value })}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. App Image / Showcase */}
                    <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">4. App Showcase / Mobile Device</span>
                        <span className="text-[10px] text-slate-400 font-medium">Rec: 800x1200 Transparent</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                          {mediaAssets.appImage ? (
                            <img src={mediaAssets.appImage} alt="App Mockup" className="w-full h-full object-contain p-1" />
                          ) : (
                            <Smartphone className="w-8 h-8 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-emerald-200">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload App Mockup</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => e.target.files?.[0] && handleFileUpload('appImage', e.target.files[0])}
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Or paste app mockup URL"
                            value={mediaAssets.appImage}
                            onChange={e => setMediaAssets({ ...mediaAssets, appImage: e.target.value })}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 5. Google Play Store Badge */}
                    <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">5. Google Play Store Badge</span>
                        <span className="text-[10px] text-slate-400 font-medium">SVG / PNG Badge</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-14 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                          {mediaAssets.playStoreBadge ? (
                            <img src={mediaAssets.playStoreBadge} alt="Play Store Badge" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">Play Store</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload Badge</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => e.target.files?.[0] && handleFileUpload('playStoreBadge', e.target.files[0])}
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Or paste badge URL"
                            value={mediaAssets.playStoreBadge}
                            onChange={e => setMediaAssets({ ...mediaAssets, playStoreBadge: e.target.value })}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 6. Apple App Store Badge */}
                    <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">6. Apple App Store Badge</span>
                        <span className="text-[10px] text-slate-400 font-medium">SVG / PNG Badge</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-14 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                          {mediaAssets.appleStoreBadge ? (
                            <img src={mediaAssets.appleStoreBadge} alt="Apple Store Badge" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">App Store</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload Badge</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => e.target.files?.[0] && handleFileUpload('appleStoreBadge', e.target.files[0])}
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Or paste badge URL"
                            value={mediaAssets.appleStoreBadge}
                            onChange={e => setMediaAssets({ ...mediaAssets, appleStoreBadge: e.target.value })}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 7. Google Play Store App Link */}
                    <div className="p-4 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                          7. Google Play Store App Link
                        </label>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Storefront Active</span>
                      </div>
                      <input
                        type="url"
                        placeholder="https://play.google.com/store/apps/details?id=com.wikcart.app"
                        value={mediaAssets.playStoreLink || ''}
                        onChange={e => setMediaAssets({ ...mediaAssets, playStoreLink: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none font-mono focus:ring-2 focus:ring-blue-500 text-slate-900"
                      />
                      <p className="text-[11px] text-slate-500">Redirects customers to download your Android app directly from the Google Play Store.</p>
                    </div>

                    {/* 8. Apple App Store Link */}
                    <div className="p-4 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                          8. Apple App Store Link
                        </label>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Storefront Active</span>
                      </div>
                      <input
                        type="url"
                        placeholder="https://apps.apple.com/app/wikcart/id123456789"
                        value={mediaAssets.appleStoreLink || ''}
                        onChange={e => setMediaAssets({ ...mediaAssets, appleStoreLink: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none font-mono focus:ring-2 focus:ring-purple-500 text-slate-900"
                      />
                      <p className="text-[11px] text-slate-500">Redirects iOS users to download your mobile app directly from the Apple App Store.</p>
                    </div>

                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={handleSaveAll}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Media & Assets</span>
                    </button>
                  </div>

                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: PAYMENT GATEWAY */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    Payment Gateways Configuration (PhonePe, Razorpay, Cashfree, Paytm, Stripe)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Toggle active payment methods, switch seamlessly between Test (Sandbox) and Live modes, and configure gateway API keys.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">

                  {/* 1. PhonePe */}
                  <div className="p-5 border border-purple-200 rounded-2xl bg-purple-50/20 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          Pe
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            PhonePe Payment Gateway
                            {paymentGateways.phonepe.enabled && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                ACTIVE
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-500">UPI, QR Code, Cards & Netbanking via PhonePe PG</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Mode switch */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => setPaymentGateways({
                              ...paymentGateways,
                              phonepe: { ...paymentGateways.phonepe, mode: 'test' }
                            })}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              paymentGateways.phonepe.mode === 'test'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Test / Sandbox
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentGateways({
                              ...paymentGateways,
                              phonepe: { ...paymentGateways.phonepe, mode: 'live' }
                            })}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              paymentGateways.phonepe.mode === 'live'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Live Mode
                          </button>
                        </div>

                        {/* Enable toggle */}
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={paymentGateways.phonepe.enabled}
                            onChange={e => setPaymentGateways({
                              ...paymentGateways,
                              phonepe: { ...paymentGateways.phonepe, enabled: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Merchant ID</label>
                        <input
                          type="text"
                          value={paymentGateways.phonepe.merchantId}
                          onChange={e => setPaymentGateways({
                            ...paymentGateways,
                            phonepe: { ...paymentGateways.phonepe, merchantId: e.target.value }
                          })}
                          placeholder="PGTESTPAYUAT"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Salt Key</label>
                        <input
                          type="password"
                          value={paymentGateways.phonepe.saltKey}
                          onChange={e => setPaymentGateways({
                            ...paymentGateways,
                            phonepe: { ...paymentGateways.phonepe, saltKey: e.target.value }
                          })}
                          placeholder="Enter PhonePe Salt Key"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Salt Index</label>
                        <input
                          type="text"
                          value={paymentGateways.phonepe.saltIndex}
                          onChange={e => setPaymentGateways({
                            ...paymentGateways,
                            phonepe: { ...paymentGateways.phonepe, saltIndex: e.target.value }
                          })}
                          placeholder="1"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Razorpay */}
                  <div className="p-5 border border-blue-200 rounded-2xl bg-blue-50/20 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          Rzp
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            Razorpay Standard Checkout
                            {paymentGateways.razorpay.enabled && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                ACTIVE
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-500">Credit Cards, Debit Cards, Netbanking, UPI, Wallets</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Mode switch */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => setPaymentGateways({
                              ...paymentGateways,
                              razorpay: { ...paymentGateways.razorpay, mode: 'test' }
                            })}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              paymentGateways.razorpay.mode === 'test'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Test / Sandbox
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentGateways({
                              ...paymentGateways,
                              razorpay: { ...paymentGateways.razorpay, mode: 'live' }
                            })}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              paymentGateways.razorpay.mode === 'live'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Live Mode
                          </button>
                        </div>

                        {/* Enable toggle */}
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={paymentGateways.razorpay.enabled}
                            onChange={e => setPaymentGateways({
                              ...paymentGateways,
                              razorpay: { ...paymentGateways.razorpay, enabled: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Key ID ({paymentGateways.razorpay.mode})</label>
                        <input
                          type="text"
                          value={paymentGateways.razorpay.keyId}
                          onChange={e => setPaymentGateways({
                            ...paymentGateways,
                            razorpay: { ...paymentGateways.razorpay, keyId: e.target.value }
                          })}
                          placeholder="rzp_test_..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Key Secret</label>
                        <input
                          type="password"
                          value={paymentGateways.razorpay.keySecret}
                          onChange={e => setPaymentGateways({
                            ...paymentGateways,
                            razorpay: { ...paymentGateways.razorpay, keySecret: e.target.value }
                          })}
                          placeholder="Enter Key Secret"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Cashfree */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          CF
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            Cashfree Payments
                            {paymentGateways.cashfree.enabled && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                ACTIVE
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-500">Seamless checkout with instant refund API support</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Mode switch */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => setPaymentGateways({
                              ...paymentGateways,
                              cashfree: { ...paymentGateways.cashfree, mode: 'test' }
                            })}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              paymentGateways.cashfree.mode === 'test'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Test
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentGateways({
                              ...paymentGateways,
                              cashfree: { ...paymentGateways.cashfree, mode: 'live' }
                            })}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              paymentGateways.cashfree.mode === 'live'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Live
                          </button>
                        </div>

                        {/* Enable toggle */}
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={paymentGateways.cashfree.enabled}
                            onChange={e => setPaymentGateways({
                              ...paymentGateways,
                              cashfree: { ...paymentGateways.cashfree, enabled: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Cashfree App ID</label>
                        <input
                          type="text"
                          value={paymentGateways.cashfree.appId}
                          onChange={e => setPaymentGateways({
                            ...paymentGateways,
                            cashfree: { ...paymentGateways.cashfree, appId: e.target.value }
                          })}
                          placeholder="TEST_CF_APP_..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Secret Key</label>
                        <input
                          type="password"
                          value={paymentGateways.cashfree.secretKey}
                          onChange={e => setPaymentGateways({
                            ...paymentGateways,
                            cashfree: { ...paymentGateways.cashfree, secretKey: e.target.value }
                          })}
                          placeholder="Enter Cashfree Secret Key"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Paytm */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          Paytm
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            Paytm PG
                            {paymentGateways.paytm.enabled && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                ACTIVE
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-500">Paytm Wallet, Postpaid, UPI & All-in-One SDK</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Mode switch */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => setPaymentGateways({
                              ...paymentGateways,
                              paytm: { ...paymentGateways.paytm, mode: 'test' }
                            })}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              paymentGateways.paytm.mode === 'test'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Test
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentGateways({
                              ...paymentGateways,
                              paytm: { ...paymentGateways.paytm, mode: 'live' }
                            })}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              paymentGateways.paytm.mode === 'live'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Live
                          </button>
                        </div>

                        {/* Enable toggle */}
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={paymentGateways.paytm.enabled}
                            onChange={e => setPaymentGateways({
                              ...paymentGateways,
                              paytm: { ...paymentGateways.paytm, enabled: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Paytm Merchant ID (MID)</label>
                        <input
                          type="text"
                          value={paymentGateways.paytm.merchantId}
                          onChange={e => setPaymentGateways({
                            ...paymentGateways,
                            paytm: { ...paymentGateways.paytm, merchantId: e.target.value }
                          })}
                          placeholder="DIY1234567890"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Merchant Key</label>
                        <input
                          type="password"
                          value={paymentGateways.paytm.merchantKey}
                          onChange={e => setPaymentGateways({
                            ...paymentGateways,
                            paytm: { ...paymentGateways.paytm, merchantKey: e.target.value }
                          })}
                          placeholder="Enter Paytm Merchant Key"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Stripe */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          Stripe
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            Stripe Global Gateway
                            {paymentGateways.stripe.enabled && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                ACTIVE
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-500">International Cards, Apple Pay, Google Pay</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Mode switch */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => setPaymentGateways({
                              ...paymentGateways,
                              stripe: { ...paymentGateways.stripe, mode: 'test' }
                            })}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              paymentGateways.stripe.mode === 'test'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Test
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentGateways({
                              ...paymentGateways,
                              stripe: { ...paymentGateways.stripe, mode: 'live' }
                            })}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              paymentGateways.stripe.mode === 'live'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Live
                          </button>
                        </div>

                        {/* Enable toggle */}
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={paymentGateways.stripe.enabled}
                            onChange={e => setPaymentGateways({
                              ...paymentGateways,
                              stripe: { ...paymentGateways.stripe, enabled: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Publishable Key</label>
                        <input
                          type="text"
                          value={paymentGateways.stripe.publishableKey}
                          onChange={e => setPaymentGateways({
                            ...paymentGateways,
                            stripe: { ...paymentGateways.stripe, publishableKey: e.target.value }
                          })}
                          placeholder="pk_test_..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Secret Key</label>
                        <input
                          type="password"
                          value={paymentGateways.stripe.secretKey}
                          onChange={e => setPaymentGateways({
                            ...paymentGateways,
                            stripe: { ...paymentGateways.stripe, secretKey: e.target.value }
                          })}
                          placeholder="sk_test_..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. Cash on Delivery (COD) */}
                  <div className="p-5 border border-emerald-200 rounded-2xl bg-emerald-50/20 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          COD
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            Cash on Delivery (COD)
                            {(paymentGateways as any).cod?.enabled !== false && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                ACTIVE
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-500">Accept cash payment from customer upon delivery in Sultanpur</p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={(paymentGateways as any).cod?.enabled !== false}
                          onChange={e => setPaymentGateways({
                            ...paymentGateways,
                            cod: { enabled: e.target.checked, maxAmount: (paymentGateways as any).cod?.maxAmount || 10000 }
                          } as any)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="text-xs">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Max Order Value for COD (₹)</label>
                      <input
                        type="number"
                        value={(paymentGateways as any).cod?.maxAmount || 10000}
                        onChange={e => setPaymentGateways({
                          ...paymentGateways,
                          cod: { enabled: (paymentGateways as any).cod?.enabled !== false, maxAmount: Number(e.target.value) || 10000 }
                        } as any)}
                        placeholder="10000"
                        className="w-full sm:w-64 px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={handleSaveAll}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Payment Gateways</span>
                    </button>
                  </div>

                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 4: LEGAL & POLICIES */}
          {activeTab === 'policies' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-600" />
                    Legal Policies & Store Information
                  </h2>
                  <p className="text-xs text-slate-500">Edit terms, privacy policy, refund guidelines, shipping rules, and about us page content visible on customer storefront.</p>
                </div>
                <button
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Policies</span>
                </button>
              </div>

              {/* 1. Terms & Conditions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900">Terms & Conditions</CardTitle>
                  <CardDescription className="text-xs">Define the platform rules, user agreements, and service guidelines.</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    rows={6}
                    value={policies.terms}
                    onChange={e => setPolicies({ ...policies, terms: e.target.value })}
                    placeholder="Enter your Terms and Conditions here..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
                  />
                </CardContent>
              </Card>

              {/* 2. Privacy Policy */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900">Privacy Policy</CardTitle>
                  <CardDescription className="text-xs">Detail how user data is collected, protected, and processed.</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    rows={6}
                    value={policies.privacy}
                    onChange={e => setPolicies({ ...policies, privacy: e.target.value })}
                    placeholder="Enter your Privacy Policy here..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
                  />
                </CardContent>
              </Card>

              {/* 3. Shipping & Delivery Policy */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900">Shipping & Delivery Policy</CardTitle>
                  <CardDescription className="text-xs">Outline delivery timeframes, zones in Sultanpur, delivery charges, and dispatch SLA.</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    rows={6}
                    value={policies.shipping}
                    onChange={e => setPolicies({ ...policies, shipping: e.target.value })}
                    placeholder="Enter your Shipping and Delivery Policy here..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
                  />
                </CardContent>
              </Card>

              {/* 4. Cancellation & Refund Policy */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900">Cancellation & Refund Policy</CardTitle>
                  <CardDescription className="text-xs">Guidelines for order cancellations, replacement conditions, and refund processing.</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    rows={6}
                    value={policies.returns}
                    onChange={e => setPolicies({ ...policies, returns: e.target.value })}
                    placeholder="Enter your Cancellation and Refund Policy here..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
                  />
                </CardContent>
              </Card>

              {/* 5. About Us Page Content */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900">About Us Story & Information</CardTitle>
                  <CardDescription className="text-xs">Company mission, Sultanpur local commerce vision, and community profile.</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    rows={5}
                    value={policies.about}
                    onChange={e => setPolicies({ ...policies, about: e.target.value })}
                    placeholder="Enter your About Us description here..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveAll}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Policies</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: DATABASE CONNECTION */}
          {activeTab === 'database' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader className="border-b border-slate-100 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-600" />
                        Cloud Database Status (Supabase)
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        Verify platform database connectivity and synchronize records.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        dbStatus?.connected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${dbStatus?.connected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                        {dbStatus?.connected ? 'CONNECTED' : 'OFFLINE (LOCAL STORAGE)'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Database API Endpoint</span>
                      <span className="font-mono text-xs text-slate-700 break-all select-all">{dbStatus?.url || 'Not configured'}</span>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Connection Strategy</span>
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-slate-400" />
                        Direct Cloud Engine Sync
                      </span>
                    </div>
                  </div>

                  {statusMessage && (
                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50 text-blue-800 text-xs flex items-center gap-2">
                      <RefreshCw className={`w-4 h-4 text-blue-500 ${isTesting || isSyncing || isFetching ? 'animate-spin' : ''}`} />
                      <span>{statusMessage}</span>
                    </div>
                  )}

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-blue-600" /> Supabase Credentials Configuration
                    </h4>
                    <p className="text-xs text-slate-500">
                      If environment variables are unconfigured, enter your Supabase project URL and Anon Key below:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          VITE_SUPABASE_URL
                        </label>
                        <input
                          type="text"
                          value={supabaseUrlInput}
                          onChange={(e) => setSupabaseUrlInput(e.target.value)}
                          placeholder="https://your-project.supabase.co"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-mono text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          VITE_SUPABASE_ANON_KEY
                        </label>
                        <input
                          type="password"
                          value={supabaseKeyInput}
                          onChange={(e) => setSupabaseKeyInput(e.target.value)}
                          placeholder="eyJh..."
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-mono text-slate-800"
                        />
                      </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSaveCredentials}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                      >
                        Save & Reconnect
                      </button>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                    <button
                      onClick={handleTestConnection}
                      disabled={isTesting || isSyncing || isFetching}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                      Re-test Connection
                    </button>

                    <button
                      onClick={handlePullData}
                      disabled={isTesting || isSyncing || isFetching || !dbStatus?.connected}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                      Pull Latest Records
                    </button>

                    <button
                      onClick={handlePushData}
                      disabled={isTesting || isSyncing || isFetching || !dbStatus?.connected}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors shadow-sm ml-auto"
                    >
                      <Play className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      Push Local Data to Cloud
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 6: CLEAN DUMMY DATA */}
          {activeTab === 'data' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-rose-600 flex items-center gap-2 text-base font-bold">
                    <Trash2 className="w-5 h-5 text-rose-500" />
                    Clean Slate / Remove Dummy Data
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Clear dummy demonstration items (products, orders, vendors) to start with a pristine production catalog.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200/60 rounded-xl hover:shadow-xs transition-shadow">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-slate-900">Purge & Clean All Dummy Data</span>
                        <p className="text-xs text-slate-500">Purges pre-populated products, categories, orders, and customer accounts.</p>
                      </div>
                      <button
                        onClick={() => {
                          marketplaceStore.removeDummyData(false);
                          setDataCleanMsg('All pre-populated dummy data successfully removed! Store is now a clean blank slate.');
                          setTimeout(() => setDataCleanMsg(null), 5000);
                        }}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Wipe Dummy Data
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200/60 rounded-xl hover:shadow-xs transition-shadow">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-slate-900">Restore Sultanpur Demo Dataset</span>
                        <p className="text-xs text-slate-500">Restores pre-populated demo vendors, products, and order graphs.</p>
                      </div>
                      <button
                        onClick={() => {
                          marketplaceStore.restoreDummyData();
                          setDataCleanMsg('Sultanpur hyperlocal demo dataset successfully restored.');
                          setTimeout(() => setDataCleanMsg(null), 5000);
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Restore Demo Data
                      </button>
                    </div>
                  </div>

                  {dataCleanMsg && (
                    <div className="p-3.5 bg-slate-900 border border-slate-800 text-white text-xs font-bold rounded-xl text-center shadow-lg animate-in fade-in">
                      {dataCleanMsg}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 7: SECURITY & PROTECTION */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 text-base font-bold">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" /> Security & Code Protection Settings
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Protect platform source code, prevent right-click inspect element, and enforce white-label privacy.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Anti-Copy & Inspect Block */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-600" />
                        <h4 className="text-sm font-bold text-slate-900">Anti-Copy & Inspect Element Protection</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        When enabled, prevents right-clicking context menus, DevTools shortcuts (F12, Ctrl+Shift+I), View Source (Ctrl+U), and selecting code text.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={codeProtection}
                        onChange={(e) => toggleCodeProtection(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* White-Label Brand Stealth Mode */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <EyeOff className="w-4 h-4 text-purple-600" />
                        <h4 className="text-sm font-bold text-slate-900">White-Label Brand Stealth Mode</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Suppresses all platform source signatures, dev tags, and generator footprints across browser requests.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={stealthMode}
                        onChange={(e) => toggleStealthMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-800 flex gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Security Protection Status: Active</p>
                      <p className="mt-0.5 text-emerald-700">
                        {codeProtection
                          ? 'Right-click, F12, Ctrl+Shift+I inspect shortcuts, and view-source are currently blocked to safeguard your code.'
                          : 'Code protection is currently toggled OFF. Developers can right-click and use browser inspect tools.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
