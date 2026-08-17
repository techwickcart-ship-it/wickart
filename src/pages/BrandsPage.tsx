import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { 
  Plus, Search, Edit2, Trash2, X, Check, Image, Tag, Layers, 
  CheckCircle, RefreshCw, UploadCloud, CloudCheck, AlertCircle 
} from 'lucide-react';
import { marketplaceStore, useMarketplaceData, Brand } from '../lib/store';

export function BrandsPage() {
  const brands = useMarketplaceData('brands', () => marketplaceStore.getBrands());
  const products = useMarketplaceData('products', () => marketplaceStore.getProducts());

  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  // Form states
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [brandStatus, setBrandStatus] = useState<'active' | 'inactive'>('active');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Automatically sync with cloud database on component mount
  useEffect(() => {
    handleSyncCloud();
  }, []);

  const handleSyncCloud = async () => {
    setIsSyncing(true);
    try {
      await marketplaceStore.syncBrandsFromSupabase();
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('Sync brands error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const getProductCountForBrand = (name: string) => {
    return products.filter(p => p.brand && p.brand.toLowerCase() === name.toLowerCase()).length;
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setBrandLogo(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = brandName.trim();
    if (!cleanName) return;

    const item = marketplaceStore.addBrand({
      name: cleanName,
      logo: brandLogo.trim() || '',
      status: brandStatus,
      count: 0
    });

    setBrandName('');
    setBrandLogo('');
    setBrandStatus('active');
    setIsAdding(false);
    setSuccessMessage(`Brand "${cleanName}" added and synced across all devices!`);
    setTimeout(() => setSuccessMessage(null), 4000);

    // Trigger instant cloud push
    try {
      await marketplaceStore.saveBrandToSupabase(item);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('Cloud save error:', err);
    }
  };

  const startEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setBrandName(brand.name);
    setBrandLogo(brand.logo || '');
    setBrandStatus(brand.status);
    setIsAdding(false);
  };

  const handleUpdate = async (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = brandName.trim();
    if (!cleanName) return;

    const updated = marketplaceStore.updateBrand(id, {
      name: cleanName,
      logo: brandLogo.trim() || '',
      status: brandStatus
    });

    setEditingId(null);
    setBrandName('');
    setBrandLogo('');
    setSuccessMessage(`Brand "${cleanName}" updated successfully.`);
    setTimeout(() => setSuccessMessage(null), 4000);

    if (updated) {
      try {
        await marketplaceStore.saveBrandToSupabase(updated);
      } catch (err) {
        console.warn('Cloud update error:', err);
      }
    }
  };

  const toggleStatus = async (brand: Brand) => {
    const newStatus = brand.status === 'active' ? 'inactive' : 'active';
    const updated = marketplaceStore.updateBrand(brand.id, { status: newStatus });
    if (updated) {
      try {
        await marketplaceStore.saveBrandToSupabase(updated);
      } catch (err) {
        console.warn('Cloud toggle status error:', err);
      }
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (confirm(`Are you sure you want to delete brand "${brand.name}"?`)) {
      marketplaceStore.deleteBrand(brand.id);
      setSuccessMessage(`Brand "${brand.name}" removed.`);
      setTimeout(() => setSuccessMessage(null), 4000);
      try {
        await marketplaceStore.deleteBrandFromSupabase(brand.id, brand.name);
      } catch (err) {
        console.warn('Cloud delete error:', err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Toast notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-white/80 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Catalog</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Brands</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Brand Directory</h1>
            {lastSyncedTime && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Synced {lastSyncedTime}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Manage global product manufacturers, brand logos, and multi-device cloud synchronization.</p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleSyncCloud}
            disabled={isSyncing}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Sync latest brands from cloud database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>

          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setBrandName(''); setBrandLogo(''); setBrandStatus('active'); }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Brand</span>
          </button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              All Brands ({brands.length})
            </CardTitle>
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">
              {brands.filter(b => b.status === 'active').length} Active
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search brand name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          
          {/* Add Brand Inline Form */}
          {isAdding && (
            <form onSubmit={handleAdd} className="p-5 border-b border-slate-100 bg-blue-50/50 space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-blue-600" /> Create New Brand
                </h3>
                <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Brand Name *</label>
                  <input 
                    type="text" 
                    required
                    autoFocus
                    placeholder="e.g. Nike, Apple, Sony, Tata..." 
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-blue-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Logo / Image</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="https://... or upload" 
                      value={brandLogo}
                      onChange={(e) => setBrandLogo(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <label className="p-2 bg-white border border-blue-200 hover:bg-blue-50 rounded-xl cursor-pointer text-blue-600 text-xs font-bold shrink-0 transition-colors flex items-center gap-1" title="Upload Logo">
                      <UploadCloud className="w-4 h-4" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} 
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={brandStatus}
                    onChange={(e: any) => setBrandStatus(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-blue-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {brandLogo && (
                <div className="flex items-center gap-3 p-2.5 bg-white border border-blue-100 rounded-xl">
                  <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-1 overflow-hidden shrink-0">
                    <img src={brandLogo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <span className="text-xs text-slate-500 truncate flex-1 font-mono">{brandLogo.substring(0, 50)}...</span>
                  <button type="button" onClick={() => setBrandLogo('')} className="text-rose-500 text-xs font-bold hover:underline cursor-pointer">Remove</button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)} 
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Brand
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Logo</th>
                  <th className="px-6 py-3.5">Brand Name</th>
                  <th className="px-6 py-3.5">Attached Products</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {filteredBrands.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-slate-600 text-sm">No brands found</p>
                      <p className="text-xs text-slate-400 mt-1">Click "Add New Brand" to create one and sync it to the cloud.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBrands.map(brand => {
                    const prodCount = getProductCountForBrand(brand.name);

                    return (
                      <tr key={brand.id} className="hover:bg-slate-50/80 transition-colors group">
                        
                        {/* Logo Thumbnail */}
                        <td className="px-6 py-3.5">
                          <div className="w-10 h-10 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center p-1 shrink-0">
                            {brand.logo && brand.logo.trim() ? (
                              <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                            ) : (
                              <Image className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                        </td>

                        {/* Name Column */}
                        <td className="px-6 py-3.5">
                          <div>
                            <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{brand.name}</span>
                            <span className="block text-[10px] text-slate-400 font-normal truncate max-w-[200px]">ID: #{brand.id}</span>
                          </div>
                        </td>

                        {/* Product Count */}
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-[11px] border border-slate-200">
                            <Layers className="w-3 h-3 text-blue-600" />
                            {prodCount} Products
                          </span>
                        </td>

                        {/* Status Column */}
                        <td className="px-6 py-3.5">
                          <button 
                            onClick={() => toggleStatus(brand)}
                            title="Click to toggle status"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase cursor-pointer transition-all ${
                              brand.status === 'active' 
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${brand.status === 'active' ? 'bg-emerald-600' : 'bg-slate-500'}`}></span>
                            {brand.status}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => startEdit(brand)} 
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Brand"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(brand)} 
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Brand"
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

      {/* Edit Brand Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-bold">Edit Brand Details</h3>
                <p className="text-xs text-slate-400 mt-0.5">Update brand name, logo image URL, and visibility status</p>
              </div>
              <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => handleUpdate(editingId, e)} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name *</label>
                <input 
                  type="text" 
                  required 
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Logo / Image URL</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center p-1 shrink-0">
                    {brandLogo && brandLogo.trim() ? (
                      <img src={brandLogo} alt="Preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Image className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="https://example.com/logo.png" 
                      value={brandLogo}
                      onChange={(e) => setBrandLogo(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none"
                    />
                    <label className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl cursor-pointer text-slate-600 shrink-0 transition-colors" title="Upload Replacement Logo">
                      <UploadCloud className="w-4 h-4" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} 
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select 
                  value={brandStatus}
                  onChange={(e: any) => setBrandStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingId(null)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Update Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
