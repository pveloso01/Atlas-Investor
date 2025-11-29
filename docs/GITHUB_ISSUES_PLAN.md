# GitHub Issues Creation Plan

This document provides a complete structure for creating all GitHub issues for the Atlas Investor project.

## Milestones

Create these milestones first (Settings → Milestones):

1. **Phase 1: Foundation & MVP** (Due: 8 weeks from start)
   - **Description**: Build a working prototype that demonstrates core value: property search, basic analysis, and map visualization. This phase includes data ingestion, property display, basic investment analysis (rental strategy), user accounts, and core features. Deliverable: MVP ready for user testing with core features working.

2. **Phase 2: Core Features** (Due: 16 weeks from start)
   - **Description**: Add multi-strategy analysis (fix-and-flip, development, commercial), regional data integration with INE statistics, advanced scoring and ranking algorithms, and comprehensive financing module with tax considerations. This phase expands the platform's analytical capabilities significantly.

3. **Phase 3: Advanced Features** (Due: 24 weeks from start)
   - **Description**: Add zoning integration with PDM data, predictive analytics for price and rent estimation, enhanced user experience with advanced search and dashboard, comprehensive reporting and export capabilities, and full mobile responsiveness. This phase adds sophisticated features that differentiate the platform.

4. **Phase 4: Polish & Scale** (Due: 32 weeks from start)
   - **Description**: Optimize performance, scale infrastructure for production, enhance data pipeline with automation and multiple sources, conduct security hardening, user testing, and complete documentation. Deliverable: Production-ready platform ready for public launch.

## Size Estimates

Use these size labels (create as labels or use in project custom fields):
- **XS** (1-2 hours) - Small tasks, quick fixes
- **S** (4-8 hours) - Simple features, single component
- **M** (1-2 days) - Medium features, multiple components
- **L** (3-5 days) - Complex features, multiple systems
- **XL** (1-2 weeks) - Major features, full modules

## Issue Structure

### Phase 1: Foundation & MVP

#### Epic 1: Data Ingestion & Property Display (Week 3-4)
**Parent Issue**: `[EPIC] Data Ingestion & Property Display`
- **Labels**: `phase-1`, `epic`, `backend`, `frontend`
- **Size**: XL
- **Milestone**: Phase 1: Foundation & MVP

**Child Issues**:

1. **Research Idealista API access requirements**
   - Labels: `phase-1`, `backend`, `task`, `documentation`
   - Size: S
   - Description: Research and document Idealista API access requirements, authentication, rate limits, data structure

2. **Create manual sample dataset**
   - Labels: `phase-1`, `backend`, `task`
   - Size: S
   - Description: Create manual sample dataset (10-20 properties from Lisbon/Porto) for development and testing

3. **Set up data models for storing listings**
   - Labels: `phase-1`, `backend`, `task`
   - Size: S
   - Description: Extend existing Property model or create new models for storing listing data from external sources

4. **Create management command to import sample data**
   - Labels: `phase-1`, `backend`, `task`
   - Size: M
   - Description: Create Django management command to import sample property data from CSV/JSON files
   - Dependencies: #3

5. **Create PropertyIngestionService class**
   - Labels: `phase-1`, `backend`, `task`
   - Size: M
   - Description: Create service class to handle property data ingestion, normalization, and validation

6. **Implement data normalization**
   - Labels: `phase-1`, `backend`, `task`
   - Size: M
   - Description: Normalize price, area, location data from various sources to consistent format

7. **Add data validation and cleaning**
   - Labels: `phase-1`, `backend`, `task`
   - Size: M
   - Description: Implement validation rules and data cleaning logic for property data

8. **Create geocoding service**
   - Labels: `phase-1`, `backend`, `task`
   - Size: M
   - Description: Service to convert addresses to coordinates using geocoding API

9. **Create PropertyCard component**
   - Labels: `phase-1`, `frontend`, `task`
   - Size: S
   - Description: React component to display property information in card format

10. **Create PropertyList page with grid/list view**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: Page component with grid and list view toggle for displaying properties
    - Dependencies: #9

11. **Implement basic filtering**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: Filter properties by region, price range, property type
    - Dependencies: #10

12. **Add pagination**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: S
    - Description: Implement pagination for property list
    - Dependencies: #10

13. **Create PropertyDetail page/modal**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: Detail view/modal showing full property information
    - Dependencies: #9

14. **Set up Mapbox account and API key**
    - Labels: `phase-1`, `infrastructure`, `task`
    - Size: XS
    - Description: Create Mapbox account and configure API key for map integration

15. **Create Map component with Mapbox GL**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: React component integrating Mapbox GL JS for map display
    - Dependencies: #14

16. **Display properties as markers on map**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: Show properties as markers on the map component
    - Dependencies: #15

17. **Add popup on marker click**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: S
    - Description: Show property summary popup when clicking map markers
    - Dependencies: #16

18. **Implement map controls**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: S
    - Description: Add zoom, pan, and search controls to map
    - Dependencies: #15

#### Epic 2: Basic Investment Analysis (Week 5-6)
**Parent Issue**: `[EPIC] Basic Investment Analysis`
- **Labels**: `phase-1`, `epic`, `backend`, `frontend`
- **Size**: XL
- **Milestone**: Phase 1: Foundation & MVP

**Child Issues**:

