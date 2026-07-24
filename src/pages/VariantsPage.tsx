import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Plus, X, Type, Palette, Ruler, Weight, Package, Trash2, Check } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

type VariantType = 'text' | 'color' | 'size' | 'weight' | 'volume';

interface VariantGroup {
  id: string;
  name: string;
  type: VariantType;
  values: { id: string; label: string; value?: string }[];
}

export function VariantsPage() {
  const variantGroups = useMarketplaceData('variants', () => marketplaceStore.getVariants()) as VariantGroup[];
  const [activeGroupId, setActiveGroupId] = useState<string>('1');
  
  const [newValueLabel, setNewValueLabel] = useState('');
  const [newValueColor, setNewValueColor] = useState('#000000');

  // New Group Modal State
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState<VariantType>('size');

  const activeGroup = variantGroups.find(g => g.id === activeGroupId) || variantGroups[0];

  const getGroupIcon = (type: VariantType) => {
    switch (type) {
      case 'color': return Palette;
      case 'size': return Ruler;
      case 'weight': return Weight;
      case 'volume': return Package;
      default: return Type;
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup: VariantGroup = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      type: newGroupType,
      values: []
    };
    const updated = [...variantGroups, newGroup];
    marketplaceStore.saveVariants(updated);
    setActiveGroupId(newGroup.id);
    setNewGroupName('');
    setIsCreatingGroup(false);
  };

  const handleDeleteGroup = (groupId: string, name: string) => {
    if (confirm(`Are you sure you want to delete variant group "${name}"?`)) {
      const updated = variantGroups.filter(g => g.id !== groupId);
      marketplaceStore.saveVariants(updated);
      if (activeGroupId === groupId && updated.length > 0) {
        setActiveGroupId(updated[0].id);
      }
    }
  };

  const handleAddValue = () => {
    if (!activeGroup || !newValueLabel.trim()) return;
    
    const updatedGroups = variantGroups.map(group => {
      if (group.id === activeGroup.id) {
        return {
          ...group,
          values: [
            ...group.values, 
            { 
              id: Date.now().toString(), 
              label: newValueLabel.trim(), 
              ...(group.type === 'color' ? { value: newValueColor } : {}) 
            }
          ]
        };
      }
      return group;
    });

    marketplaceStore.saveVariants(updatedGroups);
    setNewValueLabel('');
    setNewValueColor('#000000');
  };

  const removeValue = (groupId: string, valueId: string) => {
    const updatedGroups = variantGroups.map(group => {
      if (group.id === groupId) {
        return { ...group, values: group.values.filter(v => v.id !== valueId) };
      }
      return group;
    });
    marketplaceStore.saveVariants(updatedGroups);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Variants</h1>
          <p className="text-slate-500 mt-1">Manage attributes like sizes, colors, capacities, and weights globally.</p>
        </div>
        <button 
          onClick={() => setIsCreatingGroup(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Variant Type
        </button>
      </div>

      {isCreatingGroup && (
        <Card className="p-4 bg-blue-50/50 border-blue-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Group Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Memory Storage, Cloth Sizes" 
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Group Type</label>
              <select 
                value={newGroupType}
                onChange={(e) => setNewGroupType(e.target.value as VariantType)}
                className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm font-bold text-slate-800 outline-none"
              >
                <option value="size">Size / Measurement</option>
                <option value="color">Color Picker</option>
                <option value="weight">Weight (g, kg)</option>
                <option value="volume">Volume (ml, Liter)</option>
                <option value="text">General Text / Pack</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCreateGroup}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" /> Create Group
              </button>
              <button 
                onClick={() => setIsCreatingGroup(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar for variant groups */}
        <div className="lg:col-span-1 space-y-2">
          {variantGroups.map((group) => {
            const Icon = getGroupIcon(group.type);
            const isSelected = activeGroup && activeGroup.id === group.id;
            return (
              <div key={group.id} className="relative group">
                <button
                  onClick={() => setActiveGroupId(group.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-2xs' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 pr-6">
                    <div className={`p-1.5 rounded-md ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-left line-clamp-1">{group.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    {group.values.length}
                  </span>
                </button>
                <button 
                  onClick={() => handleDeleteGroup(group.id, group.name)}
                  className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Delete Variant Group"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right side content for selected variant */}
        <div className="lg:col-span-3">
          {activeGroup ? (
            <Card className="h-full">
              <CardHeader className="border-b border-slate-100 pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      {React.createElement(getGroupIcon(activeGroup.type), { className: 'w-5 h-5' })}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{activeGroup.name}</CardTitle>
                      <p className="text-sm text-slate-500 mt-1">Configure options for this variant group.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteGroup(activeGroup.id, activeGroup.name)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete Group"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                
                {/* Add new value form */}
                <div className="flex flex-wrap sm:flex-nowrap items-end gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Value Label</label>
                    <input 
                      type="text" 
                      placeholder={activeGroup.type === 'color' ? "e.g. Navy Blue" : "e.g. XXL, 100g, Pack of 3"}
                      value={newValueLabel}
                      onChange={(e) => setNewValueLabel(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddValue()}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  
                  {activeGroup.type === 'color' && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Color Code</label>
                      <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-lg">
                        <input 
                          type="color" 
                          value={newValueColor}
                          onChange={(e) => setNewValueColor(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                        />
                        <input 
                          type="text" 
                          value={newValueColor.toUpperCase()}
                          onChange={(e) => setNewValueColor(e.target.value)}
                          className="w-20 text-sm border-none outline-none font-mono font-bold"
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleAddValue}
                    disabled={!newValueLabel.trim()}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                  >
                    Add Value
                  </button>
                </div>

                {/* Values List */}
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-4">Existing Values ({activeGroup.values.length})</h4>
                  <div className="flex flex-wrap gap-3">
                    {activeGroup.values.map(val => (
                      <div key={val.id} className="flex items-center gap-2 pl-3 pr-1 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs group">
                        {activeGroup.type === 'color' && val.value && (
                          <div className="w-4 h-4 rounded-full border border-slate-200 shrink-0" style={{ backgroundColor: val.value }}></div>
                        )}
                        <span className="text-sm font-bold text-slate-800">{val.label}</span>
                        <button 
                          onClick={() => removeValue(activeGroup.id, val.id)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete value"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {activeGroup.values.length === 0 && (
                      <p className="text-sm text-slate-400 italic">No values added yet.</p>
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 p-8 font-medium">
              Select a variant group to configure
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
