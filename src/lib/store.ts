import { supabase, getSupabaseCredentials, clearSupabaseCache } from './supabase';

export interface Product {
  id: number | string;
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
  stock?: number | string;
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
  password?: string;
  storeName: string;
  phone: string;
  status: 'Active' | 'Pending' | 'Suspended';
  orders: number;
  revenue: string;
  rating: number;
  walletBalance?: number;
  referralCode?: string;
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
    name: 'Sultanpur Central Logistics Hub',
    code: 'WH-SLN-01',
    managerName: 'Rajesh Sharma',
    phone: '+91 9821012345',
    email: 'wh.central@wikcart.in',
    address: 'Plot 12, Civil Lines Industrial Area',
    city: 'Sultanpur',
    state: 'Uttar Pradesh',
    pincode: '228001',
    capacitySqFt: 25000,
    occupancyPercentage: 40,
    isFulfillmentCenter: true,
    status: 'Active'
  },
  {
    id: 'WH-002',
    name: 'Amhat Express Depot',
    code: 'WH-SLN-02',
    managerName: 'Vikas Verma',
    phone: '+91 9876543210',
    email: 'depot.amhat@wikcart.in',
    address: 'Building 4B, Amhat Bypass Road',
    city: 'Sultanpur',
    state: 'Uttar Pradesh',
    pincode: '228001',
    capacitySqFt: 12000,
    occupancyPercentage: 25,
    isFulfillmentCenter: false,
    status: 'Active'
  }
];