19. **Create InvestmentAnalysisService class**
    - Labels: `phase-1`, `backend`, `task`
    - Size: M
    - Description: Service class for investment analysis calculations

20. **Implement rental yield calculations**
    - Labels: `phase-1`, `backend`, `task`
    - Size: M
    - Description: Calculate gross yield and net yield for rental properties
    - Dependencies: #19

21. **Implement cash flow calculation**
    - Labels: `phase-1`, `backend`, `task`
    - Size: M
    - Description: Calculate monthly cash flow (rent - mortgage - expenses)
    - Dependencies: #19

22. **Add payback period calculation**
    - Labels: `phase-1`, `backend`, `task`
    - Size: S
    - Description: Calculate payback period for investments
    - Dependencies: #19

23. **Create unit tests for calculations**
    - Labels: `phase-1`, `backend`, `testing`, `task`
    - Size: M
    - Description: Comprehensive unit tests for all investment calculations
    - Dependencies: #20, #21, #22

24. **Create analysis API endpoint**
    - Labels: `phase-1`, `backend`, `task`
    - Size: M
    - Description: POST /api/properties/{id}/analyze/ endpoint with strategy and assumptions
    - Dependencies: #19

25. **Add Redis caching for analysis results**
    - Labels: `phase-1`, `backend`, `infrastructure`, `task`
    - Size: S
    - Description: Cache analysis results in Redis with 5-minute TTL
    - Dependencies: #24

26. **Create AnalysisPanel component**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: React component displaying investment analysis results

27. **Display key metrics in analysis panel**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: S
    - Description: Show yield, cash flow, ROI in analysis panel
    - Dependencies: #26

28. **Add input fields for assumptions**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: Input fields for rent, expenses, financing assumptions
    - Dependencies: #26

29. **Show real-time calculations**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: Update calculations in real-time as user adjusts inputs
    - Dependencies: #28

30. **Create simple charts**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: Charts for yield comparison and cash flow over time
    - Dependencies: #26

31. **Implement long-term rental analysis**
    - Labels: `phase-1`, `backend`, `task`
    - Size: M
    - Description: Analysis logic for long-term rental strategy
    - Dependencies: #19

32. **Implement short-term rental analysis**
    - Labels: `phase-1`, `backend`, `task`
    - Size: M
    - Description: Analysis logic for short-term rental (Airbnb-style) strategy
    - Dependencies: #19

33. **Create rental strategy comparison view**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: UI to compare long-term vs short-term rental strategies
    - Dependencies: #31, #32

34. **Use default assumptions from region averages**
    - Labels: `phase-1`, `backend`, `task`
    - Size: S
    - Description: Pre-fill assumptions based on regional averages
    - Dependencies: #19

#### Epic 3: User Accounts & Basic Features (Week 7-8)
**Parent Issue**: `[EPIC] User Accounts & Basic Features`
- **Labels**: `phase-1`, `epic`, `backend`, `frontend`
- **Size**: XL
- **Milestone**: Phase 1: Foundation & MVP

**Child Issues**:

35. **Complete registration/login flow**
    - Labels: `phase-1`, `backend`, `frontend`, `task`
    - Size: M
    - Description: Complete user registration and login UI/UX flow

36. **Add email verification**
    - Labels: `phase-1`, `backend`, `task`
    - Size: M
    - Description: Implement email verification for new user registrations
    - Dependencies: #35

37. **Implement password reset**
    - Labels: `phase-1`, `backend`, `frontend`, `task`
    - Size: M
    - Description: Password reset functionality with email link
    - Dependencies: #35

38. **Add user profile page**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: User profile page to view and edit account information
    - Dependencies: #35

39. **Secure API endpoints**
    - Labels: `phase-1`, `backend`, `task`
    - Size: M
    - Description: Add authentication requirements to protected endpoints

40. **Implement save property functionality**
    - Labels: `phase-1`, `backend`, `task`
    - Size: M
    - Description: Backend API for saving properties to user's saved list
    - Dependencies: #39

41. **Create My Saved Properties page**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: Page displaying user's saved properties
    - Dependencies: #40

42. **Build comparison table**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: Side-by-side comparison table for 2-3 properties
    - Dependencies: #41

43. **Add notes/annotations to saved properties**
    - Labels: `phase-1`, `backend`, `frontend`, `task`
    - Size: M
    - Description: Allow users to add notes to saved properties
    - Dependencies: #40

44. **Create report generation service**
    - Labels: `phase-1`, `backend`, `task`
    - Size: L
    - Description: Service to generate PDF reports with property details and analysis

45. **Generate PDF report**
    - Labels: `phase-1`, `backend`, `task`
    - Size: M
    - Description: PDF generation with property details, analysis, and charts
    - Dependencies: #44

46. **Add download/share functionality**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: S
    - Description: UI for downloading and sharing reports
    - Dependencies: #45

47. **Fix bugs and UI/UX issues**
    - Labels: `phase-1`, `backend`, `frontend`, `bug`, `task`
    - Size: M
    - Description: Fix identified bugs and improve UI/UX issues

48. **Add loading states and error handling**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: Implement loading indicators and error handling throughout app

49. **Write integration tests**
    - Labels: `phase-1`, `backend`, `frontend`, `testing`, `task`
    - Size: L
    - Description: Integration tests for critical user flows

