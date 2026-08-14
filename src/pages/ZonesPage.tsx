import React, { useState } from 'react';
import { 
  MapPin, Plus, Search, Edit2, Trash2, ShieldCheck, XCircle, X, 
  Clock, Truck, IndianRupee, Layers, CheckCircle2, AlertTriangle, Filter, Navigation
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { marketplaceStore, useMarketplaceData, DeliveryZone } from '../lib/store';

export function ZonesPage() {
  const zones = useMarketplaceData('deliveryZones', () => marketplaceStore.getDeliveryZones());
  const deliveryPartners = useMarketplaceData('deliveryPartners', () => marketplaceStore.getDeliveryPartners());

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [notification, setNotification] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [deletingZone, setDeletingZone] = useState<DeliveryZone | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: 'Sultanpur',
    state: 'Uttar Pradesh',
    pincodes: '228001',
    areas: '',
    deliveryFee: 0,
    minOrderAmount: 199,
    estimatedTime: '20 - 40 Mins',
    assignedRidersCount: 2,
    status: 'Active' as 'Active' | 'Inactive',
    description: ''
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    const nextCodeNum = String(zones.length + 1).padStart(2, '0');
    setFormData({
      name: '',
      code: `ZONE-SLN-${nextCodeNum}`,
      city: 'Sultanpur',
      state: 'Uttar Pradesh',
      pincodes: '228001',
      areas: '',
      deliveryFee: 0,
      minOrderAmount: 199,
      estimatedTime: '20 - 40 Mins',
      assignedRidersCount: 2,
      status: 'Active',
      description: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      code: zone.code,
      city: zone.city,
      state: zone.state,
      pincodes: Array.isArray(zone.pincodes) ? zone.pincodes.join(', ') : (zone.pincodes || ''),
      areas: zone.areas || '',
      deliveryFee: zone.deliveryFee || 0,
      minOrderAmount: zone.minOrderAmount || 199,
      estimatedTime: zone.estimatedTime || '20 - 40 Mins',
      assignedRidersCount: zone.assignedRidersCount || 2,
      status: zone.status || 'Active',
      description: zone.description || ''
    });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const pincodesList = formData.pincodes.split(',').map(s => s.trim()).filter(Boolean);
    const newZone = marketplaceStore.addDeliveryZone({
      name: formData.name.trim(),
      code: formData.code.trim() || `ZONE-${Date.now().toString().slice(-4)}`,
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincodes: pincodesList.length > 0 ? pincodesList : ['228001'],
      areas: formData.areas.trim() || 'City Municipal Limits',
      deliveryFee: Number(formData.deliveryFee) || 0,
      minOrderAmount: Number(formData.minOrderAmount) || 199,
      estimatedTime: formData.estimatedTime.trim() || '25 - 45 Mins',
      assignedRidersCount: Number(formData.assignedRidersCount) || 1,
      status: formData.status,
      description: formData.description.trim()
    });

    showToast(`Delivery zone "${newZone.name}" created successfully.`);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone || !formData.name.trim()) return;

    const pincodesList = formData.pincodes.split(',').map(s => s.trim()).filter(Boolean);
    marketplaceStore.updateDeliveryZone(editingZone.id, {
      name: formData.name.trim(),
      code: formData.code.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincodes: pincodesList.length > 0 ? pincodesList : ['228001'],
      areas: formData.areas.trim(),
      deliveryFee: Number(formData.deliveryFee) || 0,
      minOrderAmount: Number(formData.minOrderAmount) || 199,
      estimatedTime: formData.estimatedTime.trim(),
      assignedRidersCount: Number(formData.assignedRidersCount) || 1,
      status: formData.status,
      description: formData.description.trim()
    });

    showToast(`Delivery zone "${formData.name}" updated successfully.`);
    setEditingZone(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingZone) return;
    marketplaceStore.deleteDeliveryZone(deletingZone.id);
    showToast(`Delivery zone "${deletingZone.name}" removed successfully.`);
    setDeletingZone(null);
  };

  const toggleStatus = (zone: DeliveryZone) => {
    const newStatus = zone.status === 'Active' ? 'Inactive' : 'Active';
    marketplaceStore.updateDeliveryZone(zone.id, { status: newStatus });
    showToast(`Zone "${zone.name}" is now ${newStatus}.`);
  };

  const filteredZones = zones.filter(z => {
    const matchesSearch = 
      (z.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (z.code || '').toLowerCase().includes(search.toLowerCase()) ||
      (z.areas || '').toLowerCase().includes(search.toLowerCase()) ||
      (z.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(z.pincodes) ? z.pincodes.join(' ') : String(z.pincodes || '')).includes(search);

    const matchesStatus = filterStatus === 'All' || z.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalActiveZones = zones.filter(z => z.status === 'Active').length;
  const totalRidersAssigned = zones.reduce((acc, z) => acc + (Number(z.assignedRidersCount) || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
           <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
           <span className="font-medium text-sm">{notification}</span>
           <button onClick={() => setNotification(null)} className="ml-4 text-slate-400 hover:text-white cursor-pointer">
              <XCircle className="w-4 h-4" />
           </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Delivery Zones</h1>
          <p className="text-slate-500 mt-1">Configure geofenced delivery clusters, delivery fees, minimum order thresholds, and rider allocations.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Zone
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{zones.length}</div>
            <div className="text-xs font-semibold text-slate-500">Total Delivery Zones</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">{totalActiveZones}</div>
            <div className="text-xs font-semibold text-slate-500">Active Serving Zones</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{totalRidersAssigned || deliveryPartners.length || 15}</div>
            <div className="text-xs font-semibold text-slate-500">Assigned Fleet Riders</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">Sultanpur, UP</div>
            <div className="text-xs font-semibold text-slate-500">Active Regional Hub</div>
          </div>
        </div>
      </div>

      {/* Main Delivery Zones Table & Directory */}
      <Card>
        <CardHeader className="border-b border-slate-100 p-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-4">
            <CardTitle>Configured Delivery Zones ({filteredZones.length})</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by zone name, code, pincode..." 
                  className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition"
                />
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                {(['All', 'Active', 'Inactive'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                      filterStatus === status ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredZones.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <MapPin className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Delivery Zones Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">Click "Add Zone" above to define regional coverage boundaries and delivery fees.</p>
              <button 
                onClick={handleOpenAdd}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Delivery Zone
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Zone & Code</th>
                    <th className="px-6 py-4">Covered Areas & Pincodes</th>
                    <th className="px-6 py-4">Delivery Fee & Min Order</th>
                    <th className="px-6 py-4">Speed & Fleet</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredZones.map((zone) => {
                    const pincodesArr = Array.isArray(zone.pincodes) ? zone.pincodes : (zone.pincodes ? [zone.pincodes] : []);

                    return (
                      <tr key={zone.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>{zone.name}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {zone.code}
                            </span>
                            <span className="text-xs text-slate-400">{zone.city}, {zone.state}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-xs font-medium text-slate-800 line-clamp-1">
                            {zone.areas || 'Full Municipal Sector'}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {pincodesArr.map((pin, i) => (
                              <span key={i} className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                                {pin}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-slate-900">
                            {zone.deliveryFee === 0 ? (
                              <span className="text-emerald-600 font-bold">FREE Delivery</span>
                            ) : (
                              <span>₹{zone.deliveryFee} fee</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Free above ₹{zone.minOrderAmount}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span>{zone.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <Truck className="w-3.5 h-3.5 text-slate-400" />
                            <span>{zone.assignedRidersCount} Assigned Riders</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(zone)}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-bold transition cursor-pointer ${
                              zone.status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                            title="Click to toggle Active/Inactive"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${zone.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            {zone.status}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(zone)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Zone Details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingZone(zone)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Zone"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Zone Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add New Delivery Zone</h3>
                  <p className="text-xs text-slate-500">Configure new express radius and delivery rules</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Zone Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sultanpur Central & Civil Lines"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Zone Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ZONE-SLN-04"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Covered Pincodes (comma-separated) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 228001, 228125, 228155"
                    value={formData.pincodes}
                    onChange={(e) => setFormData({ ...formData, pincodes: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Covered Localities / Areas</label>
                  <input
                    type="text"
                    placeholder="e.g. Civil Lines, Golaghat, Chowk, Amhat, Railway Station"
                    value={formData.areas}
                    onChange={(e) => setFormData({ ...formData, areas: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Base Delivery Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({ ...formData, deliveryFee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Free Delivery Above (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Estimated Delivery Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 20 - 35 Mins"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Assigned Riders Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.assignedRidersCount}
                    onChange={(e) => setFormData({ ...formData, assignedRidersCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="Active">Active (Serving Orders)</option>
                    <option value="Inactive">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Create Delivery Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Zone Modal */}
      {editingZone && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Delivery Zone</h3>
                  <p className="text-xs text-slate-500 font-mono">ID: {editingZone.id}</p>
                </div>
              </div>
              <button onClick={() => setEditingZone(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Zone Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Zone Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Covered Pincodes (comma-separated) *</label>
                  <input
                    type="text"
                    required
                    value={formData.pincodes}
                    onChange={(e) => setFormData({ ...formData, pincodes: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Covered Localities / Areas</label>
                  <input
                    type="text"
                    value={formData.areas}
                    onChange={(e) => setFormData({ ...formData, areas: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Base Delivery Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({ ...formData, deliveryFee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Free Delivery Above (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Estimated Delivery Time</label>
                  <input
                    type="text"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Assigned Riders Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.assignedRidersCount}
                    onChange={(e) => setFormData({ ...formData, assignedRidersCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  >
                    <option value="Active">Active (Serving Orders)</option>
                    <option value="Inactive">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingZone(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Save Zone Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Zone Modal */}
      {deletingZone && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Delivery Zone?</h3>
                <p className="text-xs text-slate-500">Zone: {deletingZone.name}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
              <p className="text-slate-700 font-medium">Zone Code: <span className="font-mono font-bold text-slate-900">{deletingZone.code}</span></p>
              <p className="text-slate-500">City: {deletingZone.city}, {deletingZone.state}</p>
              <p className="text-slate-500">Pincodes: {Array.isArray(deletingZone.pincodes) ? deletingZone.pincodes.join(', ') : deletingZone.pincodes}</p>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to remove this delivery zone? Orders from these pincodes will no longer be mapped to this zone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingZone(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
