import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Plus, Search, Edit2, Trash2, Check, X } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

interface Attribute {
  id: string;
  name: string;
  values: string[];
}

export function AttributesPage() {
  const attributes = useMarketplaceData('attributes', () => marketplaceStore.getAttributes());
  const [search, setSearch] = useState('');
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrValues, setNewAttrValues] = useState('');

  const handleStartAdd = () => {
    setEditingId(null);
    setNewAttrName('');
    setNewAttrValues('');
    setIsAdding(true);
  };

  const handleStartEdit = (attr: Attribute) => {
    setEditingId(attr.id);
    setNewAttrName(attr.name);
    setNewAttrValues(attr.values.join(', '));
    setIsAdding(true);
  };

  const handleSave = (addAnother = false) => {
    if (!newAttrName.trim()) return;

    const valuesArr = newAttrValues.split(',').map(v => v.trim()).filter(Boolean);

    if (editingId) {
      const updated = attributes.map(a => a.id === editingId ? { ...a, name: newAttrName.trim(), values: valuesArr } : a);
      marketplaceStore.saveAttributes(updated);
    } else {
      const newAttr: Attribute = {
        id: Date.now().toString(),
        name: newAttrName.trim(),
        values: valuesArr
      };
      marketplaceStore.saveAttributes([...attributes, newAttr]);
    }

    setNewAttrName('');
    setNewAttrValues('');
    setEditingId(null);
    if (!addAnother) {
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this attribute?')) {
      const updated = attributes.filter(a => a.id !== id);
      marketplaceStore.saveAttributes(updated);
    }
  };

  const filteredAttributes = attributes.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.values.some((v: string) => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Attributes</h1>
          <p className="text-slate-500 mt-1">Manage custom specifications and properties for products.</p>
        </div>
        <button 
          onClick={handleStartAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Attribute
        </button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <CardTitle>All Attributes ({filteredAttributes.length})</CardTitle>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search attributes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 hover:border-slate-300 transition-colors outline-none"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isAdding && (
            <div className="p-4 border-b border-slate-100 bg-blue-50/50 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attribute Name *</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. Material" 
                  value={newAttrName}
                  onChange={(e) => setNewAttrName(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Values (Comma Separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Cotton, Silk, Wool" 
                  value={newAttrValues}
                  onChange={(e) => setNewAttrValues(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave(false)}
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 pb-0.5">
                <button onClick={() => handleSave(false)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer">
                  <Check className="w-4 h-4" /> Save
                </button>
                {!editingId && (
                  <button onClick={() => handleSave(true)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer">
                    + Save & Add Another
                  </button>
                )}
                <button onClick={() => setIsAdding(false)} className="px-3 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Attribute Name</th>
                  <th className="px-6 py-4">Available Values</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAttributes.length === 0 ? (
                   <tr>
                     <td colSpan={3} className="px-6 py-8 text-center text-slate-500 font-medium">No attributes found.</td>
                   </tr>
                ) : filteredAttributes.map(attr => (
                  <tr key={attr.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-900">{attr.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {attr.values.map((v: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg">
                            {v}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleStartEdit(attr)} 
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                          title="Edit Attribute"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(attr.id)} 
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
                          title="Delete Attribute"
                        >
                          <Trash2 className="w-4 h-4" />
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