50. **Performance optimization**
    - Labels: `phase-1`, `backend`, `frontend`, `task`
    - Size: M
    - Description: Lazy loading, code splitting, query optimization

51. **Responsive design testing**
    - Labels: `phase-1`, `frontend`, `task`
    - Size: M
    - Description: Test and fix responsive design for mobile, tablet, desktop

### Phase 2: Core Features

#### Epic 4: Multi-Strategy Analysis (Week 9-10)
**Parent Issue**: `[EPIC] Multi-Strategy Analysis`
- **Labels**: `phase-2`, `epic`, `backend`, `frontend`
- **Size**: XL
- **Milestone**: Phase 2: Core Features

**Child Issues**:

52. **Add ARV estimation for fix-and-flip**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Calculate After-Repair Value for fix-and-flip strategy

53. **Implement renovation cost calculator**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Calculator for estimating renovation costs
    - Dependencies: #52

54. **Calculate flip profit and ROI**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Calculate profit and ROI for fix-and-flip strategy
    - Dependencies: #52, #53

55. **Add 70% rule calculator**
    - Labels: `phase-2`, `backend`, `task`
    - Size: S
    - Description: Implement 70% rule calculation for flip analysis
    - Dependencies: #52

56. **Create flip analysis UI component**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: UI component for fix-and-flip analysis
    - Dependencies: #54

57. **Add land/teardown property type support**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Support for land and teardown properties in data model

58. **Implement development feasibility calculator**
    - Labels: `phase-2`, `backend`, `task`
    - Size: L
    - Description: Calculator for development feasibility assessment
    - Dependencies: #57

59. **Add construction cost estimation**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Estimate construction costs for development projects
    - Dependencies: #58

60. **Calculate development ROI and timeline**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Calculate ROI and timeline for development strategy
    - Dependencies: #58, #59

61. **Create development analysis UI**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: UI component for development strategy analysis
    - Dependencies: #60

62. **Add commercial property type support**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Support commercial properties in data model and analysis

63. **Implement cap rate calculation**
    - Labels: `phase-2`, `backend`, `task`
    - Size: S
    - Description: Calculate cap rate for commercial properties
    - Dependencies: #62

64. **Add vacancy rate assumptions**
    - Labels: `phase-2`, `backend`, `task`
    - Size: S
    - Description: Support vacancy rate in commercial analysis
    - Dependencies: #62

65. **Create commercial analysis UI**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: UI component for commercial property analysis
    - Dependencies: #63, #64

66. **Build strategy comparison view**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: L
    - Description: Side-by-side comparison of all investment strategies
    - Dependencies: #56, #61, #65

67. **Add Best Strategy recommendation logic**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Algorithm to recommend best strategy for a property
    - Dependencies: #54, #60, #63

68. **Create visual comparison charts**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: Charts comparing metrics across strategies
    - Dependencies: #66

#### Epic 5: Regional Data Integration (Week 11-12)
**Parent Issue**: `[EPIC] Regional Data Integration`
- **Labels**: `phase-2`, `epic`, `backend`, `frontend`
- **Size**: XL
- **Milestone**: Phase 2: Core Features

**Child Issues**:

69. **Research INE API endpoints**
    - Labels: `phase-2`, `backend`, `task`, `documentation`
    - Size: S
    - Description: Research INE API endpoints and data structure

70. **Create INEDataService**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Service class for fetching INE statistics
    - Dependencies: #69

71. **Implement data fetching and caching**
    - Labels: `phase-2`, `backend`, `infrastructure`, `task`
    - Size: M
    - Description: Fetch INE data and cache results
    - Dependencies: #70

72. **Store regional statistics in database**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Database schema and storage for regional statistics
    - Dependencies: #70

73. **Create management command for INE data updates**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Weekly scheduled command to update INE data
    - Dependencies: #71, #72

74. **Show regional averages**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: Display regional averages (price per m², rent, yield)
    - Dependencies: #72

75. **Compare property metrics to regional averages**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: Show comparison of property vs regional averages
    - Dependencies: #74

76. **Display market trends**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: Display price growth and transaction volume trends
    - Dependencies: #72

77. **Add Above/Below Market indicators**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: S
    - Description: Visual indicators showing if property is above/below market
    - Dependencies: #75

78. **Calculate average metrics per region**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Calculate and cache average metrics per region
    - Dependencies: #72

79. **Create heatmap layer for yield**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: Heatmap visualization showing yield by region
    - Dependencies: #78

80. **Create heatmap layer for price growth**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: Heatmap visualization showing price growth by region
    - Dependencies: #78

81. **Add toggle between heatmap views**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: S
    - Description: UI to toggle between different heatmap views
    - Dependencies: #79, #80

82. **Implement color-coding for heatmaps**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: S
    - Description: Color-code heatmaps (green = good, red = poor)
    - Dependencies: #79, #80

83. **Implement location score algorithm**
    - Labels: `phase-2`, `backend`, `task`
    - Size: L
    - Description: Algorithm scoring locations based on yield, growth, demand
    - Dependencies: #78

84. **Display location score on property cards**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: S
    - Description: Show location score on property cards
    - Dependencies: #83

85. **Add location score to investment score**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Include location score in overall investment score calculation
    - Dependencies: #83

