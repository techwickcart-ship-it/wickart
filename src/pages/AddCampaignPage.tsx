import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

interface Props {
  onBack: () => void;
}

export function AddCampaignPage({ onBack }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Campaign</h1>
          <p className="text-slate-500 mt-1">Set up your marketing parameters and launch new campaigns.</p>
        </div>
        <button onClick={onBack} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition text-sm">
          Back to Campaigns
        </button>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
              <input type="text" placeholder="e.g. Summer Sale 2026" className="w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input type="date" className="w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input type="date" className="w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none">
                <option>All Users</option>
                <option>New Users</option>
                <option>Inactive Users</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Description</label>
              <textarea rows={4} placeholder="Describe the campaign..." className="w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none"></textarea>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={onBack} className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-lg">Cancel</button>
              <button type="button" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Launch Campaign</button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
