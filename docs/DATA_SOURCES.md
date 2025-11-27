# Data Sources & Integration

This document outlines the data sources for Atlas Investor, their priorities, integration status, and requirements.

## Priority Levels

- **Priority 1 (MVP)**: Essential for minimum viable product
- **Priority 2 (Phase 2+)**: Important for core features
- **Priority 3 (Future)**: Nice-to-have enhancements

## Priority 1: MVP Data Sources

### 1. Idealista API

**Purpose**: Primary source for property listings

**Data Provided:**
- Property listings (residential, commercial, land)
- Location (address, coordinates)
- Price and size information
- Property type and features
- Number of bedrooms/bathrooms
- Property images
- Listing status

**Integration Status**: ⚠️ Requires API access approval

**Requirements:**
- API key/credentials
- Rate limiting compliance
- Commercial use agreement (if applicable)

**Implementation:**
- REST API integration
- Data normalization service
- Daily updates via Celery scheduled tasks
- Error handling for API failures

**Fallback Strategy:**
- Manual sample dataset for initial development
- Web scraping (if API unavailable, with legal compliance)
- Alternative listing sources (Imovirtual, Casa Sapo)

**Data Model:**
```python
Property:
  - external_id (Idealista ID)
  - address
  - coordinates (PostGIS Point)
  - price
  - size_sqm
  - property_type
  - bedrooms
  - bathrooms
  - raw_data (JSON)
  - last_updated
```

---

### 2. Manual Sample Data

**Purpose**: Initial development and testing

**Data Provided:**
- 20-50 sample properties
- Focus on Lisbon and Porto
- Various property types
- Realistic pricing and features

**Integration Status**: ✅ Can create immediately

**Implementation:**
- JSON/CSV files
- Django management command for import
- Seed data fixtures
- Can be replaced once API access is available

**Location**: `backend/data/sample_data/`

---

### 3. INE (Statistics Portugal) Open Data

**Purpose**: Regional market statistics and context

**Data Provided:**
- Regional price statistics (average price per m²)
- Rental market data (average rents)
- Transaction volumes
- Price indices and trends
- Demographics and economic indicators
- Construction permits data

**Integration Status**: ✅ Publicly available

**API Endpoints:**
- INE Open Data Portal: `https://api.ine.pt/`
- JSON/REST API
- No authentication required (public data)

**Implementation:**
- Weekly data updates via Celery
- Store regional statistics in database
- Use for market context and comparisons
- Historical data tracking

**Data Model:**
```python
Region:
  - name
  - code
  - avg_price_per_sqm
  - avg_rent
  - avg_yield
  - price_growth_yoy
  - transaction_volume
  - last_updated
```

**Key Indicators:**
- Housing Price Index by region
- Average rental prices by municipality
- Number of transactions per quarter
- Population growth
- Employment rates

---

## Priority 2: Core Features Data Sources

### 4. Municipal PDM (Plano Diretor Municipal) Data

**Purpose**: Zoning information and development feasibility

**Data Provided:**
- Zoning classifications (urban/rural, residential/commercial)
- Development rules (height limits, FAR, use restrictions)
- Protected areas (REN/RAN)
- Planning boundaries

**Integration Status**: ✅ Available from dados.gov.pt

**Format:**
- Shapefiles (.shp)
- GeoJSON
- KML/KMZ

**Implementation:**
- Download shapefiles for major cities (Lisbon, Porto, Cascais)
- Import into PostGIS database
- Point-in-polygon queries for property zoning lookup
- Display zoning overlays on map

**Cities to Prioritize:**
1. Lisbon
2. Porto
3. Cascais
4. Sintra
5. Braga

**Data Model:**
```python
ZoningData:
  - municipality
  - zone_name
  - zone_type (urban/rural/residential/commercial)
  - geometry (PostGIS Polygon)
  - max_height
  - floor_area_ratio
  - use_restrictions
  - metadata (JSON)
```

**Challenges:**
- Different formats per municipality
- Data quality varies
- Updates may be infrequent
- Requires geospatial expertise

---

### 5. Interest Rate Data

**Purpose**: Current mortgage rates for financing calculations

**Data Sources:**
- European Central Bank (ECB)
- Banco de Portugal
- Euribor rates

**Data Provided:**
- Current mortgage interest rates
- Euribor 12-month rate
- Historical rate trends

**Integration Status**: ✅ Publicly available

**Implementation:**
- Monthly updates via Celery
- Store in database
- Use as default in financing calculations
- Allow manual override by users

**Data Model:**
```python
InterestRate:
  - rate_type (mortgage, euribor_12m)
  - value
  - effective_date
  - source
```

