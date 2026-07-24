import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart, Star, ArrowLeft, Heart, Repeat, Trash2, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../../lib/cartStore';
import { marketplaceStore } from '../../lib/store';

interface ProductDetailsPageProps {
  onNavigate: (page: string) => void;
  onAddToCart?: (product: any, quantity?: number) => void;
  onUpdateQuantity?: (id: number | string, qty: number) => void;
  onRemoveFromCart?: (id: number | string) => void;
  cartItems?: CartItem[];
  product?: any;
  onWishlist?: (product: any) => void;
  onCompare?: (product: any) => void;
  isWishlisted?: boolean;
  isCompared?: boolean;
}

export function ProductDetailsPage({ 
  onNavigate, 
  onAddToCart, 
  onUpdateQuantity,
  onRemoveFromCart,
  cartItems = [],
  product: incomingProduct,
  onWishlist,
  onCompare,
  isWishlisted = false,
  isCompared = false
}: ProductDetailsPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // Fallback to first available product if none passed
  const allProducts = marketplaceStore.getProducts();
  const product = incomingProduct || allProducts[0] || {
    id: 1,
    name: 'Fresh Organic Apples',
    price: '₹120',
    mrp: '₹150',
    rating: 4.8,
    reviews: 24,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=600',
    vendor: 'City Square Mart',
    category: 'Grocery',
    sizes: ['250g', '500g', '1kg'],
    variants: ['Fresh Standard', 'Organic Premium'],
    description: 'Crisp and juicy farm-fresh organic apples sourced directly from verified local orchards.'
  };

  const availableSizes: string[] = Array.isArray(product.sizes) && product.sizes.length > 0
    ? product.sizes
    : ['Standard', 'Regular'];

  const availableVariants: string[] = Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants
    : ['Default'];

  const productMediaList: string[] = Array.isArray(product.media) && product.media.length > 0
    ? product.media
    : (Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image]);

  const activeMainImage = selectedImage || productMediaList[0] || product.image;

  const displayPrice = typeof product.price === 'number' ? `₹${product.price}` : (product.price || '₹0');
  const displayMrp = product.mrp ? (typeof product.mrp === 'number' ? `₹${product.mrp}` : product.mrp) : '';
  const vendorName = product.vendor || 'Authorized Merchant';

  const cartItem = cartItems.find(item => String(item.id) === String(product.id));
  const cartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    onAddToCart?.(product, quantity);
  };

  const handleBuyNow = () => {
    onAddToCart?.(product, quantity);
    onNavigate('Checkout');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      onNavigate('Products');
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-12 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <div className="text-sm text-slate-500 mb-6 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <button 
               onClick={handleBack} 
               className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs hover:bg-slate-100"
             >
                <ArrowLeft className="w-4 h-4" /> Back
             </button>
             <span className="text-slate-300">|</span>
             <button onClick={() => onNavigate('Home')} className="hover:text-blue-600 transition-colors cursor-pointer font-semibold">Home</button>
             <span>›</span>
             <button onClick={() => onNavigate('Products')} className="hover:text-blue-600 transition-colors cursor-pointer font-semibold">Products</button>
             <span>›</span>
             <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">{product.name}</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {/* Image Gallery */}
           <div className="space-y-4">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 flex items-center justify-center aspect-square shadow-sm relative group overflow-hidden">
                 <img src={activeMainImage} alt={product.name} className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300" />
                 
                 {/* Wishlist & Compare floating buttons */}
                 <div className="absolute top-4 right-4 flex gap-2">
                   <button 
                     onClick={() => onWishlist?.(product)}
                     className={`p-3 rounded-full shadow-md transition-colors cursor-pointer ${
                       isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-700 hover:bg-rose-50 hover:text-rose-600'
                     }`}
                     title={isWishlisted ? "In Wishlist" : "Add to Wishlist"}
                   >
                     <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                   </button>
                   <button 
                     onClick={() => onCompare?.(product)}
                     className={`p-3 rounded-full shadow-md transition-colors cursor-pointer ${
                       isCompared ? 'bg-amber-500 text-white' : 'bg-white/90 text-slate-700 hover:bg-amber-50 hover:text-amber-600'
                     }`}
                     title={isCompared ? "In Compare List" : "Add to Compare"}
                   >
                     <Repeat className="w-5 h-5" />
                   </button>
                 </div>
              </div>

              {/* Thumbnails list (up to 4 media items) */}
              <div className="grid grid-cols-4 gap-4">
                 {productMediaList.slice(0, 4).map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`bg-white rounded-xl border p-2 cursor-pointer aspect-square ${
                        activeMainImage === imgUrl ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xs' : 'border-slate-100 hover:border-slate-300'
                      } transition-all`}
                    >
                       <img src={imgUrl} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                    </div>
                 ))}
              </div>
           </div>

           {/* Product Info & Billing Area */}
           <div className="space-y-6">
              <div>
                 <div className="flex flex-wrap items-center gap-2 mb-3">
                   <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                     {vendorName}
                   </span>
                   {product.category && (
                     <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full shadow-2xs">
                       Category: {product.category}
                     </span>
                   )}
                 </div>
                 <h1 className="text-2xl sm:text-3xl font-black text-[#1f2937] tracking-tight leading-snug">{product.name}</h1>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#4b5563]">
                 <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current/30" />
                 </div>
                 <span className="font-bold text-slate-800">{product.rating || 4.8}</span>
                 <span className="text-slate-400">({product.reviews || 24} customer reviews)</span>
              </div>

              {/* Dynamic In-Cart Badge */}
              {cartQty > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                     <span className="text-xs sm:text-sm font-bold">Currently in your Cart: <strong className="text-emerald-950">{cartQty} unit(s)</strong></span>
                   </div>
                   <button 
                     onClick={() => onRemoveFromCart?.(product.id)}
                     className="text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                   >
                     <Trash2 className="w-3.5 h-3.5" /> Remove
                   </button>
                </div>
              )}

              <div className="bg-[#e9eee6] rounded-[2rem] p-6 sm:p-8 shadow-sm text-[#4b5563]">
                 <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-black text-[#1f2937] tracking-tighter">{displayPrice}</span>
                    {displayMrp && <span className="text-xs text-slate-500 line-through font-bold">MRP: {displayMrp}</span>}
                 </div>
                 <p className="text-xs font-bold mb-6 text-[#1f2937] opacity-70 uppercase tracking-widest">Incl. of all taxes (5%)</p>

                 {(product.shortDescription || product.description) && (
                   <p className="text-sm font-medium text-slate-700 mb-6 bg-white/60 p-4 rounded-xl border border-slate-200/50">
                     {product.shortDescription || product.description}
                   </p>
                 )}

                 {/* Size Selector */}
                 <div className="mb-6 bg-white/70 p-4 rounded-2xl border border-slate-200/60">
                    <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider flex items-center justify-between">
                      <span>Select Size</span>
                      {selectedSize && <span className="text-blue-600 font-black normal-case">Selected: {selectedSize}</span>}
                    </label>
                    <div className="flex flex-wrap gap-2">
                       {availableSizes.map((sz, idx) => {
                          const isSelected = selectedSize === sz || (!selectedSize && idx === 0);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedSize(sz)}
                              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20' 
                                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                              }`}
                            >
                              {sz}
                            </button>
                          );
                       })}
                    </div>
                 </div>

                 {/* Variant Selector */}
                 <div className="mb-6 bg-white/70 p-4 rounded-2xl border border-slate-200/60">
                    <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider flex items-center justify-between">
                      <span>Select Variant / Color</span>
                      {selectedVariant && <span className="text-purple-600 font-black normal-case">Selected: {selectedVariant}</span>}
                    </label>
                    <div className="flex flex-wrap gap-2">
                       {availableVariants.map((vr, idx) => {
                          const isSelected = selectedVariant === vr || (!selectedVariant && idx === 0);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedVariant(vr)}
                              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm ring-2 ring-purple-500/20' 
                                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                              }`}
                            >
                              {vr}
                            </button>
                          );
                       })}
                    </div>
                 </div>

                 <div className="mb-6">
                    <label className="block text-sm font-bold text-[#1f2937] mb-2 uppercase tracking-wide text-xs">Quantity</label>
                    <div className="inline-flex bg-white rounded-xl items-center border border-[#cfd6d1]">
                        <button 
                           onClick={() => setQuantity(Math.max(1, quantity - 1))}
                           className="px-4 py-3 text-slate-600 hover:text-black font-bold border-r border-[#cfd6d1] cursor-pointer">
                           <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-base text-[#1f2937]">{quantity}</span>
                        <button 
                           onClick={() => setQuantity(quantity + 1)}
                           className="px-4 py-3 text-slate-600 hover:text-black font-bold border-l border-[#cfd6d1] cursor-pointer">
                           <Plus className="w-4 h-4" />
                        </button>
                    </div>
                 </div>

                 <div className="flex items-start gap-3 mb-8 bg-[#dde4df] p-4 rounded-xl">
                    <ShoppingCart className="w-6 h-6 text-[#10b981] shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-[#1f2937]">Enjoy FREE Express Delivery in Sultanpur on orders above ₹499.</p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={handleAddToCart}
                      className="w-full bg-[#1f2937] hover:bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wide transition-all shadow-xl shadow-black/10 cursor-pointer flex items-center justify-center gap-2"
                    >
                       <ShoppingCart className="w-4 h-4" />
                       Add to Cart ({quantity})
                    </button>
                    <button 
                      onClick={handleBuyNow}
                      className="w-full bg-[#d97706] hover:bg-[#b45309] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wide transition-all shadow-xl shadow-[#d97706]/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                       Buy Now 
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Product Description Section */}
        <div className="mt-16 bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-slate-100">
           <h2 className="text-2xl font-black text-[#1f2937] mb-6">Product Information & Description</h2>
           <div className="prose max-w-none text-slate-600 space-y-4">
              <p className="text-base leading-relaxed">
                 {product.description || 'This authentic product is sourced directly from trusted local vendors and verified sellers in Sultanpur. Crafted with high quality materials and strictly quality-tested to meet safety and freshness standards.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-sm">
                 <div>
                    <span className="font-bold text-slate-900 block">Seller Store:</span>
                    <span className="text-slate-600">{vendorName}</span>
                 </div>
                 <div>
                    <span className="font-bold text-slate-900 block">Return Policy:</span>
                    <span className="text-slate-600">7 Days Easy Return / Exchange</span>
                 </div>
                 <div>
                    <span className="font-bold text-slate-900 block">Fulfillment:</span>
                    <span className="text-slate-600">Same-Day Local Delivery</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