#### Epic 6: Advanced Scoring & Ranking (Week 13-14)
**Parent Issue**: `[EPIC] Advanced Scoring & Ranking`
- **Labels**: `phase-2`, `epic`, `backend`, `frontend`
- **Size**: XL
- **Milestone**: Phase 2: Core Features

**Child Issues**:

86. **Design scoring formula**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Design weighted scoring formula for investment properties

87. **Implement base scoring**
    - Labels: `phase-2`, `backend`, `task`
    - Size: L
    - Description: Implement scoring with weights: 40% ROI, 20% yield spread, 20% location, 10% liquidity, 10% risk
    - Dependencies: #86

88. **Make weights configurable per user**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Allow users to customize scoring weights
    - Dependencies: #87

89. **Add letter grades**
    - Labels: `phase-2`, `backend`, `task`
    - Size: S
    - Description: Convert scores to letter grades (A, B, C, D, F)
    - Dependencies: #87

90. **Implement sorting by score**
    - Labels: `phase-2`, `backend`, `task`
    - Size: S
    - Description: Sort properties by investment score
    - Dependencies: #87

91. **Add multiple sort options**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: S
    - Description: Sort by score, yield, price, ROI
    - Dependencies: #90

92. **Create Top Opportunities dashboard**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: Dashboard showing top-scoring investment opportunities
    - Dependencies: #90

93. **Add filters that work with ranking**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: Ensure filters work correctly with ranking/sorting
    - Dependencies: #91

94. **Identify risk factors**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Identify and categorize risk factors for properties

95. **Create risk scoring system**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Scoring system for property risk assessment
    - Dependencies: #94

96. **Display risk indicators**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: S
    - Description: Visual indicators for risk on properties
    - Dependencies: #95

97. **Add risk warnings in analysis**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: S
    - Description: Show risk warnings in property analysis
    - Dependencies: #95

98. **Add filter by investment score**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: S
    - Description: Filter properties by minimum investment score
    - Dependencies: #87

99. **Filter by strategy recommendation**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: S
    - Description: Filter by recommended investment strategy
    - Dependencies: #67

100. **Filter by risk level**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: S
    - Description: Filter properties by risk level
    - Dependencies: #95

101. **Save filter presets**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: Allow users to save and reuse filter presets
    - Dependencies: #98, #99, #100

#### Epic 7: Financing Module (Week 15-16)
**Parent Issue**: `[EPIC] Financing Module`
- **Labels**: `phase-2`, `epic`, `backend`, `frontend`
- **Size**: XL
- **Milestone**: Phase 2: Core Features

**Child Issues**:

102. **Add mortgage payment calculator**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Calculate mortgage payments based on loan amount, rate, term

103. **Implement leverage impact analysis**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Analyze impact of leverage on returns
    - Dependencies: #102

104. **Calculate levered vs unlevered returns**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Compare returns with and without leverage
    - Dependencies: #103

105. **Add equity buildup over time**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Calculate equity buildup over mortgage term
    - Dependencies: #102

106. **Support multiple financing scenarios**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Allow comparing multiple financing scenarios
    - Dependencies: #102

107. **Research ECB/Banco de Portugal data sources**
    - Labels: `phase-2`, `backend`, `task`, `documentation`
    - Size: S
    - Description: Research interest rate data sources

108. **Create interest rate fetching service**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Service to fetch current interest rates
    - Dependencies: #107

109. **Store current rates in database**
    - Labels: `phase-2`, `backend`, `task`
    - Size: S
    - Description: Store interest rates in database
    - Dependencies: #108

110. **Update rates automatically**
    - Labels: `phase-2`, `backend`, `infrastructure`, `task`
    - Size: M
    - Description: Monthly scheduled task to update interest rates
    - Dependencies: #108, #109

111. **Create financing input panel**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: UI panel for financing inputs

112. **Allow multiple scenarios**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: UI to create and compare multiple financing scenarios
    - Dependencies: #111

113. **Show comparison of scenarios**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: Side-by-side comparison of financing scenarios
    - Dependencies: #112

114. **Display cash flow impact of leverage**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: Show how leverage affects cash flow
    - Dependencies: #103

115. **Add sensitivity analysis**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: What-if analysis for interest rate changes
    - Dependencies: #112

116. **Research Portuguese tax rules**
    - Labels: `phase-2`, `backend`, `task`, `documentation`
    - Size: M
    - Description: Research IMT, IMI, capital gains tax rules

117. **Add tax calculations to ROI**
    - Labels: `phase-2`, `backend`, `task`
    - Size: L
    - Description: Include tax calculations in ROI calculations
    - Dependencies: #116

118. **Show tax impact on returns**
    - Labels: `phase-2`, `frontend`, `task`
    - Size: M
    - Description: Display tax impact in analysis UI
    - Dependencies: #117

119. **Add tax optimization suggestions**
    - Labels: `phase-2`, `backend`, `task`
    - Size: M
    - Description: Suggest tax optimization strategies
    - Dependencies: #117

### Phase 3: Advanced Features

#### Epic 8: Zoning & Development Feasibility (Week 17-18)
**Parent Issue**: `[EPIC] Zoning & Development Feasibility`
- **Labels**: `phase-3`, `epic`, `backend`, `frontend`
- **Size**: XL
- **Milestone**: Phase 3: Advanced Features

**Child Issues**:

120. **Research municipal open data portals**
    - Labels: `phase-3`, `backend`, `task`, `documentation`
    - Size: S
    - Description: Research PDM data availability from municipal portals

