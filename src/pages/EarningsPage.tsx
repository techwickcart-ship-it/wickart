import React from 'react';
import { DollarSign, Search } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export function EarningsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Delivery Earnings</h1>
        <p className="text-slate-500 mt-1">Track payouts and earnings for delivery partners.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Total Payouts</div>
            <div className="text-3xl font-bold text-slate-900">₹ 1,45,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Pending Clearance</div>
            <div className="text-3xl font-bold text-amber-600">₹ 12,450</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Active Riders</div>
            <div className="text-3xl font-bold text-blue-600">42</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search rider..." className="pl-10 pr-4 py-2 w-full md:w-80 border rounded-lg text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <DollarSign className="w-12 h-12 text-slate-200 mb-4" />
            <p>No recent earnings data available.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
