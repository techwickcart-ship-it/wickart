import React from 'react';

interface PolicyPageProps {
  title: string;
}

export function PolicyPage({ title }: PolicyPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in duration-500">
      <div className="bg-white p-8 sm:p-12 border border-slate-100 shadow-sm rounded-3xl">
         <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-8">{title}</h1>
         
         <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
            <p>
               Welcome to Wikcart. This page contains our {title.toLowerCase()}. Please read these terms carefully before using our platform. By accessing or using our services, you agree to be bound by the terms outlined here.
            </p>
            
            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. General Overview</h3>
            <p>
               These policies govern your use of the Wikcart platform. We reserve the right to modify these terms at any time without prior notice. Continued use of the platform constitutes your acceptance of the revised terms.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Platform Rules</h3>
            <ul className="list-disc pl-5 space-y-2">
               <li>Users must be 18 years or older to place an order.</li>
               <li>Services are exclusively available within Sultanpur, UP.</li>
               <li>Vendors are responsible for the quality and authenticity of their products.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Legal Liability</h3>
            <p>
               Wikcart acts as a marketplace facilitator. We do not assume direct liability for the products sold by third-party vendors. Any disputes regarding product quality should be raised directly with the respective vendor through our support channels.
            </p>

            {title === 'Cancellation & Refund' && (
               <>
                  <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Refunds Process</h3>
                  <p>
                     Refunds for canceled or returned items are processed within 5-7 business days to the original payment method. Cash on Delivery refunds are processed as wallet credits or bank transfers.
                  </p>
               </>
            )}
         </div>
      </div>
    </div>
  );
}