121. **Download PDM shapefiles**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Download PDM shapefiles for Lisbon, Porto, Cascais

122. **Set up PostGIS for spatial queries**
    - Labels: `phase-3`, `backend`, `infrastructure`, `task`
    - Size: M
    - Description: Configure PostGIS for spatial data queries
    - Dependencies: #121

123. **Create ZoningService**
    - Labels: `phase-3`, `backend`, `task`
    - Size: L
    - Description: Service for point-in-polygon queries to determine zoning
    - Dependencies: #122

124. **Store zoning data in database**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Database schema and storage for zoning data
    - Dependencies: #121

125. **Implement property-to-zone lookup**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Lookup zoning for a property by coordinates
    - Dependencies: #123

126. **Retrieve zoning classification**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Extract urban/rural, residential/commercial classification
    - Dependencies: #125

127. **Extract development rules**
    - Labels: `phase-3`, `backend`, `task`
    - Size: L
    - Description: Extract height limits, FAR, use restrictions from zoning
    - Dependencies: #126

128. **Display zoning info on property detail**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Show zoning information on property detail page
    - Dependencies: #125

129. **Add development feasibility assessment**
    - Labels: `phase-3`, `backend`, `task`
    - Size: L
    - Description: Assess if property allows development based on zoning
    - Dependencies: #127

130. **Check property development permissions**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Check if property allows development
    - Dependencies: #129

131. **Warn about rural land restrictions**
    - Labels: `phase-3`, `backend`, `task`
    - Size: S
    - Description: Warn users about rural land development restrictions
    - Dependencies: #130

132. **Show permitted building parameters**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Display permitted building parameters from zoning
    - Dependencies: #127

133. **Add development risk indicators**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Risk indicators based on zoning restrictions
    - Dependencies: #129

134. **Display zoning overlay on map**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: L
    - Description: Show zoning overlay on map component
    - Dependencies: #124

135. **Color-code zones by type**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Color-code zones on map by type
    - Dependencies: #134

136. **Show zoning info in property analysis**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: S
    - Description: Include zoning info in property analysis view
    - Dependencies: #128

137. **Add warnings for restricted zones**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: S
    - Description: Visual warnings for restricted development zones
    - Dependencies: #131

#### Epic 9: Predictive Analytics (Week 19-20)
**Parent Issue**: `[EPIC] Predictive Analytics`
- **Labels**: `phase-3`, `epic`, `backend`, `frontend`
- **Size**: XL
- **Milestone**: Phase 3: Advanced Features

**Child Issues**:

138. **Collect historical price data**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Collect and store historical price data from INE indices

139. **Create price prediction model**
    - Labels: `phase-3`, `backend`, `task`
    - Size: L
    - Description: Simple regression model for price prediction
    - Dependencies: #138

140. **Predict property value 1-2 years out**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Predict property value 1-2 years in future
    - Dependencies: #139

141. **Show price appreciation potential**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Display price appreciation potential in UI
    - Dependencies: #140

142. **Add confidence intervals**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Calculate and display confidence intervals for predictions
    - Dependencies: #140

143. **Build rent estimation model**
    - Labels: `phase-3`, `backend`, `task`
    - Size: L
    - Description: Model to estimate rent based on location and features

144. **Use comparables approach**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Use comparable properties for rent estimation
    - Dependencies: #143

145. **Estimate rent if not provided**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Auto-estimate rent when not provided in listing
    - Dependencies: #143

146. **Show rent vs market average**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: S
    - Description: Compare estimated rent to market average
    - Dependencies: #145

147. **Analyze price trends by region**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Analyze price trends for each region
    - Dependencies: #138

148. **Identify market trends**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Identify rising/stable/declining markets
    - Dependencies: #147

149. **Display trend indicators**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Visual indicators for market trends
    - Dependencies: #148

150. **Add trend to location scoring**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Include market trend in location score
    - Dependencies: #148

151. **Show predicted values in analysis**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Display predicted values in property analysis
    - Dependencies: #140, #145

152. **Display trend charts**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Charts showing price and rent trends
    - Dependencies: #147

153. **Add Future Value projections**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Show future value projections in UI
    - Dependencies: #140

154. **Show appreciation scenarios**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Multiple appreciation scenarios (conservative, moderate, aggressive)
    - Dependencies: #153

#### Epic 10: Enhanced User Experience (Week 21-22)
**Parent Issue**: `[EPIC] Enhanced User Experience`
- **Labels**: `phase-3`, `epic`, `backend`, `frontend`
- **Size**: XL
- **Milestone**: Phase 3: Advanced Features

**Child Issues**:

155. **Add full-text search**
    - Labels: `phase-3`, `backend`, `task`
    - Size: L
    - Description: Full-text search for properties

156. **Implement search by address/neighborhood**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Search properties by address or neighborhood
    - Dependencies: #155

157. **Add saved searches**
    - Labels: `phase-3`, `backend`, `frontend`, `task`
    - Size: M
    - Description: Allow users to save search queries
    - Dependencies: #155

158. **Email alerts for new matches**
    - Labels: `phase-3`, `backend`, `infrastructure`, `task`
    - Size: M
    - Description: Email notifications for new property matches
    - Dependencies: #157

159. **Create user dashboard**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: L
    - Description: User dashboard with overview and quick stats

