# Implementation Roadmap

This document outlines the phased development plan for Atlas Investor.

## Overview

The development is organized into 4 phases over 32 weeks, assuming ~20 hours/week of development time. The timeline can be adjusted based on available resources.

## Current Status

**Last Updated**: 2025-11-28

**Phase 1 - Week 1-2: Project Setup & Infrastructure** ✅ **COMPLETED**
- All project initialization tasks completed
- Database models created (Property, Region, User, SavedProperty)
- Backend API foundation with Djoser authentication
- Frontend foundation with Next.js, Redux, Material-UI, and Tailwind CSS
- Conditional PostGIS support with SQLite fallback for development

**Next Steps**: Week 3-4 - Data Ingestion & Property Display

## Phase 1: Foundation & MVP (Weeks 1-8)

### Goal
Build a working prototype that demonstrates core value: property search, basic analysis, and map visualization.

### Week 1-2: Project Setup & Infrastructure

#### Tasks
1. **Project Initialization**
   - [x] Initialize Django project with REST framework
   - [x] Set up Next.js app with TypeScript and App Router
   - [x] Configure Docker and Docker Compose
   - [x] Set up Git repository structure
   - [x] Configure development environment (VS Code settings, .env files)

2. **Database Setup**
   - [x] Install and configure PostgreSQL with PostGIS (conditional support with SQLite fallback)
   - [x] Create initial database schema:
     - [x] `Property` model (id, address, coordinates, price, size, type, region, raw_data JSON)
     - [x] `Region` model (name, code, avg_price_per_sqm, avg_rent, yield)
     - [x] `User` model (custom User model extending AbstractUser with email as username)
     - [x] `SavedProperty` model (user, property, notes, created_at)
   - [x] Set up database migrations
   - [ ] Create initial seed data (2-3 sample properties for testing)

3. **Backend Foundation**
   - [x] Set up Django REST Framework
   - [x] Create basic API endpoints:
     - [x] `GET /api/properties/` (list with filters)
     - [x] `GET /api/properties/{id}/` (detail via ViewSet)
     - [x] `POST /api/auth/register/` (via Djoser)
     - [x] `POST /api/auth/login/` (via Djoser)
   - [x] Configure CORS for frontend
   - [x] Set up basic authentication (JWT tokens via Djoser)

4. **Frontend Foundation**
   - [x] Set up Next.js app structure (components, app router pages)
   - [x] Configure Redux store for Next.js
   - [x] Set up API service layer (RTK Query)
   - [x] Create basic routing (Next.js App Router)
   - [x] Set up Material-UI theme

**Deliverable**: Working development environment with basic API and frontend skeleton ✅ **COMPLETED**

---

### Week 3-4: Data Ingestion & Property Display

#### Tasks
1. **Data Acquisition Setup**
   - [ ] Research and document Idealista API access requirements
   - [ ] Create manual sample dataset (10-20 properties from Lisbon/Porto)
   - [ ] Set up data models for storing listings
   - [ ] Create management command to import sample data

2. **Property Data Pipeline**
   - [ ] Create `PropertyIngestionService` class
   - [ ] Implement data normalization (price, area, location)
   - [ ] Add data validation and cleaning
   - [ ] Create geocoding service (convert addresses to coordinates)
   - [ ] Store properties in database

3. **Frontend Property Display**
   - [ ] Create PropertyCard component
   - [ ] Create PropertyList page with grid/list view
   - [ ] Implement basic filtering (region, price range, property type)
   - [ ] Add pagination
   - [ ] Create PropertyDetail page/modal

4. **Map Integration**
   - [ ] Set up Mapbox account and API key
   - [ ] Create Map component with Mapbox GL
   - [ ] Display properties as markers on map
   - [ ] Add popup on marker click showing property summary
   - [ ] Implement map controls (zoom, pan, search)

**Deliverable**: Users can browse properties on map and list view with basic filters

---

### Week 5-6: Basic Investment Analysis

