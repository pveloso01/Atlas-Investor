# Testing Strategy

This document outlines the testing approach for Atlas Investor, including test types, coverage goals, and best practices.

## Testing Philosophy

- **Test Early, Test Often**: Write tests alongside code, not after
- **Test Behavior, Not Implementation**: Focus on what the code does, not how
- **Maintainable Tests**: Tests should be easy to read, understand, and update
- **Fast Feedback**: Tests should run quickly to enable rapid development
- **High Confidence**: Tests should catch bugs before they reach production

## Test Pyramid

```
        /\
       /  \      E2E Tests (Few)
      /____\
     /      \    Integration Tests (Some)
    /________\
   /          \  Unit Tests (Many)
  /____________\
```

## Unit Tests

### Backend (Python/pytest)

**Target Coverage**: 80%+

**What to Test:**
- All calculation functions (ROI, yield, cash flow, etc.)
- Data models and validation
- Business logic services
- Utility functions
- Data transformation functions

**Example Test Structure:**
```python
# tests/test_analysis.py
def test_calculate_gross_yield():
    """Test gross yield calculation"""
    annual_rent = 12000
    purchase_price = 200000
    expected_yield = 6.0
    
    result = calculate_gross_yield(annual_rent, purchase_price)
    assert result == expected_yield

def test_calculate_cash_flow():
    """Test cash flow calculation with mortgage"""
    monthly_rent = 1000
    monthly_mortgage = 600
    monthly_expenses = 200
    expected_cash_flow = 200
    
    result = calculate_cash_flow(
        monthly_rent, monthly_mortgage, monthly_expenses
    )
    assert result == expected_cash_flow
```

**Test Organization:**
```
backend/
├── tests/
│   ├── unit/
│   │   ├── test_analysis.py
│   │   ├── test_models.py
│   │   ├── test_services.py
│   │   └── test_utils.py
│   ├── integration/
│   └── fixtures/
```

**Tools:**
- **pytest**: Test framework
- **pytest-django**: Django integration
- **pytest-cov**: Coverage reporting
- **factory-boy**: Test data factories
- **faker**: Generate fake data

### Frontend (TypeScript/Jest)

**Target Coverage**: 80%+

**What to Test:**
- Utility functions
- Calculation helpers
- Component rendering
- User interactions
- Redux reducers and actions
- API service functions

**Example Test Structure:**
```typescript
// frontend/src/utils/__tests__/calculations.test.ts
import { calculateGrossYield } from '../calculations';

describe('calculateGrossYield', () => {
  it('calculates gross yield correctly', () => {
    const annualRent = 12000;
    const purchasePrice = 200000;
    const expected = 6.0;
    
    const result = calculateGrossYield(annualRent, purchasePrice);
    expect(result).toBe(expected);
  });
  
  it('handles zero purchase price', () => {
    expect(() => calculateGrossYield(12000, 0)).toThrow();
  });
});
```

**Component Testing:**
```typescript
// frontend/src/components/__tests__/PropertyCard.test.tsx
import { render, screen } from '@testing-library/react';
import PropertyCard from '../PropertyCard';

describe('PropertyCard', () => {
  it('renders property information', () => {
    const property = {
      id: 1,
      address: '123 Main St',
      price: 200000,
    };
    
    render(<PropertyCard property={property} />);
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('€200,000')).toBeInTheDocument();
  });
});
```

**Tools:**
- **Jest**: Test framework
- **React Testing Library**: Component testing
- **@testing-library/user-event**: User interaction simulation
- **MSW (Mock Service Worker)**: API mocking

## Integration Tests

### API Integration Tests

**What to Test:**
- End-to-end API flows
- Request/response handling
- Authentication and authorization
- Error handling
- Data validation

**Example:**
```python
# tests/integration/test_property_api.py
@pytest.mark.django_db
def test_property_list_endpoint(client):
    """Test property list API endpoint"""
    # Create test data
    PropertyFactory.create_batch(5)
    
    # Make request
    response = client.get('/api/properties/')
    
    # Assertions
    assert response.status_code == 200
    assert len(response.json()['results']) == 5
```

### Data Pipeline Integration Tests

**What to Test:**
- Data ingestion from external APIs
- Data normalization
- Database storage
- Error handling and retries

**Example:**
```python
# tests/integration/test_data_ingestion.py
@pytest.mark.django_db
def test_property_ingestion(mocker):
    """Test property data ingestion"""
    # Mock external API
    mock_response = mocker.Mock()
    mock_response.json.return_value = {...}
    mocker.patch('requests.get', return_value=mock_response)
    
    # Run ingestion
    PropertyIngestionService().ingest_properties()
    
    # Verify data in database
    assert Property.objects.count() > 0
```

### Analysis Workflow Tests

**What to Test:**
- Complete analysis workflow
- Multiple strategy calculations
- Caching behavior
- Result accuracy

## End-to-End (E2E) Tests

### Critical User Flows

**Tools**: Playwright or Cypress

**Flows to Test:**

