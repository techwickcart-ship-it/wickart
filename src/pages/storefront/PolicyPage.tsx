import React from 'react';
import { marketplaceStore } from '../../lib/store';

interface PolicyPageProps {
  title: string;
}

export function PolicyPage({ title }: PolicyPageProps) {
  const policies = marketplaceStore.getPolicies();
  const companyName = marketplaceStore.getCompanyName();

  // Determine policy text based on title
  let content = '';
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('terms')) {
    content = policies.terms;
  } else if (lowerTitle.includes('privacy')) {
    content = policies.privacy;
  } else if (lowerTitle.includes('shipping')) {
    content = policies.shipping;
  } else if (lowerTitle.includes('cancellation') || lowerTitle.includes('refund') || lowerTitle.includes('return')) {
    content = policies.returns;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in duration-500">
      <div className="bg-white p-8 sm:p-12 border border-slate-100 shadow-sm rounded-3xl">
         <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-8">{title}</h1>
         
         <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
            {content ? (
              <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
                {content}
              </div>
            ) : (
              <>
                <p>
                   Welcome to {companyName || 'Wikcart'}. This page contains our {title.toLowerCase()}. Please read these terms carefully before using our platform. By accessing or using our services, you agree to be bound by the terms outlined here.
                </p>
                
                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. General Overview</h3>
                <p>
                   These policies govern your use of the {companyName || 'Wikcart'} platform. We reserve the right to modify these terms at any time without prior notice. Continued use of the platform constitutes your acceptance of the revised terms.
                </p>

                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Platform Rules</h3>
                <ul className="list-disc pl-5 space-y-2">
                   <li>Users must be 18 years or older to place an order.</li>
                   <li>Services are exclusively available within Sultanpur, UP.</li>
                   <li>Vendors are responsible for the quality and authenticity of their products.</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Legal Liability</h3>
                <p>
                   {companyName || 'Wikcart'} acts as a marketplace facilitator. We do not assume direct liability for the products sold by third-party vendors. Any disputes regarding product quality should be raised directly with the respective vendor through our support channels.
                </p>
              </>
            )}
         </div>
      </div>
    </div>
  );
}
