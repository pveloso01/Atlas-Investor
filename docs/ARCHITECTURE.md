# System Architecture

This document describes the architecture of the Atlas Investor platform.

## High-Level Architecture

```
┌───────────────────────────────────────────────────────┐
│                      Frontend (React)                 │
│  ┌────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  │
│  │  Map   │  │ Property │  │ Analysis │  │ Reports │  │
│  │  View  │  │  List    │  │  Panel   │  │         │  │
│  └────────┘  └──────────┘  └──────────┘  └─────────┘  │
└───────────────────────────┬───────────────────────────┘
                            │ REST API (HTTPS)
┌───────────────────────────┴─────────────────────────────┐
│                    Backend (Django REST)                │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌───────────┐  │
│  │ Property │  │ Analysis │  │  User  │  │   Data    │  │
│  │   API    │  │ Engine   │  │  Auth  │  │ Ingestion │  │
│  └──────────┘  └──────────┘  └────────┘  └───────────┘  │
└───────────┬───────────────┬───────────────┬─────────────┘
            │               │               │
    ┌───────┴───────┐  ┌────┴────┐    ┌─────┴─────┐
    │  PostgreSQL   │  │  Redis  │    │  Celery   │
    │   + PostGIS   │  │  Cache  │    │  Workers  │
    └───────────────┘  └─────────┘    └───────────┘
            │
    ┌───────┴─────────────────────────────────────┐
    │         External Data Sources               │
    │  ┌───────────┐  ┌─────────┐  ┌───────────┐  │
    │  │ Idealista │  │   INE   │  │ Municipal │  │
    │  │    API    │  │   API   │  │    Data   │  │
    │  └───────────┘  └─────────┘  └───────────┘  │
    └─────────────────────────────────────────────┘
```

## Component Overview

### Frontend Layer

**Technology**: Next.js 15+ with TypeScript and App Router

**Responsibilities:**
- User interface and user experience
- Data visualization (maps, charts, tables)
- Client-side state management
- API communication
- Form validation and user input

**Key Components:**
- **Map View**: Interactive map with property markers and heatmaps
- **Property List**: Grid/list view of properties with filters
- **Analysis Panel**: Investment analysis and metrics display
- **Reports**: Report generation and export

**State Management:**
- Redux Toolkit for global state
- RTK Query for API data fetching and caching
- Local component state for UI-only concerns

### Backend Layer

**Technology**: Django 4.2+ with Django REST Framework

**Responsibilities:**
- Business logic and calculations
- Data validation and processing
- API endpoints
- Authentication and authorization
- Data ingestion and transformation

**Key Modules:**

#### Property API
- CRUD operations for properties
- Filtering and search
- Pagination
- Property detail retrieval

#### Analysis Engine
- Financial calculations (ROI, yield, cash flow)
- Multi-strategy analysis (rental, flip, development)
- Scoring and ranking algorithms
- Comparison logic

#### User Auth
- User registration and login
- JWT token management
- Password reset
- Email verification

#### Data Ingestion
- Fetching from external APIs (Idealista, INE)
- Data normalization and cleaning
- Geocoding addresses
- Scheduled updates via Celery

### Data Layer

#### PostgreSQL + PostGIS

**Primary Database:**
- Property listings
- User accounts and saved properties
- Regional statistics
- Analysis results (cached)
- Zoning data (spatial)

**Key Tables:**
- `properties`: Property listings with geospatial data
- `regions`: Regional statistics and averages
- `users`: User accounts (Django auth)
- `saved_properties`: User's saved properties
- `zoning_data`: Municipal zoning polygons (PostGIS)
- `analysis_results`: Cached analysis calculations

**PostGIS Usage:**
- Store property coordinates (Point geometry)
- Store zoning polygons (Polygon geometry)
- Spatial queries: point-in-polygon for zoning lookup
- Distance calculations
- Spatial indexing for performance

#### Redis

**Caching:**
- API response caching
- Analysis result caching
- Session storage
- Rate limiting data