**APIs:**
- ECB Statistical Data Warehouse
- Banco de Portugal statistics
- May require web scraping if no API available

---

## Priority 3: Future Enhancements

### 6. AirDNA API

**Purpose**: Short-term rental (Airbnb) analytics

**Data Provided:**
- Occupancy rates by area
- Average daily rates (ADR)
- Revenue projections
- Seasonal trends
- Market demand indicators

**Integration Status**: ⚠️ Requires subscription

**Cost**: Paid service (pricing varies)

**Implementation:**
- API integration (if available)
- Data for tourist areas (Algarve, Lisbon, Porto)
- Use for short-term rental analysis
- Compare long-term vs short-term rental returns

**Alternative:**
- Manual data collection
- Public Airbnb data (if available)
- User-provided assumptions

---

### 7. Additional Listing Sources

**Sources:**
- Imovirtual (OLX)
- Casa Sapo
- Remax Portugal
- Century 21

**Purpose**: Broader property coverage

**Integration Status**: ⚠️ May require scraping

**Implementation:**
- Web scraping (with legal compliance)
- Data deduplication
- Merge with Idealista data
- Handle conflicting information

**Challenges:**
- Terms of service compliance
- Rate limiting
- Data format variations
- Maintenance burden

---

## Data Integration Architecture

### Data Ingestion Pipeline

```
External API/File
    ↓
Data Fetcher Service
    ↓
Data Normalizer
    ↓
Data Validator
    ↓
Geocoding Service (if needed)
    ↓
Database Storage
    ↓
Cache Invalidation
```

### Services

#### PropertyIngestionService
- Fetches from Idealista API
- Normalizes property data
- Validates required fields
- Geocodes addresses
- Stores in database

#### INEDataService
- Fetches regional statistics
- Parses JSON responses
- Updates regional averages
- Tracks historical trends

#### ZoningService
- Loads PDM shapefiles
- Imports into PostGIS
- Performs spatial queries
- Returns zoning information

#### GeocodingService
- Converts addresses to coordinates
- Uses Google Maps Geocoding API or OpenStreetMap
- Caches results
- Handles address variations

## Data Quality & Validation

### Validation Rules

**Property Data:**
- Price > 0
- Size > 0
- Valid coordinates
- Required fields present
- Data type validation

**Regional Data:**
- Valid date ranges
- Reasonable value ranges
- Consistency checks

**Zoning Data:**
- Valid geometries
- Required attributes present
- Coordinate system validation

### Data Cleaning

- Remove duplicates
- Handle missing values
- Normalize formats (dates, prices, addresses)
- Flag suspicious data
- Data quality reports

### Error Handling

- API failures: Retry with exponential backoff
- Invalid data: Log and skip, notify administrators
- Rate limiting: Queue requests, respect limits
- Network issues: Retry logic, fallback to cached data

## Data Update Schedule

| Data Source | Update Frequency | Method |
|------------|------------------|--------|
| Idealista Listings | Daily | Celery scheduled task |
| INE Statistics | Weekly | Celery scheduled task |
| Interest Rates | Monthly | Celery scheduled task |
| PDM Zoning | Quarterly | Manual update |
| AirDNA (if integrated) | Weekly | API call |

## Data Storage Strategy

### Current Data
- PostgreSQL for active listings
- Fast queries with proper indexing
- Real-time access

### Historical Data
- Keep snapshots of property data
- Track price changes over time
- Enable trend analysis
- Consider data warehouse for large historical datasets

### Cached Data
- Redis for frequently accessed data
- Analysis results cached for 5 minutes
- API responses cached appropriately
- Cache invalidation on data updates

## Data Privacy & Compliance

### GDPR Compliance
- User data protection
- Right to deletion
- Data anonymization for analytics
- Privacy policy

### Data Licensing
- Respect API terms of service
- Attribute data sources
- Commercial use agreements
- Open data licenses (CC, ODbL)

### Data Retention
- User data: As per privacy policy
- Property listings: Active + 90 days
- Historical statistics: Indefinite
- Analysis results: User-dependent

## Monitoring & Alerts

### Data Quality Monitoring
- Track data freshness
- Monitor API health
- Alert on data quality issues
- Report missing data

### Integration Health
- API response times
- Error rates
- Data update success rates
- Cache hit rates

## Future Data Sources (Research)

### Potential Additions
- Land registry data (if available)
- Tax authority transaction data
- Real estate agency data
- Construction cost databases
- Energy efficiency ratings
- Public transport accessibility data
- School ratings and locations
- Crime statistics
- Weather and climate data

### Research Required
- Data availability
- Access methods
- Licensing and costs
- Data quality
- Update frequency
- Integration complexity

