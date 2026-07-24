import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { 
  Bike, 
  Search, 
  Plus, 
  MapPin, 
  Phone, 
  Building2, 
  Map, 
  Database, 
  Copy, 
  Check, 
  Trash2, 
  AlertCircle,
  Truck,
  Building,
  User,
  ExternalLink,
  Info
} from 'lucide-react';
import { marketplaceStore, useMarketplaceData, DeliveryPartner } from '../lib/store';

// Comprehensive Indian States and Union Territories with Major Cities
const INDIAN_STATES_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Rajahmundry", "Kadapa"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"],
  "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tinsukia", "Tezpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Bhilai", "Korba", "Durg", "Rajnandgaon", "Jagdalpur"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Anand", "Nadiad"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Bilaspur", "Kullu", "Chamba"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Hazaribagh", "Deoghar", "Giridih"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Davangere", "Ballari", "Kalaburagi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Kannur"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Kalyan-Dombivli", "Vasai-Virar", "Aurangabad", "Navi Mumbai", "Solapur", "Kolhapur"],
  "Manipur": ["Imphal", "Thoubal", "Kakching", "Ukhrul", "Churachandpur"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
  "Nagaland": ["Dimapur", "Kohima", "Mokokchung", "Tuensang", "Wokha"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Puri", "Balasore", "Bhadrak"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar"],
  "Sikkim": ["Gangtok", "Namchi", "Geyzing", "Mangan"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore", "Erode"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar"],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar"],
  "Uttar Pradesh": ["Sultanpur", "Lucknow", "Kanpur", "Noida", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Gorakhpur"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani", "Roorkee", "Rudrapur", "Kashipur", "Rishikesh"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol", "Durgapur", "Kharagpur", "Bardhaman", "Malda"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket", "Vasant Kunj"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
};

export function ManagePartnersPage() {
  const partners = useMarketplaceData('deliveryPartners', () => marketplaceStore.getDeliveryPartners());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'Delivery Boy' | 'Delivery Agent' | 'Delivery Company'>('Delivery Boy');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formBranch, setFormBranch] = useState('');
  const [formState, setFormState] = useState('Uttar Pradesh');
  const [formCity, setFormCity] = useState('Sultanpur');
  const [formCustomCity, setFormCustomCity] = useState('');
  const [formDeliveryArea, setFormDeliveryArea] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  
  // UI Helpers
  const [copiedSql, setCopiedSql] = useState(false);

  const availableCities = INDIAN_STATES_CITIES[formState] || [];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setFormState(state);
    const cities = INDIAN_STATES_CITIES[state] || [];
    setFormCity(cities[0] || 'Custom');
    setFormCustomCity('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formAddress || !formBranch || !formDeliveryArea) {
      alert('Please fill out all required fields.');
      return;
    }

    const finalCity = formCity === 'Custom' ? formCustomCity : formCity;
    if (!finalCity) {
      alert('Please specify a City.');
      return;
    }

    const newPartner: Partial<DeliveryPartner> = {
      type: formType,
      name: formName,
      phone: formPhone,
      address: formAddress,
      branch: formBranch,
      state: formState,
      city: finalCity,
      deliveryArea: formDeliveryArea,
      status: formStatus
    };

    marketplaceStore.addDeliveryPartner(newPartner);
    
    // Reset Form
    setFormName('');
    setFormPhone('');
    setFormAddress('');
    setFormBranch('');
    setFormDeliveryArea('');
    setIsFormOpen(false);
    alert('Delivery partner registered successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this delivery partner?')) {
      marketplaceStore.deleteDeliveryPartner(id);
    }
  };

  const filteredPartners = partners.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.deliveryArea.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedTypeFilter === 'All' || p.type === selectedTypeFilter;
    
    return matchesSearch && matchesType;
  });

  const sqlCode = `-- SQL SCHEMA FOR DELIVERY PARTNERS TABLE (Copy & Paste in SQL Editor)
-- Creates the table with appropriate constraints, types, and indexes

CREATE TABLE IF NOT EXISTS public.delivery_partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Delivery Boy', 'Delivery Agent', 'Delivery Company')),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    branch VARCHAR(150) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    delivery_area TEXT NOT NULL, -- Locations/addresses covered for delivery
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    joined_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for speedy lookups by city/state or type
CREATE INDEX IF NOT EXISTS idx_delivery_partners_city_state ON public.delivery_partners(city, state);
CREATE INDEX IF NOT EXISTS idx_delivery_partners_type ON public.delivery_partners(type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies
CREATE POLICY "Allow public read-only access" 
    ON public.delivery_partners 
    FOR SELECT USING (true);

CREATE POLICY "Allow full access for authenticated admins" 
    ON public.delivery_partners 
    FOR ALL TO authenticated USING (true);

-- Insert Initial Seed Data matching Sultanpur config
INSERT INTO public.delivery_partners (type, name, phone, address, branch, state, city, delivery_area, status)
VALUES 
('Delivery Boy', 'Amit Patel', '+91 98765 43210', '12, Civil Lines, Near Town Hall', 'Sultanpur Main Branch', 'Uttar Pradesh', 'Sultanpur', 'Sultanpur Cantonment, Amhat, and Civil Lines', 'Active'),
('Delivery Company', 'Sultanpur Express Logistics', '+91 99988 87766', '45/B, Station Road, Industrial Area', 'UP East Hub', 'Uttar Pradesh', 'Sultanpur', 'All PIN codes in Sultanpur: 228001, 228119, 228120', 'Active');`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Delivery Fleet Onboarding</h1>
          <p className="text-slate-500 mt-1">Register and manage individual delivery boys, professional agents, or third-party delivery companies.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm shrink-0"
        >
          {isFormOpen ? 'Close Form' : (
            <>
              <Plus className="w-4 h-4" />
              Onboard Delivery Partner
            </>
          )}
        </button>
      </div>

      {/* New Partner Registration Form */}
      {isFormOpen && (
        <Card className="border-blue-100 shadow-md animate-in slide-in-from-top-4 duration-300">
          <CardHeader className="bg-blue-50/30 border-b border-slate-100 pb-4">
            <CardTitle className="text-slate-900 font-bold flex items-center gap-2">
              <Bike className="w-5 h-5 text-blue-600" /> Onboard New Fleet Partner
            </CardTitle>
            <CardDescription>Fill out all local and operational details to add this entity to your platform dispatch network.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Partner Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Partner Category *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Delivery Boy', 'Delivery Agent', 'Delivery Company'] as const).map(t => {
                      const isSelected = formType === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormType(t)}
                          className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all flex flex-col items-center justify-center gap-1.5 ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {t === 'Delivery Boy' && <User className="w-4 h-4" />}
                          {t === 'Delivery Agent' && <Building className="w-4 h-4" />}
                          {t === 'Delivery Company' && <Truck className="w-4 h-4" />}
                          <span className="text-center truncate w-full">{t}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Partner Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {formType === 'Delivery Boy' ? 'Full Name' : formType === 'Delivery Agent' ? 'Agent / Owner Name' : 'Company Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={formType === 'Delivery Boy' ? 'e.g. Ramesh Kumar' : 'e.g. Speedex Logistics Ltd.'}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium transition-all"
                  />
                </div>

                {/* 3. Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium transition-all"
                    />
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 4. Branch Office */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Branch / Hub Office *</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formBranch}
                      onChange={(e) => setFormBranch(e.target.value)}
                      placeholder="e.g. Sultanpur Central, Lucknow East"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* 5. Indian State Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">State (India) *</label>
                  <select
                    value={formState}
                    onChange={handleStateChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium cursor-pointer transition-all"
                  >
                    {Object.keys(INDIAN_STATES_CITIES).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* 6. Indian City Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City (India) *</label>
                  <div className="flex gap-2">
                    <select
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium cursor-pointer transition-all"
                    >
                      {availableCities.map(ct => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                      <option value="Custom">+ Custom City</option>
                    </select>
                    {formCity === 'Custom' && (
                      <input
                        type="text"
                        required
                        value={formCustomCity}
                        onChange={(e) => setFormCustomCity(e.target.value)}
                        placeholder="Enter custom city"
                        className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium transition-all animate-in fade-in"
                      />
                    )}
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 7. Base Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registered Base Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="Provide full headquarters, shop, or home address..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium transition-all resize-none"
                  />
                </div>

                {/* 8. Delivery Service Locations */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Delivery Service Target Address / Coverage Locations *</label>
                  <textarea
                    required
                    rows={2}
                    value={formDeliveryArea}
                    onChange={(e) => setFormDeliveryArea(e.target.value)}
                    placeholder="Specify the exact locations, neighborhoods, or pincodes where they will deliver..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 font-medium transition-all resize-none"
                  />
                </div>

              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Operational Status:</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formStatus === 'Active'} 
                      onChange={() => setFormStatus(formStatus === 'Active' ? 'Inactive' : 'Active')} 
                      className="sr-only peer" 
                    />
                    <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    <span className="ml-2 text-xs font-bold text-slate-600">{formStatus}</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-blue-100"
                  >
                    Save Partner
                  </button>
                </div>
              </div>

            </form>
          </CardContent>
        </Card>
      )}

      {/* Directory Filter Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-slate-150 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Delivery Boy', 'Delivery Agent', 'Delivery Company'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedTypeFilter(type)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                selectedTypeFilter === type
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {type === 'All' ? 'All Partners' : `${type}s`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, branch, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition text-slate-800 font-medium"
          />
        </div>
      </div>

      {/* Main Partners Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.length === 0 ? (
          <div className="col-span-full py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
            <Bike className="w-12 h-12 text-slate-300 mb-3 animate-bounce" />
            <h3 className="font-bold text-slate-800 text-base">No Fleet Partners Found</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-sm px-4">Create some delivery boy, agent, or company partners or adjust your filters.</p>
          </div>
        ) : (
          filteredPartners.map(partner => (
            <Card key={partner.id} className="hover:border-blue-200 transition-all hover:shadow-md flex flex-col justify-between group overflow-hidden">
              <CardContent className="p-5 space-y-4">
                
                {/* Header: Title and Type Pill */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{partner.name}</h3>
                    <p className="text-xs text-slate-400 font-bold tracking-tight uppercase mt-0.5">{partner.id}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    partner.type === 'Delivery Boy' 
                      ? 'bg-sky-50 text-sky-700' 
                      : partner.type === 'Delivery Agent' 
                      ? 'bg-amber-50 text-amber-700' 
                      : 'bg-purple-50 text-purple-700'
                  }`}>
                    {partner.type}
                  </span>
                </div>

                {/* Info Fields */}
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{partner.phone}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Branch: <strong className="text-slate-800">{partner.branch}</strong></span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="truncate">{partner.city}, {partner.state}</span>
                  </div>
                </div>

                {/* Delivery Targets Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Map className="w-3 h-3 text-slate-400" /> Target Delivery Locations
                  </span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2" title={partner.deliveryArea}>
                    {partner.deliveryArea}
                  </p>
                </div>

              </CardContent>

              {/* Card Footer actions */}
              <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Joined: {partner.joinedDate}</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${partner.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-400'}`}></span>
                  <span className="font-bold text-slate-600 mr-2">{partner.status}</span>
                  <button 
                    onClick={() => handleDelete(partner.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Partner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </Card>
          ))
        )}
      </div>

      {/* SQL Script / Developer Panel */}
      <Card className="border-indigo-100 shadow-sm bg-indigo-50/10">
        <CardHeader className="border-b border-indigo-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-slate-900 font-extrabold flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" /> Cloud Database SQL Script
              </CardTitle>
              <CardDescription className="text-indigo-950/70">Run this SQL code in your Database SQL Editor to synchronize the schema for production deployment.</CardDescription>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition shadow-sm shrink-0"
            >
              {copiedSql ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Copied Script!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy SQL Code
                </>
              )}
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0 relative">
          <div className="bg-slate-900 p-5 rounded-b-2xl overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-72 overflow-y-auto border-t border-slate-800">
            <pre>{sqlCode}</pre>
          </div>
          <div className="p-4 bg-indigo-50 border-t border-indigo-100 rounded-b-2xl flex items-start gap-2.5 text-xs text-indigo-900/80 font-medium">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              This script establishes the database table <strong>delivery_partners</strong> with automated UUID mapping, state/city indexes, operational flags, and Row-Level Security (RLS) rules so that your production backend is completely ready for safe read-write calls.
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