160. **Show saved properties summary**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Summary of saved properties on dashboard
    - Dependencies: #159

161. **Display market overview**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Market overview statistics on dashboard
    - Dependencies: #159

162. **Show recent analyses**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Recent property analyses on dashboard
    - Dependencies: #159

163. **Add quick stats**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: S
    - Description: Quick statistics widgets on dashboard
    - Dependencies: #159

164. **Enhanced charts**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: L
    - Description: Enhanced charts for cash flow projections, ROI over time

165. **Interactive graphs**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Interactive graphs with hover details
    - Dependencies: #164

166. **Export charts as images**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Export charts as PNG/JPG images
    - Dependencies: #164

167. **Comparison visualizations**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Visualizations for comparing multiple properties
    - Dependencies: #164

168. **Optimize for mobile devices**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: L
    - Description: Mobile optimization for all components

169. **Touch-friendly map controls**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Touch-optimized map controls for mobile
    - Dependencies: #168

170. **Responsive tables and forms**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Responsive design for tables and forms
    - Dependencies: #168

171. **Mobile navigation**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Mobile-friendly navigation menu
    - Dependencies: #168

#### Epic 11: Reporting & Export (Week 23-24)
**Parent Issue**: `[EPIC] Reporting & Export`
- **Labels**: `phase-3`, `epic`, `backend`, `frontend`
- **Size**: XL
- **Milestone**: Phase 3: Advanced Features

**Child Issues**:

172. **Enhanced PDF reports**
    - Labels: `phase-3`, `backend`, `task`
    - Size: L
    - Description: Enhanced PDF reports with charts and visualizations

173. **Executive summary reports**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: High-level executive summary reports
    - Dependencies: #172

174. **Comparison reports**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Reports comparing multiple properties
    - Dependencies: #172

175. **Customizable report templates**
    - Labels: `phase-3`, `backend`, `frontend`, `task`
    - Size: L
    - Description: Allow users to customize report templates
    - Dependencies: #172

176. **Export property list to CSV**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Export filtered property lists to CSV

177. **Export analysis to Excel**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Export analysis results to Excel format
    - Dependencies: #176

178. **Export saved properties**
    - Labels: `phase-3`, `backend`, `task`
    - Size: S
    - Description: Export user's saved properties
    - Dependencies: #176

179. **Bulk export functionality**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Export multiple properties/analyses at once
    - Dependencies: #176, #177

180. **Generate shareable report links**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Generate shareable links for reports
    - Dependencies: #172

181. **Email reports**
    - Labels: `phase-3`, `backend`, `task`
    - Size: M
    - Description: Email reports to users or contacts
    - Dependencies: #172

182. **Print-friendly views**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Print-optimized views for reports
    - Dependencies: #172

183. **Social sharing**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: S
    - Description: Optional social media sharing for reports
    - Dependencies: #180

184. **User guide**
    - Labels: `phase-3`, `documentation`, `task`
    - Size: L
    - Description: Comprehensive user guide documentation

185. **FAQ section**
    - Labels: `phase-3`, `documentation`, `task`
    - Size: M
    - Description: Frequently asked questions section

186. **Tooltips and help text**
    - Labels: `phase-3`, `frontend`, `task`
    - Size: M
    - Description: Add tooltips and contextual help throughout UI

187. **Video tutorials**
    - Labels: `phase-3`, `documentation`, `task`
    - Size: L
    - Description: Optional video tutorials for key features

### Phase 4: Polish & Scale

#### Epic 12: Performance Optimization (Week 25-26)
**Parent Issue**: `[EPIC] Performance Optimization`
- **Labels**: `phase-4`, `epic`, `backend`, `frontend`, `infrastructure`
- **Size**: XL
- **Milestone**: Phase 4: Polish & Scale

**Child Issues**:

188. **Database query optimization**
    - Labels: `phase-4`, `backend`, `task`
    - Size: L
    - Description: Optimize queries with indexes, select_related, prefetch_related

189. **Implement pagination everywhere**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Ensure all list endpoints use pagination

190. **Add database connection pooling**
    - Labels: `phase-4`, `backend`, `infrastructure`, `task`
    - Size: M
    - Description: Configure database connection pooling

191. **Optimize API response times**
    - Labels: `phase-4`, `backend`, `task`
    - Size: L
    - Description: Optimize slow API endpoints
    - Dependencies: #188

192. **Add response compression**
    - Labels: `phase-4`, `backend`, `infrastructure`, `task`
    - Size: S
    - Description: Enable gzip compression for API responses

193. **Implement Redis caching**
    - Labels: `phase-4`, `backend`, `infrastructure`, `task`
    - Size: L
    - Description: Redis caching for expensive queries

194. **Cache analysis results**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Cache analysis results in Redis
    - Dependencies: #193

195. **Cache API responses**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Cache frequently accessed API responses
    - Dependencies: #193

196. **Add cache invalidation logic**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Proper cache invalidation when data changes
    - Dependencies: #193

197. **Monitor cache hit rates**
    - Labels: `phase-4`, `backend`, `infrastructure`, `task`
    - Size: M
    - Description: Monitor and log cache hit rates
    - Dependencies: #193

198. **Code splitting and lazy loading**
    - Labels: `phase-4`, `frontend`, `task`
    - Size: L
    - Description: Implement code splitting and lazy loading

