export type PromotionStatus = 'draft' | 'pending' | 'published' | 'expired' | 'rejected';
export type UserRole = 'admin' | 'user';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  business_id?: string;
  business_name?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  city_name?: string;
  is_verified?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface City {
  id: string;
  name: string;
  department: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_percentage?: number;
  original_price?: number;
  offer_price?: number;
  image_url?: string;
  status: PromotionStatus;
  business_id: string;
  business_name?: string;
  category_id?: string;
  category_name?: string;
  city_name?: string;
  start_date?: string;
  end_date?: string;
  coupon_code?: string;
  views_count?: number;
  created_at: string;
}

export interface GoogleAdsConfig {
  enabled: boolean;
  client_id: string;
  hero_slot: string;
  sidebar_slot: string;
  infeed_slot: string;
  footer_slot: string;
  auto_ads: boolean;
  estimated_revenue: number;
  impressions: number;
  clicks: number;
}
