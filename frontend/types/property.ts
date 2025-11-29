export interface Region {
  id: number;
  name: string;
  code: string;
  avg_price_per_sqm?: number;
  avg_rent?: number;
  avg_yield?: number;
}

export interface Property {
  id: number;
  external_id?: string;
  address: string;
  coordinates?: [number, number]; // [longitude, latitude]
  description?: string;
  price: string;
  size_sqm: string;
  price_per_sqm?: string;
  property_type: 'apartment' | 'house' | 'land' | 'commercial' | 'mixed';
  bedrooms?: number;
  bathrooms?: string;
  year_built?: number;
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'needs_renovation' | 'demolition';
  floor_number?: number;
  total_floors?: number;
  has_elevator?: boolean;
  parking_spaces?: number;
  has_balcony?: boolean;
  has_terrace?: boolean;
  energy_rating?: 'A+' | 'A' | 'B' | 'B-' | 'C' | 'D' | 'E' | 'F' | 'G';
  listing_status?: 'active' | 'sold' | 'pending' | 'withdrawn';
  source_url?: string;
  last_synced_at?: string;
  images?: string[];
  region?: Region;
  region_id?: number;
  raw_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}


