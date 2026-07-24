import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { 
  MapPin, 
  Truck, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Search, 
  Bike, 
  User, 
  X, 
  Plus, 
  Phone, 
  DollarSign, 
  Package, 
  AlertCircle,
  Building2,
  Map,
  Check
} from 'lucide-react';
import { marketplaceStore, useMarketplaceData, Order, DeliveryPartner } from '../lib/store';

export function DispatchManagementPage() {
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const partners = useMarketplaceData('deliveryPartners', () => marketplaceStore.getDeliveryPartners());
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());

  const [activeTab, setActiveTab] = useState<'unassigned' | 'active'>('unassigned');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [fleetSearchQuery, setFleetSearchQuery] = useState('');

  // Modals & Popups State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOrderToAssign, setSelectedOrderToAssign] = useState<Order | null>(null);

  // Form State for Add New Dispatch
  const [formStore, setFormStore] = useState('');
  const [formCustomer, setFormCustomer] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formItemName, setFormItemName] = useState('');
  const [formPartnerId, setFormPartnerId] = useState('');

  // Get active delivery partners list
  const activePartners = partners.filter(p => p.status === 'Active');

  // Filter orders
  // Unassigned: Pending or Confirmed and no delivery partner assigned
  const unassignedOrders = orders.filter(o => 
    (o.status === 'Pending' || o.status === 'Confirmed') && !o.deliveryPartnerId
  );

  // In Transit: Out for Delivery with an assigned delivery partner
  const activeDispatches = orders.filter(o => 
    o.status === 'Out for Delivery' || !!o.deliveryPartnerId
  );

  // Apply search filtering on left column orders
  const filteredUnassigned = unassignedOrders.filter(o => 
    o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    o.customer.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    o.store.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    (o.address && o.address.toLowerCase().includes(orderSearchQuery.toLowerCase()))
  );

  const filteredActive = activeDispatches.filter(o => 
    o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    o.customer.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    o.store.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    (o.deliveryPartnerName && o.deliveryPartnerName.toLowerCase().includes(orderSearchQuery.toLowerCase()))
  );

  // Filter active partners in live tracking fleet view
  const filteredFleetPartners = activePartners.filter(p => 
    p.name.toLowerCase().includes(fleetSearchQuery.toLowerCase()) ||
    p.phone.includes(fleetSearchQuery) ||
    p.city.toLowerCase().includes(fleetSearchQuery.toLowerCase()) ||
    p.deliveryArea.toLowerCase().includes(fleetSearchQuery.toLowerCase())
  );

  // Handle order creation / dispatch onboarding
  const handleAddDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStore || !formCustomer || !formPhone || !formAddress || !formAmount) {
      alert('Please fill out all required fields.');
      return;
    }

    const cleanedAmountNum = parseFloat(formAmount.replace(/[^0-9.]/g, '')) || 0;
    const amountStr = `₹${cleanedAmountNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    const newOrderPayload = {
      customer: formCustomer,
      store: formStore,
      amount: amountStr,
      address: formAddress,
      phone: formPhone,
      items: [{ name: formItemName || 'Sultanpur Hyperlocal Delivery', qty: 1, price: amountStr }]
    };

    // Create order
    const createdOrder = marketplaceStore.addOrder(newOrderPayload);

    // If an initial delivery partner was selected, update order status to Out for Delivery and assign partner info
    if (formPartnerId) {
      const selectedPartner = activePartners.find(p => p.id === formPartnerId);
      if (selectedPartner) {
        const currentOrders = marketplaceStore.getOrders();
        const updated = currentOrders.map(o => o.id === createdOrder.id ? {
          ...o,
          status: 'Out for Delivery' as const,
          deliveryPartnerId: selectedPartner.id,
          deliveryPartnerName: selectedPartner.name
        } : o);
        marketplaceStore.saveOrders(updated);
      }
    }

    // Reset Form & Close Modal
    setFormStore('');
    setFormCustomer('');
    setFormPhone('');
    setFormAddress('');
    setFormAmount('');
    setFormItemName('');
    setFormPartnerId('');
    setIsAddModalOpen(false);

    alert(`Dispatch Manifest created successfully! Assigned Order ID: ${createdOrder.id}`);
  };

  // Handle assigning partner to existing order
  const handleAssignPartner = (partner: DeliveryPartner) => {
    if (!selectedOrderToAssign) return;

    const currentOrders = marketplaceStore.getOrders();
    const updated = currentOrders.map(o => o.id === selectedOrderToAssign.id ? {
      ...o,
      status: 'Out for Delivery' as const,
      deliveryPartnerId: partner.id,
      deliveryPartnerName: partner.name
    } : o);

    marketplaceStore.saveOrders(updated);
    setIsAssignModalOpen(false);
    setSelectedOrderToAssign(null);
    alert(`Order ${selectedOrderToAssign.id} successfully assigned to ${partner.name}!`);
  };

  // Update dispatch fulfillment status
  const handleUpdateStatus = (orderId: string, nextStatus: 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered' | 'Cancelled') => {
    const currentOrders = marketplaceStore.getOrders();
    const updated = currentOrders.map(o => {
      if (o.id === orderId) {
        const item = { ...o, status: nextStatus };
        // If status becomes Delivered or Cancelled, optionally unassign partner from transit sheet or leave for tracking records
        if (nextStatus === 'Delivered' || nextStatus === 'Cancelled' || nextStatus === 'Pending') {
          item.deliveryPartnerId = undefined;
          item.deliveryPartnerName = undefined;
        }
        return item;
      }
      return o;
    });
    marketplaceStore.saveOrders(updated);
    alert(`Order status updated to: ${nextStatus}`);
  };

  // Bulk Ingestion Simulation
  const handleBulkUpload = () => {
    const sampleDispatches = [
      {
        customer: 'Karan Malhotra',
        store: 'City Square Mart',
        amount: '₹850.00',
        address: 'Sector 2, Pragati Puram, Sultanpur, UP',
        phone: '+91 94112 34567',
        items: [{ name: 'Assam Green Tea Pack', qty: 2, price: '₹425' }]
      },
      {
        customer: 'Sandeep Yadav',
        store: 'Silicon Valley Store',
        amount: '₹2,499.00',
        address: 'Police Lines Road, Sultanpur, UP',
        phone: '+91 93356 78901',
        items: [{ name: 'Wireless Earbuds Pro', qty: 1, price: '₹2,499' }]
      }
    ];

    sampleDispatches.forEach(d => marketplaceStore.addOrder(d));
    alert('Bulk Ingestion: 2 new unassigned dispatches successfully imported into Sultanpur distribution sheet.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Dispatch & Fleet Management</h1>
          <p className="text-slate-500 mt-1">Assign orders to delivery partners, optimize routes, and track live locations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleBulkUpload}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition text-sm shadow-sm flex-1 sm:flex-initial"
          >
            Upload Dispatch List
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition text-sm shadow-sm flex-1 sm:flex-initial"
          >
            <Plus className="w-4 h-4" />
            Add New Dispatch
          </button>
          <span className="flex items-center justify-center gap-2 text-sm px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 font-bold w-full sm:w-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {activePartners.length} Active Partners
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Orders / Dispatches Board */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="h-[650px] flex flex-col">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center mb-3">
                <CardTitle className="text-base font-bold">Fulfillment queue</CardTitle>
                <div className="relative w-40 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search ID, customer..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-7 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  className={`text-sm font-bold pb-2 border-b-2 transition-all ${
                    activeTab === 'unassigned' 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-slate-400 border-transparent hover:text-slate-600'
                  }`} 
                  onClick={() => setActiveTab('unassigned')}
                >
                  Unassigned ({filteredUnassigned.length})
                </button>
                <button 
                  className={`text-sm font-bold pb-2 border-b-2 transition-all ${
                    activeTab === 'active' 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-slate-400 border-transparent hover:text-slate-600'
                  }`} 
                  onClick={() => setActiveTab('active')}
                >
                  In Transit ({filteredActive.length})
                </button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
              
              {/* Unassigned dispatches */}
              {activeTab === 'unassigned' && (
                filteredUnassigned.length === 0 ? (
                  <div className="py-16 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="text-slate-500 text-xs font-bold">All caught up!</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">No unassigned orders found.</p>
                  </div>
                ) : (
                  filteredUnassigned.map(order => (
                    <div 
                      key={order.id} 
                      className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg">{order.id}</span>
                          <p className="text-sm font-bold text-slate-900 mt-2">{order.customer}</p>
                          <p className="text-xs text-slate-500 font-semibold">{order.store}</p>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" /> New
                        </span>
                      </div>

                      {order.address && (
                        <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <p className="line-clamp-2">{order.address}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs font-semibold mb-3">
                        <span className="text-slate-400">COD / Cash Due</span>
                        <strong className="text-slate-900">{order.amount}</strong>
                      </div>

                      <button 
                        onClick={() => {
                          setSelectedOrderToAssign(order);
                          setIsAssignModalOpen(true);
                        }}
                        className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors flex justify-center items-center gap-1.5 shadow-sm"
                      >
                        <Bike className="w-4 h-4" />
                        Assign Delivery Partner
                      </button>
                    </div>
                  ))
                )
              )}

              {/* In Transit active dispatches */}
              {activeTab === 'active' && (
                filteredActive.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold">No active transits</p>
                    <p className="text-[11px] mt-0.5">Assign orders to move them here.</p>
                  </div>
                ) : (
                  filteredActive.map(order => (
                    <div 
                      key={order.id} 
                      className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:border-emerald-300 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg">{order.id}</span>
                          <p className="text-sm font-bold text-slate-900 mt-2">{order.customer}</p>
                          <p className="text-xs text-slate-500 font-semibold">{order.store}</p>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          In Transit
                        </span>
                      </div>

                      {order.address && (
                        <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-3 bg-slate-50/50 p-2 rounded-lg">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <p className="line-clamp-2">{order.address}</p>
                        </div>
                      )}

                      {/* Delivery boy tag */}
                      <div className="mb-3 px-2.5 py-2 bg-blue-50/30 border border-blue-100 rounded-lg flex items-center gap-2 text-xs">
                        <Bike className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Courier Partner</p>
                          <p className="font-bold text-slate-800">{order.deliveryPartnerName || 'Assigned Courier'}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                        <span className="font-semibold text-slate-500">Update Status:</span>
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as any)}
                          className="text-xs font-bold border border-slate-200 rounded-lg bg-white px-2.5 py-1 text-slate-700 outline-none cursor-pointer focus:border-blue-500"
                        >
                          <option value="Out for Delivery">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancel / Return</option>
                          <option value="Pending">Move to Unassigned</option>
                        </select>
                      </div>
                    </div>
                  ))
                )
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Fleet View & Live Map tracking */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-[650px] flex flex-col overflow-hidden relative">
            <CardHeader className="bg-white/90 backdrop-blur-md border-b border-slate-100 pb-4 absolute top-0 left-0 right-0 z-10 w-full shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-blue-600" /> Live Fleet Tracking
                  </CardTitle>
                  <CardDescription className="text-xs">Visualizing delivery agents currently working live in Sultanpur and nearby branches.</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search active delivery boys..."
                    value={fleetSearchQuery}
                    onChange={(e) => setFleetSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 h-full w-full bg-slate-100 flex items-center justify-center relative pt-20">
              {/* Map grid background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAzMCAwIEwgMCAwIDAgMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ3NTU2OSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)' }}></div>
              
              {/* Overlay with active fleet statistics */}
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-md px-4 py-3.5 rounded-xl shadow-md border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Map className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-950">Sultanpur Live Coverage map</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">Active riders: {filteredFleetPartners.length} of {activePartners.length} total</p>
                  </div>
                </div>
                <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-500" /> Auto-refreshing via GPS telemetry
                </div>
              </div>

              {/* Dynamic Map Pins */}
              {filteredFleetPartners.length > 0 ? (
                filteredFleetPartners.map((pt, idx) => {
                  // Distribute pins loosely across different coordinate positions
                  const topPositions = ['28%', '45%', '65%', '35%', '55%'];
                  const leftPositions = ['22%', '58%', '38%', '75%', '48%'];
                  const top = topPositions[idx % topPositions.length];
                  const left = leftPositions[idx % leftPositions.length];

                  return (
                    <div 
                      key={pt.id} 
                      className="absolute group z-20"
                      style={{ top, left }}
                    >
                      <div className="relative cursor-pointer flex flex-col items-center">
                        {/* Tooltip Card */}
                        <div className="absolute bottom-full mb-1.5 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-xl w-40 pointer-events-none transition-all z-30">
                          <p className="font-extrabold">{pt.name}</p>
                          <p className="text-slate-400 font-semibold">{pt.type}</p>
                          <p className="text-emerald-400 mt-0.5">● {pt.status}</p>
                          <p className="text-[9px] text-slate-400 truncate mt-0.5">Area: {pt.deliveryArea}</p>
                        </div>
                        {/* Bounce pin wrapper */}
                        <div className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center border-2 border-white transition-transform duration-200 hover:scale-110 ${
                          pt.type === 'Delivery Boy' 
                            ? 'bg-blue-600' 
                            : pt.type === 'Delivery Agent' 
                            ? 'bg-amber-500' 
                            : 'bg-purple-600'
                        }`}>
                          <Bike className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-2.5 h-2.5 bg-slate-900/30 rounded-full blur-[1px] mt-0.5"></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center z-10 max-w-sm px-4 bg-white/90 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-200">
                  <Navigation className="w-10 h-10 text-slate-300 mx-auto mb-2 animate-bounce" />
                  <p className="text-sm font-bold text-slate-800">No dispatch riders tracked</p>
                  <p className="text-xs text-slate-500 mt-0.5">Try searching for another rider name or onboarding a new active delivery partner.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* MODAL 1: ADD NEW DISPATCH */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200 bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-slate-900 font-extrabold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" /> Create Dispatch Manifest
                </CardTitle>
                <CardDescription className="text-xs">Onboard a client order for manual city-wide dispatching.</CardDescription>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <form onSubmit={handleAddDispatch}>
              <CardContent className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                
                {/* Store Name Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pick Merchant Store *</label>
                  <select
                    required
                    value={formStore}
                    onChange={(e) => setFormStore(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="">-- Choose registered store --</option>
                    {sellers.map(s => (
                      <option key={s.id} value={s.storeName}>{s.storeName} ({s.name})</option>
                    ))}
                    <option value="Sultanpur Wholesale Depot">Sultanpur Wholesale Depot</option>
                    <option value="Express Grocery Mart">Express Grocery Mart</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={formCustomer}
                      onChange={(e) => setFormCustomer(e.target.value)}
                      placeholder="e.g. Rahul Mishra"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium"
                    />
                  </div>

                  {/* Customer Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Delivery Destination Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="Provide full customer street address, floor, and Landmark in India..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Item / Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Package Description</label>
                    <input
                      type="text"
                      value={formItemName}
                      onChange={(e) => setFormItemName(e.target.value)}
                      placeholder="e.g. Electronics Box, Food Pack"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium"
                    />
                  </div>

                  {/* Cash Due / COD value */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Total COD / Cash Due *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        required
                        value={formAmount}
                        onChange={(e) => setFormAmount(e.target.value)}
                        placeholder="450"
                        className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Instant Rider Assignment Option */}
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider">Instant Dispatch Rider (Optional)</label>
                  <select
                    value={formPartnerId}
                    onChange={(e) => setFormPartnerId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none text-slate-700 cursor-pointer focus:border-blue-500"
                  >
                    <option value="">-- Keep in Unassigned list --</option>
                    {activePartners.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.type} - {p.city})</option>
                    ))}
                  </select>
                </div>

              </CardContent>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-md shadow-blue-100"
                >
                  Onboard Dispatch
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 2: ASSIGN DELIVERY PARTNER */}
      {isAssignModalOpen && selectedOrderToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200 bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-slate-900 font-extrabold flex items-center gap-2">
                  <Bike className="w-5 h-5 text-blue-600" /> Assign Dispatch Rider
                </CardTitle>
                <CardDescription className="text-xs">
                  Choose a courier partner for Order <strong>{selectedOrderToAssign.id}</strong>.
                </CardDescription>
              </div>
              <button 
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedOrderToAssign(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {activePartners.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-medium">
                  No active partners onboarded. Go to "Manage Partners" to add delivery boys first.
                </div>
              ) : (
                activePartners.map(partner => (
                  <div 
                    key={partner.id}
                    className="p-3 border border-slate-150 rounded-xl hover:border-blue-500 hover:bg-blue-50/10 cursor-pointer transition flex items-center justify-between"
                    onClick={() => handleAssignPartner(partner)}
                  >
                    <div className="space-y-1">
                      <p className="font-extrabold text-slate-900 text-sm">{partner.name}</p>
                      <div className="flex gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>{partner.type}</span>
                        <span>•</span>
                        <span>{partner.city}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-[280px]">Area: {partner.deliveryArea}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-bold rounded-lg transition shrink-0">
                      Assign
                    </button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
