// 1. Types de base (@types/models.ts)
export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    discount_price?: number;
    images: string[];
    coverImage: string;
    category_id: number;
    category: Category[];
    in_stock: boolean;
    stock_quantity: number;
    has_unlimited_stock: boolean,
    declination: Declination[];
    currency: Currency;
    created_at: string;
    updated_at: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    description?: string;
    images?: [];
    coverImage?: string;
    parent_id?: number;
  }
  
  export interface ProductAttribute {
    id: number;
    name: string;
    value: string;
  }
  
  export interface CartItem {
    id: number;
    product_id: number;
    product: Product;
    quantity: number;
    selected_attributes?: Record<string, string>;
  }
  
  export interface Order {
    id: number;
    user_id: number;
    items: OrderItem[];
    status: OrderStatus;
    shipping_address: Address;
    billing_address: Address;
    payment_method: PaymentMethod;
    total_amount: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface OrderItem {
    id: number;
    product_id: number;
    product: Product;
    quantity: number;
    price: number;
    selected_attributes?: Record<string, string>;
  }
  
  export interface Currency{
    iso_code : string;
    symbol: string;
    name: string;
    country: string;
    exchange_rate: number;
  }

  export interface Declination{
    price: number;
    quantity: number;
    sku: string;
    declination_images?: [];
    value : Values[];
  }

  export interface Values{
    id: number;
    value: string;
    color?: string;
  }

  export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
  }
  
  export interface Address {
    id?: number;
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
    is_default?: boolean;
  }
  
  export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    PAYPAL = 'paypal',
    APPLE_PAY = 'apple_pay',
    GOOGLE_PAY = 'google_pay',
  }
  
  // 2. Types API (@types/api.ts)
  export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }
  
  export interface SocialLoginRequest {
    provider: 'google' | 'apple' | 'facebook';
    token: string;
    userData?: {
      name?: string;
      email?: string;
    };
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }

  export interface Review{
    
  }