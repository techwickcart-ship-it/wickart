import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Plus, Trash2, Edit2, Check, X, CheckCircle, RotateCcw } from 'lucide-react';

interface ReturnReason {
  id: number;
  text: string;
  status: 'Active' | 'Inactive';
}

const DEFAULT_REASONS: ReturnReason[] = [
  { id: 1, text: 'Product is damaged/defective', status: 'Active' },
  { id: 2, text: 'Wrong item was delivered', status: 'Active' },
  { id: 3, text: 'Quality is not as expected', status: 'Active' },
  { id: 4, text: 'Missing parts or accessories', status: 'Active' },
];

export function ReturnReasonsPage() {
  const [reasons, setReasons] = useState<ReturnReason[]>(() => {
    try {
      const saved = localStorage.getItem('wikcart_return_reasons');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_REASONS;
  });

  const [newReason, setNewReason] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingStatus, setEditingStatus] = useState<'Active' | 'Inactive'>('Active');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('wikcart_return_reasons', JSON.stringify(reasons));
  }, [reasons]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAdd = () => {
    if (newReason.trim()) {
      const item: ReturnReason = { id: Date.now(), text: newReason.trim(), status: 'Active' };
      setReasons(prev => [...prev, item]);
      setNewReason('');
      showToast('New return reason added successfully.');
    }
  };

  const startEdit = (r: ReturnReason) => {
    setEditingId(r.id);
    setEditingText(r.text);
    setEditingStatus(r.status);
  };

  const handleSaveEdit = (id: number) => {
    if (!editingText.trim()) return;
    setReasons(prev => prev.map(r => r.id === id ? { ...r, text: editingText.trim(), status: editingStatus } : r));
    setEditingId(null);
    showToast('Return reason updated successfully.');
  };

  const handleDelete = (id: number, text: string) => {
    if (confirm(`Are you sure you want to delete reason: "${text}"?`)) {
      setReasons(prev => prev.filter(x => x.id !== id));
      showToast('Return reason deleted successfully.');
    }
  };

  const toggleStatus = (id: number) => {
    setReasons(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-blue-600" /> Reasons For Return
          </h1>
          <p className="text-xs text-slate-500 mt-1">Configure options shown to customers when initiating a return or exchange request.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         {/* Add Form */}
         <div className="md:col-span-1">
            <Card className="border border-slate-200">
               <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
                  <CardTitle className="text-sm font-bold text-slate-900">Add New Reason</CardTitle>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-1">Reason Text <span className="text-red-500">*</span></label>
                     <textarea 
                       value={newReason}
                       onChange={(e) => setNewReason(e.target.value)}
                       placeholder="e.g. Item size was too small / doesn't fit" 
                       rows={3} 
                       className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none resize-none transition-all"
                     ></textarea>
                  </div>
                  <button 
                     onClick={handleAdd}
                     className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                     <Plus className="w-4 h-4" /> Add Reason
                  </button>
               </CardContent>
            </Card>
         </div>
         
         {/* Reasons Table */}
         <div className="md:col-span-2">
            <Card className="border border-slate-200">
               <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-900">Active Return Options ({reasons.length})</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                       <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold uppercase tracking-wider">
                          <tr>
                             <th className="px-6 py-3.5 w-16">#</th>
                             <th className="px-6 py-3.5">Reason Description</th>
                             <th className="px-6 py-3.5">Status</th>
                             <th className="px-6 py-3.5 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 font-semibold">
                          {reasons.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                No return reasons defined. Add one above.
                              </td>
                            </tr>
                          ) : (
                            reasons.map((r, i) => {
                              const isEditing = editingId === r.id;

                              return (
                                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                                   <td className="px-6 py-4 font-bold text-slate-400">{i + 1}</td>
                                   
                                   <td className="px-6 py-4">
                                     {isEditing ? (
                                       <input 
                                         type="text" 
                                         value={editingText} 
                                         onChange={(e) => setEditingText(e.target.value)} 
                                         className="w-full px-3 py-1.5 bg-white border border-blue-400 rounded-lg text-xs font-bold outline-none"
                                       />
                                     ) : (
                                       <span className="text-slate-900 font-bold text-xs">{r.text}</span>
                                     )}
                                   </td>

                                   <td className="px-6 py-4">
                                     {isEditing ? (
                                       <select 
                                         value={editingStatus}
                                         onChange={(e: any) => setEditingStatus(e.target.value)}
                                         className="px-2 py-1 border border-slate-300 rounded-lg text-xs font-bold cursor-pointer"
                                       >
                                         <option value="Active">Active</option>
                                         <option value="Inactive">Inactive</option>
                                       </select>
                                     ) : (
                                       <button 
                                         onClick={() => toggleStatus(r.id)}
                                         className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase cursor-pointer transition-all ${
                                           r.status === 'Active' 
                                             ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                             : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                         }`}
                                       >
                                         {r.status}
                                       </button>
                                     )}
                                   </td>

                                   <td className="px-6 py-4 text-right">
                                      {isEditing ? (
                                        <div className="flex items-center justify-end gap-1.5">
                                          <button 
                                            onClick={() => handleSaveEdit(r.id)} 
                                            className="p-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                                            title="Save"
                                          >
                                            <Check className="w-4 h-4" />
                                          </button>
                                          <button 
                                            onClick={() => setEditingId(null)} 
                                            className="p-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg transition-colors cursor-pointer"
                                            title="Cancel"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-end gap-2">
                                          <button 
                                            onClick={() => startEdit(r)} 
                                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                            title="Edit Reason"
                                          >
                                            <Edit2 className="w-4 h-4" />
                                          </button>
                                          <button 
                                            onClick={() => handleDelete(r.id, r.text)} 
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            title="Delete Reason"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      )}
                                   </td>
                                </tr>
                              );
                            })
                          )}
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