1. **User Registration → Property Search → Analysis → Save**
   ```typescript
   test('complete investment analysis flow', async ({ page }) => {
     // Register user
     await page.goto('/register');
     await page.fill('[name="email"]', 'test@example.com');
     await page.fill('[name="password"]', 'password123');
     await page.click('button[type="submit"]');
     
     // Search properties
     await page.goto('/properties');
     await page.fill('[name="search"]', 'Lisbon');
     await page.click('button[type="submit"]');
     
     // Select property
     await page.click('.property-card:first-child');
     
     // Run analysis
     await page.click('button:has-text("Analyze")');
     await page.waitForSelector('.analysis-results');
     
     // Save property
     await page.click('button:has-text("Save")');
     expect(await page.textContent('.success-message')).toContain('Saved');
   });
   ```

2. **Property Comparison**
   - Select multiple properties
   - Compare metrics
   - Export comparison

3. **Report Generation**
   - Generate report
   - Download PDF
   - Verify content

**E2E Test Organization:**
```
tests/
├── e2e/
│   ├── auth.spec.ts
│   ├── property-search.spec.ts
│   ├── analysis.spec.ts
│   └── reports.spec.ts
```

## Performance Tests

### Load Testing

**Tools**: Locust or k6

**Scenarios:**
- Property list endpoint with 1000+ properties
- Analysis endpoint under load
- Concurrent user testing
- Database query performance

**Example (Locust):**
```python
# tests/performance/locustfile.py
from locust import HttpUser, task, between

class PropertyUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def list_properties(self):
        self.client.get("/api/properties/")
    
    @task(3)
    def analyze_property(self):
        self.client.post("/api/properties/1/analyze/", json={
            "strategy": "rental",
            "assumptions": {...}
        })
```

**Performance Benchmarks:**
- API response time: < 200ms (property list), < 500ms (analysis)
- Database queries: < 50ms for simple queries
- Page load time: < 2 seconds
- Time to interactive: < 3 seconds

### Stress Testing

- Maximum concurrent users
- Database connection limits
- Memory usage under load
- Cache effectiveness

## Manual Testing

### Cross-Browser Testing

**Browsers to Test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**What to Test:**
- Visual appearance
- Functionality
- Performance
- Responsive design

### Mobile Device Testing

**Devices:**
- iOS (iPhone, iPad)
- Android (various screen sizes)

**What to Test:**
- Touch interactions
- Responsive layout
- Map controls
- Form inputs
- Performance

### User Acceptance Testing (UAT)

**Process:**
1. Select beta testers
2. Provide test scenarios
3. Collect feedback
4. Track issues
5. Iterate based on feedback

## Test Data Management

### Fixtures and Factories

**Backend (factory-boy):**
```python
# backend/factories.py
import factory
from .models import Property

class PropertyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Property
    
    address = factory.Faker('address')
    price = factory.Faker('random_int', min=100000, max=500000)
    size_sqm = factory.Faker('random_int', min=50, max=200)
```

**Frontend (Mock Data):**
```typescript
// frontend/src/mocks/properties.ts
export const mockProperty = {
  id: 1,
  address: '123 Main St, Lisbon',
  price: 200000,
  sizeSqm: 100,
  // ...
};
```

### Test Database

- Use separate test database
- Reset between tests (pytest-django)
- Use transactions for isolation
- Seed test data as needed

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install poetry
          poetry install
      - name: Run tests
        run: poetry run pytest --cov
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test -- --coverage
```

### Pre-commit Hooks

- Run linters
- Run formatters
- Run unit tests
- Check code coverage

## Coverage Goals

| Component | Target Coverage |
|-----------|----------------|
| Calculation Functions | 100% |
| API Endpoints | 90%+ |
| Business Logic | 85%+ |
| Data Models | 80%+ |
| UI Components | 75%+ |
| Utilities | 90%+ |
| **Overall** | **80%+** |

## Test Maintenance

### Best Practices

1. **Keep Tests Fast**: Unit tests should run in milliseconds
2. **Isolate Tests**: Tests should not depend on each other
3. **Use Mocks**: Mock external dependencies
4. **Clear Test Names**: Describe what is being tested
5. **One Assertion Per Test**: Focus on one behavior
6. **Refactor Tests**: Keep tests DRY but readable
7. **Update Tests**: Update tests when code changes

### Common Pitfalls to Avoid

- Testing implementation details
- Slow tests (network calls, file I/O)
- Flaky tests (timing issues, race conditions)
- Over-mocking (testing mocks instead of code)
- Ignoring test failures
- Not testing error cases

## Test Reporting

### Coverage Reports

- Generate HTML coverage reports
- Track coverage trends
- Set coverage thresholds
- Fail builds if coverage drops

### Test Results

- Display test results in CI/CD
- Track test execution time
- Monitor flaky tests
- Generate test reports

## Future Enhancements

### Visual Regression Testing

- Screenshot comparison
- UI component testing
- Visual diff tools

### Accessibility Testing

- Automated a11y checks
- Screen reader testing
- Keyboard navigation testing

### Security Testing

- Dependency vulnerability scanning
- OWASP Top 10 checks
- Penetration testing (future)

