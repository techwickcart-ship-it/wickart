import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Search, Plus, Trash2, Package, Tag, Image, DollarSign, X, CheckCircle2, Eye, Edit2, Sparkles, Layers, Box, Check, ExternalLink } from 'lucide-react';
import { marketplaceStore, useMarketplaceData, Product } from '../../lib/store';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';

interface SellerProductsPageProps {
  initialTab?: string;
}

export function SellerProductsPage({ initialTab }: SellerProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const allProducts = useMarketplaceData('products', () => marketplaceStore.getProducts());
  const { activeSellerStoreName, activeSellerId, activeSeller } = useActiveSellerStore();

  useEffect(() => {
    if (initialTab === 'Add Product') {
      setIsAddModalOpen(true);
    }
  }, [initialTab]);

  // Dropdown data
  const liveBrands = useMarketplaceData('brands', () => marketplaceStore.getBrands());
  const storeCategories = useMarketplaceData('categories', () => marketplaceStore.getCategories());
  const storeSubcategories = useMarketplaceData('subcategories', () => marketplaceStore.getSubcategories());
  const allAvailableCategories = Array.from(new Set([
    ...storeCategories.map((c: any) => c.name),
    ...storeSubcategories.map((sc: any) => sc.name)
  ].filter(Boolean))).sort();

  // Add Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newMrp, setNewMrp] = useState('');
  const [newStock, setNewStock] = useState('100');
  const [newImage, setNewImage] = useState('');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIsCombo, setNewIsCombo] = useState(false);
  const [newComboTitle, setNewComboTitle] = useState('');
  const [newComboItems, setNewComboItems] = useState('');
  const [newComboDiscount, setNewComboDiscount] = useState('');
  const [newComboTag, setNewComboTag] = useState('SUPER COMBO');

  // Edit Product Form State
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editMrp, setEditMrp] = useState('');
  const [editStock, setEditStock] = useState('100');
  const [editImage, setEditImage] = useState('');
  const [editShortDesc, setEditShortDesc] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editIsCombo, setEditIsCombo] = useState(false);
  const [editComboTitle, setEditComboTitle] = useState('');
  const [editComboItems, setEditComboItems] = useState('');
  const [editComboDiscount, setEditComboDiscount] = useState('');
  const [editComboTag, setEditComboTag] = useState('SUPER COMBO');

  // Open Edit Modal with prefilled values
  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name || '');
    setEditCategory(prod.category || '');
    setEditBrand(prod.brand || 'Generic');
    setEditPrice(String(prod.price || '').replace(/[^0-9.]/g, ''));
    setEditMrp(String(prod.mrp || '').replace(/[^0-9.]/g, ''));
    setEditStock(prod.stock !== undefined && prod.stock !== null ? String(prod.stock) : '100');
    setEditImage(prod.image || '');
    setEditShortDesc(prod.shortDescription || '');
    setEditDesc(prod.description || '');
    setEditIsCombo(!!prod.isComboOffer);
    setEditComboTitle(prod.comboTitle || '');
    setEditComboItems(prod.comboItems || '');
    setEditComboDiscount(prod.comboDiscount || '');
    setEditComboTag(prod.comboTag || 'SUPER COMBO');
    if (viewingProduct) setViewingProduct(null);
  };

  // Filter products belonging strictly to active vendor store
  const sellerProducts = allProducts.filter(p => {
    const activeStore = (activeSellerStoreName || '').trim().toLowerCase();
    const activeOwner = (activeSeller?.name || '').trim().toLowerCase();
    const activeIdStr = String(activeSellerId || '').toLowerCase();
    const activeSellerUuid = activeSeller?.id ? String(activeSeller.id).toLowerCase() : '';

    const vendorMatch = Boolean(
      (p.vendor && p.vendor.trim().toLowerCase() === activeStore) ||
      (activeOwner && p.vendor && p.vendor.trim().toLowerCase() === activeOwner)
    );
    const idMatch = Boolean(
      (p.sellerId && String(p.sellerId).toLowerCase() === activeIdStr) ||
      (activeSellerUuid && p.sellerId && String(p.sellerId).toLowerCase() === activeSellerUuid)
    );
    return vendorMatch || idMatch;
  });

  const handleDelete = (id: number | string) => {
    if (confirm('Are you sure you want to remove this product from your catalog?')) {
      const list = marketplaceStore.getProducts();
      const updated = list.filter(p => String(p.id) !== String(id));
      marketplaceStore.saveProducts(updated);
      marketplaceStore.deleteProductFromSupabase(id).catch(() => {});
      setToastMessage('Product removed successfully.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newPrice.trim()) return;

    const numPrice = parseFloat(newPrice.replace(/[^0-9.]/g, '')) || 0;
    const numMrp = newMrp.trim() ? parseFloat(newMrp.replace(/[^0-9.]/g, '')) : numPrice;

    const formattedPrice = `₹${numPrice}`;
    const formattedMrp = numMrp ? `₹${numMrp}` : formattedPrice;

    const targetStore = activeSellerStoreName || activeSeller?.storeName || 'Seller Store';
    const targetSellerId = activeSeller?.id || activeSellerId || '1';

    const added = marketplaceStore.addProduct({
      name: newProductName.trim(),
      price: formattedPrice,
      mrp: formattedMrp,
      category: newCategory || 'General',
      brand: newBrand || 'Generic',
      vendor: targetStore,
      sellerId: targetSellerId,
      image: newImage.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      shortDescription: newShortDesc.trim() || `${newProductName} sourced and fulfilled by ${targetStore}.`,
      description: newDesc.trim() || newShortDesc.trim() || `${newProductName} sourced and fulfilled by ${targetStore}.`,
      stock: parseInt(newStock) || 100,
      isComboOffer: newIsCombo,
      comboTitle: newIsCombo ? newComboTitle.trim() : undefined,
      comboItems: newIsCombo ? newComboItems.trim() : undefined,
      comboDiscount: newIsCombo ? newComboDiscount.trim() : undefined,
      comboTag: newIsCombo ? newComboTag.trim() : undefined,
      rating: 4.8,
      tag: newIsCombo ? (newComboTag || 'SUPER COMBO') : 'Approved & Live'
    });

    setIsAddModalOpen(false);
    setNewProductName('');
    setNewPrice('');
    setNewMrp('');
    setNewStock('100');
    setNewImage('');
    setNewShortDesc('');
    setNewDesc('');
    setNewIsCombo(false);
    setNewComboTitle('');
    setNewComboItems('');
    setNewComboDiscount('');

    setToastMessage(`Product "${added.name}" added successfully to ${targetStore}!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editName.trim() || !editPrice.trim()) return;

    const numPrice = parseFloat(editPrice.replace(/[^0-9.]/g, '')) || 0;
    const numMrp = editMrp.trim() ? parseFloat(editMrp.replace(/[^0-9.]/g, '')) : numPrice;

    const formattedPrice = `₹${numPrice}`;
    const formattedMrp = numMrp ? `₹${numMrp}` : formattedPrice;

    const updatedProduct: Product = {
      ...editingProduct,
      name: editName.trim(),
      category: editCategory || 'General',
      brand: editBrand || 'Generic',
      price: formattedPrice,
      mrp: formattedMrp,
      stock: parseInt(editStock) || 100,
      image: editImage.trim() || editingProduct.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      shortDescription: editShortDesc.trim() || editingProduct.shortDescription || '',
      description: editDesc.trim() || editShortDesc.trim() || editingProduct.description || '',
      isComboOffer: editIsCombo,
      comboTitle: editIsCombo ? editComboTitle.trim() : '',
      comboItems: editIsCombo ? editComboItems.trim() : '',
      comboDiscount: editIsCombo ? editComboDiscount.trim() : '',
      comboTag: editIsCombo ? editComboTag.trim() : '',
      tag: editIsCombo ? (editComboTag || 'SUPER COMBO') : 'Approved & Live'
    };

    marketplaceStore.updateProduct(editingProduct.id, updatedProduct);

    setEditingProduct(null);
    setToastMessage(`Product "${updatedProduct.name}" updated successfully!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filtered = sellerProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
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
            Manage product catalog, prices, stock, and listings for <strong className="text-slate-800">{activeSellerStoreName}</strong>.
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
               <p className="text-sm font-bold text-purple-600 mt-0.5">Approved & Active</p>
            </CardContent>
         </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/30">
           <CardTitle className="font-bold text-slate-800">
             Products Listing for "{activeSellerStoreName}" ({sellerProducts.length})
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
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Product to Store
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                 <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                    <tr>
                       <th className="px-6 py-4">Product Details</th>
                       <th className="px-6 py-4">Category & Brand</th>
                       <th className="px-6 py-4">Price & MRP</th>
                       <th className="px-6 py-4">Stock</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filtered.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                                  {prod.image && prod.image.trim() ? (
                                     <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                                  ) : (
                                     <span className="font-bold text-slate-400 text-xs">{prod.name?.charAt(0)}</span>
                                  )}
                               </div>
                               <div>
                                  <p className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer" onClick={() => setViewingProduct(prod)}>
                                    {prod.name}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                                    <span>ID: #{String(prod.id).slice(0, 8)}</span>
                                    {prod.isComboOffer && (
                                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                        COMBO
                                      </span>
                                    )}
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                           <div className="space-y-1">
                             <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md text-xs font-semibold">
                               {prod.category || 'General'}
                             </span>
                             {prod.brand && prod.brand !== 'Generic' && (
                               <p className="text-xs text-slate-500 font-medium">{prod.brand}</p>
                             )}
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           <div>
                             <span className="font-bold text-slate-900 text-sm block">{prod.price}</span>
                             {prod.mrp && prod.mrp !== prod.price && (
                               <span className="text-xs text-slate-400 line-through">{prod.mrp}</span>
                             )}
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                             Number(prod.stock || 100) > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                           }`}>
                             {prod.stock || 100} units
                           </span>
                         </td>
                         <td className="px-6 py-4">
                           <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                             Approved & Live
                           </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => setViewingProduct(prod)}
                                className="p-2 hover:bg-blue-50 text-blue-600 hover:text-blue-800 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
                                title="View Product Details"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="hidden md:inline">View</span>
                              </button>
                              <button 
                                onClick={() => handleOpenEditModal(prod)}
                                className="p-2 hover:bg-amber-50 text-amber-600 hover:text-amber-800 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                                <span className="hidden md:inline">Edit</span>
                              </button>
                              <button 
                                onClick={() => handleDelete(prod.id)}
                                className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors inline-flex cursor-pointer"
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* VIEW PRODUCT MODAL */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Product Details</h3>
                  <p className="text-xs text-slate-400">ID: #{viewingProduct.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingProduct(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Product Hero Info */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-44 h-44 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
                  {viewingProduct.image ? (
                    <img src={viewingProduct.image} alt={viewingProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-16 h-16 text-slate-300" />
                  )}
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
                      {viewingProduct.category || 'General'}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                      Brand: {viewingProduct.brand || 'Generic'}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                      Approved & Live
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900">{viewingProduct.name}</h2>

                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-slate-900">{viewingProduct.price}</span>
                    {viewingProduct.mrp && viewingProduct.mrp !== viewingProduct.price && (
                      <span className="text-sm text-slate-400 line-through">{viewingProduct.mrp}</span>
                    )}
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      In Stock ({viewingProduct.stock || 100} units)
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Sold and fulfilled by: <strong className="text-slate-800">{viewingProduct.vendor || activeSellerStoreName}</strong>
                  </p>
                </div>
              </div>

              {/* Combo Information if present */}
              {viewingProduct.isComboOffer && (
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Special Combo Bundle Offer Active</span>
                  </div>
                  <p className="text-xs font-bold text-amber-800">{viewingProduct.comboTitle || 'Combo Pack'}</p>
                  {viewingProduct.comboItems && (
                    <p className="text-xs text-amber-700">Included Items: {viewingProduct.comboItems}</p>
                  )}
                  {viewingProduct.comboDiscount && (
                    <span className="inline-block bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {viewingProduct.comboDiscount}
                    </span>
                  )}
                </div>
              )}

              {/* Short & Detailed Descriptions */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Short Description</h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {viewingProduct.shortDescription || 'No short description provided.'}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Detailed Description</h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                    {viewingProduct.description || viewingProduct.shortDescription || 'No detailed description provided.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setViewingProduct(null)}
                className="px-5 py-2 text-slate-600 hover:bg-slate-200/60 font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={() => handleOpenEditModal(viewingProduct)}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Product</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-blue-400" /> Edit Product
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Product ID: #{editingProduct.id}</p>
              </div>
              <button 
                onClick={() => setEditingProduct(null)} 
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title / Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Fresh Farm Whole Wheat Atta 5kg" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <select 
                    value={editCategory} 
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                  >
                    <option value="">-- Select Category --</option>
                    {allAvailableCategories.map((catName) => (
                      <option key={catName} value={catName}>{catName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
                  <select 
                    value={editBrand} 
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium cursor-pointer"
                  >
                    <option value="">-- Select Brand --</option>
                    {liveBrands.filter(b => b.status === 'active').map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                    <option value="Generic">Generic / House Brand</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="e.g. 250" 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">MRP Price (₹)</label>
                  <input 
                    type="text" 
                    value={editMrp}
                    onChange={(e) => setEditMrp(e.target.value)}
                    placeholder="e.g. 290" 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    min="0"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    placeholder="100" 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="url" 
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="https://example.com/image.png" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                  />
                  {editImage && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                      <img src={editImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <textarea 
                  rows={2} 
                  value={editShortDesc}
                  onChange={(e) => setEditShortDesc(e.target.value)}
                  placeholder="Key summary or highlights of the product..." 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea 
                  rows={3} 
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Full specifications, ingredients, or instructions..." 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                />
              </div>

              {/* Combo Offer Toggle */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Is this a Special Combo Offer?</span>
                  </label>
                  <input 
                    type="checkbox" 
                    checked={editIsCombo} 
                    onChange={e => setEditIsCombo(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
                  />
                </div>

                {editIsCombo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Combo Bundle Title</label>
                      <input 
                        type="text" 
                        value={editComboTitle} 
                        onChange={e => setEditComboTitle(e.target.value)}
                        placeholder="e.g. Mega Breakfast Combo" 
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Combo Discount Label</label>
                      <input 
                        type="text" 
                        value={editComboDiscount} 
                        onChange={e => setEditComboDiscount(e.target.value)}
                        placeholder="e.g. 20% OFF / Save ₹100" 
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" 
                      />
                    </div>
                  </div>
                )}
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-bold">Add Product to Store</h3>
                <p className="text-xs text-slate-400 mt-0.5">Store: <strong className="text-emerald-400">{activeSellerStoreName}</strong></p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title / Name <span className="text-red-500">*</span></label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                  >
                    <option value="">-- Select Category --</option>
                    {allAvailableCategories.map((catName) => (
                      <option key={catName} value={catName}>{catName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
                  <select 
                    value={newBrand} 
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium cursor-pointer"
                  >
                    <option value="">-- Select Brand --</option>
                    {liveBrands.filter(b => b.status === 'active').map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                    <option value="Generic">Generic / House Brand</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹) <span className="text-red-500">*</span></label>
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
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="100" 
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
                  placeholder="https://example.com/image.png" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                />
                <p className="text-[11px] text-slate-400 mt-1">Leave empty to use high quality default item image.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <textarea 
                  rows={2} 
                  value={newShortDesc}
                  onChange={(e) => setNewShortDesc(e.target.value)}
                  placeholder="Key summary or highlights..." 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea 
                  rows={3} 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe your product specs, ingredients, or features..." 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none font-medium"
                />
              </div>

              {/* Combo Offer Toggle in Add Modal */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Create as a Combo Bundle Pack?</span>
                  </label>
                  <input 
                    type="checkbox" 
                    checked={newIsCombo} 
                    onChange={e => setNewIsCombo(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
                  />
                </div>

                {newIsCombo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Combo Bundle Title</label>
                      <input 
                        type="text" 
                        value={newComboTitle} 
                        onChange={e => setNewComboTitle(e.target.value)}
                        placeholder="e.g. Breakfast Super Saver Combo" 
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Combo Discount Label</label>
                      <input 
                        type="text" 
                        value={newComboDiscount} 
                        onChange={e => setNewComboDiscount(e.target.value)}
                        placeholder="e.g. 20% OFF / Save ₹100" 
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" 
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
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
