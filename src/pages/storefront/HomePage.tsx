import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, ShieldCheck, Truck, HeadphonesIcon, Gift } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';
import { CartItem } from '../../lib/cartStore';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onViewProduct?: (product: any) => void;
  onAddToCart?: (product: any, qty?: number) => void;
  onUpdateQuantity?: (id: number | string, qty: number) => void;
  onRemoveFromCart?: (id: number | string) => void;
  cartItems?: CartItem[];
  onWishlist?: (product: any) => void;
  onCompare?: (product: any) => void;
  onQuickView?: (product: any) => void;
  wishlistIds?: Set<string | number>;
  compareIds?: Set<string | number>;
}

const CATEGORIES = [
  { name: 'Groceries', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-emerald-50' },
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-blue-50' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-pink-50' },
  { name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-amber-50' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54c28?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-purple-50' },
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=200&h=200', color: 'bg-red-50' },
];

export function HomePage({ 
  onNavigate, 
  onViewProduct, 
  onAddToCart, 
  onUpdateQuantity,
  onRemoveFromCart,
  cartItems = [],
  onWishlist, 
  onCompare, 
  onQuickView,
  wishlistIds = new Set(),
  compareIds = new Set()
}: HomePageProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 3062, hours: 3, minutes: 54, seconds: 48 });
  
  // Dynamic products, categories, and brands from store subscription
  const products = useMarketplaceData('products', () => marketplaceStore.getProducts());
  const categories = useMarketplaceData('categories', () => marketplaceStore.getCategories());
  const brands = useMarketplaceData('brands', () => marketplaceStore.getBrands());

  // Split into sections
  const popularProducts = products.slice(0, 8);
  const newProducts = products; // Show all products in catalog
  const hotDeals = products.length > 4 ? products.slice(0, 4) : products;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) { seconds--; }
        else {
          seconds = 59;
          if (minutes > 0) { minutes--; }
          else {
            minutes = 59;
            if (hours > 0) { hours--; }
            else { hours = 23; days--; }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white pb-20 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
         <div 
           onClick={() => onNavigate('Products')}
           className="relative group cursor-pointer overflow-hidden rounded-3xl bg-blue-600 shadow-xl shadow-blue-900/10 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20"
         >
            {/* Aspect container for the beautiful banner */}
            <div className="relative aspect-[16/7] md:aspect-[21/8] lg:aspect-[12/4] w-full overflow-hidden">
               <img 
                  src="/wikcart_hero_banner_1783937857683.jpg"
                 alt="WIKCART One Store for Everything - Electronics, Fashion, Grocery, Home & More" 
                 className="w-full h-full object-cover transform duration-700 ease-out group-hover:scale-[1.01]"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
            </div>
            
            {/* Pulsing beacon or hover overlay */}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
         </div>

         {/* Delivery Active / Promo info strip */}
         <div className="flex flex-wrap items-center justify-between gap-3 mt-4 px-2">
            <div className="flex items-center gap-2">
               <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Delivery Active in Sultanpur</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
               <span>🏷️ Use Code <strong className="text-blue-700">WIKCART10</strong> for 10% off your first order!</span>
            </div>
         </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-b border-slate-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-4 gap-4 divide-x divide-slate-100">
            <div className="flex items-center gap-4 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-blue-600">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Free Shipping</h4>
                <p className="text-xs text-slate-500">On all orders over ₹499</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Secure Payment</h4>
                <p className="text-xs text-slate-500">100% protected payments</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-purple-600">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Best Offers</h4>
                <p className="text-xs text-slate-500">Directly from local vendors</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-amber-600">
                <HeadphonesIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">24/7 Support</h4>
                <p className="text-xs text-slate-500">Dedicated assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
              <p className="text-slate-500 text-sm mt-1">Discover popular items across local Sultanpur stores</p>
           </div>
           <button onClick={() => onNavigate('Products')} className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
              Browse All <ArrowRight className="w-4 h-4" />
           </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
           {categories.slice(0, 12).map((cat, idx) => (
             <div 
               key={cat.id || idx} 
               onClick={() => onNavigate('Products')}
               className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:scale-105 hover:bg-blue-50/60 transition-all duration-300 border border-slate-200/60 hover:border-blue-200 hover:shadow-md group"
             >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white mb-3 shadow-2xs group-hover:shadow-md transition-shadow p-1 border border-slate-100 shrink-0">
                   {cat.image ? (
                     <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                   ) : (
                     <div className="w-full h-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-base rounded-xl">
                       {cat.name.charAt(0)}
                     </div>
                   )}
                </div>
                <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{cat.name}</h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{cat.count || 0} Products</p>
             </div>
           ))}
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Top Featured Brands</h2>
            <p className="text-slate-500 text-sm mt-1">Authentic products directly from official manufacturers</p>
          </div>
          <button onClick={() => onNavigate('Products')} className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
            Browse All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {brands.filter(b => b.status === 'active').map((brand) => (
            <div 
              key={brand.id} 
              onClick={() => onNavigate('Products')}
              className="bg-white p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all duration-300 border border-slate-200 group"
            >
              <div className="w-16 h-16 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center p-2 mb-2 group-hover:scale-105 transition-transform">
                <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{brand.name}</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Verified Brand</span>
            </div>
          ))}
        </div>
      </section>

      {/* Hot Deals Countdown Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row gap-8 items-center">
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              <Clock className="w-3.5 h-3.5" /> Hot Deal of the Day
            </div>
            <h2 className="text-3xl font-black mb-3 leading-tight">Limited Time Discount Offers</h2>
            <p className="text-blue-100 text-sm mb-6">Massive discounts on daily groceries and essentials in Sultanpur. Offer ends soon!</p>
            
            {/* Countdown Box */}
            <div className="grid grid-cols-4 gap-2 max-w-xs mb-4">
              <div className="text-center w-full">
                <div className="bg-white text-blue-700 font-black text-2xl px-2 py-1.5 rounded-xl shadow-inner mb-1">{timeLeft.days}</div>
                <div className="text-[10px] tracking-widest font-bold uppercase text-blue-100">Days</div>
              </div>
              <div className="text-center w-full">
                <div className="bg-white text-blue-700 font-black text-2xl px-2 py-1.5 rounded-xl shadow-inner mb-1">{timeLeft.hours}</div>
                <div className="text-[10px] tracking-widest font-bold uppercase text-blue-100">Hours</div>
              </div>
              <div className="text-center w-full">
                <div className="bg-white text-blue-700 font-black text-2xl px-2 py-1.5 rounded-xl shadow-inner mb-1">{timeLeft.minutes}</div>
                <div className="text-[10px] tracking-widest font-bold uppercase text-blue-100">Minutes</div>
              </div>
              <div className="text-center w-full">
                <div className="bg-white text-blue-700 font-black text-2xl px-2 py-1.5 rounded-xl shadow-inner mb-1">{timeLeft.seconds}</div>
                <div className="text-[10px] tracking-widest font-bold uppercase text-blue-100">Seconds</div>
              </div>
            </div>
          </div>

          {/* Hot Deals Products Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {hotDeals.map(prod => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                cartItems={cartItems}
                onNavigate={onNavigate} 
                onViewProduct={onViewProduct} 
                onAddToCart={onAddToCart} 
                onUpdateQuantity={onUpdateQuantity}
                onRemoveFromCart={onRemoveFromCart}
                onWishlist={onWishlist} 
                onCompare={onCompare} 
                onQuickView={onQuickView} 
                isWishlisted={wishlistIds.has(String(prod.id)) || wishlistIds.has(prod.id)}
                isCompared={compareIds.has(String(prod.id)) || compareIds.has(prod.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <div className="flex items-end justify-between gap-4 mb-8">
            <div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Popular Products</h2>
               <p className="text-slate-500 mt-1 text-sm">Most loved by Sultanpur customers.</p>
            </div>
            <button onClick={() => onNavigate('Products')} className="text-blue-600 font-bold text-sm hover:underline hidden sm:block">View All</button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map(prod => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                cartItems={cartItems}
                onNavigate={onNavigate} 
                onViewProduct={onViewProduct} 
                onAddToCart={onAddToCart} 
                onUpdateQuantity={onUpdateQuantity}
                onRemoveFromCart={onRemoveFromCart}
                onWishlist={onWishlist} 
                onCompare={onCompare} 
                onQuickView={onQuickView} 
                isWishlisted={wishlistIds.has(String(prod.id)) || wishlistIds.has(prod.id)}
                isCompared={compareIds.has(String(prod.id)) || compareIds.has(prod.id)}
              />
            ))}
         </div>
      </section>

      {/* Special Offers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
               <div className="w-full h-full bg-blue-500 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
            </div>
            <div className="relative z-10 max-w-xl">
               <span className="inline-block px-3 py-1 bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded border border-amber-400 mb-4">Special Offer</span>
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Get up to 50% Off<br/>On Weekly Essentials</h2>
               <p className="text-slate-400 mb-8 max-w-md">Stock up your pantry with fresh produce and daily needs at unbeatable prices from top vendors in Sultanpur.</p>
               <button onClick={() => onNavigate('Products')} className="px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  Claim Offer Now
               </button>
            </div>
            <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-white/10 shrink-0">
               <img src="https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=400" alt="Offers" className="w-full h-full object-cover" />
            </div>
         </div>
      </section>

      {/* Newly Added Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100">
         <div className="flex items-end justify-between gap-4 mb-8">
            <div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">New Arrivals</h2>
               <p className="text-slate-500 mt-1 text-sm">Freshly added items from local stores.</p>
            </div>
            <button onClick={() => onNavigate('Products')} className="text-blue-600 font-bold text-sm hover:underline hidden sm:block">View All</button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map(prod => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                cartItems={cartItems}
                onNavigate={onNavigate} 
                onViewProduct={onViewProduct} 
                onAddToCart={onAddToCart} 
                onUpdateQuantity={onUpdateQuantity}
                onRemoveFromCart={onRemoveFromCart}
                onWishlist={onWishlist} 
                onCompare={onCompare} 
                onQuickView={onQuickView} 
                isWishlisted={wishlistIds.has(String(prod.id)) || wishlistIds.has(prod.id)}
                isCompared={compareIds.has(String(prod.id)) || compareIds.has(prod.id)}
              />
            ))}
         </div>
      </section>

    </div>
  );
}
