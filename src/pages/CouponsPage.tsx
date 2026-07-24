import React, { useState } from 'react';
import { Tag, Plus, Search, Trash2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../components/ui/Card';
import { marketplaceStore, useMarketplaceData, Coupon } from '../lib/store';

interface Props {
  onNavigate?: (page: string) => void;
}

export function CouponsPage({ onNavigate }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const coupons = useMarketplaceData('coupons', () => marketplaceStore.getCoupons());

  const handleToggleStatus = (id: string) => {
    const list = marketplaceStore.getCoupons();
    const updated = list.map(c => c.id === id ? { ...c, status: (c.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive' } : c) as Coupon[];
    marketplaceStore.saveCoupons(updated);
  };

  const handleDelete = (id: string) => {
    const list = marketplaceStore.getCoupons();
    const updated = list.filter(c => c.id !== id);
    marketplaceStore.saveCoupons(updated);
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Promotional Coupons</h1>
          <p className="text-slate-500 mt-1">Manage discount coupons, active promo codes, and customer offers.</p>
        </div>
        <button 
          onClick={() => onNavigate?.('Add Coupon')} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-blue-500/15"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      <Card>
        <div className="border-b border-slate-100 p-4 bg-slate-50/50">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search coupons..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full md:w-80 border bg-white rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-700" 
            />
          </div>
        </div>
        <CardContent className="p-0">
          {filteredCoupons.length === 0 ? (
            <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center">
              <Tag className="w-12 h-12 text-slate-200 mb-4" />
              <p className="font-bold text-slate-700">No active coupons found</p>
              <p className="text-sm mt-1 max-w-xs mx-auto">Create a custom promo code (e.g. EXTRA20) to offer special checkout discounts to customers.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Promo Code</th>
                    <th className="px-6 py-4">Discount Type</th>
                    <th className="px-6 py-4">Discount Value</th>
                    <th className="px-6 py-4">Min Spend required</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredCoupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-blue-100 text-sm">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 capitalize text-slate-700">
                        {coupon.discountType === 'percentage' ? 'Percentage Off' : 'Flat Off'}
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-bold text-base">
                        {coupon.discountType === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        ₹{coupon.minPurchase}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(coupon.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                            coupon.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {coupon.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors inline-flex"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
