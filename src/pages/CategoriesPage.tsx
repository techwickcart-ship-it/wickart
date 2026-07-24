import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import * as LucideIcons from 'lucide-react';
import { Plus, Search, Trash2, Edit2, ArrowLeft, UploadCloud, Image as ImageIcon, CheckCircle, CheckCircle2, X } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';
import { compressImage } from '../lib/imageUtils';

export function CategoriesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const categories = useMarketplaceData('categories', () => marketplaceStore.getCategories());
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [categoryName, setCategoryName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('Active');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const PRESET_IMAGES = [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300&h=300', // Grocery
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=300&h=300', // Electronics
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=300&h=300', // Fashion
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300&h=300', // Home Appliance
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=300&h=300', // Jewellery
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54c28?auto=format&fit=crop&q=80&w=300&h=300', // Beauty
  ];

  const handleStartAdd = () => {
    setEditingId(null);
    setCategoryName('');
    setImageUrl('');
    setImagePreview(null);
    setStatus('Active');
    setIsAdding(true);
  };

  const handleStartEdit = (cat: any) => {
    setEditingId(cat.id);
    setCategoryName(cat.name || '');
    setImageUrl(cat.image || '');
    setImagePreview(cat.image || null);
    setStatus(cat.status || 'Active');
    setIsAdding(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const compressed = await compressImage(file, 400, 400, 0.82);
        setImagePreview(compressed);
        setImageUrl(compressed);
      } catch (err) {
        console.error('Failed to process uploaded image:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    const finalImage = imageUrl.trim() || imagePreview || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300&h=300';

    if (editingId) {
      marketplaceStore.updateCategory(editingId, {
        name: categoryName.trim(),
        image: finalImage,
        status: status
      });
      setToastMessage(`Category "${categoryName}" updated successfully!`);
    } else {
      marketplaceStore.addCategory({
        name: categoryName.trim(),
        image: finalImage,
        status: status,
        count: 0
      });
      setToastMessage(`Category "${categoryName}" created and published!`);
    }

    setTimeout(() => setToastMessage(null), 4000);

    // Reset Form
    setCategoryName('');
    setImageUrl('');
    setImagePreview(null);
    setStatus('Active');
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      marketplaceStore.deleteCategory(id);
    }
  };

  const getCategoryIcon = (cat: any) => {
    if (cat.iconName) {
      const IconComp = (LucideIcons as any)[cat.iconName];
      if (IconComp) return IconComp;
    }
    if (cat.icon) return cat.icon;
    return LucideIcons.Tv;
  };

  if (isAdding) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h1>
            <p className="text-slate-500 text-sm">
              {editingId ? 'Update existing category details.' : 'Create a new top-level category for your catalog.'}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSaveCategory} className="max-w-2xl space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Footwear, Electronics, Organic Spices" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none transition-all" 
                  required
                />
              </div>

              {/* Image Upload & Preview Section */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category Image</label>
                
                {/* Image Preview Box */}
                {(imagePreview || imageUrl) && (
                  <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                    <img 
                      src={imagePreview || imageUrl} 
                      alt="Category Preview" 
                      className="w-16 h-16 object-cover rounded-lg border border-slate-300 shadow-2xs shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Image Selected & Attached
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{imageUrl || 'Uploaded Local Image File'}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setImagePreview(null); setImageUrl(''); }}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Upload Box */}
                <div className="relative border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-colors p-6 flex flex-col items-center justify-center text-center cursor-pointer group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                  />
                  <div className="w-12 h-12 bg-white rounded-full shadow-2xs flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-5 h-5 text-slate-500 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Click or drag image file here to upload</p>
                  <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WebP up to 5MB</p>
                </div>

                {/* Or Paste URL */}
                <div className="mt-3">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Or Enter Image URL</label>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="url" 
                      placeholder="https://images.unsplash.com/photo-..."
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="mt-3">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Quick Sample Images</label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {PRESET_IMAGES.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="Preset" 
                        onClick={() => {
                          setImageUrl(img);
                          setImagePreview(img);
                        }}
                        className={`w-12 h-12 object-cover rounded-lg border-2 cursor-pointer transition-all hover:scale-105 shrink-0 ${
                          imageUrl === img ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200 opacity-80 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg font-bold text-sm flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/20 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-slate-500 mt-1">Manage main product categories and their visibility.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none shadow-2xs"
            />
          </div>
          <button 
            type="button"
            onClick={handleStartAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((cat) => {
          const Icon = getCategoryIcon(cat);
          return (
            <div key={cat.id} className="bg-white border border-slate-200/80 p-5 rounded-2xl hover:shadow-lg hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 group relative flex flex-col items-center text-center">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                <button 
                  type="button"
                  onClick={() => handleStartEdit(cat)} 
                  className="p-1.5 bg-white/90 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer" 
                  title="Edit Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id, cat.name)} 
                  className="p-1.5 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer" 
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Category Image or Icon */}
              <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-3 overflow-hidden group-hover:scale-105 transition-all duration-300 shadow-2xs p-1">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Icon className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors" />
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{cat.name}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{cat.count || 0} Products</p>
              {cat.status && (
                <span className={`mt-2 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                  cat.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {cat.status}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