export interface VendorRegistration {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  password?: string;
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

const INITIAL_TAX_RULES: TaxRule[] = [];

const INITIAL_VENDOR_REGISTRATIONS: VendorRegistration[] = [];
const INITIAL_CATEGORIES: any[] = [];
const INITIAL_SUBCATEGORIES: any[] = [];
const INITIAL_CUSTOMERS: any[] = [];
const INITIAL_WITHDRAWALS: any[] = [];
const INITIAL_GLOBAL_INVENTORY: any[] = [];
const INITIAL_TXNS: any[] = [];
const INITIAL_WALLET_TXNS: any[] = [];

// Load helper
export function isAuthOrApiKeyError(error: any): boolean {
  if (!error) return false;
  const msg = typeof error === 'string' ? error : (error.message || error.details || error.hint || String(error));
  const status = error.status || error.code;
  const lower = msg.toLowerCase();
  return (
    status === 401 ||
    status === 403 ||
    status === 'PGRST301' ||
    lower.includes('401') ||
    lower.includes('invalid api key') ||
    lower.includes('unauthorized') ||
    lower.includes('jwserror') ||
    lower.includes('apikey') ||
    lower.includes('jwt') ||
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('fetch failed') ||
    lower.includes('load failed') ||
    lower.includes('cors')
  );
}

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
    const numericIds = list.map(p => typeof p.id === 'number' ? p.id : (parseInt(String(p.id)) || 0)).filter(n => !isNaN(n));
    const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : Date.now();
    const item: Product = {
      id: newId,
      name: product.name || 'Unnamed Product',
      price: product.price || '₹0',
      mrp: product.mrp || '',
      rating: product.rating || 4.5,
      image: product.image || '',
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

    // Background sync to Supabase database
    this.saveProductToSupabase(item).catch(err => console.warn('Product bg save error:', err));

    return item;
  },
  updateProduct(id: number | string, updatedFields: Partial<Product>): Product | null {
    const list = this.getProducts();
    const index = list.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveProducts(list);
      // Background sync to Supabase database
      this.saveProductToSupabase(list[index]).catch(err => console.warn('Product bg update error:', err));
      return list[index];
    }
    return null;
  },
  deleteProduct(id: number | string): void {
    const list = this.getProducts();
    const filtered = list.filter(p => String(p.id) !== String(id));
    this.saveProducts(filtered);
    // Background sync deletion to Supabase database
    this.deleteProductFromSupabase(id).catch(err => console.warn('Product bg delete error:', err));
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

    // Save order to Supabase in background
    this.saveOrderToSupabase(newOrder).catch(err => console.warn('Order bg save error:', err));

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
    const list = getStored<Seller[]>('sellers', []);
    const MOCK_EMAILS = ['alok@citysquare.com', 'ravi@siliconvalley.com', 'suhani@freshorganic.com', 'amit@groceryhub.com'];
    const cleanList = list.filter(s => s.email && !MOCK_EMAILS.includes(s.email.toLowerCase()));
    if (cleanList.length !== list.length) {
      this.saveSellers(cleanList);
      return cleanList;
    }
    return list;
  },
  saveSellers(sellers: Seller[]): void {
    setStored('sellers', sellers);
    for (const seller of sellers) {
      if (seller.email || seller.phone) {
        this.saveVendorToSupabase(seller).catch(() => {});
      }
    }
  },
  addSeller(seller: Partial<Seller>): Seller {
    const list = this.getSellers();
    const newId = String(list.length > 0 ? Math.max(...list.map(s => parseInt(s.id) || 0)) + 1 : 1);
    const cleanName = (seller.storeName || seller.name || 'VENDOR').split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
    const generatedRefCode = seller.referralCode || `${cleanName || 'VENDOR'}${Math.floor(100 + Math.random() * 899)}`;
    
    const item: Seller = {
      id: newId,
      name: seller.name || 'New Seller',
      email: seller.email || '',
      password: seller.password || '',
      storeName: seller.storeName || 'New Store',
      phone: seller.phone || '',
      status: seller.status || 'Active',
      orders: seller.orders || 0,
      revenue: seller.revenue || '₹0.00',
      rating: seller.rating || 4.5,
      walletBalance: seller.walletBalance !== undefined ? seller.walletBalance : 0,
      referralCode: generatedRefCode,
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
    this.saveVendorToSupabase(item).catch(err => {
      if (!isAuthOrApiKeyError(err)) console.warn('Vendor bg save error:', err);
    });
    return item;
  },

  getSellerWalletBalance(sellerIdOrStoreNameOrPhone: string): number {
    if (!sellerIdOrStoreNameOrPhone) return 0;
    const sellers = this.getSellers();
    const clean = sellerIdOrStoreNameOrPhone.trim().toLowerCase();
    const cleanPhone = clean.replace(/\D/g, '');
    const seller = sellers.find(s =>
      s.id === sellerIdOrStoreNameOrPhone ||
      (cleanPhone.length > 3 && s.phone && s.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))) ||
      s.storeName.toLowerCase() === clean ||
      s.name.toLowerCase() === clean
    );
    return seller ? (Number(seller.walletBalance) || 0) : 0;
  },

  creditSellerWallet(sellerIdOrStoreNameOrPhone: string, amount: number, desc: string): number {
    if (amount <= 0) return 0;
    const sellers = this.getSellers();
    const clean = (sellerIdOrStoreNameOrPhone || '').trim().toLowerCase();
    const cleanPhone = clean.replace(/\D/g, '');

    let sellerIndex = sellers.findIndex(s =>
      s.id === sellerIdOrStoreNameOrPhone ||
      (cleanPhone.length > 3 && s.phone && s.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))) ||
      s.storeName.toLowerCase() === clean ||
      s.name.toLowerCase() === clean
    );

    let targetSeller: Seller;
    if (sellerIndex >= 0) {
      targetSeller = sellers[sellerIndex];
    } else {
      targetSeller = this.addSeller({
        name: sellerIdOrStoreNameOrPhone,
        storeName: sellerIdOrStoreNameOrPhone,
        phone: cleanPhone || '9800000000',
        walletBalance: 0
      });
      sellerIndex = sellers.findIndex(s => s.id === targetSeller.id);
    }

    const currentBal = Number(targetSeller.walletBalance) || 0;
    const newBal = currentBal + amount;
    targetSeller.walletBalance = newBal;
    if (sellerIndex >= 0) {
      sellers[sellerIndex] = targetSeller;
    }
    this.saveSellers(sellers);

    // Record wallet transaction
    const wtxns = this.getWalletTransactions();
    wtxns.unshift({
      id: `WTXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      customer: targetSeller.storeName || targetSeller.name,
      phone: targetSeller.phone || 'N/A',
      desc: desc,
      amount: `₹${amount.toFixed(2)}`,
      type: 'Credit',
      closingBal: `₹${newBal.toFixed(2)}`
    });
    this.saveWalletTransactions(wtxns);
    this.dispatchAllEvents();

    return newBal;
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
    const updated = list.filter(item => String(item.id) !== String(id));
    this.saveDeliveryPartners(updated);

    // Background sync deletion
    this.deleteDeliveryPartnerFromSupabase(id);
  },

  // SUPABASE INTEGRATION SYNC HELPERS
  async checkSupabaseStatus(): Promise<{
    connected: boolean;
    url: string;
    error?: string;
    tables: Record<string, { status: 'Accessible' | 'Error' | 'Not Checked'; count?: number; error?: string }>;
  }> {
    const { url } = getSupabaseCredentials();
    const tableNames = ['products', 'vendors', 'pos_orders', 'customers', 'categories', 'brands', 'delivery_partners', 'coupons'];
    const result: {
      connected: boolean;
      url: string;
      error?: string;
      tables: Record<string, { status: 'Accessible' | 'Error' | 'Not Checked'; count?: number; error?: string }>;
    } = {
      connected: false,
      url,
      tables: {}
    };

    for (const tbl of tableNames) {
      result.tables[tbl] = { status: 'Not Checked' };
    }

    try {
      for (const tbl of tableNames) {
        const { data, error } = await supabase.from(tbl).select('id', { count: 'exact' }).limit(1);
        if (error) {
          const is401 = isAuthOrApiKeyError(error);
          const errMsg = is401 ? '401 Unauthorized: Invalid API key or JWT token' : error.message;
          result.tables[tbl] = { status: 'Error', error: errMsg };
        } else {
          result.connected = true;
          result.tables[tbl] = { status: 'Accessible', count: data ? data.length : 0 };
        }
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
        if (!isAuthOrApiKeyError(error)) {
          console.warn('Supabase fetch delivery_partners error:', error.message);
        }
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
      if (!isAuthOrApiKeyError(err)) console.error('Failed to sync delivery partners from Supabase:', err);
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
        if (!isAuthOrApiKeyError(error)) console.error('Supabase save delivery_partners error:', error.message);
      } else if (data && data[0] && !isUUID) {
        const realId = data[0].id;
        const currentList = this.getDeliveryPartners();
        const updated = currentList.map(p => p.id === partner.id ? { ...p, id: realId } : p);
        this.saveDeliveryPartners(updated);
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to save delivery partner to Supabase:', err);
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
        if (!isAuthOrApiKeyError(error)) console.error('Supabase delete delivery_partners error:', error.message);
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to delete delivery partner from Supabase:', err);
    }
  },

  async syncCouponsFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*');
      
      if (error) {
        if (!isAuthOrApiKeyError(error)) {
          console.warn('Supabase fetch coupons error:', error.message);
        }
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
      if (!isAuthOrApiKeyError(err)) console.error('Failed to sync coupons from Supabase:', err);
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
        if (!isAuthOrApiKeyError(error)) console.error('Supabase save coupons error:', error.message);
      } else if (data && data[0] && !isUUID) {
        const realId = data[0].id;
        const currentList = this.getCoupons();
        const updated = currentList.map(c => c.id === coupon.id ? { ...c, id: realId } : c);
        this.saveCoupons(updated);
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to save coupon to Supabase:', err);
    }
  },

  // --- SUPABASE SYNC FOR PRODUCTS ---
  async syncProductsFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (!isAuthOrApiKeyError(error)) {
          console.warn('Supabase fetch products error:', error.message);
        }
        return;
      }

      if (data && data.length > 0) {
        const sellers = this.getSellers();
        const sellersById = new Map<string, Seller>();
        const sellersByStore = new Map<string, Seller>();

        for (const s of sellers) {
          if (s.id) sellersById.set(String(s.id).toLowerCase(), s);
          if (s.storeName) sellersByStore.set(s.storeName.trim().toLowerCase(), s);
          if (s.email) sellersByStore.set(s.email.trim().toLowerCase(), s);
        }

        const mapped: Product[] = data.map((row: any) => {
          const photoUrls = Array.isArray(row.photo_urls) ? row.photo_urls : [];
          const primaryImg = photoUrls[0] || row.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
          const numericPrice = row.selling_price !== null && row.selling_price !== undefined ? row.selling_price : 0;
          const numericMrp = row.mrp !== null && row.mrp !== undefined ? row.mrp : null;

          const matchedSeller = (row.vendor_id ? sellersById.get(String(row.vendor_id).toLowerCase()) : null) ||
            (row.custom_category ? sellersByStore.get(String(row.custom_category).trim().toLowerCase()) : null);

          const resolvedVendor = row.custom_category || matchedSeller?.storeName || (row.vendor_id ? matchedSeller?.storeName : null) || 'Sultanpur Local Vendor';
          const resolvedSellerId = row.vendor_id || matchedSeller?.id || '1';

          return {
            id: row.id,
            name: row.name || 'Unnamed Product',
            price: `₹${numericPrice}`,
            mrp: numericMrp !== null ? `₹${numericMrp}` : '',
            rating: 4.8,
            image: primaryImg,
            images: photoUrls.length > 0 ? photoUrls : [primaryImg],
            media: photoUrls.length > 0 ? photoUrls : [primaryImg],
            sizes: Array.isArray(row.sizes) ? row.sizes : [],
            variants: Array.isArray(row.variants) ? row.variants : [],
            tag: row.combo_tag || row.status || 'Published',
            vendor: resolvedVendor,
            sellerId: resolvedSellerId,
            brand: row.brand || (Array.isArray(row.tags) && row.tags[1]) || 'Generic',
            shortDescription: row.short_description || '',
            description: row.detailed_description || row.short_description || '',
            category: row.main_store_category || 'General',
            isComboOffer: !!row.is_combo_offer,
            comboTitle: row.combo_title || '',
            comboItems: row.combo_items || '',
            comboDiscount: row.combo_discount || '',
            comboTag: row.combo_tag || '',
            stock: row.total_allowed_qty || 50
          };
        });

        const currentLocal = getStored<Product[]>('products', []);
        const byKey = new Map<string, Product>();

        for (const item of currentLocal) {
          byKey.set(String(item.id), item);
        }

        for (const remoteItem of mapped) {
          const localItem = byKey.get(String(remoteItem.id));
          if (localItem) {
            // Keep local vendor & sellerId if remote was empty or generic
            const isLocalSpecificVendor = localItem.vendor && localItem.vendor !== 'Sultanpur Local Vendor' && localItem.vendor !== 'General';
            const mergedProd: Product = {
              ...remoteItem,
              ...localItem,
              vendor: isLocalSpecificVendor ? localItem.vendor : (remoteItem.vendor || localItem.vendor),
              sellerId: localItem.sellerId && localItem.sellerId !== '1' ? localItem.sellerId : (remoteItem.sellerId || localItem.sellerId),
              price: remoteItem.price || localItem.price,
              mrp: remoteItem.mrp || localItem.mrp,
              name: remoteItem.name || localItem.name,
              category: remoteItem.category || localItem.category
            };
            byKey.set(String(remoteItem.id), mergedProd);
          } else {
            byKey.set(String(remoteItem.id), remoteItem);
          }
        }

        const merged = Array.from(byKey.values());
        setStored('products', merged);
        this.dispatchAllEvents();
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to sync products from Supabase:', err);
    }
  },

  async saveProductToSupabase(product: Product): Promise<void> {
    try {
      const numPrice = parseFloat(String(product.price || '').replace(/[^0-9.]/g, '')) || 0;
      const numMrp = parseFloat(String(product.mrp || '').replace(/[^0-9.]/g, '')) || numPrice;
      
      const photos = product.media && product.media.length > 0 
        ? product.media 
        : (product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []));

      // Resolve seller UUID if possible
      let resolvedVendorId: string | null = null;
      if (product.sellerId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(product.sellerId))) {
        resolvedVendorId = String(product.sellerId);
      } else {
        const sellers = this.getSellers();
        const matched = sellers.find(s => 
          (product.sellerId && String(s.id) === String(product.sellerId)) ||
          (product.vendor && s.storeName && s.storeName.trim().toLowerCase() === product.vendor.trim().toLowerCase())
        );
        if (matched && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(matched.id))) {
          resolvedVendorId = String(matched.id);
        }
      }

      const payload: any = {
        name: product.name,
        selling_price: numPrice,
        mrp: numMrp,
        vendor_id: resolvedVendorId,
        custom_category: product.vendor || null,
        brand_id: null,
        short_description: product.shortDescription || product.description || '',
        detailed_description: product.description || product.shortDescription || '',
        main_store_category: product.category || 'General',
        is_combo_offer: !!product.isComboOffer,
        combo_title: product.comboTitle || null,
        combo_items: product.comboItems || null,
        combo_discount: product.comboDiscount || null,
        combo_tag: product.comboTag || null,
        photo_urls: photos,
        sizes: product.sizes || [],
        variants: product.variants || [],
        tags: [product.vendor || '', product.brand || 'Generic'].filter(Boolean),
        total_allowed_qty: typeof product.stock === 'number' ? product.stock : 100,
        status: 'Published'
      };

      const isUUID = typeof product.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(product.id);

      if (isUUID) {
        payload.id = product.id;
        const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
        if (error && !isAuthOrApiKeyError(error)) {
          console.error('Supabase update product error:', error.message);
        }
      } else {
        const { data, error } = await supabase.from('products').insert(payload).select();
        if (error && !isAuthOrApiKeyError(error)) {
          console.error('Supabase insert product error:', error.message);
        } else if (data && data[0]) {
          const realId = data[0].id;
          const currentList = this.getProducts();
          const updated = currentList.map(p => String(p.id) === String(product.id) ? { ...p, id: realId } : p);
          this.saveProducts(updated);
        }
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to save product to Supabase:', err);
    }
  },

  async deleteProductFromSupabase(id: number | string): Promise<void> {
    try {
      const isUUID = typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (!isUUID) return;

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete product error:', error.message);
      }
    } catch (err) {
      console.error('Failed to delete product from Supabase:', err);
    }
  },

  async syncCategoriesFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) {
        if (!isAuthOrApiKeyError(error)) console.warn('Supabase fetch categories error:', error.message);
        return;
      }
      if (data && data.length > 0) {
        const mapped = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          image: c.image_url || '',
          status: c.status || 'Active',
          count: 0
        }));
        setStored('categories', mapped);
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to sync categories from Supabase:', err);
    }
  },

  async saveCategoryToSupabase(category: any): Promise<void> {
    try {
      const payload: any = {
        name: category.name,
        image_url: category.image || null,
        status: category.status || 'Active'
      };
      const isUUID = typeof category.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(category.id);
      if (isUUID) {
        payload.id = category.id;
      }
      const onConflictTarget = isUUID ? 'id' : 'name';
      const { data, error } = await supabase.from('categories').upsert(payload, { onConflict: onConflictTarget }).select();
      if (error) {
        if (!isAuthOrApiKeyError(error)) console.error('Supabase save category error:', error.message);
      } else if (data && data[0]) {
        const realId = data[0].id;
        const currentList = this.getCategories();
        const updated = currentList.map(c => 
          (String(c.id) === String(category.id) || c.name.toLowerCase() === category.name.toLowerCase()) 
            ? { ...c, id: realId } 
            : c
        );
        this.saveCategories(updated);
        this.dispatchAllEvents();
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to save category to Supabase:', err);
    }
  },

  async deleteCategoryFromSupabase(id: string): Promise<void> {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (!isUUID) return;
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error && !isAuthOrApiKeyError(error)) console.error('Supabase delete category error:', error.message);
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to delete category from Supabase:', err);
    }
  },

  async syncBrandsFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase.from('brands').select('*');
      if (error) {
        if (!isAuthOrApiKeyError(error)) console.warn('Supabase fetch brands error:', error.message);
        return;
      }
      if (data && data.length > 0) {
        const mapped: Brand[] = data.map((b: any) => ({
          id: b.id,
          name: b.name,
          logo: b.logo_url || '',
          status: b.status === 'Active' ? 'active' : 'inactive'
        }));
        setStored('brands', mapped);
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to sync brands from Supabase:', err);
    }
  },

  async saveBrandToSupabase(brand: Brand): Promise<void> {
    try {
      const payload: any = {
        name: brand.name,
        logo_url: brand.logo || null,
        status: brand.status === 'active' ? 'Active' : 'Inactive'
      };
      const isUUID = typeof brand.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(brand.id);
      if (isUUID) {
        payload.id = brand.id;
      }
      const onConflictTarget = isUUID ? 'id' : 'name';
      const { data, error } = await supabase.from('brands').upsert(payload, { onConflict: onConflictTarget }).select();
      if (error) {
        if (!isAuthOrApiKeyError(error)) console.error('Supabase save brand error:', error.message);
      } else if (data && data[0]) {
        const realId = data[0].id;
        const currentList = this.getBrands();
        const updated = currentList.map(b => 
          (String(b.id) === String(brand.id) || b.name.toLowerCase() === brand.name.toLowerCase()) 
            ? { ...b, id: realId } 
            : b
        );
        this.saveBrands(updated);
        this.dispatchAllEvents();
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to save brand to Supabase:', err);
    }
  },

  async deleteBrandFromSupabase(id: string): Promise<void> {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (!isUUID) return;
      const { error } = await supabase.from('brands').delete().eq('id', id);
      if (error && !isAuthOrApiKeyError(error)) console.error('Supabase delete brand error:', error.message);
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to delete brand from Supabase:', err);
    }
  },

  async syncVendorsFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase.from('vendors').select('*');
      if (error) {
        if (!isAuthOrApiKeyError(error)) console.warn('Supabase fetch vendors error:', error.message);
        return;
      }
      if (data && data.length > 0) {
        const mapped: Seller[] = data.map((v: any) => ({
          id: v.id,
          name: v.full_name || v.business_owner_name || 'Vendor Owner',
          email: v.email || '',
          password: v.password_hash && v.password_hash !== 'hashed_password_default' ? v.password_hash : 'pass123',
          storeName: v.store_display_name || v.legal_business_name || 'Vendor Store',
          phone: v.mobile_number || '',
          status: (v.status === 'Approved' || v.status === 'Active') ? 'Active' : (v.status === 'Rejected' || v.status === 'Suspended' ? 'Suspended' : 'Pending'),
          orders: 0,
          revenue: '₹0.00',
          rating: 4.8,
          plan: v.commission_plan || 'Standard Plan',
          category: v.primary_category || 'General',
          city: v.city || 'Sultanpur',
          address: v.store_address_line1 || '',
          gstin: v.gstin_number || ''
        }));

        const currentLocal = getStored<Seller[]>('sellers', []);
        
        // Helper to find existing local seller
        const findMatchingLocal = (remote: Seller): Seller | undefined => {
          const remoteEmail = (remote.email || '').trim().toLowerCase();
          const remotePhoneDigits = (remote.phone || '').replace(/\D/g, '').slice(-10);
          const remoteStore = (remote.storeName || '').trim().toLowerCase();
          const remoteId = String(remote.id).toLowerCase();

          return currentLocal.find(l => {
            if (remoteEmail && l.email && l.email.trim().toLowerCase() === remoteEmail) return true;
            if (remotePhoneDigits && l.phone && l.phone.replace(/\D/g, '').slice(-10) === remotePhoneDigits) return true;
            if (remoteId && String(l.id).toLowerCase() === remoteId) return true;
            if (remoteStore && l.storeName && l.storeName.trim().toLowerCase() === remoteStore) return true;
            return false;
          });
        };

        const mergedMap = new Map<string, Seller>();

        // Seed with all current local sellers
        for (const localItem of currentLocal) {
          const key = (localItem.email || localItem.phone || String(localItem.id)).toLowerCase();
          if (key) mergedMap.set(key, localItem);
        }

        // Merge remote sellers
        for (const remoteItem of mapped) {
          const matchedLocal = findMatchingLocal(remoteItem);
          const key = (remoteItem.email || remoteItem.phone || String(remoteItem.id)).toLowerCase();

          if (matchedLocal) {
            const isLocalActive = matchedLocal.status === 'Active' || (matchedLocal as any).status === 'Approved';
            const isRemoteActive = remoteItem.status === 'Active' || (remoteItem as any).status === 'Approved';
            const finalStatus: 'Active' | 'Pending' | 'Suspended' = (isLocalActive || isRemoteActive) ? 'Active' : (remoteItem.status === 'Suspended' ? 'Suspended' : 'Pending');

            const merged: Seller = {
              ...matchedLocal,
              ...remoteItem,
              id: remoteItem.id || matchedLocal.id, // Prefer Supabase UUID
              storeName: matchedLocal.storeName || remoteItem.storeName,
              password: matchedLocal.password || remoteItem.password,
              status: finalStatus
            };
            
            // Remove previous key if different
            const oldKey = (matchedLocal.email || matchedLocal.phone || String(matchedLocal.id)).toLowerCase();
            if (oldKey && oldKey !== key) mergedMap.delete(oldKey);
            
            mergedMap.set(key, merged);

            // If locally approved but remote was pending, push approved status to Supabase
            if (isLocalActive && !isRemoteActive) {
              this.saveVendorToSupabase(merged).catch(() => {});
            }
          } else {
            mergedMap.set(key, remoteItem);
          }
        }

        const mergedList = Array.from(mergedMap.values());
        setStored('sellers', mergedList);
        this.dispatchAllEvents();
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to sync vendors from Supabase:', err);
    }
  },

  async saveVendorToSupabase(seller: Seller): Promise<void> {
    if (!supabase) return;
    try {
      const s = seller as any;
      const isApprovedOrActive = s.status === 'Approved' || s.status === 'Active';
      const isRejectedOrSuspended = s.status === 'Rejected' || s.status === 'Suspended';
      const payloadStatus = isApprovedOrActive ? 'Approved' : isRejectedOrSuspended ? 'Rejected' : 'Pending';

      const payload: any = {
        full_name: s.businessOwnerName || s.name || 'Vendor Owner',
        business_owner_name: s.businessOwnerName || s.name || 'Vendor Owner',
        mobile_number: s.mobileNumber || s.phone || `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        email: s.email || `${s.id}@vendor.local`,
        password_hash: s.passwordHash || s.password || 'hashed_password_default',
        legal_business_name: s.legalBusinessName || s.storeDisplayName || s.storeName || 'Vendor Store',
        store_display_name: s.storeDisplayName || s.storeName || s.legalBusinessName || 'Vendor Store',
        primary_category: s.primaryCategory || s.category || 'General',
        store_address_line1: s.storeAddressLine1 || s.address || 'Sultanpur',
        city: s.city || 'Sultanpur',
        state: s.state || 'Uttar Pradesh',
        pincode: s.pincode || '228001',
        aadhaar_number: s.aadhaarNumber || '000000000000',
        pan_number: s.panNumber || 'ABCDE1234F',
        bank_account_holder_name: s.bankAccountHolderName || s.businessOwnerName || s.name || 'Vendor Owner',
        bank_name: s.bankName || 'HDFC Bank',
        account_number: s.accountNumber || '0000000000',
        ifsc_code: s.ifscCode || 'HDFC0000001',
        status: payloadStatus
      };

      const isUUID = typeof s.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s.id);

      let existingId: string | null = null;
      if (isUUID) {
        existingId = s.id;
      } else if (payload.email) {
        const { data: existingByEmail, error: findErr1 } = await supabase.from('vendors').select('id').eq('email', payload.email).limit(1);
        if (findErr1 && isAuthOrApiKeyError(findErr1)) {
          clearSupabaseCache();
        }
        if (existingByEmail && existingByEmail.length > 0) {
          existingId = existingByEmail[0].id;
        }
      } else if (payload.mobile_number) {
        const { data: existingByPhone, error: findErr2 } = await supabase.from('vendors').select('id').eq('mobile_number', payload.mobile_number).limit(1);
        if (findErr2 && isAuthOrApiKeyError(findErr2)) {
          clearSupabaseCache();
        }
        if (existingByPhone && existingByPhone.length > 0) {
          existingId = existingByPhone[0].id;
        }
      }

      if (existingId) {
        const { error } = await supabase.from('vendors').update(payload).eq('id', existingId);
        if (error) {
          if (isAuthOrApiKeyError(error)) {
            clearSupabaseCache();
          } else {
            console.warn('Supabase update vendor notice:', error.message);
          }
        }
      } else {
        const { data, error } = await supabase.from('vendors').insert(payload).select();
        if (error) {
          if (isAuthOrApiKeyError(error)) {
            clearSupabaseCache();
          } else {
            console.warn('Supabase insert vendor notice:', error.message);
          }
        } else if (data && data[0]) {
          const realId = data[0].id;
          const currentList = this.getSellers();
          const updated = currentList.map(item => String(item.id) === String(s.id) ? { ...item, id: realId } : item);
          this.saveSellers(updated);
        }
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) {
        console.error('Failed to save vendor to Supabase:', err);
      }
    }
  },

  async syncOrdersFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase.from('pos_orders').select('*').order('created_at', { ascending: false });
      if (error) {
        if (!isAuthOrApiKeyError(error)) console.warn('Supabase fetch orders error:', error.message);
        return;
      }
      if (data && data.length > 0) {
        const mapped: Order[] = data.map((o: any) => ({
          id: o.order_number || o.id,
          date: o.created_at ? new Date(o.created_at).toLocaleString() : new Date().toLocaleString(),
          customer: o.customer_name || 'Walk-in Customer',
          store: o.store_name || 'Main Store Counter',
          amount: o.total_amount !== null && o.total_amount !== undefined ? `₹${o.total_amount}` : '₹0',
          status: o.status || 'Confirmed',
          phone: o.phone_number || '',
          discountAmount: o.discount_amount ? `₹${o.discount_amount}` : '',
          discountReason: o.discount_reason || ''
        }));
        setStored('orders', mapped);
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to sync orders from Supabase:', err);
    }
  },

  async saveOrderToSupabase(order: Order): Promise<void> {
    try {
      const numAmt = parseFloat(String(order.amount || '').replace(/[^0-9.]/g, '')) || 0;
      const numDiscount = parseFloat(String(order.discountAmount || '').replace(/[^0-9.]/g, '')) || 0;

      const payload: any = {
        order_number: order.id,
        customer_name: order.customer,
        phone_number: order.phone || null,
        store_name: order.store,
        subtotal: numAmt + numDiscount,
        tax_amount: Number((order as any).tax) || 0,
        total_amount: numAmt,
        discount_amount: numDiscount,
        discount_reason: order.discountReason || null,
        status: order.status || 'Confirmed'
      };

      const { error } = await supabase.from('pos_orders').upsert(payload, { onConflict: 'order_number' });
      if (error && !isAuthOrApiKeyError(error)) {
        console.error('Supabase save order error:', error.message);
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to save order to Supabase:', err);
    }
  },

  async syncCustomersFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) {
        if (!isAuthOrApiKeyError(error)) console.warn('Supabase fetch customers error:', error.message);
        return;
      }
      if (data && data.length > 0) {
        const mapped: any[] = data.map((c: any) => ({
          id: c.id,
          name: c.full_name || 'Customer',
          email: c.email || '',
          phone: c.mobile_number || '',
          address: c.street_area || [c.house_flat_no, c.landmark, c.city].filter(Boolean).join(', ') || '',
          orders: 0,
          walletBalance: Number(c.wallet_balance) || 0,
          referralCode: c.referral_code || '',
          status: 'Active'
        }));

        const currentLocal = getStored<any[]>('customers', []);
        const byKey = new Map<string, any>();

        // Populate from Supabase
        for (const item of mapped) {
          const key = (item.email || item.phone || item.id).toLowerCase();
          byKey.set(key, item);
        }
        // Also keep local ones not yet synced
        for (const item of currentLocal) {
          const key = (item.email || item.phone || item.id).toLowerCase();
          if (!byKey.has(key)) {
            byKey.set(key, item);
          }
        }

        const merged = Array.from(byKey.values());
        setStored('customers', merged);
        this.dispatchAllEvents();
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.error('Failed to sync customers from Supabase:', err);
    }
  },

  async saveCustomerToSupabase(customer: any): Promise<void> {
    try {
      const payload: any = {
        full_name: customer.name || 'Customer',
        mobile_number: customer.phone || '',
        email: customer.email || `${customer.id || Date.now()}@customer.local`,
        password_hash: customer.password_hash || customer.password || 'customer_pass_default',
        street_area: customer.address || '',
        wallet_balance: Number(customer.walletBalance) || 0,
        referral_code: customer.referralCode || ''
      };

      const isUUID = typeof customer.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(customer.id);
      
      let existingId: string | null = null;
      if (isUUID) {
        existingId = customer.id;
      } else if (payload.email) {
        const { data: existing } = await supabase.from('customers').select('id').eq('email', payload.email).limit(1);
        if (existing && existing.length > 0) {
          existingId = existing[0].id;
        }
      }

      if (existingId) {
        const { error } = await supabase.from('customers').update(payload).eq('id', existingId);
        if (error && !isAuthOrApiKeyError(error)) {
          console.warn('Supabase update customer info:', error.message);
        }
      } else {
        const { data, error } = await supabase.from('customers').insert(payload).select();
        if (error && !isAuthOrApiKeyError(error)) {
          console.warn('Supabase insert customer info:', error.message);
        } else if (data && data[0]) {
          const realId = data[0].id;
          const currentList = this.getCustomers();
          const updated = currentList.map(c => String(c.id) === String(customer.id) ? { ...c, id: realId } : c);
          this.saveCustomers(updated);
        }
      }
    } catch (err) {
      if (!isAuthOrApiKeyError(err)) console.warn('Failed to save customer to Supabase:', err);
    }
  },

  async pushLocalDataToSupabase(): Promise<void> {
    const products = this.getProducts();
    for (const product of products) {
      await this.saveProductToSupabase(product);
    }
    const partners = this.getDeliveryPartners();
    for (const partner of partners) {
      await this.saveDeliveryPartnerToSupabase(partner);
    }
    const coupons = this.getCoupons();
    for (const coupon of coupons) {
      await this.saveCouponToSupabase(coupon);
    }
    const categories = this.getCategories();
    for (const cat of categories) {
      await this.saveCategoryToSupabase(cat);
    }
    const brands = this.getBrands();
    for (const brand of brands) {
      await this.saveBrandToSupabase(brand);
    }
    const sellers = this.getSellers();
    for (const seller of sellers) {
      await this.saveVendorToSupabase(seller);
    }
    const customers = this.getCustomers();
    for (const cust of customers) {
      await this.saveCustomerToSupabase(cust);
    }
  },

  async syncAllFromSupabase(): Promise<void> {
    await Promise.all([
      this.syncProductsFromSupabase(),
      this.syncDeliveryPartnersFromSupabase(),
      this.syncCouponsFromSupabase(),
      this.syncCategoriesFromSupabase(),
      this.syncBrandsFromSupabase(),
      this.syncVendorsFromSupabase(),
      this.syncOrdersFromSupabase(),
      this.syncCustomersFromSupabase()
    ]);
    await this.pushLocalDataToSupabase();
    this.dispatchAllEvents();
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
      image: category.image || '',
      iconName: category.iconName || 'Tv',
      status: category.status || 'Active',
      count: category.count || 0
    };
    list.unshift(newCat);
    this.saveCategories(list);
    this.saveCategoryToSupabase(newCat).catch(err => console.warn(err));
    return newCat;
  },
  deleteCategory(id: string): void {
    const list = this.getCategories();
    const filtered = list.filter(c => String(c.id) !== String(id));
    this.saveCategories(filtered);
    this.deleteCategoryFromSupabase(id).catch(err => console.warn(err));
  },
  updateCategory(id: string, updatedFields: Partial<any>): any {
    const list = this.getCategories();
    const index = list.findIndex(c => String(c.id) === String(id));
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveCategories(list);
      this.saveCategoryToSupabase(list[index]).catch(err => console.warn(err));
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
      image: subcategory.image || '',
      status: subcategory.status || 'Active',
      count: subcategory.count || 0
    };
    list.unshift(newSubcat);
    this.saveSubcategories(list);
    return newSubcat;
  },
  deleteSubcategory(id: string): void {
    const list = this.getSubcategories();
    const filtered = list.filter(sc => String(sc.id) !== String(id));
    this.saveSubcategories(filtered);
  },
  updateSubcategory(id: string, updatedFields: Partial<any>): any {
    const list = this.getSubcategories();
    const index = list.findIndex(sc => String(sc.id) === String(id));
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveSubcategories(list);
      return list[index];
    }
    return null;
  },

  // ATTRIBUTES & VARIANTS PERSISTENCE
  getAttributes(): any[] {
    return getStored('attributes', []);
  },
  saveAttributes(list: any[]): void {
    setStored('attributes', list);
  },

  getVariants(): any[] {
    return getStored('variants', []);
  },
  saveVariants(list: any[]): void {
    setStored('variants', list);
  },

  getCustomers(): any[] {
    const list = getStored('customers', INITIAL_CUSTOMERS);
    const MOCK_CUST_EMAILS = ['alok@example.com', 'vikas@example.com', 'priya@example.com'];
    const cleanList = list.filter(c => c.email && !MOCK_CUST_EMAILS.includes(c.email.toLowerCase()));
    if (cleanList.length !== list.length) {
      this.saveCustomers(cleanList);
      return cleanList;
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
    this.saveCustomerToSupabase(newCustomer).catch(err => console.warn('Customer bg save error:', err));
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
    return getStored('referralsList', []);
  },
  saveReferralsList(list: any[]): void {
    setStored('referralsList', list);
  },

  // VENDOR REGISTRATIONS
  getVendorRegistrations(): VendorRegistration[] {
    const list = getStored('vendorRegistrations', INITIAL_VENDOR_REGISTRATIONS);
    const MOCK_EMAILS = ['alok@citysquare.com', 'ravi@siliconvalley.com', 'suhani@freshorganic.com', 'amit@groceryhub.com'];
    const cleanList = list.filter(v => v.email && !MOCK_EMAILS.includes(v.email.toLowerCase()));
    if (cleanList.length !== list.length) {
      this.saveVendorRegistrations(cleanList);
      return cleanList;
    }
    return list;
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
      password: reg.password || '',
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

    // Also automatically create/update a customer entry so account is registered as User & Vendor
    this.addCustomer({
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address || `${item.city || 'Sultanpur'}, India`
    });

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
    return getStored('walletTransactions', []);
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

  processReferralCode(
    referralCode: string,
    newEntityName: string,
    newEntityPhone: string,
    isVendor: boolean = false,
    newEntityId?: string
  ): { success: boolean; message: string; referrerName?: string } {
    const codeClean = (referralCode || '').trim().toUpperCase();
    if (!codeClean) return { success: false, message: 'Please enter a valid referral code.' };

    const customers = this.getCustomers();
    const sellers = this.getSellers();
    const vendorRegs = this.getVendorRegistrations();

    // Find referrer in Customers or Sellers or Vendor Registrations
    const referrerCust = customers.find(c => c.referralCode && c.referralCode.toUpperCase() === codeClean);
    const referrerSeller = sellers.find(s => s.referralCode && s.referralCode.toUpperCase() === codeClean);
    const referrerReg = vendorRegs.find(v => (v as any).referralCode && (v as any).referralCode.toUpperCase() === codeClean);

    const referrerName = referrerCust?.name || referrerSeller?.storeName || referrerSeller?.name || referrerReg?.businessName || referrerReg?.name;
    const referrerPhone = referrerCust?.phone || referrerSeller?.phone || referrerReg?.phone || '';
    const referrerId = referrerCust?.id || referrerSeller?.id || referrerReg?.id || 'REF-X';
    const referrerRole = referrerSeller || referrerReg ? 'Vendor' : 'User';

    if (!referrerName) {
      return { success: false, message: `Referral code "${codeClean}" is invalid or not found.` };
    }

    const referrerCleanPhone = (referrerPhone || '').replace(/\D/g, '');
    const newCleanPhone = (newEntityPhone || '').replace(/\D/g, '');
    if (referrerCleanPhone.length > 5 && newCleanPhone.length > 5 && referrerCleanPhone.endsWith(newCleanPhone.slice(-10))) {
      return { success: false, message: 'You cannot use your own referral code.' };
    }

    const config = this.getReferralConfig();
    const referrerReward = Number(config.referrerAmount) || 200;
    const refereeReward = Number(config.refereeAmount) || 200;

    // 1. Credit Referrer
    if (referrerRole === 'Vendor' || referrerSeller) {
      this.creditSellerWallet(referrerId || referrerName, referrerReward, `Referral Reward for inviting ${newEntityName || 'a new merchant/user'}`);
      this.creditCustomerWallet(referrerName, referrerPhone, referrerReward, `Referral Reward for inviting ${newEntityName || 'a new merchant/user'}`);
    } else {
      this.creditCustomerWallet(referrerName, referrerPhone, referrerReward, `Referral Reward for inviting ${newEntityName || 'a new merchant/user'}`);
    }

    // 2. Credit Referee (the newly created User or Seller/Vendor)
    if (isVendor) {
      this.creditSellerWallet(newEntityId || newEntityName || newEntityPhone, refereeReward, `Vendor Referral Bonus for signing up with code ${codeClean}`);
      this.creditCustomerWallet(newEntityName, newEntityPhone, refereeReward, `Vendor Signup Bonus with code ${codeClean}`);
    } else {
      this.creditCustomerWallet(newEntityName, newEntityPhone, refereeReward, `Referral Bonus for signing up with code ${codeClean}`);
    }

    // 3. Log in referrals list
    const referrals = this.getReferralsList();
    const refereeCustomer = this.getOrCreateCustomer(newEntityName, newEntityPhone);

    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    referrals.unshift({
      id: `REF-${Math.floor(100 + Math.random() * 899)}`,
      referrerRole: referrerRole,
      referrerId: referrerId,
      referrerName: referrerName,
      referrerPhone: referrerPhone,
      refereeRole: isVendor ? 'Vendor' : 'User',
      refereeId: newEntityId || refereeCustomer.id,
      refereeName: newEntityName,
      refereePhone: newEntityPhone,
      date: todayStr,
      status: 'Completed',
      earned: `₹${(referrerReward + refereeReward).toFixed(2)}`
    });
    this.saveReferralsList(referrals);
    this.dispatchAllEvents();

    return {
      success: true,
      message: `🎉 Referral code applied! ₹${refereeReward} bonus credited to your wallet! (${referrerName} also received ₹${referrerReward})`,
      referrerName: referrerName
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
      logo: brand.logo || '',
      count: brand.count || 0
    };
    list.unshift(item);
    this.saveBrands(list);
    this.saveBrandToSupabase(item).catch(err => {
      if (!isAuthOrApiKeyError(err)) console.warn('Brand bg save error:', err);
    });
    return item;
  },
  updateBrand(id: string, updatedFields: Partial<Brand>): Brand | null {
    const list = this.getBrands();
    const index = list.findIndex(b => String(b.id) === String(id));
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveBrands(list);
      this.saveBrandToSupabase(list[index]).catch(err => {
        if (!isAuthOrApiKeyError(err)) console.warn('Brand bg update error:', err);
      });
      return list[index];
    }
    return null;
  },
  deleteBrand(id: string): void {
    const list = this.getBrands();
    const filtered = list.filter(b => String(b.id) !== String(id));
    this.saveBrands(filtered);
    this.deleteBrandFromSupabase(id).catch(err => {
      if (!isAuthOrApiKeyError(err)) console.warn('Brand bg delete error:', err);
    });
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
    const index = list.findIndex(t => String(t.id) === String(id));
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveTaxRules(list);
      return list[index];
    }
    return null;
  },
  deleteTaxRule(id: string): void {
    const list = this.getTaxRules();
    const filtered = list.filter(t => String(t.id) !== String(id));
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
    const index = list.findIndex(w => String(w.id) === String(id));
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveWarehouses(list);
      return list[index];
    }
    return null;
  },
  deleteWarehouse(id: string): void {
    const list = this.getWarehouses();
    const filtered = list.filter(w => String(w.id) !== String(id));
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
  if (localStorage.getItem('initialCleanSlateApplied_v4') !== 'true') {
    const defaultCleanKeys = [
      'products', 'orders', 'sellers', 'coupons', 'deliveryPartners',
      'categories', 'subcategories', 'withdrawals', 'customers',
      'globalInventory', 'transactions', 'walletTransactions', 'vendorRegistrations', 'brands', 'warehouses'
    ];
    defaultCleanKeys.forEach(k => {
      localStorage.setItem(k, JSON.stringify([]));
    });
    localStorage.setItem('initialCleanSlateApplied_v4', 'true');
  }
}


