import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Settings, Plus, Search } from 'lucide-react';

export function PagePlaceholder({ pageName }: { pageName: string }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{pageName}</h1>
          <p className="text-slate-500 mt-1">Manage and view your {pageName.toLowerCase()} settings.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <CardTitle>{pageName} Overview</CardTitle>
            <CardDescription>View and manage all records for this module.</CardDescription>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={`Search ${pageName}...`}
              className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 hover:border-slate-300 transition-colors outline-none"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <span className="text-2xl font-bold text-slate-300">
                {pageName.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No {pageName} Found</h3>
            <p className="text-slate-500 max-w-sm mb-6 text-sm">
              We couldn't find any data for {pageName}. The tables and lists will appear here once records are generated or imported.
            </p>
            <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
              Learn about {pageName} &rarr;
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
