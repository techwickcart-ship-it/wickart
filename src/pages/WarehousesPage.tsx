import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Edit2, 
  Trash2, 
  Boxes, 
  Layers, 
  Check, 
  X, 
  Package, 
  ShieldCheck, 
  Sliders
} from 'lucide-react';
import { marketplaceStore, useMarketplaceData, Warehouse } from '../lib/store';

export function WarehousesPage() {
  const warehouses = useMarketplaceData('warehouses', () => marketplaceStore.getWarehouses());
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Maintenance'>('All');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  
  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    managerName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Sultanpur',
    state: 'Uttar Pradesh',
    pincode: '228001',
    capacitySqFt: '10000',
    occupancyPercentage: '30',
    isFulfillmentCenter: true,
    status: 'Active' as 'Active' | 'Inactive' | 'Maintenance'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    const nextCodeNum = String(warehouses.length + 1).padStart(2, '0');
    setEditingWarehouse(null);
    setFormData({
      name: '',
      code: `WH-SLN-${nextCodeNum}`,
      managerName: '',
      phone: '',
      email: '',
      address: '',
      city: 'Sultanpur',
      state: 'Uttar Pradesh',
      pincode: '228001',
      capacitySqFt: '10000',
      occupancyPercentage: '20',
      isFulfillmentCenter: true,
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (wh: Warehouse) => {
    setEditingWarehouse(wh);
    setFormData({
      name: wh.name,
      code: wh.code,
      managerName: wh.managerName || '',
      phone: wh.phone || '',
      email: wh.email || '',
      address: wh.address,
      city: wh.city || 'Sultanpur',
      state: wh.state || 'Uttar Pradesh',
      pincode: wh.pincode || '228001',
      capacitySqFt: String(wh.capacitySqFt || 10000),
      occupancyPercentage: String(wh.occupancyPercentage || 0),
      isFulfillmentCenter: wh.isFulfillmentCenter !== false,
      status: wh.status
    });
    setIsModalOpen(true);
  };

  const handleSaveWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      alert('Please fill in required fields: Warehouse Name and Address');
      return;
    }

    if (editingWarehouse) {
      marketplaceStore.updateWarehouse(editingWarehouse.id, {
        name: formData.name.trim(),
        code: formData.code.trim(),
        managerName: formData.managerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        capacitySqFt: Number(formData.capacitySqFt) || 10000,
        occupancyPercentage: Number(formData.occupancyPercentage) || 0,
        isFulfillmentCenter: formData.isFulfillmentCenter,
        status: formData.status
      });
      showToast(`Updated warehouse "${formData.name}" successfully!`);
    } else {
      marketplaceStore.addWarehouse({
        name: formData.name.trim(),
        code: formData.code.trim(),
        managerName: formData.managerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        capacitySqFt: Number(formData.capacitySqFt) || 10000,
        occupancyPercentage: Number(formData.occupancyPercentage) || 0,
        isFulfillmentCenter: formData.isFulfillmentCenter,
        status: formData.status
      });
      showToast(`Created new warehouse "${formData.name}" successfully!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteWarehouse = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete warehouse "${name}"?`)) {
      marketplaceStore.deleteWarehouse(id);
      showToast(`Deleted warehouse "${name}"`);
    }
  };

  const handleToggleStatus = (wh: Warehouse) => {
    const nextStatus = wh.status === 'Active' ? 'Inactive' : 'Active';
    marketplaceStore.updateWarehouse(wh.id, { status: nextStatus });
    showToast(`Warehouse "${wh.name}" status changed to ${nextStatus}`);
  };

  // Filtered warehouses
  const filteredWarehouses = warehouses.filter(wh => {
    const matchesSearch = 
      wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (wh.managerName && wh.managerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      wh.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || wh.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalCapacity = warehouses.reduce((acc, w) => acc + (w.capacitySqFt || 0), 0);
  const activeCount = warehouses.filter(w => w.status === 'Active').length;
  const fulfillmentCount = warehouses.filter(w => w.isFulfillmentCenter && w.status === 'Active').length;
  const avgOccupancy = warehouses.length > 0 
    ? (warehouses.reduce((acc, w) => acc + (w.occupancyPercentage || 0), 0) / warehouses.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Warehouse & Depot Management</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Provision, manage, and monitor fulfillment hubs, storage capacities, and stock depots.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Warehouse</span>
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Warehouses</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{warehouses.length}</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">{activeCount} Currently Active</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fulfillment Centers</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{fulfillmentCount}</h3>
              <p className="text-xs text-blue-600 font-medium mt-1">Express Dispatch Ready</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Capacity</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalCapacity.toLocaleString()} <span className="text-xs font-medium text-slate-500">Sq Ft</span></h3>
              <p className="text-xs text-purple-600 font-medium mt-1">Storage Area</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Boxes className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Occupancy</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{avgOccupancy}%</h3>
              <p className="text-xs text-amber-600 font-medium mt-1">Capacity Utilization</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search warehouse, code, city, manager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Active', 'Inactive', 'Maintenance'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Warehouses Table */}
      <Card className="border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-4">Warehouse & Code</th>
                <th className="px-6 py-4">Manager & Contact</th>
                <th className="px-6 py-4">Location & Address</th>
                <th className="px-6 py-4">Capacity & Occupancy</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredWarehouses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No Warehouses Found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search or add a new warehouse depot.</p>
                  </td>
                </tr>
              ) : (
                filteredWarehouses.map((wh) => (
                  <tr key={wh.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name & Code */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-700 shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{wh.name}</div>
                          <div className="inline-block mt-0.5 font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                            {wh.code}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Manager & Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs font-medium text-slate-700">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{wh.managerName || 'Operations Team'}</span>
                        </div>
                        {wh.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{wh.phone}</span>
                          </div>
                        )}
                        {wh.email && (
                          <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-[180px]">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{wh.email}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Address & City */}
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-start gap-1.5 font-medium text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{wh.address}</span>
                        </div>
                        <div className="text-slate-500 pl-5">
                          {wh.city}, {wh.state} - {wh.pincode}
                        </div>
                      </div>
                    </td>

                    {/* Capacity & Occupancy */}
                    <td className="px-6 py-4">
                      <div className="space-y-1.5 w-36">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{(wh.capacitySqFt || 0).toLocaleString()} sq ft</span>
                          <span className={wh.occupancyPercentage && wh.occupancyPercentage > 85 ? 'text-rose-600' : 'text-slate-600'}>
                            {wh.occupancyPercentage || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className={`h-full transition-all rounded-full ${
                              (wh.occupancyPercentage || 0) > 85 
                                ? 'bg-rose-500' 
                                : (wh.occupancyPercentage || 0) > 60 
                                ? 'bg-amber-500' 
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, wh.occupancyPercentage || 0)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      {wh.isFulfillmentCenter ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Fulfillment Hub
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          Standard Depot
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${
                        wh.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        wh.status === 'Maintenance' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          wh.status === 'Active' ? 'bg-emerald-500' : 
                          wh.status === 'Maintenance' ? 'bg-amber-500' : 
                          'bg-slate-400'
                        }`} />
                        {wh.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(wh)}
                          title={`Toggle Status (Currently ${wh.status})`}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          {wh.status === 'Active' ? (
                            <XCircle className="w-4 h-4 text-slate-400 hover:text-rose-600" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-slate-400 hover:text-emerald-600" />
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(wh)}
                          title="Edit Warehouse"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteWarehouse(wh.id, wh.name)}
                          title="Delete Warehouse"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Warehouse Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg">
                  {editingWarehouse ? 'Edit Warehouse Depot' : 'Add New Warehouse'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveWarehouse} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Warehouse Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Warehouse Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sultanpur Central Logistics Hub"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Warehouse Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Warehouse Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WH-SLN-04"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-blue-600 focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Manager Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Manager / Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9821012345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. wh.central@wikcart.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Full Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Address Line <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Civil Lines Industrial Area, Near Railway Overbridge"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* State & Pincode */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Capacity (Sq Ft) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacity (Sq Ft)</label>
                  <input
                    type="number"
                    value={formData.capacitySqFt}
                    onChange={(e) => setFormData({ ...formData, capacitySqFt: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Occupancy % */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Occupancy Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.occupancyPercentage}
                    onChange={(e) => setFormData({ ...formData, occupancyPercentage: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Fulfillment Center Checkbox */}
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="fc_check"
                    checked={formData.isFulfillmentCenter}
                    onChange={(e) => setFormData({ ...formData, isFulfillmentCenter: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="fc_check" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Enable as Primary Express Fulfillment Hub
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {editingWarehouse ? 'Update Warehouse' : 'Save & Provision Warehouse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
