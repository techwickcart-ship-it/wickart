import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Plus, Search, Trash2, Edit2, ArrowLeft, UploadCloud, Image as ImageIcon, CheckCircle, CheckCircle2, X } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';
import { compressImage } from '../lib/imageUtils';

export function SubCategoriesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const subcategories = useMarketplaceData('subcategories', () => marketplaceStore.getSubcategories());
  const categories = useMarketplaceData('categories', () => marketplaceStore.getCategories());

  // Form State
  const [subName, setSubName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('Active');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleStartAdd = () => {
    setEditingId(null);
    setSubName('');
    setParentCategory(categories[0]?.name || 'Grocery');
    setImageUrl('');
    setImagePreview(null);
    setStatus('Active');
    setIsAdding(true);
  };

  const handleStartEdit = (sc: any) => {
    setEditingId(sc.id);
    setSubName(sc.name || '');
    setParentCategory(sc.parent || '');
    setImageUrl(sc.image || '');
    setImagePreview(sc.image || null);
    setStatus(sc.status || 'Active');
    setIsAdding(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 400, 400, 0.82);
        setImagePreview(compressed);
        setImageUrl(compressed);
      } catch (err) {
        console.error('Failed to process subcategory image:', err);
      }
    }
  };

  const handleSaveSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) {
      alert('Please enter a subcategory name');
      return;
    }
    if (!parentCategory.trim()) {
      alert('Please select a parent category');
      return;
    }

    const finalImage = imageUrl.trim() || imagePreview || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200&h=200';

    if (editingId) {
      marketplaceStore.updateSubcategory(editingId, {
        name: subName.trim(),
        parent: parentCategory,
        image: finalImage,
        status: status
      });
    } else {
      marketplaceStore.addSubcategory({
        name: subName.trim(),
        parent: parentCategory,
        image: finalImage,
        status: status,
        count: 0
      });
    }

    // Reset Form
    setSubName('');
    setParentCategory('');
    setImageUrl('');
    setImagePreview(null);
    setStatus('Active');
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDeleteSubcategory = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete subcategory "${name}"?`)) {
      marketplaceStore.deleteSubcategory(id);
    }
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
              {editingId ? 'Edit Sub Category' : 'Add Sub Category'}
            </h1>
            <p className="text-slate-500 text-sm">
              {editingId ? 'Update existing subcategory mapping.' : 'Create a new sub-category mapped to a parent category.'}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSaveSubcategory} className="max-w-2xl space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Sub Category Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Smart TVs, Organic Pulses, Running Shoes" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none transition-all" 
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Parent Category <span className="text-red-500">*</span></label>
                <select 
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                  required
                >
                  <option value="">-- Select Parent Category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Grocery">Grocery & Daily Essentials</option>
                  <option value="Electronics">Electronics & Gadgets</option>
                  <option value="Fashion">Fashion & Clothing</option>
                  <option value="Home Appliance">Home Appliance</option>
                  <option value="Jewellery">Jewellery & Accessories</option>
                </select>
              </div>

              {/* Sub Category Image Upload & Preview */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Sub Category Image</label>
                
                {/* Preview Box */}
                {(imagePreview || imageUrl) && (
                  <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                    <img 
                      src={imagePreview || imageUrl} 
                      alt="Subcategory Preview" 
                      className="w-16 h-16 object-cover rounded-lg border border-slate-300 shadow-2xs shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Image Selected
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{imageUrl || 'Uploaded Local File'}</p>
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

                {/* Upload Area */}
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
                  <p className="text-sm font-bold text-slate-700">Click or drag subcategory image file here</p>
                  <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WebP up to 5MB</p>
                </div>

                {/* Or Image URL */}
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
                  Save Sub Category
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredSubcategories = subcategories.filter(sc => 
    sc.name.toLowerCase().includes(search.toLowerCase()) || 
    (sc.parent && sc.parent.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sub Categories</h1>
          <p className="text-slate-500 mt-1">Manage sub categories mapping and hierarchy.</p>
        </div>
        <button 
          type="button"
          onClick={handleStartAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Sub Category
        </button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <CardTitle>All Sub Categories ({filteredSubcategories.length})</CardTitle>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search subcategory or parent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 hover:border-slate-300 transition-colors outline-none"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Sub Category</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Parent Category</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Products</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubcategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-xl border border-slate-200 shadow-2xs shrink-0" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-xs shrink-0">
                            {cat.name.charAt(0)}
                          </div>
                        )}
                        <span>{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold border border-blue-100">
                        {cat.parent}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{cat.count || 0} Products</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        cat.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {cat.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200 transition-colors cursor-pointer" 
                          title="Edit Subcategory"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteSubcategory(cat.id, cat.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors cursor-pointer" 
                          title="Delete Subcategory"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

