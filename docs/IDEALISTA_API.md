# Idealista API Integration

## Overview

Idealista is the largest real estate portal in Southern Europe, with extensive listings for Portugal. Their API provides programmatic access to property listings data.

## API Access Requirements

### Commercial License
- Idealista API requires a **commercial partnership agreement**
- Access is not publicly available without business verification
- Typically requires company registration and valid business use case
- Contact: api@idealista.com or through their partner portal

### Application Process
1. Submit business inquiry through idealista.com/api
2. Provide company information and intended use case
3. Negotiate API terms and pricing
4. Receive API credentials (client ID and secret)

### Pricing
- Pricing is typically based on:
  - Number of API calls per month
  - Geographic regions accessed
  - Data freshness requirements
  - Commercial vs. non-commercial use

## API Endpoints (Reference)

Once access is granted, typical endpoints include:

### Search Properties
```
POST /oauth/token - Authentication
GET /3.5/pt/search - Search listings
GET /3.5/pt/property/{propertyCode} - Property details
```

### Search Parameters
- `country`: pt (Portugal)
- `operation`: sale, rent
- `propertyType`: homes, premises, garages, etc.
- `center`: latitude,longitude
- `distance`: radius in meters
- `maxItems`: results per page
- `numPage`: pagination
- `maxPrice`, `minPrice`: price filters
- `minSize`, `maxSize`: size filters

### Response Data
- Property code/ID
- Price and currency
- Address and coordinates
- Property type and features
- Photos URLs
- Agent/agency information
- Publication date

## Rate Limits
- Typically 100-1000 requests/day depending on tier
- Rate limiting via X-RateLimit headers
- Exponential backoff recommended for retries

## Alternative Approaches

Given the commercial requirements, consider these alternatives for development:

### 1. Manual Sample Data (Recommended for MVP)
- Create a JSON dataset with 20-50 sample properties
- Manually collect data from public listings
- Include realistic coordinates, prices, and features
- See `backend/data/sample_properties.json`

### 2. Web Scraping (Legal Considerations)
- Check robots.txt and terms of service
- Implement respectful crawling (rate limits, caching)
- May violate terms of service
- Not recommended for production

### 3. Other Data Sources
- **INE (Instituto Nacional de Estatística)**: Official statistics
- **Casa Sapo**: Alternative portal with potential API
- **Imovirtual**: Another major portal
- **Public data portals**: DGPC, Câmara Municipal

## Implementation Strategy

### Phase 1: Development (Current)
Use manual sample dataset for development and testing.

### Phase 2: Beta
Consider web scraping with proper legal review.

### Phase 3: Production
Apply for Idealista API access or establish partnerships with multiple data sources.

## Sample Data Format

See `backend/data/sample_properties.json` for the expected data format:

```json
{
  "properties": [
    {
      "external_id": "IDEAL-12345",
      "address": "Rua Augusta 100, Lisboa",
      "coordinates": [-9.1393, 38.7109],
      "price": 450000,
      "size_sqm": 85,
      "property_type": "apartment",
      "bedrooms": 2,
      "bathrooms": 1,
      "description": "...",
      "images": ["..."],
      "source_url": "https://..."
    }
  ]
}
```

## References

- Idealista API Portal: https://www.idealista.com/developers/
- Idealista API Documentation: https://developers.idealista.com/access-request
- Portuguese Real Estate Market: https://www.ine.pt/