199. **Image optimization**
    - Labels: `phase-4`, `frontend`, `task`
    - Size: M
    - Description: Optimize images (compression, lazy loading, WebP)

200. **Bundle size optimization**
    - Labels: `phase-4`, `frontend`, `task`
    - Size: M
    - Description: Reduce JavaScript bundle sizes

201. **Implement virtual scrolling**
    - Labels: `phase-4`, `frontend`, `task`
    - Size: M
    - Description: Virtual scrolling for long property lists
    - Dependencies: #198

202. **Add service worker for offline support**
    - Labels: `phase-4`, `frontend`, `task`
    - Size: L
    - Description: Basic service worker for offline functionality

203. **Set up load testing**
    - Labels: `phase-4`, `infrastructure`, `testing`, `task`
    - Size: M
    - Description: Set up load testing with Locust or k6

204. **Test with 1000+ properties**
    - Labels: `phase-4`, `testing`, `task`
    - Size: M
    - Description: Load test with large dataset
    - Dependencies: #203

205. **Test concurrent users**
    - Labels: `phase-4`, `testing`, `task`
    - Size: M
    - Description: Test with multiple concurrent users
    - Dependencies: #203

206. **Identify bottlenecks**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Identify performance bottlenecks from load tests
    - Dependencies: #204, #205

207. **Fix performance issues**
    - Labels: `phase-4`, `backend`, `frontend`, `task`
    - Size: L
    - Description: Fix identified performance issues
    - Dependencies: #206

#### Epic 13: Scalability & Infrastructure (Week 27-28)
**Parent Issue**: `[EPIC] Scalability & Infrastructure`
- **Labels**: `phase-4`, `epic`, `infrastructure`
- **Size**: XL
- **Milestone**: Phase 4: Polish & Scale

**Child Issues**:

208. **Set up production environment**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: L
    - Description: Set up production environment on AWS/DigitalOcean

209. **Configure production database**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Configure managed Postgres (RDS) for production
    - Dependencies: #208

210. **Set up Redis in cloud**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Set up managed Redis in cloud
    - Dependencies: #208

211. **Configure CDN for static assets**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Configure CDN for static file delivery
    - Dependencies: #208

212. **Set up SSL certificates**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: S
    - Description: Configure SSL/TLS certificates
    - Dependencies: #208

213. **Set up GitHub Actions**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Configure GitHub Actions for CI/CD

214. **Automated testing on PR**
    - Labels: `phase-4`, `infrastructure`, `testing`, `task`
    - Size: M
    - Description: Run tests automatically on pull requests
    - Dependencies: #213

215. **Automated deployment to staging**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Auto-deploy to staging environment
    - Dependencies: #213

216. **Production deployment workflow**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Manual/automated production deployment workflow
    - Dependencies: #213

217. **Rollback procedures**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Document and test rollback procedures
    - Dependencies: #216

218. **Set up error tracking**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Set up Sentry for error tracking

219. **Configure application monitoring**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Application performance monitoring
    - Dependencies: #218

220. **Set up database monitoring**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Monitor database performance and health
    - Dependencies: #209

221. **Create monitoring dashboards**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Create Grafana dashboards for monitoring
    - Dependencies: #219, #220

222. **Set up alerts**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Configure alerts for critical issues
    - Dependencies: #221

223. **Automated database backups**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Set up automated daily database backups
    - Dependencies: #209

224. **Backup retention policy**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: S
    - Description: Define and implement backup retention policy
    - Dependencies: #223

225. **Test restore procedures**
    - Labels: `phase-4`, `infrastructure`, `testing`, `task`
    - Size: M
    - Description: Test database restore procedures
    - Dependencies: #223

226. **Document disaster recovery plan**
    - Labels: `phase-4`, `infrastructure`, `documentation`, `task`
    - Size: M
    - Description: Document complete disaster recovery plan
    - Dependencies: #225

#### Epic 14: Data Pipeline Enhancement (Week 29-30)
**Parent Issue**: `[EPIC] Data Pipeline Enhancement`
- **Labels**: `phase-4`, `epic`, `backend`, `infrastructure`
- **Size**: XL
- **Milestone**: Phase 4: Polish & Scale

**Child Issues**:

227. **Set up Celery scheduled tasks**
    - Labels: `phase-4`, `backend`, `infrastructure`, `task`
    - Size: L
    - Description: Set up Celery for scheduled background tasks

228. **Daily property listing updates**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Daily scheduled task to update property listings
    - Dependencies: #227

229. **Weekly INE data updates**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Weekly scheduled task to update INE data
    - Dependencies: #227

230. **Monthly interest rate updates**
    - Labels: `phase-4`, `backend`, `task`
    - Size: S
    - Description: Monthly scheduled task to update interest rates
    - Dependencies: #227

231. **Handle API failures gracefully**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Error handling and retry logic for API failures
    - Dependencies: #228, #229, #230

232. **Implement data validation rules**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Comprehensive data validation rules

233. **Add data quality monitoring**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Monitor data quality metrics
    - Dependencies: #232

234. **Flag suspicious data**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Automatically flag suspicious or invalid data
    - Dependencies: #232

235. **Create data quality reports**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Generate data quality reports
    - Dependencies: #233

236. **Store historical property data**
    - Labels: `phase-4`, `backend`, `task`
    - Size: L
    - Description: Store historical snapshots of property data

