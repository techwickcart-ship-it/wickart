import { supabase } from './supabase';

export interface Product {
  id: number;
  name: string;
  price: string;
  mrp?: string;
  rating: number;
  image: string;
  images?: string[];
  media?: string[];
  sizes?: string[];
  variants?: string[];
  tag?: string;
  vendor?: string;
  sellerId?: string;
  brand?: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  isComboOffer?: boolean;
  comboTitle?: string;
  comboItems?: string;
  comboDiscount?: string;
  comboTag?: string;
}

export interface Brand {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  logo?: string;
  count?: number;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  store: string;
  amount: string;
  status: 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  items?: { name: string; qty: number; price: string }[];
  address?: string;
  phone?: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  discountAmount?: string;
  discountReason?: string;
  walletAmountUsed?: string;
  isRefundedToWallet?: boolean;
  refundedAmount?: string;
  cancellationReason?: string;
  cancelledAt?: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  storeName: string;
  phone: string;
  status: 'Active' | 'Pending' | 'Suspended';
  orders: number;
  revenue: string;
  rating: number;
  plan?: string;
  category?: string;
  city?: string;
  address?: string;
  gstin?: string;
  storeLogo?: string;
  storeBanner?: string;
  bankDetails?: {
    accountName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
  };
  documents?: Record<string, { fileName: string; fileData?: string; uploadedAt?: string; status?: string }>;
}

export interface TaxRule {
  id: string;
  name: string;
  rate: string;
  appliesTo: string;
  status: 'Active' | 'Inactive';
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  status: 'Active' | 'Inactive';
}

export interface DeliveryPartner {
  id: string;
  type: 'Delivery Boy' | 'Delivery Agent' | 'Delivery Company';
  name: string;
  phone: string;
  address: string;
  branch: string;
  state: string;
  city: string;
  deliveryArea: string;
  status: 'Active' | 'Inactive';
  joinedDate: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  managerName?: string;
  phone?: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  capacitySqFt?: number;
  occupancyPercentage?: number;
  isFulfillmentCenter?: boolean;
  status: 'Active' | 'Inactive' | 'Maintenance';
}

// Initial Clean Arrays (No pre-uploaded mock data)
const INITIAL_BRANDS: Brand[] = [];
const INITIAL_PRODUCTS: Product[] = [];
const INITIAL_ORDERS: Order[] = [];
const INITIAL_SELLERS: Seller[] = [];
const INITIAL_COUPONS: Coupon[] = [];
const INITIAL_DELIVERY_PARTNERS: DeliveryPartner[] = [];

const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'WH-001',
    name: 'Main Warehouse - Central Hub',
    code: 'WH-SLN-01',
    managerName: 'Rajesh Sharma',
    phone: '+91 9821012345',
    email: 'wh.central@wikcart.in',
    address: 'Civil Lines Industrial Area, Near Railway Station',
    city: 'Sultanpur',
    state: 'Uttar Pradesh',
    pincode: '228001',
    capacitySqFt: 25000,
    occupancyPercentage: 62.5,
    isFulfillmentCenter: true,
    status: 'Active'
  },
  {
    id: 'WH-002',
    name: 'North Sultanpur Logistics Depot',
    code: 'WH-SLN-02',
    managerName: 'Vikas Verma',
    phone: '+91 9821098765',
    email: 'wh.north@wikcart.in',
    address: 'Lucknow Road Highway Bypass',
    city: 'Sultanpur',
    state: 'Uttar Pradesh',
    pincode: '228002',
    capacitySqFt: 15000,
    occupancyPercentage: 38.0,
    isFulfillmentCenter: true,
    status: 'Active'
  },
  {
    id: 'WH-003',
    name: 'South Express Fulfilment Center',
    code: 'WH-SLN-03',
    managerName: 'Suresh Gupta',
    phone: '+91 9821055443',
    email: 'wh.south@wikcart.in',
    address: 'Kurebhar Link Road',
    city: 'Sultanpur',
    state: 'Uttar Pradesh',
    pincode: '228003',
    capacitySqFt: 18000,
    occupancyPercentage: 20.0,
    isFulfillmentCenter: true,
    status: 'Active'
  }
];

export interface VendorRegistration {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  plan?: string;
  category?: string;
  city?: string;
  state?: string;
  address?: string;
  pincode?: string;
  gstin?: string;
  pan?: string;
  businessType?: string;
  storeDesc?: string;
  storeTimings?: string;
  storeLogo?: string;
  storeBanner?: string;
  bankDetails?: {
    accountName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
  };
  documents?: Record<string, { fileName: string; fileData?: string; uploadedAt?: string; status?: string }>;
}

const INITIAL_TAX_RULES: TaxRule[] = [
  { id: '1', name: 'Standard GST - 18%', rate: '18%', appliesTo: 'Electronics, Fashion', status: 'Active' },
  { id: '2', name: 'Lower GST - 12%', rate: '12%', appliesTo: 'Processed Foods', status: 'Active' },
  { id: '3', name: 'Reduced GST - 5%', rate: '5%', appliesTo: 'Food, Groceries', status: 'Active' },
  { id: '4', name: 'Zero Tax - 0%', rate: '0%', appliesTo: 'Fresh Produce', status: 'Active' },
  { id: '5', name: 'Luxury GST - 28%', rate: '28%', appliesTo: 'Luxury Goods', status: 'Active' },
];

const INITIAL_VENDOR_REGISTRATIONS: VendorRegistration[] = [];
const INITIAL_CATEGORIES: any[] = [];
const INITIAL_SUBCATEGORIES: any[] = [];
const INITIAL_CUSTOMERS: any[] = [];
const INITIAL_WITHDRAWALS: any[] = [];
const INITIAL_GLOBAL_INVENTORY: any[] = [];
const INITIAL_TXNS: any[] = [];
const INITIAL_WALLET_TXNS: any[] = [];

// Load helper
function getStored<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (val !== null) {
      return JSON.parse(val);
    }
    if (key === 'companyName') return 'Wikcart' as any as T;
    return [] as any as T;
  } catch (e) {
    return fallback;
  }
}

