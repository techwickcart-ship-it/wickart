import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Save } from 'lucide-react';
import { marketplaceStore } from '../lib/store';

export function AddSellerPage() {
  const [sellerName, setSellerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [storeName, setStoreName] = useState('');
  const [categories, setCategories] = useState('Grocery');
  const [status, setStatus] = useState<'Active' | 'Pending' | 'Suspended'>('Active');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName.trim() || !mobile.trim() || !email.trim() || !storeName.trim()) {
      alert('Please fill out all required fields: Seller Name, Mobile, Email, and Store Name.');
      return;
    }

    const nextId = String(Math.floor(100 + Math.random() * 900));

    marketplaceStore.addSeller({
      id: nextId,
      name: sellerName.trim(),
      email: email.trim(),
      storeName: storeName.trim(),
      phone: mobile.trim(),
      status: status,
      orders: 0,
      revenue: '₹0',
      rating: 5.0
    });

    alert(`Successfully registered seller ${sellerName} as store "${storeName}" with ID ${nextId}!`);
    
    // Clear state
    setSellerName('');
    setMobile('');
    setEmail('');
    setStoreName('');
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-16 z-10 bg-slate-50/90 backdrop-blur-md py-4 border-b border-slate-200/60 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span>Home</span>
            <span>/</span>
            <span>Sellers</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">Register Seller</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Register New Seller</h1>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => { setSellerName(''); setMobile(''); setEmail(''); setStoreName(''); }} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            Reset
          </button>
          <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            Register Seller
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-slate-800 text-lg">Seller Information</CardTitle>
              <CardDescription>Basic personal and login details for the seller.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Seller Owner Name <span className="text-red-500">*</span></label>
                  <input required type="text" value={sellerName} onChange={(e) => setSellerName(e.target.value)} placeholder="e.g. Ramesh Gupta" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mobile <span className="text-red-500">*</span></label>
                  <input required type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="e.g. +91 98765 43210" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seller@example.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <input required type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                  <input required type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Address <span className="text-red-500">*</span></label>
                  <textarea required rows={3} placeholder="Sultanpur, Uttar Pradesh, India" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-medium text-slate-700"></textarea>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Details */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-slate-800 text-lg">Store Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Store Name <span className="text-red-500">*</span></label>
                <input required type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="e.g. Sultanpur Super Mart" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Categories (Comma separated) <span className="text-red-500">*</span></label>
                <input required type="text" value={categories} onChange={(e) => setCategories(e.target.value)} placeholder="e.g. Grocery, Fruits, Vegetables" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card className="border-blue-100 shadow-sm shadow-blue-50">
            <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-4">
              <CardTitle className="text-blue-900 font-bold">Verification & Plans</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">KYC Status</label>
                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none font-semibold text-slate-700">
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Active Subscription Plan</label>
                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none font-semibold text-slate-700">
                  <option value="premium">Premium Seller</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-slate-800 text-lg">Store Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Pending' | 'Suspended')}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none font-semibold text-slate-700"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
