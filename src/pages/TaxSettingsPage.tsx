import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Plus, Check, Percent, Edit2, Trash2, X } from 'lucide-react';
import { marketplaceStore, useMarketplaceData, TaxRule } from '../lib/store';

export function TaxSettingsPage() {
  const taxes = useMarketplaceData('taxRules', () => marketplaceStore.getTaxRules());
  const [taxInclusive, setTaxInclusive] = useState(() => marketplaceStore.getTaxInclusive());

  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<TaxRule | null>(null);

  const [ruleName, setRuleName] = useState('');
  const [ruleRate, setRuleRate] = useState('');
  const [appliesTo, setAppliesTo] = useState('');
  const [ruleStatus, setRuleStatus] = useState<'Active' | 'Inactive'>('Active');

  const handleOpenModal = (rule?: TaxRule) => {
    if (rule) {
      setEditingRule(rule);
      setRuleName(rule.name);
      setRuleRate(rule.rate.replace('%', ''));
      setAppliesTo(rule.appliesTo);
      setRuleStatus(rule.status);
    } else {
      setEditingRule(null);
      setRuleName('');
      setRuleRate('');
      setAppliesTo('');
      setRuleStatus('Active');
    }
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) {
      alert('Please enter a tax rule name.');
      return;
    }

    const formattedRate = ruleRate.includes('%') ? ruleRate.trim() : `${ruleRate.trim()}%`;

    if (editingRule) {
      marketplaceStore.updateTaxRule(editingRule.id, {
        name: ruleName.trim(),
        rate: formattedRate,
        appliesTo: appliesTo.trim() || 'All Products',
        status: ruleStatus,
      });
    } else {
      marketplaceStore.addTaxRule({
        name: ruleName.trim(),
        rate: formattedRate,
        appliesTo: appliesTo.trim() || 'All Products',
        status: ruleStatus,
      });
    }

    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      marketplaceStore.deleteTaxRule(id);
    }
  };

  const handleToggleInclusive = () => {
    const nextVal = !taxInclusive;
    setTaxInclusive(nextVal);
    marketplaceStore.setTaxInclusive(nextVal);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tax Configurations</h1>
          <p className="text-slate-500 mt-1">Manage tax rules and GST rates applicable to categories and products.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Tax Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {taxes.map((tax) => (
          <Card key={tax.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{tax.name}</h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${
                        tax.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tax.status}
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{tax.rate}</div>
              </div>
              <div className="text-sm text-slate-500">
                <strong className="text-slate-700">Applies to:</strong> {tax.appliesTo}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => handleOpenModal(tax)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-slate-50"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(tax.id, tax.name)}
                  className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors px-2 py-1 rounded hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {taxes.length === 0 && (
          <div className="col-span-full p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <Percent className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium text-sm">No tax rules configured yet.</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-3 px-4 py-2 text-xs font-bold text-blue-600 hover:underline"
            >
              + Create First Tax Rule
            </button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Tax Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Display prices inclusive of tax in storefront</h4>
              <p className="text-xs text-slate-500 mt-0.5">Customers will see the final price including applied taxes.</p>
            </div>
            <button
              type="button"
              onClick={handleToggleInclusive}
              className={`w-12 h-7 rounded-full transition-colors relative flex items-center p-1 ${
                taxInclusive ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform flex items-center justify-center ${
                  taxInclusive ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                {taxInclusive && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingRule ? 'Edit Tax Rule' : 'Add New Tax Rule'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tax Rule Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard GST - 18%"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tax Rate (%) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18"
                  value={ruleRate}
                  onChange={(e) => setRuleRate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Applies To Categories / Products
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electronics, Fashion, Apparel"
                  value={appliesTo}
                  onChange={(e) => setAppliesTo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={ruleStatus}
                  onChange={(e) => setRuleStatus(e.target.value as 'Active' | 'Inactive')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {editingRule ? 'Save Changes' : 'Create Tax Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