237. **Track price changes**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Track and store price changes over time
    - Dependencies: #236

238. **Track listing duration**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Track how long properties are listed
    - Dependencies: #236

239. **Enable historical analysis**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Enable analysis of historical data
    - Dependencies: #236

240. **Integrate additional listing sources**
    - Labels: `phase-4`, `backend`, `task`
    - Size: L
    - Description: Integrate Imovirtual, Casa Sapo, or other sources

241. **Deduplicate listings**
    - Labels: `phase-4`, `backend`, `task`
    - Size: L
    - Description: Detect and merge duplicate listings
    - Dependencies: #240

242. **Merge data from multiple sources**
    - Labels: `phase-4`, `backend`, `task`
    - Size: L
    - Description: Merge property data from multiple sources
    - Dependencies: #240

243. **Handle conflicting data**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Resolve conflicts when data differs between sources
    - Dependencies: #242

#### Epic 15: Final Polish & Launch Prep (Week 31-32)
**Parent Issue**: `[EPIC] Final Polish & Launch Prep`
- **Labels**: `phase-4`, `epic`, `backend`, `frontend`, `infrastructure`
- **Size**: XL
- **Milestone**: Phase 4: Polish & Scale

**Child Issues**:

244. **Security audit**
    - Labels: `phase-4`, `backend`, `frontend`, `task`
    - Size: L
    - Description: Comprehensive security audit

245. **Implement rate limiting**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Rate limiting for API endpoints
    - Dependencies: #244

246. **Add input validation everywhere**
    - Labels: `phase-4`, `backend`, `frontend`, `task`
    - Size: L
    - Description: Comprehensive input validation
    - Dependencies: #244

247. **SQL injection prevention**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: Ensure all queries use parameterized statements
    - Dependencies: #244

248. **XSS prevention**
    - Labels: `phase-4`, `frontend`, `task`
    - Size: M
    - Description: Prevent cross-site scripting attacks
    - Dependencies: #244

249. **CSRF protection**
    - Labels: `phase-4`, `backend`, `task`
    - Size: M
    - Description: CSRF protection for all forms
    - Dependencies: #244

250. **Beta testing with real users**
    - Labels: `phase-4`, `task`
    - Size: L
    - Description: Organize and conduct beta testing

251. **Collect feedback**
    - Labels: `phase-4`, `task`
    - Size: M
    - Description: Collect and organize user feedback
    - Dependencies: #250

252. **Fix critical issues**
    - Labels: `phase-4`, `backend`, `frontend`, `bug`, `task`
    - Size: L
    - Description: Fix critical issues from beta testing
    - Dependencies: #251

253. **Improve UX based on feedback**
    - Labels: `phase-4`, `frontend`, `task`
    - Size: M
    - Description: UX improvements based on user feedback
    - Dependencies: #251

254. **API documentation**
    - Labels: `phase-4`, `documentation`, `task`
    - Size: L
    - Description: Complete API documentation with Swagger/OpenAPI

255. **Technical documentation**
    - Labels: `phase-4`, `documentation`, `task`
    - Size: L
    - Description: Technical documentation for developers

256. **Deployment guide**
    - Labels: `phase-4`, `documentation`, `task`
    - Size: M
    - Description: Step-by-step deployment guide
    - Dependencies: #208

257. **User manual**
    - Labels: `phase-4`, `documentation`, `task`
    - Size: L
    - Description: Complete user manual

258. **Marketing website/landing page**
    - Labels: `phase-4`, `frontend`, `task`
    - Size: L
    - Description: Marketing website or landing page

259. **User onboarding flow**
    - Labels: `phase-4`, `frontend`, `task`
    - Size: M
    - Description: User onboarding tutorial/flow
    - Dependencies: #258

260. **Terms of service & privacy policy**
    - Labels: `phase-4`, `documentation`, `task`
    - Size: M
    - Description: Legal documents (ToS, Privacy Policy)

261. **Support channels setup**
    - Labels: `phase-4`, `infrastructure`, `task`
    - Size: M
    - Description: Set up support channels (email, chat, etc.)

262. **Launch checklist**
    - Labels: `phase-4`, `task`
    - Size: M
    - Description: Final launch checklist and verification

## Additional Labels to Create

Create these additional labels for better organization:

- **`epic`** - Color: `#0E8A16` (green) - Description: `Epic - Large feature or collection of related tasks`
- **`blocked`** - Color: `#D73A4A` (red) - Description: `Blocked - Issue is blocked by another issue`
- **`in-review`** - Color: `#FBCA04` (yellow) - Description: `In Review - Pull request is being reviewed`

## How to Use This Document

1. **Create Milestones First**: Set up the 4 phase milestones
2. **Create Epic Issues**: Create parent issues for each epic (mark with `epic` label)
3. **Create Child Issues**: Create all child issues, linking them to parent epics
4. **Set Dependencies**: Use issue references in descriptions (e.g., "Depends on #123")
5. **Add to Project Board**: Add all issues to your project board
6. **Update as You Go**: Mark issues complete, update dependencies, add notes

## Notes

- **Size estimates** are in hours/days - adjust based on your experience
- **Dependencies** are indicated in issue descriptions
- **Epic issues** should be created first, then child issues reference them
- Use GitHub's **Projects** feature to track progress visually
- Consider using **GitHub Actions** to automate issue management

