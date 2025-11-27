# Contributing to Atlas Investor

Thank you for your interest in contributing to Atlas Investor! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Python/Node versions)
   - Screenshots if applicable

### Suggesting Features

1. **Check existing issues** and discussions
2. **Open a feature request** with:
   - Clear description of the feature
   - Use case and motivation
   - Proposed implementation (if you have ideas)
   - Examples or mockups (if applicable)

### Contributing Code

1. **Fork the repository**
2. **Set up Git Flow** (see [Git Flow Workflow](#git-flow-workflow) section)
3. **Start a feature branch**:
   ```bash
   git flow feature start your-feature-name
   # Or manually: git checkout -b feature/your-feature-name
   ```
4. **Make your changes**
5. **Write/update tests**
6. **Ensure all tests pass**
7. **Commit your changes** (follow commit message guidelines)
8. **Push your feature branch**
9. **Open a Pull Request** targeting `develop` branch

## Git Flow Workflow

This project uses **Git Flow** for branch management. Git Flow is a branching model that provides a robust framework for managing features, releases, and hotfixes.

### What is Git Flow?

Git Flow defines a strict branching model designed around the project release. It provides a clear structure for:
- **Feature branches**: New features and enhancements
- **Develop branch**: Integration branch for features
- **Release branches**: Preparation for production releases
- **Hotfix branches**: Critical bug fixes in production
- **Main branch**: Production-ready code

### Git Flow Diagram

```
                        main (production)
                          │
                          │
                    ┌─────┴─────┐
                    │           │
                    │      hotfix/1.2.1
                    │           │
                    │      ┌────┴────┐
                    │      │         │
                    │      │    release/1.2.0
                    │      │         │
                    │      │    ┌────┴────┐
                    │      │    │         │
                    develop─────┘         │
                    │                     │
                    │              feature/user-auth
                    │                     │
                    │              feature/property-search
                    │                     │
                    │              bugfix/api-error-handling
                    │
```

**Branch Types:**
- **`main`**: Always production-ready, tagged with version numbers
- **`develop`**: Integration branch for completed features
- **`feature/*`**: New features (branched from `develop`)
- **`release/*`**: Release preparation (branched from `develop`)
- **`hotfix/*`**: Critical production fixes (branched from `main`)

### Installing Git Flow

**macOS:**
```bash
brew install git-flow-avh
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install git-flow
```

**Windows:**
```bash
# Using Git for Windows (comes with Git Flow)
# Or use Git Flow AVH Edition
```

**Verify installation:**
```bash
git flow version
```

### Git Flow Commands

#### Initialize Git Flow

```bash
# Initialize Git Flow in your repository
git flow init

# Accept defaults or customize:
# - Branch name for production releases: [main]
# - Branch name for "next release" development: [develop]
# - Feature branch prefix: [feature/]
# - Bugfix branch prefix: [bugfix/]
# - Release branch prefix: [release/]
# - Hotfix branch prefix: [hotfix/]
# - Support branch prefix: [support/]
# - Version tag prefix: []
```

#### Feature Branches

**Start a new feature:**
```bash
git flow feature start feature-name
# Creates: feature/feature-name from develop
# Switches to the new branch
```

**Finish a feature:**
```bash
git flow feature finish feature-name
# Merges feature/feature-name into develop
# Deletes the feature branch
# Switches back to develop
```

**Publish a feature (share with team):**
```bash
git flow feature publish feature-name
# Pushes feature branch to remote
```

**Pull a published feature:**
```bash
git flow feature pull origin feature-name
# Pulls latest changes from remote feature branch
```

#### Release Branches

**Start a release:**
```bash
git flow release start 1.2.0
# Creates: release/1.2.0 from develop
# Switches to the new branch
```

**Finish a release:**
```bash
git flow release finish 1.2.0
# Merges release/1.2.0 into main and develop
# Tags main with version number
# Deletes the release branch
# Switches back to develop
```

#### Hotfix Branches

**Start a hotfix:**
```bash
git flow hotfix start 1.2.1
# Creates: hotfix/1.2.1 from main
# Switches to the new branch
```

**Finish a hotfix:**
```bash
git flow hotfix finish 1.2.1
# Merges hotfix/1.2.1 into main and develop
# Tags main with version number
# Deletes the hotfix branch
# Switches back to develop
```

### Manual Git Flow Workflow (Without git-flow tool)

If you prefer not to use the `git-flow` tool, you can follow the same workflow manually:

#### Feature Workflow

```bash
# Start feature
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Work on feature, commit changes
git add .
git commit -m "feat(scope): your commit message"

# Push feature branch
git push origin feature/your-feature-name

# Finish feature (after PR is merged)
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name
```

#### Release Workflow

```bash
# Start release
git checkout develop
git pull origin develop
git checkout -b release/1.2.0

# Update version numbers, changelog, etc.
# Commit release preparation
git commit -m "chore: prepare release 1.2.0"

# Finish release
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git checkout develop
git merge --no-ff release/1.2.0
git branch -d release/1.2.0
git push origin main --tags
git push origin develop
```

#### Hotfix Workflow

```bash
# Start hotfix
git checkout main
git pull origin main
git checkout -b hotfix/1.2.1

# Fix the bug, commit
git commit -m "fix(scope): critical bug fix"

# Finish hotfix
git checkout main
git merge --no-ff hotfix/1.2.1
git tag -a v1.2.1 -m "Hotfix version 1.2.1"
git checkout develop
git merge --no-ff hotfix/1.2.1
git branch -d hotfix/1.2.1
git push origin main --tags
git push origin develop
```

### Git Flow Best Practices

1. **Always branch from `develop`** for new features
2. **Never commit directly to `main`** or `develop`
3. **Keep feature branches small** and focused on one feature
4. **Regularly sync with `develop`** to avoid conflicts
5. **Delete branches after merging** to keep repository clean
6. **Use descriptive branch names**: `feature/user-authentication`, not `feature/fix`
7. **Tag releases** on `main` branch with semantic versioning (v1.2.0)

### Branch Naming Conventions

- **Features**: `feature/description` (e.g., `feature/property-search`)
- **Bugfixes**: `bugfix/description` (e.g., `bugfix/api-error-handling`)
- **Releases**: `release/version` (e.g., `release/1.2.0`)
- **Hotfixes**: `hotfix/version` (e.g., `hotfix/1.2.1`)

### Common Git Flow Scenarios

#### Scenario 1: Starting a New Feature

```bash
# Update develop
git checkout develop
git pull origin develop

# Start feature
git flow feature start property-search

# Work on feature...
git add .
git commit -m "feat(property): add search functionality"

# Push to remote
git flow feature publish property-search
```

#### Scenario 2: Syncing Feature with Latest Develop

```bash
# While on feature branch
git checkout feature/your-feature
git pull origin develop
# Resolve any conflicts
git push origin feature/your-feature
```

#### Scenario 3: Finishing a Feature

```bash
# Ensure all tests pass
# Ensure code is reviewed and approved

# Finish feature (merges to develop)
git flow feature finish property-search

# Push develop
git push origin develop
```

### Resources

- **Official Git Flow Documentation**: [https://nvie.com/posts/a-successful-git-branching-model/](https://nvie.com/posts/a-successful-git-branching-model/)
- **Git Flow AVH Edition**: [https://github.com/petervanderdoes/gitflow-avh](https://github.com/petervanderdoes/gitflow-avh)
- **Git Flow Cheat Sheet**: [https://danielkummer.github.io/git-flow-cheatsheet/](https://danielkummer.github.io/git-flow-cheatsheet/)
- **Semantic Versioning**: [https://semver.org/](https://semver.org/)

## Development Workflow

### 1. Set Up Development Environment

Follow the [Setup Guide](SETUP.md) to get your environment ready.

### 2. Initialize Git Flow (First Time Only)

```bash
# Clone repository
git clone https://github.com/yourusername/Atlas-Investor.git
cd Atlas-Investor

# Initialize Git Flow
git flow init
# Accept defaults or customize as needed
```

### 3. Start a Feature Branch

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Start new feature using Git Flow
git flow feature start your-feature-name

# Or manually:
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Write clean, readable code
- Follow code style guidelines
- Add comments for complex logic
- Update documentation as needed

### 4. Write Tests

- Add tests for new features
- Update tests for modified features
- Ensure all tests pass
- Aim for good test coverage

### 5. Commit Changes

Follow the commit message format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

**Examples:**
```
feat(analysis): add cash flow calculation

Add monthly cash flow calculation to rental analysis.
Includes unit tests and API endpoint updates.

Closes #123
```

```
fix(api): handle missing property data gracefully

Return 404 instead of 500 when property not found.
Adds error handling and test coverage.
```

### 6. Push and Create Pull Request

```bash
# Push feature branch to remote
git flow feature publish your-feature-name

# Or manually:
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- **Base branch**: `develop` (not `main`)
- Clear title and description
- Reference related issues
- Screenshots (for UI changes)
- Checklist of changes

**Important**: Always create PRs targeting `develop`, not `main`. Only `release/*` and `hotfix/*` branches merge to `main`.

## Code Style

### Python (Backend)

- Follow [PEP 8](https://pep8.org/)
- Use [Black](https://black.readthedocs.io/) for formatting
- Maximum line length: 88 characters (Black default)
- Use type hints where appropriate

**Format code:**
```bash
cd backend
black .
flake8 .
```

### TypeScript/JavaScript (Frontend)

- Follow [Airbnb Style Guide](https://github.com/airbnb/javascript)
- Use [Prettier](https://prettier.io/) for formatting
- Use ESLint for linting
- Prefer functional components and hooks

**Format code:**
```bash
cd frontend
npm run format
npm run lint
```

### General Guidelines

- **Naming**: Use descriptive names
- **Functions**: Keep functions small and focused
- **Comments**: Explain why, not what
- **DRY**: Don't Repeat Yourself
- **SOLID**: Follow SOLID principles

## Testing

### Backend Tests

```bash
cd backend
# Run all tests
pytest

# Run with coverage
pytest --cov

# Run specific test file
pytest tests/test_analysis.py

# Run with verbose output
pytest -v
```

### Frontend Tests

```bash
cd frontend
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Test Requirements

- All new code must have tests
- Maintain 80%+ code coverage
- Tests should be fast and isolated
- Use descriptive test names

## Pull Request Process

1. **Update your feature branch with latest develop**:
   ```bash
   # While on your feature branch
   git checkout feature/your-feature-name
   git pull origin develop
   # Resolve any conflicts
   git push origin feature/your-feature-name
   ```
   
   **Note**: Always rebase/merge with `develop`, not `main`. The `main` branch is only for production releases.

2. **Ensure all checks pass**:
   - Tests pass
   - Linting passes
   - Code coverage maintained
   - Documentation updated

3. **Request review**:
   - Assign reviewers
   - Add labels
   - Link related issues

4. **Address feedback**:
   - Make requested changes
   - Respond to comments
   - Update PR description if needed

5. **Merge**:
   - PRs are merged into `develop` (not `main`)
   - Squash commits if requested
   - Branch is automatically deleted after merge
   - After merge, update local `develop`:
     ```bash
     git checkout develop
     git pull origin develop
     ```

## Project Structure

```
Atlas-Investor/
├── backend/           # Django backend
│   ├── api/          # API endpoints
│   ├── core/         # Core business logic
│   ├── data/         # Data ingestion
│   ├── analysis/     # Investment analysis
│   └── tests/        # Backend tests
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── __tests__/    # Frontend tests
├── docs/             # Project documentation
└── docs/             # Additional docs
```

## Areas for Contribution

### High Priority

- Data ingestion improvements
- Analysis algorithm enhancements
- UI/UX improvements
- Performance optimization
- Test coverage
- Documentation

### Good First Issues

Look for issues labeled `good first issue` - these are great for newcomers!

### Documentation

- Code comments
- API documentation
- User guides
- Tutorials
- Examples

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open an Issue
- **Features**: Open a Feature Request
- **Code**: Open a Pull Request

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Appreciated in the community!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Atlas Investor! 🎉