// Save helper
function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch system-wide event for cross-component re-renders
    window.dispatchEvent(new Event(`store_${key}_updated`));
  } catch (e) {
    console.error(e);
  }
}

export const marketplaceStore = {
  // PRODUCTS
  getProducts(): Product[] {
    return getStored('products', INITIAL_PRODUCTS);
  },
  saveProducts(products: Product[]): void {
    setStored('products', products);
  },
  addProduct(product: Partial<Product>): Product {
    const list = this.getProducts();
    const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
    const item: Product = {
      id: newId,
      name: product.name || 'Unnamed Product',
      price: product.price || '₹0',
      mrp: product.mrp || '',
      rating: product.rating || 4.5,
      image: product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
      tag: product.tag || 'New',
      vendor: product.vendor || 'City Square Mart',
      sellerId: product.sellerId || '1',
      shortDescription: product.shortDescription || product.description || '',
      description: product.description || '',
      category: product.category || 'General',
      brand: product.brand || 'Generic',
      sizes: product.sizes || [],
      variants: product.variants || [],
      media: product.media || (product.image ? [product.image] : []),
      images: product.images || (product.image ? [product.image] : [])
    };
    list.unshift(item); // Add to beginning of catalog
    this.saveProducts(list);

    // Sync to global inventory for vendor stock management
    try {
      const invList = this.getGlobalInventory();
      invList.unshift({
        id: `PRD-${newId}`,
        name: item.name,
        vendor: item.vendor,
        stock: 50,
        status: 'In Stock'
      });
      this.saveGlobalInventory(invList);
    } catch (e) {
      console.error(e);
    }

    return item;
  },
  updateProduct(id: number, updatedFields: Partial<Product>): Product | null {
    const list = this.getProducts();
    const index = list.findIndex(p => p.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveProducts(list);
      return list[index];
    }
    return null;
  },
  deleteProduct(id: number): void {
    const list = this.getProducts();
    const filtered = list.filter(p => p.id !== id);
    this.saveProducts(filtered);
  },
  getOrders(): Order[] {
    return getStored('orders', INITIAL_ORDERS);
  },
  saveOrders(orders: Order[]): void {
    setStored('orders', orders);
  },
  addOrder(order: Omit<Order, 'id' | 'date' | 'status'>): Order {
    const list = this.getOrders();
    const newId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const newOrder: Order = {
      ...order,
      id: newId,
      date: formattedDate,
      status: 'Pending'
    };
    
    list.unshift(newOrder);
    this.saveOrders(list);

    // Increment seller stats if valid sellerName/storeName matches
    const sellers = this.getSellers();
    const matchingSeller = sellers.find(s => s.storeName === order.store);
    if (matchingSeller) {
      const orderAmtStr = order.amount.replace(/[^0-9.]/g, '');
      const amt = parseFloat(orderAmtStr) || 0;
      matchingSeller.orders += 1;
      const currentRevStr = matchingSeller.revenue.replace(/[^0-9.]/g, '');
      const newRev = (parseFloat(currentRevStr) || 0) + amt;
      matchingSeller.revenue = `₹${newRev.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      this.saveSellers(sellers);
    }

    return newOrder;
  },
  cancelOrder(orderId: string, reason: string): void {
    const list = this.getOrders();
    const target = list.find(o => o.id === orderId);
    if (!target) return;

    const numericAmt = parseFloat(target.amount.replace(/[^0-9.]/g, '')) || 0;
    const isAlreadyRefunded = Boolean(target.isRefundedToWallet);

    const updated = list.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Cancelled' as const,
          cancellationReason: reason || 'Order Cancelled',
          isRefundedToWallet: true,
          refundedAmount: o.amount,
          cancelledAt: new Date().toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        };
      }
      return o;
    });
    this.saveOrders(updated);

    // Auto refund money back into customer wallet
    if (numericAmt > 0 && !isAlreadyRefunded) {
      this.creditCustomerWallet(
        target.customer,
        target.phone || '',
        numericAmt,
        `Auto Refund for Cancelled Order ${orderId}`
      );
    }

    this.dispatchAllEvents();
  },
  hasPhoneNumberUsedDiscount(phone: string, excludeOrderId?: string): boolean {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 5) return false;

    const orders = this.getOrders();
    return orders.some(o => {
      if (excludeOrderId && o.id === excludeOrderId) return false;
      if (o.status === 'Cancelled') return false;
      const orderPhone = (o.phone || '').replace(/\D/g, '');
      if (!orderPhone || orderPhone.length < 5) return false;

      // Match phone numbers by full exact clean match or last 10 digits
      const phoneMatch = cleanPhone === orderPhone || (cleanPhone.length >= 10 && orderPhone.length >= 10 && cleanPhone.slice(-10) === orderPhone.slice(-10));
      if (!phoneMatch) return false;

      // Check if order had discount
      const hasDiscount = Boolean(
        (o.discountAmount && o.discountAmount !== '₹0' && o.discountAmount !== '₹0.00' && o.discountAmount !== '0') ||
        (o.discountReason && o.discountReason.trim().length > 0)
      );

      return hasDiscount;
    });
  },

  // SELLERS
  getSellers(): Seller[] {
    return getStored('sellers', INITIAL_SELLERS);
  },
  saveSellers(sellers: Seller[]): void {
    setStored('sellers', sellers);
  },
  addSeller(seller: Partial<Seller>): Seller {
    const list = this.getSellers();
    const newId = String(list.length > 0 ? Math.max(...list.map(s => parseInt(s.id) || 0)) + 1 : 1);
    const item: Seller = {
      id: newId,
      name: seller.name || 'New Seller',
      email: seller.email || '',
      storeName: seller.storeName || 'New Store',
      phone: seller.phone || '',
      status: seller.status || 'Active',
      orders: seller.orders || 0,
      revenue: seller.revenue || '₹0.00',
      rating: seller.rating || 4.5,
      plan: seller.plan || 'Standard Plan',
      category: seller.category || 'General',
      city: seller.city || 'India',
      address: seller.address || '',
      gstin: seller.gstin || '',
      storeLogo: seller.storeLogo || '',
      storeBanner: seller.storeBanner || '',
      bankDetails: seller.bankDetails || {},
      documents: seller.documents || {}
    };
    list.unshift(item);
    this.saveSellers(list);
    return item;
  },

  // COUPONS
  getCoupons(): Coupon[] {
    return getStored('coupons', INITIAL_COUPONS);
  },
  saveCoupons(coupons: Coupon[]): void {
    setStored('coupons', coupons);
  },
  addCoupon(coupon: Partial<Coupon>): Coupon {
    const list = this.getCoupons();
    const newId = `C${list.length + 1}`;
    const item: Coupon = {
      id: newId,
      code: (coupon.code || '').trim().toUpperCase(),
      discountType: coupon.discountType || 'fixed',
      value: coupon.value || 50,
      minPurchase: coupon.minPurchase || 300,
      status: coupon.status || 'Active'
    };
    list.push(item);
    this.saveCoupons(list);

    // Background sync to Supabase
    this.saveCouponToSupabase(item);

    return item;
  },

  // DELIVERY PARTNERS
  getDeliveryPartners(): DeliveryPartner[] {
    return getStored('deliveryPartners', INITIAL_DELIVERY_PARTNERS);
  },
  saveDeliveryPartners(partners: DeliveryPartner[]): void {
    setStored('deliveryPartners', partners);
  },
  addDeliveryPartner(partner: Partial<DeliveryPartner>): DeliveryPartner {
    const list = this.getDeliveryPartners();
    const newId = `DP-${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const item: DeliveryPartner = {
      id: newId,
      type: partner.type || 'Delivery Boy',
      name: partner.name || 'Unnamed Partner',
      phone: partner.phone || '',
      address: partner.address || '',
      branch: partner.branch || 'Main',
      state: partner.state || 'Uttar Pradesh',
      city: partner.city || 'Sultanpur',
      deliveryArea: partner.deliveryArea || '',
      status: partner.status || 'Active',
      joinedDate: today
    };
    list.unshift(item);
    this.saveDeliveryPartners(list);

    // Background sync to Supabase
    this.saveDeliveryPartnerToSupabase(item);

    return item;
  },
  deleteDeliveryPartner(id: string): void {
    const list = this.getDeliveryPartners();
    const updated = list.filter(item => item.id !== id);
    this.saveDeliveryPartners(updated);

    // Background sync deletion
    this.deleteDeliveryPartnerFromSupabase(id);
  },

  // SUPABASE INTEGRATION SYNC HELPERS
  async checkSupabaseStatus(): Promise<{
    connected: boolean;
    url: string;
    error?: string;
    tables: {
      delivery_partners: { status: 'Accessible' | 'Error' | 'Not Checked'; count?: number; error?: string };
      coupons: { status: 'Accessible' | 'Error' | 'Not Checked'; count?: number; error?: string };
    };
  }> {
    const url = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://jlxyisjrqebcmbsihjdb.supabase.co';
    const result: {
      connected: boolean;
      url: string;
      error?: string;
      tables: {
        delivery_partners: { status: 'Accessible' | 'Error' | 'Not Checked'; count?: number; error?: string };
        coupons: { status: 'Accessible' | 'Error' | 'Not Checked'; count?: number; error?: string };
      };
    } = {
      connected: false,
      url,
      tables: {
        delivery_partners: { status: 'Not Checked' },
        coupons: { status: 'Not Checked' }
      }
    };

    try {
      // Test delivery_partners table
      const { data: dpData, error: dpError } = await supabase
        .from('delivery_partners')
        .select('id')
        .limit(1);

      if (dpError) {
        result.tables.delivery_partners = { status: 'Error' as const, error: dpError.message };
      } else {
        result.connected = true;
        const { count } = await supabase.from('delivery_partners').select('*', { count: 'exact', head: true });
        result.tables.delivery_partners = { status: 'Accessible' as const, count: count || 0 };
      }

      // Test coupons table
      const { data: cData, error: cError } = await supabase
        .from('coupons')
        .select('id')
        .limit(1);

      if (cError) {
        result.tables.coupons = { status: 'Error' as const, error: cError.message };
      } else {
        result.connected = true;
        const { count } = await supabase.from('coupons').select('*', { count: 'exact', head: true });
        result.tables.coupons = { status: 'Accessible' as const, count: count || 0 };
      }
    } catch (err: any) {
      result.error = err.message || String(err);
    }

    return result;
  },

  async syncDeliveryPartnersFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('delivery_partners')
        .select('*');
      
      if (error) {
        console.warn('Supabase fetch delivery_partners error:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const mapped: DeliveryPartner[] = data.map((item: any) => ({
          id: item.id,
          type: item.type || 'Delivery Boy',
          name: item.name || 'Unnamed Partner',
          phone: item.phone || '',
          address: item.address || '',
          branch: item.branch || 'Main',
          state: item.state || 'Uttar Pradesh',
          city: item.city || 'Sultanpur',
          deliveryArea: item.delivery_area || item.deliveryArea || '',
          status: item.status || 'Active',
          joinedDate: item.joined_date || item.joinedDate || new Date().toLocaleDateString()
        }));
        setStored('deliveryPartners', mapped);
      }
    } catch (err) {
      console.error('Failed to sync delivery partners from Supabase:', err);
    }
  },

  async saveDeliveryPartnerToSupabase(partner: DeliveryPartner): Promise<void> {
    try {
      const payload: any = {
        name: partner.name,
        phone: partner.phone,
        status: partner.status,
        type: partner.type,
        address: partner.address,
        branch: partner.branch,
        state: partner.state,
        city: partner.city,
        delivery_area: partner.deliveryArea,
        joined_date: partner.joinedDate
      };

      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(partner.id);
      if (isUUID) {
        payload.id = partner.id;
      }

      const { data, error } = await supabase
        .from('delivery_partners')
        .upsert(payload, { onConflict: 'id' })
        .select();

      if (error) {
        console.error('Supabase save delivery_partners error:', error.message);
      } else if (data && data[0] && !isUUID) {
        const realId = data[0].id;
        const currentList = this.getDeliveryPartners();
        const updated = currentList.map(p => p.id === partner.id ? { ...p, id: realId } : p);
        this.saveDeliveryPartners(updated);
      }
    } catch (err) {
      console.error('Failed to save delivery partner to Supabase:', err);
    }
  },

  async deleteDeliveryPartnerFromSupabase(id: string): Promise<void> {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (!isUUID) return;

      const { error } = await supabase
        .from('delivery_partners')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete delivery_partners error:', error.message);
      }
    } catch (err) {
      console.error('Failed to delete delivery partner from Supabase:', err);
    }
  },

  async syncCouponsFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*');
      
      if (error) {
        console.warn('Supabase fetch coupons error:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const mapped: Coupon[] = data.map((item: any) => ({
          id: item.id,
          code: item.code,
          discountType: item.discount_type || item.discountType || 'fixed',
          value: Number(item.discount_value || item.value || 0),
          minPurchase: Number(item.min_order_amount || item.minPurchase || 0),
          status: item.status || 'Active'
        }));
        setStored('coupons', mapped);
      }
    } catch (err) {
      console.error('Failed to sync coupons from Supabase:', err);
    }
  },

  async saveCouponToSupabase(coupon: Coupon): Promise<void> {
    try {
      const payload: any = {
        code: coupon.code,
        discount_type: coupon.discountType,
        discount_value: coupon.value,
        min_order_amount: coupon.minPurchase,
        status: coupon.status
      };

      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(coupon.id);
      if (isUUID) {
        payload.id = coupon.id;
      }

      const { data, error } = await supabase
        .from('coupons')
        .upsert(payload, { onConflict: 'id' })
        .select();

      if (error) {
        console.error('Supabase save coupons error:', error.message);
      } else if (data && data[0] && !isUUID) {
        const realId = data[0].id;
        const currentList = this.getCoupons();
        const updated = currentList.map(c => c.id === coupon.id ? { ...c, id: realId } : c);
        this.saveCoupons(updated);
      }
    } catch (err) {
      console.error('Failed to save coupon to Supabase:', err);
    }
  },

  async pushLocalDataToSupabase(): Promise<void> {
    const partners = this.getDeliveryPartners();
    for (const partner of partners) {
      await this.saveDeliveryPartnerToSupabase(partner);
    }
    const coupons = this.getCoupons();
    for (const coupon of coupons) {
      await this.saveCouponToSupabase(coupon);
    }
  },

  async syncAllFromSupabase(): Promise<void> {
    await Promise.all([
      this.syncDeliveryPartnersFromSupabase(),
      this.syncCouponsFromSupabase()
    ]);
  },

  // SETTINGS
  getCompanyName(): string {
    return localStorage.getItem('companyName') || 'Wikcart';
  },
  saveCompanyName(name: string): void {
    localStorage.setItem('companyName', name);
    window.dispatchEvent(new Event('settingsUpdated'));
  },

  // NEW DYNAMIC ENTITIES FOR FULL WIPE CAPABILITY
  getCategories(): any[] {
    return getStored('categories', INITIAL_CATEGORIES);
  },
  saveCategories(list: any[]): void {
    setStored('categories', list);
  },
  addCategory(category: { name: string; image?: string; iconName?: string; status?: string; count?: number }): any {
    const list = this.getCategories();
    const newId = String(Date.now());
    const newCat = {
      id: newId,
      name: category.name.trim(),
      image: category.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300&h=300',
      iconName: category.iconName || 'Tv',
      status: category.status || 'Active',
      count: category.count || 0
    };
    list.unshift(newCat);
    this.saveCategories(list);
    return newCat;
  },
  deleteCategory(id: string): void {
    const list = this.getCategories();
    const filtered = list.filter(c => c.id !== id);
    this.saveCategories(filtered);
  },
  updateCategory(id: string, updatedFields: Partial<any>): any {
    const list = this.getCategories();
    const index = list.findIndex(c => c.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveCategories(list);
      return list[index];
    }
    return null;
  },

  getSubcategories(): any[] {
    return getStored('subcategories', INITIAL_SUBCATEGORIES);
  },
  saveSubcategories(list: any[]): void {
    setStored('subcategories', list);
  },
  addSubcategory(subcategory: { name: string; parent: string; image?: string; status?: string; count?: number }): any {
    const list = this.getSubcategories();
    const newId = String(Date.now());
    const newSubcat = {
      id: newId,
      name: subcategory.name.trim(),
      parent: subcategory.parent,
      image: subcategory.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200&h=200',
      status: subcategory.status || 'Active',
      count: subcategory.count || 0
    };
    list.unshift(newSubcat);
    this.saveSubcategories(list);
    return newSubcat;
  },
  deleteSubcategory(id: string): void {
    const list = this.getSubcategories();
    const filtered = list.filter(sc => sc.id !== id);
    this.saveSubcategories(filtered);
  },
  updateSubcategory(id: string, updatedFields: Partial<any>): any {
    const list = this.getSubcategories();
    const index = list.findIndex(sc => sc.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveSubcategories(list);
      return list[index];
    }
    return null;
  },

  // ATTRIBUTES & VARIANTS PERSISTENCE
  getAttributes(): any[] {
    const DEFAULT_ATTRIBUTES = [
      { id: '1', name: 'Material', values: ['Cotton', 'Polyester', 'Leather', 'Wood'] },
      { id: '2', name: 'Display Type', values: ['OLED', 'LCD', 'AMOLED'] },
      { id: '3', name: 'Storage Capacity', values: ['64GB', '128GB', '256GB', '512GB'] },
    ];
    return getStored('attributes', DEFAULT_ATTRIBUTES);
  },
  saveAttributes(list: any[]): void {
    setStored('attributes', list);
  },

  getVariants(): any[] {
    const DEFAULT_VARIANTS = [
      { id: '1', name: 'Cloth Sizes', type: 'size', values: [{ id: 'v1', label: 'XS' }, { id: 'v2', label: 'S' }, { id: 'v3', label: 'M' }, { id: 'v4', label: 'L' }, { id: 'v5', label: 'XL' }] },
      { id: '2', name: 'Colors', type: 'color', values: [{ id: 'c1', label: 'Red', value: '#ef4444' }, { id: 'c2', label: 'Blue', value: '#3b82f6' }, { id: 'c3', label: 'Black', value: '#0f172a' }] },
      { id: '3', name: 'Shoe Sizes (UK)', type: 'size', values: [{ id: 's1', label: '6' }, { id: 's2', label: '7' }, { id: 's3', label: '8' }, { id: 's4', label: '9' }, { id: 's5', label: '10' }] },
      { id: '4', name: 'Weight', type: 'weight', values: [{ id: 'w1', label: '250g' }, { id: 'w2', label: '500g' }, { id: 'w3', label: '1kg' }] }
    ];
    return getStored('variants', DEFAULT_VARIANTS);
  },
  saveVariants(list: any[]): void {
    setStored('variants', list);
  },

  getCustomers(): any[] {
    const list = getStored('customers', INITIAL_CUSTOMERS);
    if (!list || list.length === 0) {
      const DEFAULT_CUSTOMERS = [
        { id: 'CUST-390', name: 'Alok Nath', email: 'alok@example.com', phone: '9821054321', address: 'Civil Lines, Sultanpur, UP', orders: 12, walletBalance: 500, referralCode: 'ALOK200', status: 'Active' },
        { id: 'CUST-391', name: 'Vikas Patel', email: 'vikas@example.com', phone: '9876543210', address: 'Golaganj, Sultanpur, UP', orders: 5, walletBalance: 200, referralCode: 'VIKAS200', status: 'Active' },
        { id: 'CUST-392', name: 'Priya Desai', email: 'priya@example.com', phone: '9123456789', address: 'Super Market, Sultanpur, UP', orders: 8, walletBalance: 350, referralCode: 'PRIYA200', status: 'Active' }
      ];
      this.saveCustomers(DEFAULT_CUSTOMERS);
      return DEFAULT_CUSTOMERS;
    }
    return list;
  },
  saveCustomers(list: any[]): void {
    setStored('customers', list);
  },
  addCustomer(cust: { name: string; email?: string; phone?: string; address?: string; walletBalance?: number; referralCode?: string }): any {
    const list = this.getCustomers();
    // Check if customer with same email or phone already exists
    const existing = list.find(c => (cust.email && c.email.toLowerCase() === cust.email.toLowerCase()) || (cust.phone && c.phone === cust.phone));
    if (existing) {
      return existing;
    }
    const newId = `CUST-${String(list.length + 1).padStart(3, '0')}`;
    const cleanFirstName = (cust.name || 'USER').split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
    const newCustomer = {
      id: newId,
      name: cust.name || 'New Customer',
      email: cust.email || `${cust.name ? cust.name.toLowerCase().replace(/\s+/g, '') : 'user'}@example.com`,
      phone: cust.phone || '+91 9000000000',
      address: cust.address || 'Sultanpur, UP',
      orders: 0,
      walletBalance: cust.walletBalance !== undefined ? cust.walletBalance : 0,
      referralCode: cust.referralCode || `${cleanFirstName || 'USER'}${Math.floor(100 + Math.random() * 899)}`,
      status: 'Active'
    };
    list.unshift(newCustomer);
    this.saveCustomers(list);
    return newCustomer;
  },

  // REFERRAL CONFIG & LOGS
  getReferralConfig(): { referrerAmount: number; refereeAmount: number } {
    return getStored('referralConfig', { referrerAmount: 200, refereeAmount: 200 });
  },
  saveReferralConfig(config: { referrerAmount: number; refereeAmount: number }): void {
    setStored('referralConfig', config);
  },
  getReferralsList(): any[] {
    const DEFAULT_REFERRALS = [
      { id: 'REF-101', referrerRole: 'User', referrerId: 'CUST-390', referrerName: 'Alok Nath', referrerPhone: '9821054321', refereeRole: 'User', refereeId: 'CUST-391', refereeName: 'Vikas Patel', refereePhone: '9876543210', date: '24 Jul 2026', status: 'Completed', earned: '₹400.00' },
    ];
    return getStored('referralsList', DEFAULT_REFERRALS);
  },
  saveReferralsList(list: any[]): void {
    setStored('referralsList', list);
  },

  // VENDOR REGISTRATIONS
  getVendorRegistrations(): VendorRegistration[] {
    return getStored('vendorRegistrations', INITIAL_VENDOR_REGISTRATIONS);
  },
  saveVendorRegistrations(list: VendorRegistration[]): void {
    setStored('vendorRegistrations', list);
  },
  addVendorRegistration(reg: Partial<VendorRegistration>): VendorRegistration {
    const list = this.getVendorRegistrations();
    const newId = `REG-${String(list.length + 1).padStart(3, '0')}`;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const item: VendorRegistration = {
      id: newId,
      name: reg.name || 'New Vendor',
      businessName: reg.businessName || reg.name || 'New Business',
      phone: reg.phone || '',
      email: reg.email || '',
      date: today,
      status: reg.status || 'Pending',
      plan: reg.plan || 'Standard Plan',
      category: reg.category || 'General',
      city: reg.city || 'India',
      state: reg.state || '',
      address: reg.address || '',
      pincode: reg.pincode || '',
      gstin: reg.gstin || '',
      pan: reg.pan || '',
      businessType: reg.businessType || 'Individual',
      storeDesc: reg.storeDesc || '',
      storeTimings: reg.storeTimings || '',
      storeLogo: reg.storeLogo || '',
      storeBanner: reg.storeBanner || '',
      bankDetails: reg.bankDetails || {},
      documents: reg.documents || {}
    };
    list.unshift(item);
    this.saveVendorRegistrations(list);

    // Also automatically create/update a pending seller entry so they show up in Seller Directory!
    const sellers = this.getSellers();
    const existingSellerIndex = sellers.findIndex(s => s.email.toLowerCase() === item.email.toLowerCase() || s.phone === item.phone);
    if (existingSellerIndex >= 0) {
      sellers[existingSellerIndex] = {
        ...sellers[existingSellerIndex],
        name: item.name,
        storeName: item.businessName,
        plan: item.plan,
        category: item.category,
        city: item.city,
        address: item.address,
        gstin: item.gstin,
        storeLogo: item.storeLogo,
        storeBanner: item.storeBanner,
        bankDetails: item.bankDetails,
        documents: item.documents
      };
      this.saveSellers(sellers);
    } else {
      this.addSeller({
        name: item.name,
        email: item.email,
        phone: item.phone,
        storeName: item.businessName,
        status: item.status === 'Approved' ? 'Active' : 'Pending',
        plan: item.plan,
        category: item.category,
        city: item.city,
        address: item.address,
        gstin: item.gstin,
        storeLogo: item.storeLogo,
        storeBanner: item.storeBanner,
        bankDetails: item.bankDetails,
        documents: item.documents
      });
    }

    return item;
  },

  getWithdrawals(): any[] {
    return getStored('withdrawals', INITIAL_WITHDRAWALS);
  },
  saveWithdrawals(list: any[]): void {
    setStored('withdrawals', list);
  },

  getGlobalInventory(): any[] {
    return getStored('globalInventory', INITIAL_GLOBAL_INVENTORY);
  },
  saveGlobalInventory(list: any[]): void {
    setStored('globalInventory', list);
  },

  getTransactions(): any[] {
    return getStored('transactions', INITIAL_TXNS);
  },
  saveTransactions(list: any[]): void {
    setStored('transactions', list);
  },

  getWalletTransactions(): any[] {
    const INITIAL_WALLET_TXNS = [
      { id: 'WTXN-801', date: '24 Jul 2026, 10:30 AM', customer: 'Alok Nath', phone: '9821054321', desc: 'Welcome Bonus Credited', amount: '₹200.00', type: 'Credit', closingBal: '₹500.00' },
      { id: 'WTXN-802', date: '23 Jul 2026, 04:15 PM', customer: 'Vikas Patel', phone: '9876543210', desc: 'Referral Bonus Credited', amount: '₹200.00', type: 'Credit', closingBal: '₹200.00' }
    ];
    return getStored('walletTransactions', INITIAL_WALLET_TXNS);
  },
  saveWalletTransactions(list: any[]): void {
    setStored('walletTransactions', list);
  },

  getCustomerWalletBalance(phoneOrName: string): number {
    if (!phoneOrName) return 0;
    const clean = phoneOrName.trim().toLowerCase().replace(/\D/g, '');
    const customers = this.getCustomers();
    const cust = customers.find(c => 
      (clean.length > 3 && c.phone && c.phone.replace(/\D/g, '').endsWith(clean.slice(-10))) ||
      c.name.toLowerCase() === phoneOrName.trim().toLowerCase()
    );
    return cust ? (Number(cust.walletBalance) || 0) : 0;
  },

  getOrCreateCustomer(name: string, phone: string, address?: string): any {
    const customers = this.getCustomers();
    const cleanPhone = (phone || '').replace(/\D/g, '');
    
    let cust = customers.find(c => 
      (cleanPhone.length > 3 && c.phone && c.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))) ||
      (c.name.toLowerCase() === (name || '').trim().toLowerCase())
    );

    if (!cust) {
      const firstName = (name || 'USER').split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
      const code = `${firstName || 'USER'}${Math.floor(100 + Math.random() * 899)}`;
      cust = {
        id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        name: name || 'Valued Customer',
        email: `${(name || 'user').toLowerCase().replace(/\s+/g, '')}@example.com`,
        phone: phone || '+91 9821000000',
        address: address || 'Sultanpur, UP',
        orders: 0,
        walletBalance: 0,
        referralCode: code,
        status: 'Active'
      };
      customers.unshift(cust);
      this.saveCustomers(customers);
    }
    return cust;
  },

  creditCustomerWallet(customerName: string, phone: string, amount: number, desc: string): number {
    if (amount <= 0) return 0;
    const customers = this.getCustomers();
    const cleanPhone = (phone || '').replace(/\D/g, '');
    
    let targetIndex = customers.findIndex(c => 
      (cleanPhone.length > 3 && c.phone && c.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))) ||
      (c.name.toLowerCase() === (customerName || '').trim().toLowerCase())
    );

    let targetCustomer;
    if (targetIndex >= 0) {
      targetCustomer = customers[targetIndex];
    } else {
      targetCustomer = this.getOrCreateCustomer(customerName, phone);
      targetIndex = customers.findIndex(c => c.id === targetCustomer.id);
    }

    const currentBal = Number(targetCustomer.walletBalance) || 0;
    const newBal = currentBal + amount;
    
    targetCustomer.walletBalance = newBal;
    if (targetIndex >= 0) {
      customers[targetIndex] = targetCustomer;
    }
    this.saveCustomers(customers);

    // Record wallet transaction
    const wtxns = this.getWalletTransactions();
    const newTxn = {
      id: `WTXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString('en-US', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      customer: targetCustomer.name,
      phone: targetCustomer.phone,
      desc: desc,
      amount: `₹${amount.toFixed(2)}`,
      type: 'Credit',
      closingBal: `₹${newBal.toFixed(2)}`
    };
    wtxns.unshift(newTxn);
    this.saveWalletTransactions(wtxns);
    this.dispatchAllEvents();

    return newBal;
  },

  debitCustomerWallet(customerName: string, phone: string, amount: number, desc: string): { success: boolean; deducted: number; newBalance: number } {
    if (amount <= 0) return { success: true, deducted: 0, newBalance: this.getCustomerWalletBalance(phone || customerName) };
    
    const customers = this.getCustomers();
    const cleanPhone = (phone || '').replace(/\D/g, '');
    
    let targetIndex = customers.findIndex(c => 
      (cleanPhone.length > 3 && c.phone && c.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))) ||
      (c.name.toLowerCase() === (customerName || '').trim().toLowerCase())
    );

    if (targetIndex < 0) {
      const created = this.getOrCreateCustomer(customerName, phone);
      targetIndex = customers.findIndex(c => c.id === created.id);
    }

    const targetCustomer = customers[targetIndex];
    const currentBal = Number(targetCustomer.walletBalance) || 0;
    
    if (currentBal <= 0) {
      return { success: false, deducted: 0, newBalance: 0 };
    }

    const actualDeducted = Math.min(currentBal, amount);
    const newBal = currentBal - actualDeducted;

    targetCustomer.walletBalance = newBal;
    customers[targetIndex] = targetCustomer;
    this.saveCustomers(customers);

    // Record wallet transaction
    const wtxns = this.getWalletTransactions();
    const newTxn = {
      id: `WTXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString('en-US', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      customer: targetCustomer.name,
      phone: targetCustomer.phone,
      desc: desc,
      amount: `₹${actualDeducted.toFixed(2)}`,
      type: 'Debit',
      closingBal: `₹${newBal.toFixed(2)}`
    };
    wtxns.unshift(newTxn);
    this.saveWalletTransactions(wtxns);
    this.dispatchAllEvents();

    return { success: true, deducted: actualDeducted, newBalance: newBal };
  },

  processReferralCode(referralCode: string, newCustomerName: string, newCustomerPhone: string): { success: boolean; message: string; referrerName?: string } {
    const codeClean = (referralCode || '').trim().toUpperCase();
    if (!codeClean) return { success: false, message: 'Please enter a valid referral code.' };

    const customers = this.getCustomers();
    const referrer = customers.find(c => c.referralCode && c.referralCode.toUpperCase() === codeClean);

    if (!referrer) {
      return { success: false, message: `Referral code "${codeClean}" is invalid or not found.` };
    }

    const referrerCleanPhone = (referrer.phone || '').replace(/\D/g, '');
    const newCleanPhone = (newCustomerPhone || '').replace(/\D/g, '');
    if (referrerCleanPhone.length > 5 && newCleanPhone.length > 5 && referrerCleanPhone.endsWith(newCleanPhone.slice(-10))) {
      return { success: false, message: 'You cannot use your own referral code.' };
    }

    const config = this.getReferralConfig();
    const referrerReward = Number(config.referrerAmount) || 200;
    const refereeReward = Number(config.refereeAmount) || 200;

    // Credit Referrer
    this.creditCustomerWallet(
      referrer.name,
      referrer.phone,
      referrerReward,
      `Referral Reward for inviting ${newCustomerName || 'a new user'}`
    );

    // Credit Referee
    this.creditCustomerWallet(
      newCustomerName,
      newCustomerPhone,
      refereeReward,
      `Referral Bonus for signing up with code ${codeClean}`
    );

    // Log in referrals list
    const referrals = this.getReferralsList();
    const refereeCustomer = this.getOrCreateCustomer(newCustomerName, newCustomerPhone);
    
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    referrals.unshift({
      id: `REF-${Math.floor(100 + Math.random() * 899)}`,
      referrerRole: 'User',
      referrerId: referrer.id,
      referrerName: referrer.name,
      referrerPhone: referrer.phone,
      refereeRole: 'User',
      refereeId: refereeCustomer.id,
      refereeName: newCustomerName,
      refereePhone: newCustomerPhone,
      date: todayStr,
      status: 'Completed',
      earned: `₹${(referrerReward + refereeReward).toFixed(2)}`
    });
    this.saveReferralsList(referrals);

    return {
      success: true,
      message: `🎉 Referral code applied! ₹${refereeReward} bonus credited to your wallet! (${referrer.name} also received ₹${referrerReward})`,
      referrerName: referrer.name
    };
  },

  // BRANDS
  getBrands(): Brand[] {
    return getStored('brands', INITIAL_BRANDS);
  },
  saveBrands(brands: Brand[]): void {
    setStored('brands', brands);
  },
  addBrand(brand: Partial<Brand>): Brand {
    const list = this.getBrands();
    const newId = String(list.length > 0 ? Math.max(...list.map(b => parseInt(b.id) || 0)) + 1 : 1);
    const item: Brand = {
      id: newId,
      name: brand.name || 'New Brand',
      status: brand.status || 'active',
      logo: brand.logo || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
      count: brand.count || 0
    };
    list.unshift(item);
    this.saveBrands(list);
    return item;
  },
  updateBrand(id: string, updatedFields: Partial<Brand>): Brand | null {
    const list = this.getBrands();
    const index = list.findIndex(b => b.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveBrands(list);
      return list[index];
    }
    return null;
  },
  deleteBrand(id: string): void {
    const list = this.getBrands();
    const filtered = list.filter(b => b.id !== id);
    this.saveBrands(filtered);
  },

  // TAX RULES
  getTaxRules(): TaxRule[] {
    return getStored('taxRules', INITIAL_TAX_RULES);
  },
  saveTaxRules(rules: TaxRule[]): void {
    setStored('taxRules', rules);
  },
  addTaxRule(rule: Partial<TaxRule>): TaxRule {
    const list = this.getTaxRules();
    const newId = String(list.length > 0 ? Math.max(...list.map(t => parseInt(t.id) || 0)) + 1 : 1);
    const item: TaxRule = {
      id: newId,
      name: rule.name || 'New Tax Rule',
      rate: rule.rate || '18%',
      appliesTo: rule.appliesTo || 'All Products',
      status: rule.status || 'Active'
    };
    list.unshift(item);
    this.saveTaxRules(list);
    return item;
  },
  updateTaxRule(id: string, updatedFields: Partial<TaxRule>): TaxRule | null {
    const list = this.getTaxRules();
    const index = list.findIndex(t => t.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveTaxRules(list);
      return list[index];
    }
    return null;
  },
  deleteTaxRule(id: string): void {
    const list = this.getTaxRules();
    const filtered = list.filter(t => t.id !== id);
    this.saveTaxRules(filtered);
  },
  getTaxInclusive(): boolean {
    const val = localStorage.getItem('displayTaxInclusive');
    return val === null ? true : val === 'true';
  },
  setTaxInclusive(inclusive: boolean): void {
    localStorage.setItem('displayTaxInclusive', inclusive ? 'true' : 'false');
    window.dispatchEvent(new Event('store_taxRules_updated'));
  },

  // WAREHOUSES
  getWarehouses(): Warehouse[] {
    return getStored('warehouses', INITIAL_WAREHOUSES);
  },
  saveWarehouses(warehouses: Warehouse[]): void {
    setStored('warehouses', warehouses);
  },
  addWarehouse(warehouse: Partial<Warehouse>): Warehouse {
    const list = this.getWarehouses();
    const newNum = list.length + 1;
    const newId = `WH-${String(newNum).padStart(3, '0')}`;
    const codeNum = String(newNum).padStart(2, '0');
    const item: Warehouse = {
      id: newId,
      name: warehouse.name || 'New Warehouse',
      code: warehouse.code || `WH-SLN-${codeNum}`,
      managerName: warehouse.managerName || 'Operations Manager',
      phone: warehouse.phone || '+91 9821000000',
      email: warehouse.email || 'warehouse@wikcart.in',
      address: warehouse.address || 'Industrial Area',
      city: warehouse.city || 'Sultanpur',
      state: warehouse.state || 'Uttar Pradesh',
      pincode: warehouse.pincode || '228001',
      capacitySqFt: warehouse.capacitySqFt || 10000,
      occupancyPercentage: warehouse.occupancyPercentage || 25,
      isFulfillmentCenter: warehouse.isFulfillmentCenter !== false,
      status: warehouse.status || 'Active'
    };
    list.unshift(item);
    this.saveWarehouses(list);
    return item;
  },
  updateWarehouse(id: string, updatedFields: Partial<Warehouse>): Warehouse | null {
    const list = this.getWarehouses();
    const index = list.findIndex(w => w.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveWarehouses(list);
      return list[index];
    }
    return null;
  },
  deleteWarehouse(id: string): void {
    const list = this.getWarehouses();
    const filtered = list.filter(w => w.id !== id);
    this.saveWarehouses(filtered);
  },

  // CLEAR & RESTORE DUMMY DATA METHODS
  isDummyDataRemoved(): boolean {
    return localStorage.getItem('dummyDataRemoved') === 'true';
  },

  removeDummyData(completelyWipeAll: boolean = false): void {
    localStorage.setItem('dummyDataRemoved', 'true');
    if (completelyWipeAll) {
      const keysToClear = [
        'products', 'orders', 'sellers', 'coupons', 'deliveryPartners',
        'categories', 'subcategories', 'withdrawals', 'customers',
        'globalInventory', 'transactions', 'walletTransactions', 'vendorRegistrations', 'brands', 'warehouses'
      ];
      keysToClear.forEach(k => localStorage.removeItem(k));
    } else {
      // Create clean empty structures if not already present
      localStorage.setItem('products', JSON.stringify([]));
      localStorage.setItem('orders', JSON.stringify([]));
      localStorage.setItem('sellers', JSON.stringify([]));
      localStorage.setItem('coupons', JSON.stringify([]));
      localStorage.setItem('deliveryPartners', JSON.stringify([]));
      localStorage.setItem('categories', JSON.stringify([]));
      localStorage.setItem('subcategories', JSON.stringify([]));
      localStorage.setItem('withdrawals', JSON.stringify([]));
      localStorage.setItem('customers', JSON.stringify([]));
      localStorage.setItem('globalInventory', JSON.stringify([]));
      localStorage.setItem('transactions', JSON.stringify([]));
      localStorage.setItem('walletTransactions', JSON.stringify([]));
      localStorage.setItem('vendorRegistrations', JSON.stringify([]));
      localStorage.setItem('brands', JSON.stringify([]));
      localStorage.setItem('warehouses', JSON.stringify([]));
    }
    this.dispatchAllEvents();
  },

  restoreDummyData(): void {
    localStorage.removeItem('dummyDataRemoved');
    const keysToClear = [
      'products', 'orders', 'sellers', 'coupons', 'deliveryPartners',
      'categories', 'subcategories', 'withdrawals', 'customers',
      'globalInventory', 'transactions', 'walletTransactions', 'vendorRegistrations', 'brands', 'warehouses'
    ];
    keysToClear.forEach(k => localStorage.removeItem(k));
    this.dispatchAllEvents();
  },

  dispatchAllEvents(): void {
    const keys = [
      'products', 'orders', 'sellers', 'coupons', 'deliveryPartners',
      'categories', 'subcategories', 'withdrawals', 'customers',
      'globalInventory', 'transactions', 'walletTransactions', 'vendorRegistrations', 'brands',
      'referralConfig', 'referralsList', 'warehouses'
    ];
    keys.forEach(k => {
      window.dispatchEvent(new Event(`store_${k}_updated`));
    });
    window.dispatchEvent(new Event('settingsUpdated'));
  }
};

// Re-export useMarketplaceData from hooks.ts to keep other component imports working
export { useMarketplaceData } from './hooks';

// Ensure software starts completely clean without any pre-uploaded mock data or images
if (typeof window !== 'undefined') {
  if (localStorage.getItem('initialCleanSlateApplied_v3') !== 'true') {
    const defaultCleanKeys = [
      'products', 'orders', 'sellers', 'coupons', 'deliveryPartners',
      'categories', 'subcategories', 'withdrawals', 'customers',
      'globalInventory', 'transactions', 'walletTransactions', 'vendorRegistrations', 'brands'
    ];
    defaultCleanKeys.forEach(k => {
      // If items exist and match old pre-uploaded demo data, wipe or reset them
      const current = localStorage.getItem(k);
      if (!current || current === '[]' || current.includes('Cold Brew Coffee') || current.includes('Nike')) {
        localStorage.setItem(k, JSON.stringify([]));
      }
    });
    localStorage.setItem('initialCleanSlateApplied_v3', 'true');
  }
}


