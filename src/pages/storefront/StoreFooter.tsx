import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, ExternalLink } from 'lucide-react';

interface StoreFooterProps {
  onNavigate: (page: string) => void;
}

export function StoreFooter({ onNavigate }: StoreFooterProps) {
  return (
    <footer className="bg-slate-900 pt-16 pb-8 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
         
         <div>
            <div className="font-bold text-2xl tracking-tight text-white mb-6">
              Wik<span className="text-blue-500">cart</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Your one-stop destination for daily needs, electronics, groceries, and more, exclusively delivering in Sultanpur.
            </p>
            <div className="flex gap-4">
               <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
               </a>
               <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
               </a>
               <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
               </a>
            </div>
         </div>

         <div>
            <h4 className="text-white font-bold mb-6">Portals & Accounts (New Tab)</h4>
            <ul className="space-y-3 text-sm">
               <li>
                  <a href="/admin" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-amber-300 font-semibold">
                     <span>Admin Login</span>
                     <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
               </li>
               <li>
                  <a href="/vendor-registration" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors flex items-center gap-1.5 text-blue-400 font-medium">
                     <span>Vendor Registration</span>
                     <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
               </li>
               <li>
                  <a href="/customer-registration" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 text-emerald-400 font-medium">
                     <span>User Register / Login</span>
                     <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
               </li>
               <li><button onClick={() => onNavigate('Home')} className="hover:text-white transition-colors">Storefront Home</button></li>
               <li><button onClick={() => onNavigate('Products')} className="hover:text-white transition-colors">All Products</button></li>
            </ul>
         </div>

         <div>
            <h4 className="text-white font-bold mb-6">About & Policies</h4>
            <ul className="space-y-3 text-sm">
               <li>
                  <a href="/#about" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                     <span>About Us Page</span>
                     <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
               </li>
               <li>
                  <a href="/#privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                     <span>Privacy Policy</span>
                     <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
               </li>
               <li><button onClick={() => onNavigate('Terms & Conditions')} className="hover:text-white transition-colors">Terms & Conditions</button></li>
               <li><button onClick={() => onNavigate('Shipping Policy')} className="hover:text-white transition-colors">Shipping Policy</button></li>
               <li><button onClick={() => onNavigate('Cancellation & Refund')} className="hover:text-white transition-colors">Cancellation & Refund</button></li>
            </ul>
         </div>

         <div>
            <h4 className="text-white font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm">
               <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>MG Road, Sultanpur, Uttar Pradesh, 228001, India</span>
               </li>
               <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>+91 98765 43210</span>
               </li>
               <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>support@wikcart.com</span>
               </li>
            </ul>
         </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-sm text-center md:flex md:justify-between items-center text-slate-500">
         <p>© 2026 Wikcart Multi-Vendor by Digital Communique Private Limited. All rights reserved.</p>
         <p className="mt-4 md:mt-0 flex items-center justify-center gap-2">
            Delivering exclusively in <strong className="text-slate-300">Sultanpur</strong>
         </p>
      </div>
    </footer>
  );
}
