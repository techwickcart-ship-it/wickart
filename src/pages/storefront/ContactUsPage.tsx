import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export function ContactUsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in duration-500">
      <div className="text-center mb-16">
         <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Contact Us</h1>
         <p className="text-lg text-slate-600">We're here to help. Reach out to the Wikcart team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         <div>
            <form className="space-y-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/20">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors" placeholder="John Doe" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors" placeholder="john@example.com" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors" placeholder="How can we help?" />
               </div>
               <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                  Send Message
               </button>
            </form>
         </div>

         <div className="space-y-8">
            <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
               </div>
               <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">Head Office</h3>
                  <p className="text-slate-600">MG Road, Sultanpur<br/>Uttar Pradesh, 228001<br/>India</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-emerald-600" />
               </div>
               <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">Phone</h3>
                  <p className="text-slate-600">+91 98765 43210<br/>Mon-Sat: 9AM to 8PM</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-purple-600" />
               </div>
               <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">Email</h3>
                  <p className="text-slate-600">Support: support@wikcart.com<br/>Vendors: vendors@wikcart.com</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
