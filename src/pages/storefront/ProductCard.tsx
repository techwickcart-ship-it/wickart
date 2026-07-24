import React from 'react';
import { ShoppingCart, Star, Heart, Repeat, Search, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../../lib/cartStore';

interface ProductCardProps { 
  product: any; 
  cartItems?: CartItem[];
  onNavigate?: (p: string) => void; 
  onViewProduct?: (p: any) => void;
  onAddToCart?: (p: any, qty?: number) => void; 
  onUpdateQuantity?: (id: number | string, qty: number) => void;
  onRemoveFromCart?: (id: number | string) => void;
  onWishlist?: (p: any) => void; 
  onCompare?: (p: any) => void; 
  onQuickView?: (p: any) => void; 
  isWishlisted?: boolean;
  isCompared?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  cartItems = [],
  onNavigate, 
  onViewProduct,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onWishlist,
  onCompare,
  onQuickView,
  isWishlisted = false,
  isCompared = false
}) => {
  const handleProductClick = () => {
    if (onViewProduct) {
      onViewProduct(product);
    } else if (onNavigate) {
      onNavigate('ProductDetails');
    }
  };

  const cartItem = cartItems.find(item => String(item.id) === String(product.id));
  const cartQty = cartItem ? cartItem.quantity : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative flex flex-col justify-between">
      <div>
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" 
            onClick={handleProductClick}
          />
          
          {/* Discount/Tag Badge */}
          {product.tag && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm z-10">
              {product.tag}
            </div>
          )}

          {/* Always Visible Top Right Wishlist & Compare Quick Icons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button 
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                isWishlisted 
                  ? 'bg-rose-500 text-white hover:bg-rose-600' 
                  : 'bg-white/90 backdrop-blur-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600'
              }`}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              onClick={(e) => { e.stopPropagation(); onWishlist?.(product); }}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <button 
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer sm:opacity-0 group-hover:opacity-100 ${
                isCompared 
                  ? 'bg-amber-500 text-white hover:bg-amber-600' 
                  : 'bg-white/90 backdrop-blur-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600'
              }`}
              title={isCompared ? "In Compare List" : "Add to Compare"}
              onClick={(e) => { e.stopPropagation(); onCompare?.(product); }}
            >
              <Repeat className="w-4 h-4" />
            </button>

            <button 
              className="w-9 h-9 bg-white/90 backdrop-blur-xs rounded-full flex items-center justify-center text-slate-700 shadow-md hover:bg-purple-50 hover:text-purple-600 transition-all cursor-pointer sm:opacity-0 group-hover:opacity-100"
              title="Quick View"
              onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-1.5">
             {product.vendor && <div className="text-xs font-bold text-blue-600 truncate mr-2">{product.vendor}</div>}
             <div className="flex items-center gap-1 text-amber-400 shrink-0">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-bold text-slate-700">{product.rating || 4.8}</span>
             </div>
          </div>

          {/* Category & Brand Badges */}
          <div className="mb-1.5 flex flex-wrap items-center gap-1">
            {product.category && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded-md border border-slate-200">
                {product.category}
              </span>
            )}
            {product.brand && (
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold text-[10px] rounded-md border border-purple-100">
                {product.brand}
              </span>
            )}
          </div>

          <h3 
            className="font-bold text-slate-900 text-sm sm:text-base mb-1 cursor-pointer hover:text-blue-600 line-clamp-1 transition-colors" 
            onClick={handleProductClick}
          >
            {product.name}
          </h3>

          {/* Sizes & Variants Quick Display */}
          {(Array.isArray(product.sizes) && product.sizes.length > 0) || (Array.isArray(product.variants) && product.variants.length > 0) ? (
            <div className="flex flex-wrap gap-1 mb-2">
              {Array.isArray(product.sizes) && product.sizes.slice(0, 3).map((s: string, idx: number) => (
                <span key={idx} className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                  {s}
                </span>
              ))}
              {Array.isArray(product.variants) && product.variants.slice(0, 2).map((v: string, idx: number) => (
                <span key={idx} className="text-[9px] font-bold px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-100">
                  {v}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-slate-400 mb-2 font-medium">Incl. of all taxes (5%)</p>
          )}
          
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg sm:text-xl font-bold text-slate-900">{product.price}</span>
            {product.mrp && <span className="text-xs text-slate-400 line-through">{product.mrp}</span>}
          </div>
        </div>
      </div>

      {/* Dynamic Cart Button / Controls */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
        {cartQty > 0 ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-1.5 transition-all">
            <div className="flex items-center gap-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (cartQty === 1) {
                    onRemoveFromCart?.(product.id);
                  } else {
                    onUpdateQuantity?.(product.id, cartQty - 1);
                  }
                }}
                className="w-8 h-8 rounded-lg bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center font-bold text-sm shadow-xs transition-colors cursor-pointer"
                title="Decrease Quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              
              <span className="w-8 text-center font-black text-sm text-emerald-900">{cartQty}</span>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateQuantity?.(product.id, cartQty + 1);
                }}
                className="w-8 h-8 rounded-lg bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center font-bold text-sm shadow-xs transition-colors cursor-pointer"
                title="Increase Quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromCart?.(product.id);
              }}
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
              title="Remove from Cart"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product, 1);
            }}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};
