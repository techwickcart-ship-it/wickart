import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, MapPin, Eye, Edit2 } from 'lucide-react';

const MOCK_ADDRESSES = [
  { id: 'ADDR-101', customer: 'Alok Nath', label: 'Home', address: '123, Sunrise Apartments, Sector 4, MG Road, CA, 90210' },
  { id: 'ADDR-102', customer: 'Priya Desai', label: 'Office', address: 'Tech Park Tower B, 4th Floor, Silicon Valley' },
];

export function CustomerAddressesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Addresses</h1>
          <p className="text-slate-500 mt-1">View and manage saved delivery addresses of customers.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
           <div className="flex items-center justify-between">
              <CardTitle>Directory</CardTitle>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search addresses..."
                  className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 transition-colors outline-none"
                />
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                   <tr>
                      <th className="px-6 py-4 font-medium">ID</th>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Full Address</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {MOCK_ADDRESSES.map((addr) => (
                     <tr key={addr.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{addr.id}</td>
                        <td className="px-6 py-4 font-medium text-blue-600">{addr.customer}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              <div>
                                 <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold rounded mb-1">{addr.label}</span>
                                 <p>{addr.address}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                             <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded bg-slate-50 border border-slate-200">
                                <Eye className="w-4 h-4" />
                             </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
