import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, ShoppingCart, Plus, Minus, CreditCard, Receipt, User, CheckCircle, Printer, X, Store, Tag, Percent, Trash2, AlertTriangle, Gift, ArrowLeft } from 'lucide-react';
import { marketplaceStore, useMarketplaceData, Order, Product } from '../lib/store';

export function POSDashboardPage() {
  const storeProducts = useMarketplaceData('products', () => marketplaceStore.getProducts());
  const storeSellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());
  const storeCustomers = useMarketplaceData('customers', () => marketplaceStore.getCustomers());
  const storeOrders = useMarketplaceData('orders', () => marketplaceStore.getOrders());

  const [activeTab, setActiveTab] = useState<'terminal' | 'recent_orders'>('terminal');

  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number; image?: string; isComboOffer?: boolean; comboTitle?: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('Main Store');

  // Customer State
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // Discount Modal State
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat');
  const [discountValue, setDiscountValue] = useState<string>('');
  const [discountReason, setDiscountReason] = useState<string>('Festive / Seasonal Offer');
  const [customDiscountReason, setCustomDiscountReason] = useState<string>('');

  // Applied Discount
  const [appliedDiscount, setAppliedDiscount] = useState<{ amount: number; type: 'flat' | 'percent'; value: number; reason: string } | null>(null);

  // Cancel Order Modal State
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>('Customer Changed Mind');
  const [customCancellationReason, setCustomCancellationReason] = useState<string>('');

  // Success Receipt Modal state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Default products if store is empty
  const defaultProducts = [
    { id: 101, name: 'Premium Wireless Headphones', price: '2999', rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
    { id: 102, name: 'Organic Green Tea (250g)', price: '450', rating: 4.9, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200' },
    { id: 103, name: 'Smart Fitness Band', price: '1299', rating: 4.5, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200' },
    { id: 104, name: 'Breakfast Essentials Combo Pack', price: '699', rating: 4.9, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200', isComboOffer: true, comboTitle: 'Milk 1L + Wheat Bread + Amul Butter', comboTag: 'SUPER COMBO' },
    { id: 105, name: 'Yoga Mat with Alignment Lines', price: '999', rating: 4.6, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200' },
    { id: 106, name: 'Ceramic Coffee Mug', price: '350', rating: 4.4, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200' }
  ];

  const availableProducts = storeProducts.length > 0 ? storeProducts : defaultProducts;

  const filteredProducts = availableProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ('category' in p && typeof p.category === 'string' && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    ('comboTitle' in p && typeof p.comboTitle === 'string' && p.comboTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCustomers = storeCustomers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  );

  const selectCustomer = (c: { name: string; phone: string }) => {
    setCustomerName(c.name);
    setCustomerPhone(c.phone);
    setCustomerSearch('');
    setShowCustomerDropdown(false);

    if (c.phone && marketplaceStore.hasPhoneNumberUsedDiscount(c.phone)) {
      if (appliedDiscount) {
        setAppliedDiscount(null);
      }
      alert(`⚠️ Discount Restriction Alert:\n\nCustomer ${c.name} (${c.phone}) has ALREADY used a coupon or discount on a previous order. Each phone number is strictly allowed 1 discount or coupon use.`);
    }
  };

  const addToCart = (product: Product | any) => {
    const numPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price.toString().replace(/[^0-9.]/g, '')) || 0;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: numPrice, 
        qty: 1, 
        image: product.image,
        isComboOffer: product.isComboOffer,
        comboTitle: product.comboTitle
      }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const removeCartItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleApplyDiscount = () => {
    if (customerPhone && customerPhone !== 'N/A' && marketplaceStore.hasPhoneNumberUsedDiscount(customerPhone)) {
      alert(`🚫 Discount Restriction Error:\n\nPhone number "${customerPhone}" has ALREADY redeemed a coupon or discount on a previous order. Each phone number is allowed only 1 discount or coupon use.`);
      return;
    }

    const val = parseFloat(discountValue);
    if (isNaN(val) || val <= 0) {
      alert('Please enter a valid discount amount or percentage.');
      return;
    }

    const finalReason = discountReason === 'Custom Reason' ? customDiscountReason.trim() : discountReason;
    if (!finalReason) {
      alert('Please select or enter a valid reason for applying this discount.');
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let calcAmt = 0;
    if (discountType === 'percent') {
      calcAmt = subtotal * (val / 100);
    } else {
      calcAmt = Math.min(subtotal, val);
    }

    setAppliedDiscount({
      type: discountType,
      value: val,
      amount: calcAmt,
      reason: finalReason
    });

    setShowDiscountModal(false);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountValue('');
    setCustomDiscountReason('');
  };

  const handleCancelCurrentSale = () => {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to cancel and clear the current bill?')) {
      setCart([]);
      setAppliedDiscount(null);
      setCustomerName('Walk-in Customer');
      setCustomerPhone('');
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmt = appliedDiscount ? (
    appliedDiscount.type === 'percent'
      ? subtotal * (appliedDiscount.value / 100)
      : Math.min(subtotal, appliedDiscount.value)
  ) : 0;

  const discountedSubtotal = Math.max(0, subtotal - discountAmt);
  const tax = discountedSubtotal * 0.18; // 18% GST
  const total = discountedSubtotal + tax;

  const handleCompleteOrder = (paymentMethod: 'Cash' | 'Card/UPI') => {
    if (cart.length === 0) {
      alert('Cart is empty. Add products to cart before checking out.');
      return;
    }

    if (appliedDiscount && customerPhone && customerPhone !== 'N/A' && marketplaceStore.hasPhoneNumberUsedDiscount(customerPhone)) {
      alert(`🚫 Order Sale Blocked:\n\nPhone number "${customerPhone}" has ALREADY redeemed a coupon or discount on a previous order. Please remove the discount to complete this sale.`);
      return;
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      customer: customerName || 'Walk-in Customer',
      phone: customerPhone || 'N/A',
      store: selectedStore || (storeSellers[0]?.storeName || 'Main Store'),
      amount: `₹${total.toFixed(2)}`,
      status: 'Confirmed',
      items: cart.map(i => ({ name: i.name, qty: i.qty, price: `₹${i.price}` })),
      discountAmount: discountAmt > 0 ? `₹${discountAmt.toFixed(2)}` : undefined,
      discountReason: appliedDiscount ? appliedDiscount.reason : undefined
    };

    marketplaceStore.addOrder(newOrder);

    if (customerName !== 'Walk-in Customer' && customerPhone) {
      const existingCust = storeCustomers.find(c => c.phone === customerPhone);
      if (!existingCust) {
        marketplaceStore.addCustomer({
          name: customerName,
          phone: customerPhone
        });
      }
    }

    setCompletedOrder(newOrder);
    setCart([]);
    setAppliedDiscount(null);
  };

  const handleConfirmCancelOrder = () => {
    if (!orderToCancel) return;
    const finalReason = cancellationReason === 'Other Custom Reason' ? customCancellationReason.trim() : cancellationReason;
    
    if (!finalReason) {
      alert('Please select or specify a cancellation reason.');
      return;
    }

    marketplaceStore.cancelOrder(orderToCancel.id, finalReason);
    setOrderToCancel(null);
    setCancellationReason('Customer Changed Mind');
    setCustomCancellationReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header & Store Selector & View Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" /> Point of Sale (POS) Counter
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Instant retail counter checkout, discounts with reason, & order cancellation</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Navigation Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'terminal' 
                  ? 'bg-white text-blue-600 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Billing Counter
            </button>
            <button
              onClick={() => setActiveTab('recent_orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'recent_orders' 
                  ? 'bg-white text-blue-600 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recent POS Orders
            </button>
          </div>

          {/* Store Selector */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Store className="w-4 h-4 text-slate-500" />
            <select 
              value={selectedStore} 
              onChange={(e) => setSelectedStore(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold text-slate-800 cursor-pointer"
            >
              <option value="Main Store">Main Store Counter</option>
              {storeSellers.map(s => (
                <option key={s.id} value={s.storeName}>{s.storeName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeTab === 'terminal' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Products Grid */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="h-[calc(100vh-220px)] flex flex-col border border-slate-200">
              <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search products or combo offers by name or category..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-900 transition-all"
                  />
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4">
                {filteredProducts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 text-center p-8">
                    <ShoppingCart className="w-10 h-10 text-slate-300" />
                    <p className="font-bold text-sm">No products matched "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredProducts.map(product => (
                      <div 
                        key={product.id} 
                        onClick={() => addToCart(product)}
                        className={`border rounded-2xl p-3 cursor-pointer hover:shadow-md bg-white transition-all group flex flex-col justify-between relative ${
                          product.isComboOffer ? 'border-amber-300 hover:border-amber-500 bg-amber-50/10' : 'border-slate-200 hover:border-blue-500'
                        }`}
                      >
                        {product.isComboOffer && (
                          <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
                            <Gift className="w-2.5 h-2.5" /> {product.comboTag || 'COMBO'}
                          </span>
                        )}

                        <div className="aspect-square bg-slate-50 rounded-xl mb-2 flex items-center justify-center overflow-hidden p-2 group-hover:bg-blue-50/50 transition-colors">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                          ) : (
                            <ShoppingCart className="w-8 h-8 text-slate-300 group-hover:text-blue-500" />
                          )}
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                          {product.comboTitle && (
                            <p className="text-[10px] text-amber-700 font-medium line-clamp-1 mt-0.5">{product.comboTitle}</p>
                          )}
                          <p className="text-blue-600 font-black text-sm mt-0.5">₹{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cart / Billing Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-220px)] flex flex-col border border-slate-200 shadow-sm">
              
              {/* Header & Customer Picker */}
              <CardHeader className="bg-slate-900 text-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-bold text-white">
                    <Receipt className="w-4 h-4 text-blue-400" /> Current Bill
                  </CardTitle>
                  {cart.length > 0 && (
                    <button 
                      onClick={handleCancelCurrentSale}
                      className="text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-1 bg-red-950/60 hover:bg-red-900 px-2.5 py-1 rounded-lg transition-colors"
                      title="Cancel and Clear Current Sale"
                    >
                      <Trash2 className="w-3 h-3" /> Cancel Sale
                    </button>
                  )}
                </div>

                {/* Customer Fetch / Quick Input */}
                <div className="relative">
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Search or enter Customer Mobile..." 
                      value={customerSearch || (customerPhone ? `${customerName} (${customerPhone})` : customerName)}
                      onFocus={() => setShowCustomerDropdown(true)}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setShowCustomerDropdown(true);
                      }}
                      className="w-full bg-transparent outline-none text-xs font-bold text-white placeholder:text-slate-500" 
                    />
                    {customerPhone && (
                      <button onClick={() => { setCustomerName('Walk-in Customer'); setCustomerPhone(''); setCustomerSearch(''); }} className="text-slate-400 hover:text-white cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Customer Dropdown search results */}
                  {showCustomerDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 z-30 max-h-48 overflow-y-auto">
                      <div 
                        onClick={() => selectCustomer({ name: 'Walk-in Customer', phone: '' })}
                        className="p-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700"
                      >
                        <span>Walk-in Customer</span>
                        <span className="text-[10px] text-slate-400">Default</span>
                      </div>

                      {filteredCustomers.map(c => (
                        <div 
                          key={c.id} 
                          onClick={() => selectCustomer(c)}
                          className="p-2.5 hover:bg-blue-50 cursor-pointer border-b border-slate-100 flex items-center justify-between text-xs font-semibold"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{c.name}</p>
                            <p className="text-[10px] text-slate-500">{c.phone}</p>
                          </div>
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold">Select</span>
                        </div>
                      ))}

                      {customerSearch && !filteredCustomers.some(c => c.phone === customerSearch) && (
                        <div 
                          onClick={() => {
                            setCustomerName(customerSearch.includes('@') || isNaN(Number(customerSearch)) ? customerSearch : 'Customer');
                            setCustomerPhone(isNaN(Number(customerSearch)) ? '' : customerSearch);
                            setShowCustomerDropdown(false);
                          }}
                          className="p-2.5 hover:bg-emerald-50 text-emerald-700 cursor-pointer text-xs font-bold flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Use "{customerSearch}" as new customer
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              {/* Cart Items List */}
              <CardContent className="flex-1 overflow-y-auto p-0">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 p-6 text-center">
                    <ShoppingCart className="w-10 h-10 text-slate-200" />
                    <p className="text-xs font-bold">Cart is empty.</p>
                    <p className="text-[11px] text-slate-400">Click any product on the left to add items to bill.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {cart.map(item => (
                      <div key={item.id} className="p-3 flex items-center justify-between hover:bg-slate-50 group">
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1">
                            <h4 className="font-bold text-slate-900 text-xs truncate">{item.name}</h4>
                            {item.isComboOffer && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.2 rounded shrink-0">COMBO</span>
                            )}
                          </div>
                          <p className="text-slate-500 text-[11px] font-semibold mt-0.5">₹{item.price} × {item.qty}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                            <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded text-slate-700 cursor-pointer"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded text-slate-700 cursor-pointer"><Plus className="w-3 h-3" /></button>
                          </div>

                          <p className="font-bold text-slate-900 text-xs w-14 text-right">₹{item.price * item.qty}</p>

                          {/* Cancel Item button */}
                          <button 
                            onClick={() => removeCartItem(item.id)} 
                            className="text-slate-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Cancel / Remove Item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>

              {/* Total & Checkout */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                
                {/* Discount Section */}
                {cart.length > 0 && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
                    {appliedDiscount ? (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="p-1 bg-emerald-100 text-emerald-700 rounded-md">
                            <Tag className="w-3 h-3" />
                          </span>
                          <div>
                            <p className="font-bold text-emerald-700">
                              Discount: -₹{discountAmt.toFixed(2)} ({appliedDiscount.type === 'percent' ? `${appliedDiscount.value}%` : `₹${appliedDiscount.value}`})
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">Reason: {appliedDiscount.reason}</p>
                          </div>
                        </div>
                        <button 
                          onClick={handleRemoveDiscount}
                          className="text-slate-400 hover:text-red-500 text-xs font-bold p-1 cursor-pointer"
                          title="Remove discount"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowDiscountModal(true)}
                        className="w-full py-1.5 px-3 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Tag className="w-3.5 h-3.5 text-blue-600" /> + Add Discount & Reason
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 font-semibold">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmt > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount Savings</span>
                      <span>-₹{discountAmt.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 font-semibold">
                    <span>GST Tax (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-black text-base text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Payable</span>
                    <span className="text-blue-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button 
                    onClick={() => handleCompleteOrder('Card/UPI')}
                    disabled={cart.length === 0}
                    className="flex items-center justify-center gap-1.5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition shadow-md cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Pay Card/UPI
                  </button>
                  <button 
                    onClick={() => handleCompleteOrder('Cash')}
                    disabled={cart.length === 0}
                    className="flex items-center justify-center gap-1.5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition shadow-md cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" /> Pay Cash
                  </button>
                </div>
              </div>

            </Card>
          </div>

        </div>
      ) : (
        /* Recent POS Orders View */
        <Card className="border border-slate-200">
          <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Recent POS Orders & Returns</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Manage placed counter sales, view receipts, or execute order cancellation with reason.</p>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Store Counter</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Discount Applied</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {storeOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                      No recent POS orders found.
                    </td>
                  </tr>
                ) : (
                  storeOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {ord.id}
                        <p className="text-[10px] text-slate-400 font-medium">{ord.date}</p>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {ord.customer}
                        {ord.phone && ord.phone !== 'N/A' && (
                          <p className="text-[10px] text-slate-400">{ord.phone}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {ord.store}
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs truncate text-[11px] text-slate-600 font-medium">
                          {ord.items && ord.items.length > 0 
                            ? ord.items.map(i => `${i.name} (${i.qty})`).join(', ')
                            : 'N/A'
                          }
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {ord.discountAmount ? (
                          <div>
                            <span className="font-bold text-emerald-700 text-[11px]">{ord.discountAmount}</span>
                            {ord.discountReason && (
                              <p className="text-[10px] text-slate-500 truncate max-w-[120px]" title={ord.discountReason}>
                                {ord.discountReason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900">
                        {ord.amount}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                          ord.status === 'Cancelled' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ord.status}
                        </span>
                        {ord.cancellationReason && (
                          <p className="text-[10px] text-red-600 font-medium mt-0.5 italic max-w-[130px] truncate" title={`Reason: ${ord.cancellationReason}`}>
                            Reason: {ord.cancellationReason}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setCompletedOrder(ord)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Receipt
                          </button>
                          {ord.status !== 'Cancelled' && (
                            <button 
                              onClick={() => {
                                setOrderToCancel(ord);
                                setCancellationReason('Customer Changed Mind');
                                setCustomCancellationReason('');
                              }}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <X className="w-3 h-3" /> Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Discount & Reason Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" /> Apply POS Discount & Reason
              </h3>
              <button onClick={() => setShowDiscountModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Discount Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Discount Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDiscountType('flat')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      discountType === 'flat'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Flat Amount (₹)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('percent')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      discountType === 'percent'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Percent className="w-3.5 h-3.5" />
                    <span>Percentage (%)</span>
                  </button>
                </div>
              </div>

              {/* Value Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {discountType === 'flat' ? 'Discount Amount (₹)' : 'Discount Percentage (%)'}
                </label>
                <input 
                  type="number" 
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'flat' ? 'e.g. 50' : 'e.g. 10'}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              {/* Reason for Discount Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Discount (Mandatory)</label>
                <select
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="Festive / Seasonal Offer">🎉 Festive / Seasonal Offer</option>
                  <option value="Damaged / Defective Packaging">📦 Damaged / Defective Packaging</option>
                  <option value="VIP / Loyal Customer Discount">⭐ VIP / Loyal Customer Discount</option>
                  <option value="Manager Override / Special Clearance">🔑 Manager Override / Special Clearance</option>
                  <option value="Bulk Quantity Purchase">🛍️ Bulk Quantity Purchase</option>
                  <option value="Price Match Guarantee">🏷️ Price Match Guarantee</option>
                  <option value="Employee / Staff Discount">💼 Employee / Staff Discount</option>
                  <option value="Custom Reason">✍️ Custom Reason (Specify Below)</option>
                </select>
              </div>

              {discountReason === 'Custom Reason' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specify Custom Reason</label>
                  <input 
                    type="text"
                    value={customDiscountReason}
                    onChange={(e) => setCustomDiscountReason(e.target.value)}
                    placeholder="Enter reason for applying discount..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button 
                onClick={() => setShowDiscountModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleApplyDiscount}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                Apply Discount
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" /> Cancel Order #{orderToCancel.id}
              </h3>
              <button onClick={() => setOrderToCancel(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 font-medium">
                <p>Are you sure you want to cancel this POS sale of <strong>{orderToCancel.amount}</strong> for customer <strong>{orderToCancel.customer}</strong>?</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Cancellation (Required)</label>
                <select
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
                >
                  <option value="Customer Changed Mind">Customer Changed Mind / Refused</option>
                  <option value="Wrong Product Scanned">Wrong Product Scanned / Billing Error</option>
                  <option value="Payment Declined">Payment Failed / Declined</option>
                  <option value="Damaged / Expired Product">Damaged or Expired Product</option>
                  <option value="Customer Requested Refund">Customer Requested Immediate Refund</option>
                  <option value="Other Custom Reason">Other Reason (Specify Below)</option>
                </select>
              </div>

              {cancellationReason === 'Other Custom Reason' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Custom Cancellation Reason</label>
                  <textarea 
                    rows={2}
                    value={customCancellationReason}
                    onChange={(e) => setCustomCancellationReason(e.target.value)}
                    placeholder="Provide detailed reason for cancellation..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-red-500"
                  ></textarea>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button 
                onClick={() => setOrderToCancel(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Keep Order
              </button>
              <button 
                onClick={handleConfirmCancelOrder}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completed Order Receipt Modal */}
      {completedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
            <div className="p-6 bg-emerald-600 text-white text-center space-y-2">
              <CheckCircle className="w-12 h-12 mx-auto text-white" />
              <h3 className="text-lg font-black">Order Placed Successfully!</h3>
              <p className="text-xs text-emerald-100">Order ID: #{completedOrder.id}</p>
            </div>

            <div className="p-6 space-y-4 text-xs font-semibold text-slate-700">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Customer:</span>
                <span className="font-bold text-slate-900">{completedOrder.customer} ({completedOrder.phone})</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Store Counter:</span>
                <span className="font-bold text-slate-900">{completedOrder.store}</span>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-400">Items Purchased:</p>
                {completedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-800">
                    <span>{item.name} × {item.qty}</span>
                    <span className="font-bold">{item.price}</span>
                  </div>
                ))}
              </div>

              {completedOrder.discountAmount && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-0.5">
                  <div className="flex justify-between font-bold text-emerald-800">
                    <span>Discount Applied:</span>
                    <span>-{completedOrder.discountAmount}</span>
                  </div>
                  {completedOrder.discountReason && (
                    <p className="text-[10px] text-emerald-700 font-medium">Reason: {completedOrder.discountReason}</p>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-600">{completedOrder.amount}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button 
                onClick={() => setCompletedOrder(null)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                New POS Sale
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
