export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  priceString?: string;
  mrp?: string | number;
  image: string;
  vendor?: string;
  quantity: number;
}

const CART_STORAGE_KEY = 'wikcart_cart_items';

const INITIAL_CART: CartItem[] = [
  {
    id: 1,
    name: 'Cold Brew Coffee',
    price: 400,
    priceString: '₹400',
    mrp: '₹500',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=200',
    vendor: 'City Square Mart',
    quantity: 1
  },
  {
    id: 3,
    name: 'Organic Brown Sugar',
    price: 120,
    priceString: '₹120',
    mrp: '₹150',
    image: 'https://images.unsplash.com/photo-1581428982868-e410dd447aa4?auto=format&fit=crop&q=80&w=200',
    vendor: 'Fresh Organic Foods',
    quantity: 1
  }
];

export function parsePriceNumber(priceVal: string | number | undefined): number {
  if (typeof priceVal === 'number') return priceVal;
  if (!priceVal) return 0;
  const numStr = String(priceVal).replace(/[^0-9.]/g, '');
  return parseFloat(numStr) || 0;
}

export function getStoredCart(): CartItem[] {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading cart from localStorage', e);
  }
  return INITIAL_CART;
}

export function saveStoredCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('wikcart_cart_updated'));
  } catch (e) {
    console.error('Error saving cart to localStorage', e);
  }
}
