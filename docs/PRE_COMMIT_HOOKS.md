# Pre-Commit Hooks Documentation

This project uses comprehensive pre-commit hooks to ensure code quality, security, and consistency across both frontend and backend codebases.

## Overview

The pre-commit hooks system consists of:

1. **Husky** - Git hooks manager (Node.js based)
2. **lint-staged** - Run linters on staged files only
3. **Pre-commit framework** - Python-based hook system (optional)

## What Gets Checked

### Frontend Checks (on staged frontend files)

1. **Linting** - ESLint with Next.js configuration
2. **Formatting** - Prettier for consistent code style
3. **Type Checking** - TypeScript compiler check
4. **Tests** - Jest test suite
5. **Coverage** - Ensures test coverage stays above 80%
6. **Security** - npm audit for vulnerable dependencies
7. **Build** - Verifies the project builds successfully

### Backend Checks (on staged backend files)

1. **Formatting** - Black code formatter
2. **Linting** - Flake8 for Python style and errors
3. **Type Checking** - mypy for type annotations
4. **Tests** - Django test suite
5. **Security** - Bandit for security vulnerabilities
6. **Dependencies** - Safety check for vulnerable packages

### Commit Message Validation

- Must follow [Conventional Commits](https://www.conventionalcommits.org/) format
- Format: `<type>(<scope>): <subject>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`
- Minimum 10 characters, recommended max 100 characters

## Installation

The hooks are automatically installed when you run:

```bash
npm install  # In frontend directory (installs Husky)
```

Or manually:

```bash
# Install Husky
cd frontend
npm install

# Install backend dev dependencies
cd ../backend
source venv/bin/activate
pip install -r requirements-dev.txt

# Optional: Install pre-commit framework
pip install pre-commit
pre-commit install
```

## Usage

The hooks run automatically when you:

- **Commit**: `git commit` - Runs all checks on staged files
- **Push**: `git push` - Runs full test suite

### Bypassing Hooks (Not Recommended)

If you absolutely need to bypass hooks (emergency fixes only):

```bash
git commit --no-verify
git push --no-verify
```

⚠️ **Warning**: Only bypass hooks in emergencies. Always fix issues properly.

## Configuration Files

- `.husky/pre-commit` - Main pre-commit hook script
- `.husky/commit-msg` - Commit message validation
- `.husky/pre-push` - Pre-push checks
- `frontend/.prettierrc.json` - Prettier configuration
- `frontend/.prettierignore` - Files to ignore for Prettier
- `backend/.flake8` - Flake8 configuration
- `backend/pyproject.toml` - Black, mypy, pytest, bandit configs
- `backend/.bandit` - Bandit security scanner config
- `.pre-commit-config.yaml` - Pre-commit framework config (optional)

## Fixing Common Issues

### Frontend Issues

**ESLint errors:**
```bash
cd frontend
npm run lint:fix
```

**Formatting issues:**
```bash
cd frontend
npm run format
```

**Type errors:**
```bash
cd frontend
npm run type-check
```

**Test failures:**
```bash
cd frontend
npm test
```

### Backend Issues

**Formatting issues:**
```bash
cd backend
source venv/bin/activate
black .
```

**Linting errors:**
```bash
cd backend
source venv/bin/activate
flake8 .
```

**Type errors:**
```bash
cd backend
source venv/bin/activate
mypy .
```

**Test failures:**
```bash
cd backend
source venv/bin/activate
python manage.py test
```

## Coverage Requirements

- **Frontend**: Minimum 80% statement coverage
- **Backend**: Minimum 80% coverage (configured in pytest)

## Security Checks

The hooks run security scans but don't block commits for:
- Low severity npm vulnerabilities
- Bandit warnings (non-critical)
- Safety warnings (non-critical)

However, you should still address these issues. Check reports in:
- Frontend: `npm audit`
- Backend: `/tmp/bandit-output.txt` and `safety check`

## Troubleshooting

### Hooks not running

1. Check if Husky is installed: `ls -la .husky/`
2. Verify prepare script: `cat frontend/package.json | grep prepare`
3. Reinstall: `cd frontend && npm install`

### Coverage check failing

If coverage drops below 80%, add more tests or adjust the threshold in:
- Frontend: `.husky/pre-commit` (line with coverage check)
- Backend: `backend/pyproject.toml` (pytest.ini_options.cov-fail-under)

### Build failing

Check build output:
- Frontend: `/tmp/build-output.txt`
- Backend: Check Django settings and migrations

## Best Practices

1. **Always run hooks** - Don't bypass unless absolutely necessary
2. **Fix issues locally** - Run checks manually before committing
3. **Keep coverage high** - Add tests for new code
4. **Follow commit format** - Use conventional commits
5. **Review security warnings** - Even if non-blocking

## CI/CD Integration

These hooks complement CI/CD pipelines. The same checks run in:
- Pre-commit (local)
- Pre-push (local)
- CI pipeline (remote)

This ensures code quality at every stage.

