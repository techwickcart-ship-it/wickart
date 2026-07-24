import React, { useState, useEffect } from 'react';
import { HomePage } from './HomePage';
import { ProductsPage } from './ProductsPage';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';
import { AboutUsPage } from './AboutUsPage';
import { ContactUsPage } from './ContactUsPage';
import { PolicyPage } from './PolicyPage';
import { ProductDetailsPage } from './ProductDetailsPage';
import { StoreHeader } from './StoreHeader';
import { StoreFooter } from './StoreFooter';
import { CheckCircle2, X, Heart, Repeat, ShoppingCart, Star, Trash2, ArrowRight } from 'lucide-react';
import { getStoredCart, saveStoredCart, parsePriceNumber, CartItem } from '../../lib/cartStore';
import { marketplaceStore } from '../../lib/store';

export function StorefrontApp() {
  const [activePage, setActivePage] = useState('Home');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getStoredCart());
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [storefrontSearchQuery, setStorefrontSearchQuery] = useState('');
  
  // Wishlist & Compare lists stored in local memory / state
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [compareList, setCompareList] = useState<any[]>([]);
  
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  const [lastAddedInfo, setLastAddedInfo] = useState<{ product: any; qty: number } | null>(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string } | null>(null);

  // Sync cart state
  useEffect(() => {
    const syncCart = () => {
      setCartItems(getStoredCart());
    };
    window.addEventListener('wikcart_cart_updated', syncCart);
    return () => window.removeEventListener('wikcart_cart_updated', syncCart);
  }, []);

  // Sync Hash & History navigation for Browser Back/Forward buttons
  useEffect(() => {
    const syncRouteFromHash = () => {
      const hash = window.location.hash || '';
      const allProducts = marketplaceStore.getProducts();

      if (hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        const found = allProducts.find(p => String(p.id) === String(prodId));
        if (found) {
          setSelectedProduct(found);
          setActivePage('ProductDetails');
        } else {
          setActivePage('Products');
        }
      } else if (hash === '#products') {
        setActivePage('Products');
      } else if (hash === '#cart') {
        setActivePage('Cart');
      } else if (hash === '#checkout') {
        setActivePage('Checkout');
      } else if (hash === '#about') {
        setActivePage('About');
      } else if (hash === '#contact') {
        setActivePage('Contact');
      } else if (hash === '#privacy-policy') {
        setActivePage('Privacy Policy');
      } else if (hash === '#terms') {
        setActivePage('Terms & Conditions');
      } else if (hash === '#shipping') {
        setActivePage('Shipping Policy');
      } else if (hash === '#refund') {
        setActivePage('Cancellation & Refund');
      } else {
        setActivePage('Home');
      }
    };

    // Initial check on mount
    syncRouteFromHash();

    window.addEventListener('popstate', syncRouteFromHash);
    window.addEventListener('hashchange', syncRouteFromHash);
    return () => {
      window.removeEventListener('popstate', syncRouteFromHash);
      window.removeEventListener('hashchange', syncRouteFromHash);
    };
  }, []);

  // Navigation Helper that updates URL Hash for Browser Back/Forward history
  const handleNavigate = (page: string, product?: any) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let newHash = '';
    if (page === 'ProductDetails' && product) {
      setSelectedProduct(product);
      newHash = `#product-${product.id}`;
    } else if (page === 'Products') {
      newHash = '#products';
    } else if (page === 'Cart') {
      newHash = '#cart';
    } else if (page === 'Checkout') {
      newHash = '#checkout';
    } else if (page === 'About') {
      newHash = '#about';
    } else if (page === 'Contact') {
      newHash = '#contact';
    } else if (page === 'Privacy Policy') {
      newHash = '#privacy-policy';
    } else if (page === 'Terms & Conditions') {
      newHash = '#terms';
    } else if (page === 'Shipping Policy') {
      newHash = '#shipping';
    } else if (page === 'Cancellation & Refund') {
      newHash = '#refund';
    } else {
      newHash = '#home';
    }

    if (window.location.hash !== newHash) {
      window.history.pushState({ page, productId: product?.id }, '', newHash || window.location.pathname);
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: any, qty: number = 1) => {
    if (!product) return;
    const priceNum = parsePriceNumber(product.price);
    
    setCartItems(prevCart => {
      const existingIndex = prevCart.findIndex(i => String(i.id) === String(product.id));
      let updated: CartItem[];

      if (existingIndex >= 0) {
        updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty
        };
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: priceNum,
          priceString: typeof product.price === 'string' ? product.price : `₹${priceNum}`,
          mrp: product.mrp,
          image: product.image,
          vendor: product.vendor,
          quantity: qty
        };
        updated = [newItem, ...prevCart];
      }

      saveStoredCart(updated);
      return updated;
    });

    setLastAddedInfo({ product, qty });
    setShowCartModal(true);

    setTimeout(() => {
      setShowCartModal(false);
    }, 4000);
  };

  const handleUpdateQuantity = (id: number | string, newQty: number) => {
    setCartItems(prevCart => {
      let updated: CartItem[];
      if (newQty <= 0) {
        updated = prevCart.filter(i => String(i.id) !== String(id));
      } else {
        updated = prevCart.map(i => String(i.id) === String(id) ? { ...i, quantity: newQty } : i);
      }
      saveStoredCart(updated);
      return updated;
    });
  };

  const handleRemoveFromCart = (id: number | string) => {
    setCartItems(prevCart => {
      const updated = prevCart.filter(i => String(i.id) !== String(id));
      saveStoredCart(updated);
      return updated;
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    saveStoredCart([]);
  };

  const handleViewProduct = (product: any) => {
    handleNavigate('ProductDetails', product);
  };

  const showToast = (message: string) => {
    setNotification({ message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Wishlist Handling
  const handleWishlist = (product: any) => {
    const exists = wishlistItems.some(item => String(item.id) === String(product.id));
    if (exists) {
      setWishlistItems(prev => prev.filter(item => String(item.id) !== String(product.id)));
      showToast(`Removed "${product.name}" from Wishlist`);
    } else {
      setWishlistItems(prev => [product, ...prev]);
      showToast(`Added "${product.name}" to your Wishlist! ❤️`);
    }
  };

  // Compare Handling
  const handleCompare = (product: any) => {
    const exists = compareList.some(item => String(item.id) === String(product.id));
    if (exists) {
      setCompareList(prev => prev.filter(item => String(item.id) !== String(product.id)));
      showToast(`Removed "${product.name}" from Compare list`);
    } else {
      if (compareList.length >= 4) {
        showToast(`Compare list is full (max 4 products). Remove one to add this.`);
        setShowCompareModal(true);
        return;
      }
      setCompareList(prev => [...prev, product]);
      showToast(`Added "${product.name}" to Compare list! 🔄`);
      setShowCompareModal(true);
    }
  };

  const handleQuickView = (product: any) => {
    setQuickViewProduct(product);
  };

  const wishlistIds = new Set<string | number>(wishlistItems.map(i => String(i.id)));
  const compareIds = new Set<string | number>(compareList.map(i => String(i.id)));

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative">
      <StoreHeader 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        cartCount={totalCartCount} 
        wishlistCount={wishlistItems.length}
        compareCount={compareList.length}
        onOpenWishlist={() => setShowWishlistModal(true)}
        onOpenCompare={() => setShowCompareModal(true)}
        initialSearchQuery={storefrontSearchQuery}
        onSearch={(query) => {
          setStorefrontSearchQuery(query);
          handleNavigate('Products');
        }}
        onViewProduct={handleViewProduct}
      />
      
      <main className="flex-1">
        {activePage === 'Home' && (
          <HomePage 
            onNavigate={handleNavigate} 
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart} 
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            cartItems={cartItems}
            onWishlist={handleWishlist} 
            onCompare={handleCompare} 
            onQuickView={handleQuickView} 
            wishlistIds={wishlistIds}
            compareIds={compareIds}
          />
        )}
        {activePage === 'Products' && (
          <ProductsPage 
            onNavigate={handleNavigate} 
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart} 
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            cartItems={cartItems}
            onWishlist={handleWishlist} 
            onCompare={handleCompare} 
            onQuickView={handleQuickView} 
            wishlistIds={wishlistIds}
            compareIds={compareIds}
            externalSearchQuery={storefrontSearchQuery}
            onSearchQueryChange={setStorefrontSearchQuery}
          />
        )}
        {activePage === 'ProductDetails' && (
          <ProductDetailsPage 
            onNavigate={handleNavigate} 
            onAddToCart={handleAddToCart} 
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            cartItems={cartItems}
            product={selectedProduct}
            onWishlist={handleWishlist}
            onCompare={handleCompare}
            isWishlisted={selectedProduct ? wishlistIds.has(String(selectedProduct.id)) : false}
            isCompared={selectedProduct ? compareIds.has(String(selectedProduct.id)) : false}
          />
        )}
        {activePage === 'Cart' && (
          <CartPage 
            onNavigate={handleNavigate} 
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
          />
        )}
        {activePage === 'Checkout' && (
          <CheckoutPage 
            onNavigate={handleNavigate} 
            cartItems={cartItems}
            onClearCart={handleClearCart}
          />
        )}
        {activePage === 'About' && <AboutUsPage />}
        {activePage === 'Contact' && <ContactUsPage />}
        {activePage === 'Privacy Policy' && <PolicyPage title="Privacy Policy" />}
        {activePage === 'Terms & Conditions' && <PolicyPage title="Terms & Conditions" />}
        {activePage === 'Shipping Policy' && <PolicyPage title="Shipping Policy" />}
        {activePage === 'Cancellation & Refund' && <PolicyPage title="Cancellation & Refund" />}
      </main>

      <StoreFooter onNavigate={handleNavigate} />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[100] bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
           <CheckCircle2 className="w-5 h-5 text-emerald-400" />
           <span className="font-medium text-sm">{notification.message}</span>
           <button onClick={() => setNotification(null)} className="ml-4 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
           </button>
        </div>
      )}

      {/* Add to Cart Modal Pop */}
      {showCartModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-in zoom-in duration-300 relative">
            <button onClick={() => setShowCartModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                 <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Added to Cart!</h3>
              <p className="text-slate-600 text-sm font-semibold mb-1">
                {lastAddedInfo ? `${lastAddedInfo.qty}x ${lastAddedInfo.product?.name}` : 'Item'}
              </p>
              <p className="text-slate-400 text-xs mb-6">Successfully added to your shopping cart.</p>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                 <button 
                   onClick={() => setShowCartModal(false)} 
                   className="py-2.5 px-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                 >
                   Continue Shopping
                 </button>
                 <button 
                   onClick={() => { setShowCartModal(false); handleNavigate('Cart'); }} 
                   className="py-2.5 px-3 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                 >
                   View Cart ({totalCartCount})
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Modal / Side Drawer */}
      {showWishlistModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div>
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <h3 className="font-bold text-slate-900 text-lg">My Wishlist ({wishlistItems.length})</h3>
                </div>
                <button onClick={() => setShowWishlistModal(false)} className="text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[calc(100vh-140px)] space-y-3">
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-1" />
                    <p className="font-bold text-slate-700 text-base mb-1">Your Wishlist is Empty</p>
                    <p className="text-xs text-slate-400 mb-6">Save items you love by clicking the heart icon on any product.</p>
                    <button 
                      onClick={() => { setShowWishlistModal(false); handleNavigate('Products'); }}
                      className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  wishlistItems.map((prod) => (
                    <div key={prod.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                      <img src={prod.image} alt={prod.name} className="w-16 h-16 object-cover rounded-xl bg-white border border-slate-100 cursor-pointer" onClick={() => { setShowWishlistModal(false); handleViewProduct(prod); }} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate cursor-pointer hover:text-blue-600" onClick={() => { setShowWishlistModal(false); handleViewProduct(prod); }}>{prod.name}</h4>
                        <p className="text-xs font-bold text-rose-600">{prod.price}</p>
                        <p className="text-[10px] text-slate-400">{prod.vendor || 'Merchant'}</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button 
                          onClick={() => { handleAddToCart(prod, 1); }}
                          className="p-2 bg-slate-900 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleWishlist(prod)}
                          className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                          title="Remove from Wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-white">
                <button 
                  onClick={() => {
                    wishlistItems.forEach(item => handleAddToCart(item, 1));
                    setShowWishlistModal(false);
                    showToast('All Wishlist items added to Cart!');
                  }}
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Move All to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compare Modal Table */}
      {showCompareModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
              <div className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-lg">Product Comparison ({compareList.length}/4)</h3>
              </div>
              <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto overflow-y-auto flex-1">
              {compareList.length === 0 ? (
                <div className="text-center py-12">
                  <Repeat className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-1" />
                  <p className="font-bold text-slate-700 text-base mb-1">No products in compare list</p>
                  <p className="text-xs text-slate-400 mb-6">Click the compare button on product cards to view side-by-side specs.</p>
                  <button 
                    onClick={() => { setShowCompareModal(false); handleNavigate('Products'); }}
                    className="px-5 py-2.5 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition-colors cursor-pointer"
                  >
                    Select Products to Compare
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 min-w-[600px]">
                  {compareList.map((prod) => (
                    <div key={prod.id} className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between relative group">
                      <button 
                        onClick={() => handleCompare(prod)}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-slate-400 hover:text-rose-600 shadow-xs cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div>
                        <div className="w-full aspect-square bg-white rounded-xl p-2 mb-3 border border-slate-100 overflow-hidden">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-contain cursor-pointer" onClick={() => { setShowCompareModal(false); handleViewProduct(prod); }} />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2 cursor-pointer hover:text-blue-600" onClick={() => { setShowCompareModal(false); handleViewProduct(prod); }}>{prod.name}</h4>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="font-bold text-slate-900 text-base">{prod.price}</span>
                          {prod.mrp && <span className="text-xs text-slate-400 line-through">{prod.mrp}</span>}
                        </div>

                        <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200/60 pt-3 mb-4">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Vendor:</span>
                            <span className="font-bold text-slate-800 truncate max-w-[100px]">{prod.vendor || 'Merchant'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Rating:</span>
                            <span className="font-bold text-amber-600 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" /> {prod.rating || 4.8}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Stock:</span>
                            <span className="font-bold text-emerald-600">In Stock</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleAddToCart(prod, 1)}
                        className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-center aspect-square border border-slate-100">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="max-w-full max-h-full object-contain" />
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-full uppercase tracking-wider mb-2">
                    {quickViewProduct.vendor || 'Authorized Merchant'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-xl mb-2">{quickViewProduct.name}</h3>
                  <div className="flex items-center gap-1 text-amber-500 mb-3 text-xs font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-slate-800">{quickViewProduct.rating || 4.8}</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-black text-slate-900">{quickViewProduct.price}</span>
                    {quickViewProduct.mrp && <span className="text-xs text-slate-400 line-through">{quickViewProduct.mrp}</span>}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-6">
                    {quickViewProduct.description || 'Authentic product verified and fulfilled by local Sultanpur vendors with fast local shipping.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      handleAddToCart(quickViewProduct, 1);
                      setQuickViewProduct(null);
                    }}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Shopping Cart
                  </button>

                  <button 
                    onClick={() => {
                      setQuickViewProduct(null);
                      handleViewProduct(quickViewProduct);
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    View Full Details <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
