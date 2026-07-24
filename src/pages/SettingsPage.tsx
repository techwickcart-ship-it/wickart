import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Save, UploadCloud, Building2, Scale, Image as ImageIcon, Database, Check, AlertTriangle, RefreshCw, Play, Laptop, HelpCircle, Trash2, ShieldCheck, Lock, EyeOff, CheckCircle } from 'lucide-react';
import { marketplaceStore } from '../lib/store';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [companyName, setCompanyName] = useState(() => marketplaceStore.getCompanyName());
  const [dataCleanMsg, setDataCleanMsg] = useState<string | null>(null);
  
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

  useEffect(() => {
    setCompanyName(marketplaceStore.getCompanyName());
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

  const handleSave = () => {
    marketplaceStore.saveCompanyName(companyName);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-slate-500 mt-1">Manage global app configurations, policies, and platform identity.</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'general'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              General Details
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'media'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Media & Assets
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'policies'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Scale className="w-4 h-4" />
              Legal & Policies
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'database'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              Database Connection
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'data'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              Clean Dummy Data
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Security & Code Protection
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6 min-w-0">
          
          {activeTab === 'general' && (
            <>
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Primary contact details for support and users.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                      <input
                        type="email"
                        defaultValue="support@hyperlocal.app"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                      <input
                        type="tel"
                        defaultValue="+91 9876543210"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Registered Header Address</label>
                      <textarea
                        rows={3}
                        defaultValue={"123, Silicon Valley Tech Park,\nSector 4, Bangalore, India - 560001"}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Branding */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Branding</CardTitle>
                  <CardDescription>Upload your platform logo and site identity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer group">
                      <UploadCloud className="w-8 h-8 mb-2 group-hover:text-blue-500 transition-colors" />
                      <span className="text-xs font-medium">Upload Logo</span>
                    </div>
                    <div className="space-y-3 flex-1">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        This logo will be displayed on the app, website, and all transactional emails. Recommended size: 512x512px.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Home Page Sections Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Home Page Sections Configuration</CardTitle>
                  <CardDescription>Configure custom image sections and text for your home page (e.g., Top Categories, Value Packs).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Top Categories */}
                  <div className="border border-slate-200 rounded-xl p-4">
                     <h3 className="font-bold text-slate-900 mb-2">Top Categories Display</h3>
                     <p className="text-sm text-slate-500 mb-4">Upload up to 8 category images that will appear on the storefront homepage.</p>
                     <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                           <div key={idx} className="space-y-2">
                              <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer group p-2 text-center">
                                <ImageIcon className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                              </div>
                              <input type="text" placeholder={`Category ${idx}`} className="w-full text-xs px-2 py-1 border border-slate-200 rounded-md outline-none focus:border-blue-500" />
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Value Packs & Banners */}
                  <div className="border border-slate-200 rounded-xl p-4">
                     <div className="flex justify-between items-center mb-4">
                        <div>
                           <h3 className="font-bold text-slate-900 mb-1">Custom Website Sections</h3>
                           <p className="text-sm text-slate-500">Add dynamic image banners and custom text titles (e.g. Value Packs & Favourites).</p>
                        </div>
                        <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
                           + Add New Section
                        </button>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <input type="text" defaultValue="Value Packs & Favourites" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-blue-500 outline-none" />
                           <div className="aspect-[2/1] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer group p-2 text-center">
                             <UploadCloud className="w-8 h-8 mb-2 group-hover:text-blue-500 transition-colors" />
                             <span className="text-xs font-medium leading-tight">Upload Banner (Left)</span>
                           </div>
                        </div>
                        <div className="space-y-3">
                           <input type="text" placeholder="Section Title (Optional)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-blue-500 outline-none opacity-0" disabled />
                           <div className="aspect-[2/1] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer group p-2 text-center">
                             <UploadCloud className="w-8 h-8 mb-2 group-hover:text-blue-500 transition-colors" />
                             <span className="text-xs font-medium leading-tight">Upload Banner (Right)</span>
                           </div>
                        </div>
                     </div>
                  </div>
                </CardContent>
              </Card>

              {/* Website Sliders */}
              <Card>
                <CardHeader>
                  <CardTitle>Website Sliders</CardTitle>
                  <CardDescription>Upload 5 to 6 promotion banners for the storefront homepage.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                      <div key={idx} className="aspect-video rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer group p-2 text-center">
                        <UploadCloud className="w-6 h-6 mb-2 group-hover:text-blue-500 transition-colors" />
                        <span className="text-[10px] font-medium leading-tight">Upload Slider {idx}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-4">
                    Recommended resolution: 1920x1080px (16:9 ratio). These will cycle automatically on the customer homepage.
                  </p>
                </CardContent>
              </Card>

              {/* Promotional Banner */}
              <Card>
                <CardHeader>
                  <CardTitle>Promotional Banner</CardTitle>
                  <CardDescription>Upload a large promotional banner to be displayed on top of the storefront or in special sections.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-full sm:w-64 h-32 shrink-0 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer group">
                      <ImageIcon className="w-8 h-8 mb-2 group-hover:text-blue-500 transition-colors" />
                      <span className="text-xs font-medium">Upload Banner</span>
                    </div>
                    <div className="space-y-3 flex-1">
                      <p className="text-sm text-slate-700 font-medium">
                        Upload a high-quality banner for special sales, festivals, or general promotions.
                      </p>
                      <p className="text-xs text-slate-500">
                        This image will be highlighted prominently across the platform. Recommended size: 1920x400px.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Us Photo */}
              <Card>
                <CardHeader>
                  <CardTitle>About Us Page Photo</CardTitle>
                  <CardDescription>Featured image for the "About Us" section of your storefront.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-48 h-32 shrink-0 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer group">
                      <ImageIcon className="w-8 h-8 mb-2 group-hover:text-blue-500 transition-colors" />
                      <span className="text-xs font-medium">Upload Photo</span>
                    </div>
                    <div className="space-y-3 flex-1">
                      <p className="text-sm text-slate-700 font-medium">
                        Upload a high-quality team photo, store picture, or brand imagery.
                      </p>
                      <p className="text-xs text-slate-500">
                        This image will be highlighted prominently on the About Us page. Recommended size: 1200x800px.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                  <CardDescription>Define the rules and guidelines users must agree to.</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    rows={6}
                    placeholder="Enter your Terms and Conditions here..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <div className="mt-2 text-xs text-slate-500 flex justify-end">Markdown format supported</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy</CardTitle>
                  <CardDescription>Detail how you collect, use, and protect user data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    rows={6}
                    placeholder="Enter your Privacy Policy here..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cancellation & Refund Policy</CardTitle>
                  <CardDescription>Guidelines for order cancellations and user refunds.</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    rows={4}
                    placeholder="Enter your Cancellation and Refund Policy here..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Policy</CardTitle>
                  <CardDescription>Details regarding delivery timelines, constraints, and operational zones.</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    rows={4}
                    placeholder="Enter your Shipping and Delivery Policy here..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Card>
                <CardHeader className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-600" />
                        Cloud Database Status
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500 mt-0.5">
                        Verify platform database connectivity and synchronize records.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        dbStatus?.connected 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${dbStatus?.connected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                        {dbStatus?.connected ? 'CONNECTED' : 'OFFLINE MODE (LOCAL STORAGE)'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Connection Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Database API Endpoint</span>
                      <span className="font-mono text-xs text-slate-700 break-all select-all">{dbStatus?.url || 'Not configured'}</span>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Connection Strategy</span>
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-slate-400" />
                        Direct Cloud Engine Sync
                      </span>
                    </div>
                  </div>

                  {/* Status log message */}
                  {statusMessage && (
                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50 text-blue-800 text-xs flex items-center gap-2">
                      <RefreshCw className={`w-4 h-4 text-blue-500 ${isTesting || isSyncing || isFetching ? 'animate-spin' : ''}`} />
                      <span>{statusMessage}</span>
                    </div>
                  )}

                  {/* Table Status Checkers */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Database Table Checks</h3>
                    
                    {/* delivery_partners table */}
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-all duration-200">
                      <div className="space-y-1">
                        <span className="font-mono text-sm font-semibold text-slate-800">delivery_partners</span>
                        <p className="text-xs text-slate-400">Stores operational fleet agents, delivery boys, and organizations.</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {dbStatus?.tables?.delivery_partners?.status === 'Accessible' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">
                              {dbStatus.tables.delivery_partners.count} records saved
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-xs font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Ready
                            </span>
                          </div>
                        ) : dbStatus?.tables?.delivery_partners?.status === 'Error' ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-bold">
                              Table Not Found
                            </span>
                            <span className="text-[10px] text-slate-400 max-w-[200px] text-right break-words font-mono">
                              {dbStatus.tables.delivery_partners.error}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Not checked</span>
                        )}
                      </div>
                    </div>

                    {/* coupons table */}
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-all duration-200">
                      <div className="space-y-1">
                        <span className="font-mono text-sm font-semibold text-slate-800">coupons</span>
                        <p className="text-xs text-slate-400">Stores promotional voucher codes, values, and constraints.</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {dbStatus?.tables?.coupons?.status === 'Accessible' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">
                              {dbStatus.tables.coupons.count} records saved
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-xs font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Ready
                            </span>
                          </div>
                        ) : dbStatus?.tables?.coupons?.status === 'Error' ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-bold">
                              Table Not Found
                            </span>
                            <span className="text-[10px] text-slate-400 max-w-[200px] text-right break-words font-mono">
                              {dbStatus.tables.coupons.error}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Not checked</span>
                        )}
                      </div>
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

              {/* Troubleshooting Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-500" />
                    How to configure your database & save data properly
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-slate-600">
                  <p>
                    Wikcart is fully integrated with a cloud database engine. If your environment is configured, adding any new delivery partner or coupon on the panels will automatically be saved <strong>live to your cloud database in real-time</strong>.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800">1. Required SQL Schema Tables</h4>
                    <p>
                      Ensure you have created the correct tables in your database dashboard (under the SQL Editor). Copy the schema from the file <code className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-800">database_schema.sql</code> or use the specific script available on the <code className="text-blue-600 font-medium">Delivery Partners Page</code>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800">2. App Secrets Setup</h4>
                    <p>
                      Define the following secret variables in your environment project settings (.env):
                    </p>
                    <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-slate-700">
                      <li><strong>VITE_DB_URL</strong> / <strong>VITE_SUPABASE_URL</strong>: The API URL of your cloud database project</li>
                      <li><strong>VITE_DB_ANON_KEY</strong> / <strong>VITE_SUPABASE_ANON_KEY</strong>: The anonymous public API key of your cloud database project</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3 text-[11px] text-amber-800 leading-relaxed flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Offline Resilience:</strong> If your database credentials are not configured, Wikcart seamlessly stores everything locally in your browser cache (<code className="font-mono">localStorage</code>) so that you never lose your progress during development.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card>
                <CardHeader>
                  <CardTitle className="text-rose-600 flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-rose-500" />
                    Clean Slate / Remove Dummy Data
                  </CardTitle>
                  <CardDescription>
                    Wikcart comes pre-populated with a rich hyperlocal Sultanpur demonstration dataset (products, orders, vendors, categories) to showcase its dynamic features. Clear this dummy data to prepare the platform for real-world live use.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Mode Banner */}
                  {marketplaceStore.isDummyDataRemoved() ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-emerald-900 text-sm">Clean Live Mode Active</h4>
                        <p className="text-xs text-emerald-600 mt-1 leading-relaxed">
                          All hardcoded mock demonstration data has been removed. The storefront, admin dashboard, and vendor panels are completely blank, ready for fresh categories, sellers, actual inventories, and customer bookings!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-900 text-sm">Demo Data Active</h4>
                        <p className="text-xs text-amber-600 mt-1 leading-relaxed">
                          Currently showing pre-loaded demo items including 5 active vendors, 38 categories, 45 products, and historic mock bookings. Any new entries you add are combined with this demo catalog.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 space-y-4">
                    <h4 className="text-sm font-semibold text-slate-800">Available Cleanup Operations</h4>
                    
                    <div className="flex flex-col gap-4">
                      {/* Clean Demo Data action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200/60 rounded-xl hover:shadow-md transition-shadow">
                        <div className="space-y-1">
                          <span className="text-sm font-semibold text-slate-900">Purge & Clean All Dummy Data</span>
                          <p className="text-xs text-slate-500">Completely purges all default products, categories, subcategories, customers, orders, partners, and withdrawals.</p>
                        </div>
                        <button
                          onClick={() => {
                            marketplaceStore.removeDummyData(false);
                            setDataCleanMsg('All pre-populated dummy data successfully removed! Store is now a clean blank slate.');
                            setTimeout(() => setDataCleanMsg(null), 5000);
                          }}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                        >
                          Wipe Dummy Data
                        </button>
                      </div>

                      {/* Restore Demo Data action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200/60 rounded-xl hover:shadow-md transition-shadow">
                        <div className="space-y-1">
                          <span className="text-sm font-semibold text-slate-900">Restore Sultanpur Demo Dataset</span>
                          <p className="text-xs text-slate-500">Restore the complete hyperlocal demonstration catalog if you want to preview active graphs, layouts, and orders.</p>
                        </div>
                        <button
                          onClick={() => {
                            marketplaceStore.restoreDummyData();
                            setDataCleanMsg('Sultanpur hyperlocal demo dataset successfully restored.');
                            setTimeout(() => setDataCleanMsg(null), 5000);
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                        >
                          Restore Demo Data
                        </button>
                      </div>
                    </div>
                  </div>

                  {dataCleanMsg && (
                    <div className="p-3.5 bg-slate-900 border border-slate-800 text-white text-xs font-semibold rounded-xl text-center shadow-lg animate-in fade-in duration-300">
                      {dataCleanMsg}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Hardening Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                    Production Readiness Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-600 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✔</span>
                    <p><strong>Clean Slate Setup:</strong> Set dynamic lists to empty to bypass pre-loaded defaults and let real vendors sign up.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✔</span>
                    <p><strong>Cloud Sync Ready:</strong> Configure Cloud Database connection keys to enable permanent records across sessions.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✔</span>
                    <p><strong>No Cache Leak:</strong> To restore or test, you can seamlessly switch back to demonstration mode at any time above.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 text-base font-bold">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" /> Security & Code Protection Settings
                  </CardTitle>
                  <CardDescription>
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
