import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Gift, Save, Search, Users, Share2, Sparkles, CheckCircle } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function ReferralsPage() {
  const referralConfig = useMarketplaceData('referralConfig', () => marketplaceStore.getReferralConfig());
  const referralsList = useMarketplaceData('referralsList', () => marketplaceStore.getReferralsList());
  const customers = useMarketplaceData('customers', () => marketplaceStore.getCustomers());

  const [referrerAmount, setReferrerAmount] = useState(String(referralConfig.referrerAmount || 200));
  const [refereeAmount, setRefereeAmount] = useState(String(referralConfig.refereeAmount || 200));
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');

  // Test Referral Simulation
  const [testCode, setTestCode] = useState('ALOK200');
  const [testFriendName, setTestFriendName] = useState('Rahul Verma');
  const [testFriendPhone, setTestFriendPhone] = useState('9811223344');
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    marketplaceStore.saveReferralConfig({
      referrerAmount: parseFloat(referrerAmount) || 200,
      refereeAmount: parseFloat(refereeAmount) || 200,
    });
    setTimeout(() => {
      setIsSaving(false);
      alert('Referral reward amounts saved successfully!');
    }, 400);
  };

  const handleTestReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testCode || !testFriendName) return;
    const res = marketplaceStore.processReferralCode(testCode, testFriendName, testFriendPhone);
    setTestResultMsg(res.message);
  };

  const filteredReferrals = referralsList.filter((row: any) =>
    (row.referrerName || '').toLowerCase().includes(search.toLowerCase()) ||
    (row.refereeName || '').toLowerCase().includes(search.toLowerCase()) ||
    (row.id || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Referral & Loyalty Rewards</h1>
          <p className="text-slate-500 mt-1">Configure referral reward amounts, track successful invites, and test code redemptions.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Configuration Card */}
         <div className="md:col-span-1 space-y-6">
            <Card>
               <CardHeader className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                     <Gift className="w-5 h-5 text-blue-600" />
                     <CardTitle>Reward Configurations</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Reward for Referrer (₹)</label>
                     <p className="text-xs text-slate-500 mb-2">Amount credited to existing customer's wallet when code is redeemed.</p>
                     <input 
                       type="number" 
                       value={referrerAmount}
                       onChange={(e) => setReferrerAmount(e.target.value)}
                       className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Reward for Referee (₹)</label>
                     <p className="text-xs text-slate-500 mb-2">Amount credited to new customer's wallet on signup.</p>
                     <input 
                       type="number" 
                       value={refereeAmount}
                       onChange={(e) => setRefereeAmount(e.target.value)}
                       className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white outline-none"
                     />
                  </div>
                  <button 
                     onClick={handleSave}
                     className="w-full flex justify-center items-center gap-2 px-4 py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                     <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Update Settings'}
                  </button>
               </CardContent>
            </Card>

            {/* Test Referral Simulator */}
            <Card className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-0 shadow-lg">
               <CardHeader className="pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 font-bold text-sm text-blue-300">
                     <Sparkles className="w-4 h-4 text-amber-400" /> Test Referral Code Redemption
                  </div>
               </CardHeader>
               <CardContent className="pt-4 space-y-3">
                  <p className="text-xs text-slate-300">Simulate a new friend using an existing customer's referral code to watch wallets get credited live.</p>
                  <div>
                     <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Referral Code to Use</label>
                     <select 
                       value={testCode} 
                       onChange={(e) => setTestCode(e.target.value)}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-bold outline-none"
                     >
                        {customers.map(c => (
                           <option key={c.id} value={c.referralCode} className="bg-slate-900 text-white">
                              {c.referralCode} ({c.name})
                           </option>
                        ))}
                     </select>
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">New Friend Full Name</label>
                     <input 
                       type="text" 
                       value={testFriendName}
                       onChange={(e) => setTestFriendName(e.target.value)}
                       placeholder="e.g. Rahul Verma"
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-medium outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">New Friend Phone</label>
                     <input 
                       type="text" 
                       value={testFriendPhone}
                       onChange={(e) => setTestFriendPhone(e.target.value)}
                       placeholder="+91 9811223344"
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-medium outline-none"
                     />
                  </div>
                  <button 
                    onClick={handleTestReferral}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer mt-2"
                  >
                     Trigger Referral Bonus
                  </button>
                  {testResultMsg && (
                    <p className="text-xs font-medium text-emerald-300 mt-2 bg-emerald-950/80 p-2.5 rounded-lg border border-emerald-500/30">
                       {testResultMsg}
                    </p>
                  )}
               </CardContent>
            </Card>
         </div>
         
         {/* Detailed Logs & Customer Codes */}
         <div className="md:col-span-2 space-y-6">
            <Card>
               <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                  <CardTitle>Customer Referral Codes & History</CardTitle>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search referrer or referee..." 
                      className="pl-9 pr-4 py-1.5 w-56 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none" 
                    />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                 <div className="p-4 bg-slate-50/60 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                       <Share2 className="w-3.5 h-3.5 text-blue-600" /> Active Customer Referral Codes
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {customers.map(c => (
                          <div key={c.id} className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2">
                             <span className="font-bold text-xs text-slate-900">{c.name}:</span>
                             <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{c.referralCode}</span>
                             <span className="text-[10px] text-emerald-600 font-bold">₹{(Number(c.walletBalance)||0).toFixed(0)} bal</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                       <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                          <tr>
                             <th className="px-6 py-4 font-medium">Referrer Details</th>
                             <th className="px-6 py-4 font-medium">Referee Details</th>
                             <th className="px-6 py-4 font-medium text-center">Status / Date</th>
                             <th className="px-6 py-4 font-medium text-right">Disbursed Reward</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {filteredReferrals.length === 0 ? (
                             <tr>
                                <td colSpan={4} className="text-center py-8 text-slate-400">
                                   No referral logs found.
                                </td>
                             </tr>
                          ) : filteredReferrals.map((row: any) => (
                            <tr key={row.id} className="hover:bg-slate-50">
                               <td className="px-6 py-4">
                                 <div className="font-bold text-blue-600">{row.referrerName}</div>
                                 <div className="text-xs text-slate-500">{row.referrerId || row.referrerPhone}</div>
                               </td>
                               <td className="px-6 py-4">
                                 <div className="font-bold text-slate-900">{row.refereeName}</div>
                                 <div className="text-xs text-slate-500">{row.refereePhone || row.refereeId}</div>
                               </td>
                               <td className="px-6 py-4 text-center">
                                 <span className={`inline-flex items-center px-2 py-1 mb-1 rounded-full text-xs font-bold ${row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {row.status}
                                 </span>
                                 <div className="text-xs text-slate-500">{row.date}</div>
                               </td>
                               <td className="px-6 py-4 font-black text-slate-900 text-right">{row.earned}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               </CardContent>
            </Card>
         </div>
      </div>
      
    </div>
  );
}
