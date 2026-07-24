import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../../lib/cartStore';

interface CartPageProps {
  onNavigate: (page: string) => void;
  cartItems?: CartItem[];
  onUpdateQuantity?: (id: number | string, newQty: number) => void;
  onRemoveFromCart?: (id: number | string) => void;
  onClearCart?: () => void;
}

export function CartPage({ 
  onNavigate, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveFromCart 
}: CartPageProps) {
  const [discountCode, setDiscountCode] = useState('');
  const [isSuccessfullyApplied, setIsSuccessfullyApplied] = useState(false);

  const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subTotal > 499 || subTotal === 0 ? 0 : 20;
  const discount = isSuccessfullyApplied ? 50 : 0;
  const tax = Math.round(Math.max(0, subTotal - discount) * 0.05); // 5% tax
  const total = Math.max(0, subTotal + deliveryFee + tax - discount);

  const handleApplyCoupon = () => {
    if (discountCode.trim().toUpperCase() === 'WELCOME50') {
      setIsSuccessfullyApplied(true);
      alert('Coupon WELCOME50 applied! Eligibility (1 discount per phone number) will be verified at checkout.');
    } else {
      setIsSuccessfullyApplied(false);
      alert('Invalid coupon code. Try WELCOME50 for ₹50 off!');
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-12 animate-in fade-in duration-500">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
         
         <div className="bg-[#e9eee6] rounded-[2rem] p-6 sm:p-8 shadow-sm text-[#4b5563] relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10 text-[#374151]">
               <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-1 opacity-70">CART MANIFEST</p>
                  <h1 className="text-3xl font-black tracking-tight">Order Summary</h1>
               </div>
               <button onClick={() => onNavigate('Home')} className="p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer" title="Close Cart">
                  <X className="w-6 h-6" />
               </button>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white/60 rounded-3xl mb-6">
                <div className="w-16 h-16 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Your Cart is Empty</h3>
                <p className="text-sm text-slate-500 mb-6">Explore our store and add items to your cart!</p>
                <button 
                  onClick={() => onNavigate('Products')}
                  className="px-6 py-3 bg-[#1f2937] hover:bg-black text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-black/10 cursor-pointer"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-[#dde4df] rounded-3xl p-4 flex gap-4 items-center">
                     <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0 shadow-xs">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#1f2937] text-base sm:text-lg mb-0.5 truncate">{item.name}</h3>
                        <p className="text-[#3b82f6] font-extrabold text-sm mb-3">
                           ₹{item.price.toFixed(2)} {item.vendor && <span className="font-normal text-xs text-slate-500">({item.vendor})</span>}
                        </p>
                        <div className="flex justify-between items-center w-full">
                           <div className="inline-flex bg-[#cfd6d1] rounded-full items-center border border-slate-300/40">
                              <button 
                                 onClick={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
                                 title="Decrease Quantity"
                                 className="px-3 py-1 text-slate-700 hover:text-black font-extrabold cursor-pointer transition-colors">
                                 <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center font-bold text-sm text-[#1f2937]">{item.quantity}</span>
                              <button 
                                 onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                                 title="Increase Quantity"
                                 className="px-3 py-1 text-slate-700 hover:text-black font-extrabold cursor-pointer transition-colors">
                                 <Plus className="w-3.5 h-3.5" />
                              </button>
                           </div>
                           <button 
                             onClick={() => onRemoveFromCart?.(item.id)}
                             title="Remove Item"
                             className="p-1.5 text-slate-400 hover:text-red-500 transition-colors opacity-70 hover:opacity-100 cursor-pointer"
                           >
                              <X className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {cartItems.length > 0 && (
              <>
                {/* Voucher */}
                <div className="mb-8">
                   <div className="flex justify-between items-end mb-2">
                      <p className="text-[10px] font-bold tracking-widest text-[#3b82f6] uppercase">VOUCHER / CODE</p>
                      <button onClick={() => alert('Available Offers:\n\n1. WELCOME50 - Flat ₹50 Off')} className="text-[11px] font-bold text-[#ec4899] hover:underline cursor-pointer">Offers list</button>
                   </div>
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={discountCode} 
                        onChange={(e) => setDiscountCode(e.target.value)} 
                        placeholder="e.g. WELCOME50" 
                        className="flex-1 bg-transparent border-b-2 border-[#cfd6d1] focus:border-[#3b82f6] outline-none px-2 py-2 font-medium text-[#1f2937] placeholder:text-[#9ca3af] transition-colors uppercase" 
                      />
                      <button onClick={handleApplyCoupon} className="bg-[#1f2937] hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-black/10 transition-all cursor-pointer">
                         APPLY
                      </button>
                   </div>
                   {isSuccessfullyApplied && <p className="text-[#10b981] text-xs font-bold mt-2">Discount applied successfully!</p>}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-8">
                   <div className="flex justify-between items-center text-sm font-bold text-[#3b82f6]">
                      <span className="uppercase tracking-widest text-xs opacity-80">SUBTOTAL</span>
                      <span className="text-[#1f2937]">₹{subTotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-bold text-[#3b82f6]">
                      <span className="uppercase tracking-widest text-xs opacity-80">DELIVERY FEE</span>
                      <span className="text-[#1f2937]">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
                   </div>
                   {isSuccessfullyApplied && (
                      <div className="flex justify-between items-center text-sm font-bold text-[#10b981]">
                         <span className="uppercase tracking-widest text-xs opacity-80">DISCOUNT</span>
                         <span>-₹{discount.toFixed(2)}</span>
                      </div>
                   )}
                   <div className="flex justify-between items-center text-sm font-bold text-[#3b82f6]">
                      <span className="uppercase tracking-widest text-xs opacity-80">ESTIMATED TAX (5%)</span>
                      <span className="text-[#1f2937]">₹{tax.toFixed(2)}</span>
                   </div>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-end mb-8 pt-4 border-t border-[#cfd6d1]">
                   <span className="text-[10px] font-bold tracking-widest text-[#3b82f6] opacity-80 uppercase">GRAND TOTAL</span>
                   <span className="text-4xl font-black text-[#1f2937] tracking-tighter">₹{total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <button 
                  onClick={() => onNavigate('Checkout')} 
                  className="w-full bg-[#10b981] hover:bg-[#059669] active:bg-[#047857] text-[#064e3b] py-5 rounded-[1.5rem] font-black tracking-widest text-sm flex items-center justify-center gap-3 transition-colors shadow-xl shadow-[#10b981]/20 group cursor-pointer"
                >
                   INITIATE SECURE CHECKOUT 
                   <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </>
            )}

         </div>
      </div>
    </div>
  );
}