#### Tasks
1. **Financial Calculation Engine**
   - [ ] Create `InvestmentAnalysisService` class
   - [ ] Implement rental yield calculations:
     - Gross yield = (annual_rent / purchase_price) * 100
     - Net yield = ((annual_rent - annual_expenses) / purchase_price) * 100
   - [ ] Implement cash flow calculation:
     - Monthly cash flow = monthly_rent - monthly_mortgage - monthly_expenses
   - [ ] Add payback period calculation
   - [ ] Create unit tests for all calculations

2. **Analysis API Endpoints**
   - [ ] `POST /api/properties/{id}/analyze/` endpoint
   - [ ] Accept strategy parameter (rental, flip, development)
   - [ ] Accept user assumptions (rent amount, expenses, financing)
   - [ ] Return JSON with all calculated metrics
   - [ ] Cache results in Redis (5-minute TTL)

3. **Frontend Analysis UI**
   - [ ] Create AnalysisPanel component
   - [ ] Display key metrics (yield, cash flow, ROI)
   - [ ] Add input fields for assumptions (rent, expenses, financing)
   - [ ] Show calculations in real-time as user adjusts inputs
   - [ ] Create simple charts (yield comparison, cash flow over time)

4. **Rental Strategy (Primary Focus)**
   - [ ] Long-term rental analysis
   - [ ] Short-term rental analysis (Airbnb-style)
   - [ ] Comparison view (long-term vs short-term)
   - [ ] Use default assumptions based on region averages

**Deliverable**: Users can analyze properties for rental investment with adjustable assumptions

---

### Week 7-8: User Accounts & Basic Features

#### Tasks
1. **User Authentication**
   - [ ] Complete registration/login flow
   - [ ] Add email verification
   - [ ] Implement password reset
   - [ ] Add user profile page
   - [ ] Secure API endpoints (require authentication where needed)

2. **Save & Compare Features**
   - [ ] Implement save property functionality
   - [ ] Create "My Saved Properties" page
   - [ ] Build comparison table (compare 2-3 properties side-by-side)
   - [ ] Add notes/annotations to saved properties

3. **Basic Reporting**
   - [ ] Create report generation service
   - [ ] Generate PDF report with property details and analysis
   - [ ] Include charts and key metrics
   - [ ] Add download/share functionality

4. **Polish & Testing**
   - [ ] Fix bugs and UI/UX issues
   - [ ] Add loading states and error handling
   - [ ] Write integration tests for critical flows
   - [ ] Performance optimization (lazy loading, code splitting)
   - [ ] Responsive design testing (mobile, tablet, desktop)

**Deliverable**: MVP ready for user testing with core features working

---

## Phase 2: Core Features (Weeks 9-16)

### Goal
Add multi-strategy analysis, regional data integration, and enhanced scoring/ranking.

### Week 9-10: Multi-Strategy Analysis

#### Tasks
1. **Fix-and-Flip Strategy**
   - [ ] Add ARV (After-Repair Value) estimation
   - [ ] Implement renovation cost calculator
   - [ ] Calculate flip profit and ROI
   - [ ] Add 70% rule calculator
   - [ ] Create flip analysis UI component

2. **Development Strategy**
   - [ ] Add land/teardown property type support
   - [ ] Implement development feasibility calculator
   - [ ] Add construction cost estimation
   - [ ] Calculate development ROI and timeline
   - [ ] Create development analysis UI

3. **Commercial/Mixed-Use**
   - [ ] Add commercial property type support
   - [ ] Implement cap rate calculation
   - [ ] Add vacancy rate assumptions
   - [ ] Create commercial analysis UI

4. **Strategy Comparison**
   - [ ] Build strategy comparison view
   - [ ] Show side-by-side metrics for all strategies
   - [ ] Add "Best Strategy" recommendation logic
   - [ ] Visual comparison charts

**Deliverable**: Users can analyze properties using multiple investment strategies

---

### Week 11-12: Regional Data Integration

#### Tasks
1. **INE API Integration**
   - [ ] Research INE API endpoints and data structure
   - [ ] Create `INEDataService` for fetching statistics
   - [ ] Implement data fetching and caching
   - [ ] Store regional statistics in database
   - [ ] Create management command to update INE data (weekly)

