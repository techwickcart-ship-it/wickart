import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { marketplaceStore } from '../lib/store';

interface Props {
  onBack: () => void;
}

export function AddCouponPage({ onBack }: Props) {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('fixed');
  const [value, setValue] = useState(100);
  const [minPurchase, setMinPurchase] = useState(500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('Please enter a coupon code!');
      return;
    }

    marketplaceStore.addCoupon({
      code: code.trim(),
      discountType,
      value: Number(value),
      minPurchase: Number(minPurchase),
      status: 'Active'
    });

    onBack();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Coupon</h1>
          <p className="text-slate-500 mt-1">Configure discount codes and apply them to products.</p>
        </div>
        <button onClick={onBack} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition text-sm">
          Back to Coupons
        </button>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Coupon Code</label>
              <input 
                type="text" 
                required
                placeholder="e.g. MEGA200" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all font-mono font-bold uppercase text-slate-800" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Discount Type</label>
                <select 
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all font-semibold text-slate-700"
                >
                  <option value="fixed">Flat Amount (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Discount Value</label>
                <input 
                  type="number" 
                  required
                  placeholder="100" 
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all font-semibold text-slate-700" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Minimum Order Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 500" 
                  value={minPurchase}
                  onChange={(e) => setMinPurchase(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all font-semibold text-slate-700" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Max Usage per User</label>
                <input 
                  type="number" 
                  defaultValue={1}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all font-semibold text-slate-700" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Valid Until</label>
              <input 
                type="date" 
                defaultValue="2026-12-31"
                className="w-full md:w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all font-semibold text-slate-700" 
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={onBack} className="px-5 py-2.5 text-slate-600 hover:bg-slate-50 font-bold rounded-lg">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/15">Save Coupon</button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
