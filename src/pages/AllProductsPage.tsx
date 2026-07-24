import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, Plus, Trash2, Edit, ExternalLink, Filter, Package, Tag, ArrowUpDown, CheckCircle, X, Gift } from 'lucide-react';
import { marketplaceStore, useMarketplaceData, Product } from '../lib/store';

interface AllProductsPageProps {
  onNavigate?: (page: string) => void;
}

export function AllProductsPage({ onNavigate }: AllProductsPageProps) {
  const products = useMarketplaceData('products', () => marketplaceStore.getProducts());
  const categoriesList = useMarketplaceData('categories', () => marketplaceStore.getCategories());

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editMrp, setEditMrp] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editVendor, setEditVendor] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editSizes, setEditSizes] = useState('');
  const [editVariants, setEditVariants] = useState('');

  // Dynamic Categories for filter dropdown
  const categories = ['All', ...Array.from(new Set([...categoriesList.map(c => c.name), 'Grocery', 'Electronics', 'Fashion', 'Beverages', 'Beauty & Health', 'Home & Kitchen']))];
  
  // Extract unique vendors
  const vendors = ['All', ...Array.from(new Set(products.map(p => p.vendor).filter(Boolean)))];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.vendor && p.vendor.toLowerCase().includes(search.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || 
      (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesVendor = selectedVendor === 'All' || p.vendor === selectedVendor;

    return matchesSearch && matchesCategory && matchesVendor;
  });

  const handleDeleteProduct = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the product catalog?`)) {
      marketplaceStore.deleteProduct(id);
      setDeleteSuccess(`Product "${name}" deleted successfully.`);
      setTimeout(() => setDeleteSuccess(null), 4000);
    }
  };

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name || '');
    setEditPrice(p.price || '');
    setEditMrp(p.mrp || '');
    setEditCategory(p.category || 'Grocery');
    setEditVendor(p.vendor || '');
    setEditImage(p.image || '');
    setEditDesc(p.description || '');
    setEditSizes(Array.isArray(p.sizes) ? p.sizes.join(', ') : '');
    setEditVariants(Array.isArray(p.variants) ? p.variants.join(', ') : '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formattedPrice = editPrice.startsWith('₹') ? editPrice : `₹${editPrice}`;
    const formattedMrp = editMrp ? (editMrp.startsWith('₹') ? editMrp : `₹${editMrp}`) : formattedPrice;

    marketplaceStore.updateProduct(editingProduct.id, {
      name: editName.trim(),
      price: formattedPrice,
      mrp: formattedMrp,
      category: editCategory,
      vendor: editVendor.trim(),
      image: editImage.trim() || editingProduct.image,
      description: editDesc.trim(),
      sizes: editSizes.split(',').map(s => s.trim()).filter(Boolean),
      variants: editVariants.split(',').map(v => v.trim()).filter(Boolean)
    });

    setEditingProduct(null);
    setDeleteSuccess(`Product "${editName}" updated successfully.`);
    setTimeout(() => setDeleteSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      {/* Toast Banner */}
      {deleteSuccess && (
        <div className="p-4 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{deleteSuccess}</span>
          </div>
          <button onClick={() => setDeleteSuccess(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Catalog</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">All Products</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">All Marketplace Products</h1>
          <p className="text-xs text-slate-500 mt-1">Manage and inspect all {products.length} live catalog items across all vendors.</p>
        </div>

        <button 
          onClick={() => onNavigate?.('Add Product')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters & Stats Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search products, vendors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white cursor-pointer"
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>Category: {cat}</option>
              ))}
            </select>

            {/* Vendor Filter */}
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white cursor-pointer"
            >
              {vendors.map((v, i) => (
                <option key={i} value={v}>Vendor: {v}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <span className="text-xs font-bold text-slate-500">{filteredProducts.length} Products Found</span>
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            <button 
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${viewMode === 'table' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Table
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Grid
            </button>
          </div>

        </CardContent>
      </Card>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No products found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Try adjusting your search or category filters.</p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedVendor('All'); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </Card>
      ) : viewMode === 'table' ? (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Attached Sizes & Variants</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Vendor</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center p-1">
                          <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{product.name}</p>
                          <p className="text-[11px] text-slate-400">ID: #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-[11px] font-bold border border-blue-100">
                        {product.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                          product.sizes.map((sz: string, idx: number) => (
                            <span key={idx} className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">
                              Size: {sz}
                            </span>
                          ))
                        ) : null}
                        {Array.isArray(product.variants) && product.variants.length > 0 ? (
                          product.variants.map((vr: string, idx: number) => (
                            <span key={idx} className="text-[10px] font-bold px-1.5 py-0.5 bg-purple-50 text-purple-800 rounded border border-purple-200">
                              Var: {vr}
                            </span>
                          ))
                        ) : null}
                        {(!product.sizes || product.sizes.length === 0) && (!product.variants || product.variants.length === 0) && (
                          <span className="text-[10px] text-slate-400 italic">Standard</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      {product.price}
                      {product.mrp && <span className="line-through text-slate-400 text-[10px] ml-1.5 font-normal">{product.mrp}</span>}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {product.vendor || 'City Square Mart'}
                    </td>
                    <td className="py-3 px-4">
                      {product.isComboOffer ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase bg-amber-100 text-amber-900 border border-amber-300 w-fit">
                            <Gift className="w-3 h-3 text-amber-600" /> {product.comboTag || 'COMBO'}
                          </span>
                          {product.comboTitle && (
                            <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]" title={product.comboTitle}>
                              {product.comboTitle}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                          product.tag === 'DRAFT' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {product.tag || 'NEW'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={`/#product-${product.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleStartEdit(product)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:border-blue-200 transition-all group">
              <div className="aspect-square bg-slate-50 border-b border-slate-100 relative p-4 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded">
                  {product.category || 'General'}
                </span>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm truncate">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-black text-blue-600 text-base">{product.price}</span>
                  <span className="text-[11px] text-slate-500 font-semibold">{product.vendor}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">ID: #{product.id}</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleStartEdit(product)}
                      className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-bold">Edit Product #{editingProduct.id}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Update details for <strong className="text-blue-400">{editingProduct.name}</strong></p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name / Title *</label>
                <input 
                  type="text" 
                  required 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price *</label>
                  <input 
                    type="text" 
                    required 
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">MRP Price</label>
                  <input 
                    type="text" 
                    value={editMrp}
                    onChange={(e) => setEditMrp(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select 
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
                  >
                    {categories.filter(c => c !== 'All').map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vendor / Store Name</label>
                  <input 
                    type="text" 
                    value={editVendor}
                    onChange={(e) => setEditVendor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                  <input 
                    type="text" 
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attached Sizes (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. S, M, L, XL"
                    value={editSizes}
                    onChange={(e) => setEditSizes(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attached Variants (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 500g, 1kg, Red, Blue"
                    value={editVariants}
                    onChange={(e) => setEditVariants(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  rows={3} 
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