2. **Market Context Display**
   - [ ] Show regional averages (price per m², rent, yield)
   - [ ] Compare property metrics to regional averages
   - [ ] Display market trends (price growth, transaction volume)
   - [ ] Add "Above/Below Market" indicators

3. **Regional Heatmaps**
   - [ ] Calculate average metrics per region
   - [ ] Create heatmap layer for yield
   - [ ] Create heatmap layer for price growth
   - [ ] Add toggle between different heatmap views
   - [ ] Implement color-coding (green = good, red = poor)

4. **Location Scoring**
   - [ ] Implement location score algorithm
   - [ ] Factor in: yield, price growth, demand indicators
   - [ ] Display location score on property cards
   - [ ] Add location score to overall investment score

**Deliverable**: Properties show market context and regional comparisons

---

### Week 13-14: Advanced Scoring & Ranking

#### Tasks
1. **Investment Scoring Algorithm**
   - [ ] Design scoring formula (weighted combination of metrics)
   - [ ] Implement base scoring:
     - 40% ROI/Return metrics
     - 20% Yield vs mortgage spread
     - 20% Location score
     - 10% Liquidity
     - 10% Risk factors
   - [ ] Make weights configurable per user
   - [ ] Add letter grades (A, B, C, D, F)

2. **Property Ranking**
   - [ ] Implement sorting by score
   - [ ] Add multiple sort options (score, yield, price, ROI)
   - [ ] Create "Top Opportunities" dashboard
   - [ ] Add filters that work with ranking

3. **Risk Assessment**
   - [ ] Identify risk factors (high rehab needed, uncertain zoning, etc.)
   - [ ] Create risk scoring system
   - [ ] Display risk indicators on properties
   - [ ] Add risk warnings in analysis

4. **Advanced Filtering**
   - [ ] Add filter by investment score
   - [ ] Filter by strategy recommendation
   - [ ] Filter by risk level
   - [ ] Save filter presets

**Deliverable**: Properties are scored and ranked, helping users identify best opportunities

---

### Week 15-16: Financing Module

#### Tasks
1. **Financing Calculations**
   - [ ] Add mortgage payment calculator
   - [ ] Implement leverage impact analysis
   - [ ] Calculate levered vs unlevered returns
   - [ ] Add equity buildup over time
   - [ ] Support multiple financing scenarios

2. **Interest Rate Integration**
   - [ ] Research ECB/Banco de Portugal data sources
   - [ ] Create interest rate fetching service
   - [ ] Store current rates in database
   - [ ] Update rates automatically (monthly)

3. **Financing UI**
   - [ ] Create financing input panel
   - [ ] Allow multiple scenarios (20% down, 50% down, etc.)
   - [ ] Show comparison of scenarios
   - [ ] Display cash flow impact of leverage
   - [ ] Add sensitivity analysis (what-if interest rates change)

4. **Tax Considerations**
   - [ ] Research Portuguese tax rules (IMT, IMI, capital gains)
   - [ ] Add tax calculations to ROI
   - [ ] Show tax impact on returns
   - [ ] Add tax optimization suggestions

**Deliverable**: Users can model financing scenarios and see impact on returns

---

## Phase 3: Advanced Features (Weeks 17-24)

### Goal
Add zoning integration, predictive analytics, and enhanced user experience.

### Week 17-18: Zoning & Development Feasibility

#### Tasks
1. **PDM Data Integration**
   - [ ] Research municipal open data portals
   - [ ] Download PDM shapefiles for 2-3 major cities (Lisbon, Porto, Cascais)
   - [ ] Set up PostGIS for spatial queries
   - [ ] Create `ZoningService` for point-in-polygon queries
   - [ ] Store zoning data in database

2. **Zoning Lookup**
   - [ ] Implement property-to-zone lookup
   - [ ] Retrieve zoning classification (urban/rural, residential/commercial)
   - [ ] Extract development rules (height limits, FAR, use restrictions)
   - [ ] Display zoning info on property detail page

3. **Development Feasibility**
   - [ ] Add development feasibility assessment
   - [ ] Check if property allows development
   - [ ] Warn about rural land restrictions
   - [ ] Show permitted building parameters
   - [ ] Add development risk indicators

