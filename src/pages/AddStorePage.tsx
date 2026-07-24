import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { marketplaceStore } from '../lib/store';
import { CheckCircle, Store, Building2, Phone, MapPin, User, Mail } from 'lucide-react';

interface AddStorePageProps {
  onNavigate?: (page: string) => void;
}

export function AddStorePage({ onNavigate }: AddStorePageProps) {
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('General Retail');
  const [status, setStatus] = useState<'Active' | 'Pending'>('Active');
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !ownerName.trim()) {
      alert('Please enter Store Name and Owner Name.');
      return;
    }

    const newSeller = {
      id: `S-${Math.floor(1000 + Math.random() * 9000)}`,
      name: ownerName.trim(),
      storeName: storeName.trim(),
      email: email.trim() || `${storeName.toLowerCase().replace(/\s+/g, '')}@store.com`,
      phone: phone.trim() || '+91 98765 43210',
      address: address.trim(),
      city: city.trim() || 'Sultanpur',
      category: category,
      status: status,
      orders: 0,
      revenue: '₹0',
      rating: 5.0,
      plan: 'Pro Plan'
    };

    marketplaceStore.addSeller(newSeller);

    setSuccessMessage(`Store "${storeName}" created successfully!`);
    
    // Reset form
    setStoreName('');
    setOwnerName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
      
      {successMessage && (
        <div className="p-4 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
          {onNavigate && (
            <button 
              onClick={() => onNavigate('all-stores')}
              className="px-3 py-1 bg-white text-emerald-800 text-xs font-black rounded-lg hover:bg-emerald-50 transition-colors"
            >
              View Stores List
            </button>
          )}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Store className="w-6 h-6 text-blue-600" /> Add New Store / Seller
        </h1>
        <p className="text-xs text-slate-500 mt-1">Register a new retail store tenant into the Sultanpur marketplace network.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> Store Name *
                </label>
                <input 
                  type="text" 
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-xs font-bold text-slate-900 transition-all" 
                  placeholder="e.g. Fresh Organic Supermarket" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Owner / Manager Name *
                </label>
                <input 
                  type="text" 
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-xs font-bold text-slate-900 transition-all" 
                  placeholder="Owner's full name" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" /> Contact Phone Number
                </label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-xs font-semibold transition-all" 
                  placeholder="+91 98765 43210" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" /> Store Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-xs font-semibold transition-all" 
                  placeholder="store@example.com" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Property Address
                </label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-xs font-semibold transition-all" 
                  placeholder="Street, Landmark, Market Area" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-xs font-semibold transition-all" 
                  placeholder="Sultanpur" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Store Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-xs font-bold text-slate-800 transition-all cursor-pointer"
                >
                  <option value="General Retail">General Retail</option>
                  <option value="Groceries & Organics">Groceries & Organics</option>
                  <option value="Electronics & Mobiles">Electronics & Mobiles</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Pharmacy & Health">Pharmacy & Health</option>
                </select>
              </div>

            </div>
            
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                type="button" 
                onClick={() => onNavigate && onNavigate('all-stores')}
                className="px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Store className="w-4 h-4" /> Save Store
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
