import React from 'react';

export function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in duration-500 text-center">
      <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-6">About Wikcart</h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Wikcart is a premier multi-vendor marketplace dedicated exclusively to the residents of Sultanpur, Uttar Pradesh. 
        We bridge the gap between local vendors and consumers, offering a seamless digital platform for fresh groceries, 
        electronics, fashion, and daily essentials.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
         <div className="bg-slate-50 p-6 rounded-2xl">
            <h3 className="font-bold text-xl text-slate-900 mb-3">Local First</h3>
            <p className="text-slate-600">We empower local Sultanpur businesses by providing them a powerful digital storefront to reach more customers.</p>
         </div>
         <div className="bg-slate-50 p-6 rounded-2xl">
            <h3 className="font-bold text-xl text-slate-900 mb-3">Fast Delivery</h3>
            <p className="text-slate-600">Operating exclusively in Sultanpur allows us to organize rapid, reliable delivery directly to your door.</p>
         </div>
         <div className="bg-slate-50 p-6 rounded-2xl">
            <h3 className="font-bold text-xl text-slate-900 mb-3">Quality Assured</h3>
            <p className="text-slate-600">We carefully onboard vendors to ensure you receive the highest quality products and genuine brands.</p>
         </div>
      </div>
    </div>
  );
}