4. **Zoning UI**
   - [ ] Display zoning overlay on map
   - [ ] Color-code zones by type
   - [ ] Show zoning info in property analysis
   - [ ] Add warnings for restricted zones

**Deliverable**: Properties show zoning information and development feasibility

---

### Week 19-20: Predictive Analytics (Basic)

#### Tasks
1. **Price Prediction Model**
   - [ ] Collect historical price data (INE indices)
   - [ ] Create simple regression model (linear/trend-based)
   - [ ] Predict property value 1-2 years out
   - [ ] Show price appreciation potential
   - [ ] Add confidence intervals

2. **Rent Prediction**
   - [ ] Build rent estimation model based on location and features
   - [ ] Use comparables approach
   - [ ] Estimate rent if not provided
   - [ ] Show rent vs market average

3. **Market Trend Analysis**
   - [ ] Analyze price trends by region
   - [ ] Identify rising/stable/declining markets
   - [ ] Display trend indicators
   - [ ] Add trend to location scoring

4. **Predictive UI**
   - [ ] Show predicted values in analysis
   - [ ] Display trend charts
   - [ ] Add "Future Value" projections
   - [ ] Show appreciation scenarios

**Deliverable**: Platform provides basic price and rent predictions

---

### Week 21-22: Enhanced User Experience

#### Tasks
1. **Advanced Search**
   - [ ] Add full-text search
   - [ ] Implement search by address, neighborhood
   - [ ] Add saved searches
   - [ ] Email alerts for new matches (basic)

2. **Dashboard**
   - [ ] Create user dashboard
   - [ ] Show saved properties summary
   - [ ] Display market overview
   - [ ] Show recent analyses
   - [ ] Add quick stats

3. **Data Visualization**
   - [ ] Enhanced charts (cash flow projections, ROI over time)
   - [ ] Interactive graphs
   - [ ] Export charts as images
   - [ ] Comparison visualizations

4. **Mobile Responsiveness**
   - [ ] Optimize for mobile devices
   - [ ] Touch-friendly map controls
   - [ ] Responsive tables and forms
   - [ ] Mobile navigation

**Deliverable**: Platform is user-friendly and works well on all devices

---

### Week 23-24: Reporting & Export

#### Tasks
1. **Advanced Reports**
   - [ ] Enhanced PDF reports with charts
   - [ ] Executive summary reports
   - [ ] Comparison reports (multiple properties)
   - [ ] Customizable report templates

2. **Data Export**
   - [ ] Export property list to CSV
   - [ ] Export analysis to Excel
   - [ ] Export saved properties
   - [ ] Bulk export functionality

3. **Sharing Features**
   - [ ] Generate shareable report links
   - [ ] Email reports
   - [ ] Print-friendly views
   - [ ] Social sharing (optional)

4. **Documentation**
   - [ ] User guide
   - [ ] FAQ section
   - [ ] Tooltips and help text
   - [ ] Video tutorials (optional)

**Deliverable**: Users can generate professional reports and export data

---

## Phase 4: Polish & Scale (Weeks 25-32)

### Goal
Optimize performance, scale infrastructure, and prepare for production launch.

### Week 25-26: Performance Optimization

#### Tasks
1. **Backend Optimization**
   - [ ] Database query optimization (indexes, select_related)
   - [ ] Implement pagination everywhere
   - [ ] Add database connection pooling
   - [ ] Optimize API response times
   - [ ] Add response compression

2. **Caching Strategy**
   - [ ] Implement Redis caching for expensive queries
   - [ ] Cache analysis results
   - [ ] Cache API responses
   - [ ] Add cache invalidation logic
   - [ ] Monitor cache hit rates

3. **Frontend Optimization**
   - [ ] Code splitting and lazy loading
   - [ ] Image optimization
   - [ ] Bundle size optimization
   - [ ] Implement virtual scrolling for long lists
   - [ ] Add service worker for offline support (basic)
   - [ ] **Evaluate Next.js migration**: Consider migrating to Next.js if SEO, SSR, or performance benefits justify the complexity (see TECHNOLOGY_STACK.md for rationale)

