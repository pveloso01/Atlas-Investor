# Atlas Investor

> A comprehensive real estate investment analysis platform for Portugal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg)](https://www.typescriptlang.org/)

## 🎯 Overview

Atlas Investor is a data-driven platform that helps real estate investors identify, analyze, and compare property investment opportunities across Portugal. The platform combines live property listings, market statistics, zoning data, and financial modeling to provide comprehensive investment insights.

### Core Value Proposition

- **⏱️ Time Savings**: Reduce weeks of manual research to minutes of automated analysis
- **📊 Data-Driven Decisions**: Combine live listings, market statistics, and zoning data for comprehensive insights
- **🎯 Multi-Strategy Analysis**: Evaluate rental, flip, and development strategies side-by-side
- **💡 Actionable Intelligence**: Clear ROI metrics, scoring, and recommendations

### Key Features

- 🔍 **Nationwide Property Search**: Browse and filter properties across all regions of Portugal
- 📈 **Investment Analysis**: Calculate ROI, yield, cash flow, and payback period for multiple strategies
- 🗺️ **Interactive Maps**: Visualize properties with heatmaps showing investment potential
- 📊 **Market Context**: Compare properties to regional averages and market trends
- 🏗️ **Zoning Integration**: Check development feasibility using municipal planning data
- 💰 **Financing Modeling**: Model different financing scenarios and leverage impacts
- 📄 **Professional Reports**: Generate detailed investment reports for sharing

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ with PostGIS
- Redis 7+
- Docker & Docker Compose (recommended)

### Installation

See [SETUP.md](SETUP.md) for detailed setup instructions.

```bash
# Clone the repository
git clone https://github.com/yourusername/Atlas-Investor.git
cd Atlas-Investor

# Start with Docker Compose (recommended)
docker-compose up -d

# Or set up manually
# See SETUP.md for detailed instructions
```

## 📁 Project Structure

```
Atlas-Investor/
├── backend/              # Django backend application
│   ├── api/             # REST API endpoints
│   ├── core/            # Core business logic
│   ├── data/            # Data ingestion services
│   └── analysis/        # Investment analysis engine
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── store/       # Redux store
├── docs/               # Project documentation (architecture, design, planning)
└── docker-compose.yml  # Docker configuration
```

## 🛠️ Technology Stack

- **Backend**: Django 4.2+ (Python 3.11+)
- **Database**: PostgreSQL 15+ with PostGIS
- **Cache**: Redis 7+
- **Frontend**: React 18+ with TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Mapping**: Mapbox GL JS
- **UI Library**: Material-UI (MUI) v5

For detailed information about the technology stack and rationale, see [docs/TECHNOLOGY_STACK.md](docs/TECHNOLOGY_STACK.md).

## 📚 Documentation

### Project Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - System architecture and design
- **[Technology Stack](docs/TECHNOLOGY_STACK.md)** - Technology choices and rationale
- **[Data Sources](docs/DATA_SOURCES.md)** - Data integration priorities and sources
- **[Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md)** - Phased development plan
- **[Testing Strategy](docs/TESTING_STRATEGY.md)** - Testing approach and coverage
- **[Deployment](docs/DEPLOYMENT.md)** - Deployment strategy and infrastructure
- **[Risk Management](docs/RISK_MANAGEMENT.md)** - Risk assessment and mitigation
- **[Success Metrics](docs/SUCCESS_METRICS.md)** - KPIs and success criteria

### Additional Documentation

- **[Setup Guide](SETUP.md)** - Detailed setup and installation instructions
- **[Contributing](CONTRIBUTING.md)** - Guidelines for contributing to the project

## 🧪 Development

### Running the Development Server

```bash
# Backend (Django)
cd backend
python manage.py runserver

# Frontend (React)
cd frontend
npm start
```

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Quality

```bash
# Backend linting
cd backend
black .
flake8 .
pylint .

# Frontend linting
cd frontend
npm run lint
npm run format
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- **Git Flow workflow** - We use Git Flow for branch management
- Code style and standards
- Pull request process
- Issue reporting
- Development workflow

**Quick Start for Contributors:**
1. Fork the repository
2. Install Git Flow (see [SETUP.md](SETUP.md))
3. Initialize Git Flow: `git flow init`
4. Start a feature: `git flow feature start your-feature-name`
5. Create PR targeting `develop` branch

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Pedro Veloso**

- GitHub: [@pveloso01](https://github.com/pveloso01)
- Email: pedrovelosofernandes@outlook.com

## 🙏 Acknowledgments

- Inspired by tools like DealCheck, Mashvisor, and BiggerPockets
- Built with data from Idealista, INE (Statistics Portugal), and municipal open data portals
- Uses open-source technologies and libraries from the amazing developer community

## 📊 Project Status

**Current Phase**: Planning & Setup

- [x] Project planning and architecture design
- [ ] Phase 1: Foundation & MVP (Weeks 1-8)
- [ ] Phase 2: Core Features (Weeks 9-16)
- [ ] Phase 3: Advanced Features (Weeks 17-24)
- [ ] Phase 4: Polish & Scale (Weeks 25-32)

See [docs/IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md) for the complete roadmap.

---

**Note**: This project is currently in active development. Features and documentation are subject to change.

