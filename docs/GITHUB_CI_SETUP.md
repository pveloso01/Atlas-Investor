# GitHub CI Pipeline Setup Guide

This guide explains how to set up and enable the CI pipeline in GitHub.

## What's Already Done

✅ CI workflow file exists: `.github/workflows/ci.yml`
✅ Workflow configured for:
  - Backend tests with PostgreSQL
  - Frontend tests and build
  - Docker image builds

## What You Need to Do in GitHub

### Step 1: Push the Workflow Files to GitHub

If you haven't already, push the workflow files:

```bash
git add .github/workflows/
git commit -m "ci: add GitHub Actions workflows"
git push origin develop
```

### Step 2: Enable GitHub Actions (Automatic)

GitHub Actions are **automatically enabled** for public repositories. For private repos:

1. Go to your repository on GitHub
2. Click **Settings** → **Actions** → **General**
3. Under "Actions permissions", select **"Allow all actions and reusable workflows"**
4. Click **Save**

### Step 3: Verify Workflow is Active

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You should see the workflow listed
4. It will run automatically on:
   - Push to `main` or `develop` branches
   - Pull requests to `main` or `develop` branches

### Step 4: Test the Pipeline

1. **Create a test commit:**
   ```bash
   git flow feature start test-ci
   # Make a small change
   git commit -m "test: trigger CI pipeline"
   git flow feature finish test-ci
   git push origin develop
   ```

2. **Check the Actions tab:**
   - Go to **Actions** tab in GitHub
   - You should see a workflow run starting
   - Click on it to see the progress

### Step 5: Optional - Set Up Code Coverage (Codecov)

If you want to track code coverage:

1. **Sign up at [codecov.io](https://codecov.io)**
2. **Connect your GitHub repository**
3. **Get your Codecov token** (if required)
4. **Add it as a GitHub Secret:**
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `CODECOV_TOKEN`
   - Value: Your Codecov token
   - Click **Add secret**

The workflow will automatically upload coverage reports.

### Step 6: Optional - Add Status Badge

Add a CI status badge to your README:

1. Go to **Actions** tab
2. Click on the workflow name
3. Click the **...** menu → **Create status badge**
4. Copy the markdown code
5. Add it to your `README.md`:

```markdown
![CI](https://github.com/yourusername/Atlas-Investor/workflows/CI%20Pipeline/badge.svg)
```

## Workflow Details

### What Runs Automatically

**On Push to `main` or `develop`:**
- ✅ Backend tests with PostgreSQL
- ✅ Frontend build and tests
- ✅ Docker image builds

**On Pull Requests:**
- ✅ Same as above
- ✅ Prevents merge if tests fail

### Workflow Jobs

1. **backend-tests**: Runs Django tests with PostgreSQL
2. **frontend-tests**: Runs Next.js build and tests
3. **docker-build**: Builds Docker images (runs after tests pass)

### Environment Variables

The workflow uses these environment variables (set in the workflow file):
- `USE_POSTGRES=True`
- `DB_NAME=test_atlas`
- `DB_USER=postgres`
- `DB_PASSWORD=postgres`
- `DB_HOST=localhost`
- `SECRET_KEY=test-secret-key-for-ci`
- `DEBUG=True`

**No GitHub Secrets needed** for basic CI - everything is configured in the workflow file.

## Troubleshooting

### Workflow Not Running

1. **Check Actions tab** - Is it enabled?
2. **Check branch** - Workflow only runs on `main` and `develop`
3. **Check file location** - Must be in `.github/workflows/ci.yml`
4. **Check syntax** - YAML syntax errors will prevent workflow from running

### Tests Failing

1. **Check the Actions tab** for error details
2. **Check logs** - Click on the failed job to see logs
3. **Common issues:**
   - Database connection errors
   - Missing dependencies
   - Test failures

### Viewing Results

1. Go to **Actions** tab
2. Click on a workflow run
3. Click on a job (e.g., "Backend Tests")
4. Expand steps to see detailed logs

## Next Steps

1. ✅ Push workflow files to GitHub
2. ✅ Verify workflow runs on push
3. ✅ Check test results
4. ✅ Optional: Set up Codecov for coverage tracking
5. ✅ Optional: Add status badge to README

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Codecov Documentation](https://docs.codecov.com/)





