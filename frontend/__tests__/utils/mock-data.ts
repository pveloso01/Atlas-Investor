import { Property, Region } from '@/types/property';

export const mockRegion: Region = {
  id: 1,
  name: 'Lisbon',
  code: 'LIS',
  avg_price_per_sqm: 3500,
  avg_rent: 1200,
  avg_yield: 4.1,
};

export const mockProperty: Property = {
  id: 1,
  external_id: 'TEST-001',
  address: 'Rua Teste 123, Lisbon',
  coordinates: [-9.1393, 38.7223],
  description: 'A beautiful apartment in the heart of Lisbon',
  price: '300000',
  size_sqm: '100',
  price_per_sqm: '3000',
  property_type: 'apartment',
  bedrooms: 2,
  bathrooms: '1.5',
  year_built: 2010,
  condition: 'good',
  floor_number: 3,
  total_floors: 5,
  has_elevator: true,
  parking_spaces: 1,
  has_balcony: true,
  has_terrace: false,
  energy_rating: 'C',
  listing_status: 'active',
  source_url: 'https://example.com/property/1',
  images: ['https://example.com/image1.jpg'],
  region: mockRegion,
  region_id: 1,
  raw_data: {
    description: 'Additional property details',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockPropertyWithoutOptional: Property = {
  id: 2,
  address: 'Rua Minimal 456',
  price: '200000',
  size_sqm: '80',
  property_type: 'house',
  created_at: '2024-01-02T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z',
};

export const mockProperties: Property[] = [mockProperty, mockPropertyWithoutOptional];

