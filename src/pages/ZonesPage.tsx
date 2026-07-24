import React from 'react';
import { MapPin, Plus, Search } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export function ZonesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Delivery Zones</h1>
          <p className="text-slate-500 mt-1">Manage delivery areas and assign riders to specific geometric zones.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Zone
        </button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search delivery zones..." className="pl-10 pr-4 py-2 w-full md:w-80 border rounded-lg text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <MapPin className="w-12 h-12 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-1">Active Zone: Sultanpur, UP</h3>
            <p className="text-sm mt-1 max-w-md">The delivery zone is strictly limited to Sultanpur limits. All orders outside this zone will be rejected automatically.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