4. **Load Testing**
   - [ ] Set up load testing (Locust, k6)
   - [ ] Test with 1000+ properties
   - [ ] Test concurrent users
   - [ ] Identify bottlenecks
   - [ ] Fix performance issues

**Deliverable**: Platform handles large datasets and many users efficiently

---

### Week 27-28: Scalability & Infrastructure

#### Tasks
1. **Cloud Deployment**
   - [ ] Set up production environment (AWS/DigitalOcean)
   - [ ] Configure production database (RDS/managed Postgres)
   - [ ] Set up Redis in cloud
   - [ ] Configure CDN for static assets
   - [ ] Set up SSL certificates

2. **CI/CD Pipeline**
   - [ ] Set up GitHub Actions
   - [ ] Automated testing on PR
   - [ ] Automated deployment to staging
   - [ ] Production deployment workflow
   - [ ] Rollback procedures

3. **Monitoring & Logging**
   - [ ] Set up error tracking (Sentry)
   - [ ] Configure application monitoring
   - [ ] Set up database monitoring
   - [ ] Create dashboards (Grafana)
   - [ ] Set up alerts

4. **Backup & Recovery**
   - [ ] Automated database backups
   - [ ] Backup retention policy
   - [ ] Test restore procedures
   - [ ] Document disaster recovery plan

**Deliverable**: Production-ready infrastructure with monitoring

---

### Week 29-30: Data Pipeline Enhancement

#### Tasks
1. **Automated Data Updates**
   - [ ] Set up Celery scheduled tasks
   - [ ] Daily property listing updates
   - [ ] Weekly INE data updates
   - [ ] Monthly interest rate updates
   - [ ] Handle API failures gracefully

2. **Data Quality**
   - [ ] Implement data validation rules
   - [ ] Add data quality monitoring
   - [ ] Flag suspicious data
   - [ ] Create data quality reports

3. **Historical Data**
   - [ ] Store historical property data
   - [ ] Track price changes
   - [ ] Track listing duration
   - [ ] Enable historical analysis

4. **Multiple Data Sources**
   - [ ] Integrate additional listing sources (Imovirtual, Casa Sapo)
   - [ ] Deduplicate listings
   - [ ] Merge data from multiple sources
   - [ ] Handle conflicting data

**Deliverable**: Automated, reliable data pipeline with multiple sources

---

### Week 31-32: Final Polish & Launch Prep

#### Tasks
1. **Security Hardening**
   - [ ] Security audit
   - [ ] Implement rate limiting
   - [ ] Add input validation everywhere
   - [ ] SQL injection prevention
   - [ ] XSS prevention
   - [ ] CSRF protection

2. **User Testing**
   - [ ] Beta testing with real users
   - [ ] Collect feedback
   - [ ] Fix critical issues
   - [ ] Improve UX based on feedback

3. **Documentation**
   - [ ] API documentation (Swagger/OpenAPI)
   - [ ] Technical documentation
   - [ ] Deployment guide
   - [ ] User manual

4. **Launch Preparation**
   - [ ] Marketing website/landing page
   - [ ] User onboarding flow
   - [ ] Terms of service & privacy policy
   - [ ] Support channels setup
   - [ ] Launch checklist

**Deliverable**: Production-ready platform ready for public launch

---

## Notes

- This plan assumes ~20 hours/week development time
- Timeline can be adjusted based on available time
- Features can be prioritized/deprioritized based on user feedback
- Some tasks may be done in parallel
- Consider building in public for feedback and portfolio visibility

### Technology Evolution Considerations

**Next.js Evaluation (Phase 4):**
- ✅ **Completed**: Migrated to Next.js for better SEO, performance, and developer experience
- **Consider Next.js if:**
  - SEO becomes important (public property pages, blog content)
  - Server-side rendering would improve performance metrics
  - Built-in routing and optimization features would simplify codebase
- **Next.js Benefits Realized:**
  - Current SPA architecture meets all performance requirements
  - Migration effort outweighs benefits
  - Team is more productive with current stack
- See [TECHNOLOGY_STACK.md](TECHNOLOGY_STACK.md) for detailed comparison and rationale

