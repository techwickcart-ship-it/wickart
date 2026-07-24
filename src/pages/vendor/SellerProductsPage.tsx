import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Search, Plus, Trash2, Package, Tag, Image, DollarSign, X, CheckCircle2 } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';

interface SellerProductsPageProps {
  initialTab?: string;
}

export function SellerProductsPage({ initialTab }: SellerProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const allProducts = useMarketplaceData('products', () => marketplaceStore.getProducts());
  const { activeSellerStoreName, activeSellerId } = useActiveSellerStore();

  useEffect(() => {
    if (initialTab === 'Add Product') {
      setIsAddModalOpen(true);
    }
  }, [initialTab]);

  // Form state for new product
  const liveBrands = useMarketplaceData('brands', () => marketplaceStore.getBrands());
  const [newProductName, setNewProductName] = useState('');
  const [newCategory, setNewCategory] = useState('Grocery');
  const [newBrand, setNewBrand] = useState('Generic');
  const [newPrice, setNewPrice] = useState('');
  const [newMrp, setNewMrp] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Filter products belonging strictly to active vendor store
  const sellerProducts = allProducts.filter(p => {
    const vendorMatch = Boolean(p.vendor && p.vendor.trim().toLowerCase() === activeSellerStoreName.trim().toLowerCase());
    const idMatch = Boolean(p.sellerId && String(p.sellerId) === String(activeSellerId));
    return vendorMatch || idMatch;
  });

  const handleDelete = (id: number | string) => {
    if (confirm('Are you sure you want to remove this product from your catalog?')) {
      const list = marketplaceStore.getProducts();
      const updated = list.filter(p => String(p.id) !== String(id));
      marketplaceStore.saveProducts(updated);
      setToastMessage('Product removed successfully.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newPrice) return;

    const formattedPrice = newPrice.startsWith('₹') ? newPrice : `₹${newPrice}`;
    const formattedMrp = newMrp ? (newMrp.startsWith('₹') ? newMrp : `₹${newMrp}`) : formattedPrice;

    const added = marketplaceStore.addProduct({
      name: newProductName,
      price: formattedPrice,
      mrp: formattedMrp,
      category: newCategory,
      brand: newBrand || 'Generic',
      vendor: activeSellerStoreName,
      sellerId: activeSellerId,
      image: newImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      shortDescription: newDesc || `${newProductName} sourced and fulfilled by ${activeSellerStoreName}.`,
      description: newDesc || `${newProductName} sourced and fulfilled by ${activeSellerStoreName}.`,
      rating: 4.8,
      tag: 'NEW'
    });

    setIsAddModalOpen(false);
    setNewProductName('');
    setNewPrice('');
    setNewMrp('');
    setNewImage('');
    setNewDesc('');

    setToastMessage(`Product "${added.name}" added successfully to ${activeSellerStoreName}!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filtered = sellerProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Products</h1>
          <p className="text-slate-500 mt-1">
            Manage product catalog, prices, and listings for <strong className="text-slate-800">{activeSellerStoreName}</strong>.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="p-4 text-center">
               <h3 className="text-2xl font-black text-blue-900">{sellerProducts.length}</h3>
               <p className="text-sm font-bold text-blue-600 mt-0.5">Total Store Products</p>
            </CardContent>
         </Card>
         <Card className="bg-emerald-50/50 border-emerald-100">
            <CardContent className="p-4 text-center">
               <h3 className="text-2xl font-black text-emerald-900">{sellerProducts.length}</h3>
               <p className="text-sm font-bold text-emerald-600 mt-0.5">Live on Storefront</p>
            </CardContent>
         </Card>
         <Card className="bg-purple-50/50 border-purple-100">
            <CardContent className="p-4 text-center">
               <h3 className="text-2xl font-black text-purple-900">100%</h3>
               <p className="text-sm font-bold text-purple-600 mt-0.5">Vendor Catalog Scope</p>
            </CardContent>
         </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/30">
           <CardTitle className="font-bold text-slate-800">
             Products Listing for "{activeSellerStoreName}"
           </CardTitle>
           <div className="relative w-full sm:w-auto">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Search my products..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9 pr-4 py-2 w-full sm:w-64 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-all font-medium text-slate-700" 
             />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">No products found for {activeSellerStoreName}</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                {searchQuery ? 'Try adjusting your search criteria.' : 'Your store does not have any product listings yet. Click below to add your first product!'}
              </p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Add Product to Store
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                 <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                    <tr>
                       <th className="px-6 py-4">Product details</th>
                       <th className="px-6 py-4">Category</th>
                       <th className="px-6 py-4">Price</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filtered.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/40 transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                               </div>
                               <div>
                                  <p className="font-bold text-slate-900">{prod.name}</p>
                                  <p className="text-xs text-slate-400 font-mono">ID: #{prod.id}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                           <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                             {prod.category || 'General'}
                           </span>
                         </td>
                         <td className="px-6 py-4 font-bold text-slate-900">{prod.price}</td>
                         <td className="px-6 py-4">
                           <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                             Approved & Live
                           </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDelete(prod.id)}
                              className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors inline-flex"
                              title="Delete Product"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Add Product to Store</h3>
                <p className="text-xs text-slate-400 mt-0.5">Store: <strong className="text-emerald-400">{activeSellerStoreName}</strong></p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title / Name *</label>
                <input 
                  type="text" 
                  required 
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Fresh Farm Whole Wheat Atta 5kg" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                  >
                    <option>Grocery</option>
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Beauty & Health</option>
                    <option>Home & Kitchen</option>
                    <option>Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
                  <select 
                    value={newBrand} 
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium cursor-pointer"
                  >
                    {liveBrands.filter(b => b.status === 'active').map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                    <option value="Generic">Generic / House Brand</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input 
                    type="text" 
                    required 
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. 250" 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">MRP Price (₹)</label>
                  <input 
                    type="text" 
                    value={newMrp}
                    onChange={(e) => setNewMrp(e.target.value)}
                    placeholder="e.g. 290" 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL (Optional)</label>
                <input 
                  type="url" 
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..." 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                />
                <p className="text-[11px] text-slate-400 mt-1">Leave empty to use a high quality product photo placeholder.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <textarea 
                  rows={3} 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe your product specs, ingredients, or features..." 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 font-bold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
