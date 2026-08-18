import React from 'react';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';

export function AboutUsPage() {
  const policies = useMarketplaceData('policies', () => marketplaceStore.getPolicies());
  const companyName = useMarketplaceData('companyName', () => marketplaceStore.getCompanyName());
  const contactInfo = useMarketplaceData('contactInfo', () => marketplaceStore.getContactInfo());

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in duration-500 text-center">
      <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-6">About {companyName || 'Wikcart'}</h1>
      
      {policies.about ? (
        <div className="text-left bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm mb-12">
          <div className="whitespace-pre-line text-slate-700 leading-relaxed text-base sm:text-lg">
            {policies.about}
          </div>
        </div>
      ) : (
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          {companyName || 'Wikcart'} is a premier multi-vendor marketplace dedicated exclusively to the residents of Sultanpur, Uttar Pradesh. 
          We bridge the gap between local vendors and consumers, offering a seamless digital platform for fresh groceries, 
          electronics, fashion, and daily essentials.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-left">
         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-xl text-slate-900 mb-3">Local First</h3>
            <p className="text-slate-600 text-sm">Empowering local Sultanpur shops and verified regional vendors with an instant digital channel.</p>
         </div>
         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-xl text-slate-900 mb-3">Hyperlocal Delivery</h3>
            <p className="text-slate-600 text-sm">Direct fulfillment across all Sultanpur pincodes within guaranteed same-day delivery windows.</p>
         </div>
         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-xl text-slate-900 mb-3">100% Genuine</h3>
            <p className="text-slate-600 text-sm">Every vendor and catalog item is quality-vetted before going live for our local community.</p>
         </div>
      </div>

      {contactInfo.email && (
        <div className="mt-12 text-sm text-slate-500">
          Have questions or want to partner? Contact us at <a href={`mailto:${contactInfo.email}`} className="text-blue-600 font-semibold underline">{contactInfo.email}</a> or call <a href={`tel:${contactInfo.mobileNumber || contactInfo.supportNumber}`} className="text-blue-600 font-semibold">{contactInfo.mobileNumber || contactInfo.supportNumber}</a>.
        </div>
      )}
    </div>
  );
}
