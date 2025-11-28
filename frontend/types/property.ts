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
  price: string;
  size_sqm: string;
  property_type: 'apartment' | 'house' | 'land' | 'commercial' | 'mixed';
  bedrooms?: number;
  bathrooms?: string;
  region?: Region;
  region_id?: number;
  raw_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}