**Celery Broker:**
- Task queue for async processing
- Scheduled task coordination

### External Services

#### Idealista API
- Property listings
- Real-time property data
- Location and pricing information

#### INE (Statistics Portugal) API
- Regional price statistics
- Rental market data
- Economic indicators
- Historical data

#### Municipal Open Data
- PDM (Plano Diretor Municipal) shapefiles
- Zoning classifications
- Development rules
- Planning information

## Data Flow

### Property Search Flow

```
User → Frontend → API Request → Backend → Database Query
                                    ↓
                              Redis Cache Check
                                    ↓
                              Return Results → Frontend → Display
```

### Analysis Flow

```
User Input → Frontend → API Request → Backend Analysis Engine
                                            ↓
                                    Check Redis Cache
                                            ↓
                                    If not cached:
                                    - Fetch property data
                                    - Fetch regional averages
                                    - Perform calculations
                                    - Cache results
                                            ↓
                                    Return Analysis → Frontend → Display
```

### Data Ingestion Flow

```
Celery Scheduled Task → Fetch from External API
                            ↓
                    Normalize & Validate Data
                            ↓
                    Geocode Addresses
                            ↓
                    Store in PostgreSQL
                            ↓
                    Invalidate Relevant Caches
```

## Security Architecture

### Authentication
- JWT tokens for stateless authentication
- Token refresh mechanism
- Secure password hashing (Django's PBKDF2)

### Authorization
- Role-based access control (future)
- API endpoint permissions
- User data isolation

### Data Protection
- HTTPS for all communications
- Input validation and sanitization
- SQL injection prevention (Django ORM)
- XSS prevention (React's built-in escaping)
- CSRF protection (Django middleware)

### API Security
- Rate limiting
- API key authentication for external services
- CORS configuration
- Request validation

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (can run multiple instances)
- Load balancer for request distribution
- Database read replicas
- Redis cluster for distributed caching

### Vertical Scaling
- Database connection pooling
- Query optimization and indexing
- Caching strategy
- CDN for static assets

### Future Microservices (Optional)
- Separate data ingestion service
- Separate analysis service
- Separate reporting service
- Message queue for inter-service communication

## Deployment Architecture

### Development
- Docker Compose for local services
- Hot reload for development
- Local database and cache

### Staging
- Single server deployment
- Mirrors production setup
- Used for testing

### Production (Initial)
- Single application server
- Managed PostgreSQL (RDS/DigitalOcean)
- Managed Redis
- CDN for frontend assets
- SSL certificates

### Production (Scaled)
- Multiple application servers
- Load balancer
- Database read replicas
- Redis cluster
- Auto-scaling groups
- Monitoring and alerting

## Technology Integration Points

### Frontend ↔ Backend
- REST API over HTTPS
- JSON data format
- JWT authentication headers

### Backend ↔ Database
- Django ORM for queries
- PostGIS for spatial queries
- Connection pooling

### Backend ↔ Cache
- Redis client library
- Cache key naming conventions
- TTL management

### Backend ↔ External APIs
- HTTP clients (requests library)
- API key management
- Error handling and retries
- Rate limiting compliance

### Celery ↔ Backend
- Shared Django models
- Task serialization
- Result backend (Redis)

## Monitoring and Observability

### Application Monitoring
- Sentry for error tracking
- Application logs (structured logging)
- Performance metrics

### Infrastructure Monitoring
- Prometheus for metrics collection
- Grafana for visualization
- Database monitoring
- Cache hit rates

### Business Metrics
- User activity tracking
- Feature usage analytics
- API usage statistics
- Data quality metrics

## Future Enhancements

### Real-time Features
- WebSocket support for live updates
- Real-time property alerts
- Live collaboration features

### Machine Learning
- Price prediction models
- Rent estimation models
- Recommendation engine
- Anomaly detection

### Mobile App
- React Native application
- Shared backend API
- Offline capabilities

### Advanced Analytics
- Data warehouse for historical analysis
- ETL pipelines for data transformation
- Business intelligence dashboards

