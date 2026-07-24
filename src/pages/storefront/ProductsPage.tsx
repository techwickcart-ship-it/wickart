import React, { useState } from 'react';
import { Filter, X, ArrowUpDown, Tag, Search } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';
import { CartItem } from '../../lib/cartStore';

export function ProductsPage({ 
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
  compareIds = new Set(),
  externalSearchQuery = '',
  onSearchQueryChange
}: { 
  onNavigate?: (p: string) => void, 
  onViewProduct?: (p: any) => void,
  onAddToCart?: (p: any, qty?: number) => void,
  onUpdateQuantity?: (id: number | string, qty: number) => void,
  onRemoveFromCart?: (id: number | string) => void,
  cartItems?: CartItem[],
  onWishlist?: (p: any) => void,
  onCompare?: (p: any) => void,
  onQuickView?: (p: any) => void,
  wishlistIds?: Set<string | number>,
  compareIds?: Set<string | number>,
  externalSearchQuery?: string,
  onSearchQueryChange?: (q: string) => void
}) {
  const products = useMarketplaceData('products', () => marketplaceStore.getProducts());
  const brands = useMarketplaceData('brands', () => marketplaceStore.getBrands());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(externalSearchQuery);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  const [showFilterBar, setShowFilterBar] = useState<boolean>(false);

  // Sync external search query
  React.useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  const handleQueryChange = (val: string) => {
    setSearchQuery(val);
    if (onSearchQueryChange) {
      onSearchQueryChange(val);
    }
  };

  const categories = ['All', 'Beverages', 'Electronics', 'Grocery', 'Fashion', 'Beauty & Health', 'Home & Kitchen', 'Fitness', 'Personal Care', 'Accessories'];

  let filteredProducts = products.filter(product => {
    // Brand filter
    if (selectedBrand !== 'All') {
      if (!product.brand || product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchVendor = product.vendor && product.vendor.toLowerCase().includes(q);
      const matchCat = product.category && product.category.toLowerCase().includes(q);
      const matchDesc = product.description && product.description.toLowerCase().includes(q);
      if (!matchName && !matchVendor && !matchCat && !matchDesc) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory === 'All') return true;
    const catLower = selectedCategory.toLowerCase();
    const prodCatLower = (product.category || '').toLowerCase();
    if (prodCatLower === catLower || prodCatLower.includes(catLower)) return true;

    if (selectedCategory === 'Beverages') return product.name.toLowerCase().includes('tea') || product.name.toLowerCase().includes('coffee') || product.name.toLowerCase().includes('drink') || product.name.toLowerCase().includes('juice');
    if (selectedCategory === 'Electronics') return product.name.toLowerCase().includes('earbuds') || product.name.toLowerCase().includes('watch') || product.name.toLowerCase().includes('camera') || product.name.toLowerCase().includes('phone');
    if (selectedCategory === 'Grocery') return product.name.toLowerCase().includes('sugar') || product.name.toLowerCase().includes('butter') || product.name.toLowerCase().includes('atta') || product.name.toLowerCase().includes('rice') || product.name.toLowerCase().includes('oil');
    if (selectedCategory === 'Fitness') return product.name.toLowerCase().includes('yoga') || product.name.toLowerCase().includes('gym');
    if (selectedCategory === 'Personal Care') return product.name.toLowerCase().includes('mug') || product.name.toLowerCase().includes('crystal') || product.name.toLowerCase().includes('soap') || product.name.toLowerCase().includes('cream');
    
    return false;
  });

  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const pa = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
      const pb = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
      return pa - pb;
    });
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const pa = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
      const pb = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
      return pb - pa;
    });
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">All Products</h1>
            <p className="text-slate-500 mt-1">Showing {filteredProducts.length} of {products.length} products available in Sultanpur</p>
         </div>

         <div className="flex flex-wrap items-center gap-3">
            <form 
              onSubmit={(e) => e.preventDefault()} 
              className="relative flex-1 sm:flex-initial min-w-[240px] flex items-center"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search products, brands..." 
                value={searchQuery}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="pl-9 pr-24 py-2 w-full bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-800"
              />
              {searchQuery ? (
                <button 
                  type="button"
                  onClick={() => handleQueryChange('')}
                  className="absolute right-16 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 p-0.5"
                  title="Clear search"
                >
                  ✕
                </button>
              ) : null}
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                Search
              </button>
            </form>

            <button 
              onClick={() => setShowFilterBar(!showFilterBar)}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer ${
                showFilterBar ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
               <Filter className="w-3.5 h-3.5" /> 
               <span>Filter & Sort</span>
               {selectedCategory !== 'All' && <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{selectedCategory}</span>}
            </button>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
               <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 ml-2" />
               <select 
                 value={sortBy} 
                 onChange={(e: any) => setSortBy(e.target.value)}
                 className="bg-transparent text-xs font-bold text-slate-700 py-1.5 pr-2 outline-none cursor-pointer"
               >
                 <option value="default">Sort: Recommended</option>
                 <option value="price-low">Price: Low to High</option>
                 <option value="price-high">Price: High to Low</option>
                 <option value="rating">Top Rated</option>
               </select>
            </div>
         </div>
      </div>

      {/* Interactive Category & Brand Filter Pills */}
      {showFilterBar && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-8 animate-in slide-in-from-top-2 duration-300 space-y-4">
           <div>
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" /> Filter by Category
                </span>
                {selectedCategory !== 'All' && (
                  <button 
                    onClick={() => setSelectedCategory('All')} 
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Reset Category
                  </button>
                )}
             </div>
             <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
           </div>

           <div className="pt-3 border-t border-slate-200/60">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-600" /> Filter by Brand
                </span>
                {selectedBrand !== 'All' && (
                  <button 
                    onClick={() => setSelectedBrand('All')} 
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Reset Brand
                  </button>
                )}
             </div>
             <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedBrand('All')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedBrand === 'All' 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  All Brands
                </button>
                {brands.filter(b => b.status === 'active').map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedBrand.toLowerCase() === b.name.toLowerCase() 
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
             </div>
           </div>
        </div>
      )}

      {/* Category Horizontal Quick Bar */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            cartItems={cartItems}
            onNavigate={onNavigate} 
            onViewProduct={onViewProduct}
            onAddToCart={onAddToCart} 
            onUpdateQuantity={onUpdateQuantity}
            onRemoveFromCart={onRemoveFromCart}
            onWishlist={onWishlist} 
            onCompare={onCompare} 
            onQuickView={onQuickView} 
            isWishlisted={wishlistIds.has(String(product.id)) || wishlistIds.has(product.id)}
            isCompared={compareIds.has(String(product.id)) || compareIds.has(product.id)}
          />
        ))}
      </div>
      
      {/* Top Categories Section at the bottom */}
      <section className="pt-24 pb-8">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
               <h2 className="text-3xl font-bold text-slate-900 inline-block relative">
                  Explore More Categories
                  <span className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-red-600"></span>
               </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 text-center">
               {[
                 {name: 'Beverages', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=200&h=200'},
                 {name: 'Electronics', img: 'https://images.unsplash.com/photo-1590658268037-6f16144e5f8e?auto=format&fit=crop&q=80&w=200&h=200'},
                 {name: 'Grocery', img: 'https://images.unsplash.com/photo-1581428982868-e410dd447aa4?auto=format&fit=crop&q=80&w=200&h=200'},
                 {name: 'Fitness', img: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=200&h=200'},
                 {name: 'Personal Care', img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=200&h=200'},
                 {name: 'Jewelry', img: 'https://images.unsplash.com/photo-1599643478514-4a1200ead3f0?auto=format&fit=crop&q=80&w=200&h=200'},
                 {name: 'Home Security', img: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=200&h=200'},
                 {name: 'Tea & Coffee', img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=200&h=200'}
               ].map((cat, i) => (
                  <div key={i} className="group cursor-pointer" onClick={() => setSelectedCategory(cat.name)}>
                     <div className="rounded-[2rem] overflow-hidden bg-slate-100 aspect-square mb-3 shadow-sm border border-slate-200">
                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     </div>
                     <h3 className="font-medium text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                  </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}
