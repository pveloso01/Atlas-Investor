# GitHub Project Setup Guide

This guide explains how to set up GitHub Issues, Labels, and Project Boards for Atlas Investor.

## Labels Setup

Go to **Settings → Labels** in your GitHub repository and create the following labels:

### Phase Labels
- **`phase-1`** - Color: `#0E8A16` (green)
  - Description: `Foundation & MVP - Project setup, basic features, and working prototype`
- **`phase-2`** - Color: `#1D76DB` (blue)
  - Description: `Core Features - Advanced analysis, data integration, and core functionality`
- **`phase-3`** - Color: `#FBCA04` (yellow)
  - Description: `Advanced Features - Advanced analytics, reporting, and enhanced features`
- **`phase-4`** - Color: `#D93F0B` (red)
  - Description: `Polish & Scale - Performance optimization, polish, and scaling`

### Component Labels
- **`backend`** - Color: `#0052CC` (blue)
  - Description: `Backend/Django - Python backend, API endpoints, services, and business logic`
- **`frontend`** - Color: `#5319E7` (purple)
  - Description: `Frontend/Next.js - React frontend, UI components, and user interface`
- **`infrastructure`** - Color: `#B60205` (red)
  - Description: `Infrastructure - DevOps, CI/CD, Docker, deployment, and system configuration`

### Type Labels
- **`bug`** - Color: `#D73A4A` (red)
  - Description: `Bug - Something isn't working as expected`
- **`enhancement`** - Color: `#A2EEEF` (cyan)
  - Description: `Enhancement - New feature or improvement request`
- **`task`** - Color: `#7057FF` (purple)
  - Description: `Task - Work item from the implementation roadmap`
- **`documentation`** - Color: `#0075CA` (blue)
  - Description: `Documentation - Documentation updates, guides, and README changes`
- **`refactoring`** - Color: `#C5DEF5` (light blue)
  - Description: `Refactoring - Code refactoring without changing functionality`
- **`testing`** - Color: `#BFD4F2` (light blue)
  - Description: `Testing - Tests, test coverage, and testing infrastructure`

## Project Board Setup

### Recommended: Single Project with Multiple Views

1. Go to **Projects** in your GitHub repository
2. Click **New project** → Select **Board** template
3. Name it: **"Atlas Investor Development"**

### Create Views

#### 1. Development Pipeline (Board View)
- **View Name**: "Development Pipeline"
- **View Type**: Board
- **Columns**:
  - Backlog
  - To Do
  - In Progress
  - In Review
  - Done
- **Purpose**: Track work through development stages

#### 2. Phase Overview (Table View)
- **View Name**: "Phase Overview"
- **View Type**: Table
- **Group by**: Phase labels (`phase-1`, `phase-2`, `phase-3`, `phase-4`)
- **Sort by**: Issue number
- **Purpose**: See progress across all phases

#### 3. Component View (Table View)
- **View Name**: "Component View"
- **View Type**: Table
- **Group by**: Component labels (`backend`, `frontend`, `infrastructure`)
- **Purpose**: See work by component

### Automation (Optional but Recommended)

Set up automation rules in your project:

1. **When issue is assigned** → Move to "In Progress"
2. **When PR is created** → Move linked issue to "In Review"
3. **When PR is merged** → Move linked issue to "Done"

To set up automation:
- Go to your project → Click **⚙️** (Settings) → **Workflows**
- Add automation rules as needed

## Issue Templates

The following issue templates are available:

1. **Bug Report** - For reporting bugs
2. **Feature Request** - For suggesting new features
3. **Task** - For roadmap tasks

To create an issue:
- Go to **Issues** → **New issue**
- Select the appropriate template
- Fill in the required information

## Pull Request Template

When creating a Pull Request, the template will automatically populate. Make sure to:

1. Link related issues using `Closes #123` or `Related to #123`
2. Check all relevant boxes
3. Add screenshots if applicable
4. Ensure all tests pass before requesting review

## Workflow Integration

### Creating Issues from Roadmap

1. Review `docs/IMPLEMENTATION_ROADMAP.md`
2. Create an issue for each task using the **Task** template
3. Add appropriate labels (phase, component, type)
4. Add the issue to your project board

### Git Flow Integration

1. Create an issue for the feature/task
2. Start feature branch: `git flow feature start feature-name`
3. Reference issue in commits: `git commit -m "feat: add property search (#123)"`
4. Open PR targeting `develop` branch
5. Link PR to issue (use "Closes #123" in PR description)
6. Merge after review/CI passes
7. Issue auto-closes when PR merges

## Best Practices

1. **One issue per task** - Don't combine multiple unrelated tasks
2. **Clear titles** - Use descriptive titles that explain what needs to be done
3. **Link related issues** - Use issue references in PRs and other issues
4. **Update status** - Move issues through the board as work progresses
5. **Close completed issues** - Keep the board clean and up-to-date

## Quick Reference

- **Issues**: https://github.com/pveloso01/Atlas-Investor/issues
- **Projects**: https://github.com/pveloso01/Atlas-Investor/projects
- **Labels**: https://github.com/pveloso01/Atlas-Investor/labels
- **Pull Requests**: https://github.com/pveloso01/Atlas-Investor/pulls

