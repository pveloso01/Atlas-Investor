# UX Components Documentation

This document describes the shared UI components created for consistent loading states, error handling, and user feedback throughout the Atlas Investor application.

## Overview

The application includes a comprehensive set of reusable components to provide excellent user experience:

- **Loading States**: Spinners and skeleton loaders
- **Error Handling**: Error boundaries and error messages
- **Toast Notifications**: Global toast system for feedback
- **Consistent Patterns**: Standardized UX across all pages

## Components

### LoadingSpinner

Location: `frontend/components/Shared/LoadingSpinner.tsx`

A flexible loading spinner component with multiple configuration options.

**Usage:**

```tsx
import LoadingSpinner from '@/components/Shared/LoadingSpinner';

// Basic usage
<LoadingSpinner />

// With custom message
<LoadingSpinner message="Loading properties..." />

// Fullscreen loading
<LoadingSpinner fullScreen message="Processing..." />

// Inline spinner for buttons
import { InlineSpinner } from '@/components/Shared/LoadingSpinner';
<Button>
  <InlineSpinner size={20} />
</Button>
```

**Props:**
- `message?: string` - Text to display below spinner
- `size?: number` - Size of spinner (default: 40)
- `fullScreen?: boolean` - Full screen overlay mode
- `minHeight?: string | number` - Minimum container height

### ErrorBoundary

Location: `frontend/components/Shared/ErrorBoundary.tsx`

React Error Boundary for catching and handling JavaScript errors gracefully.

**Usage:**

```tsx
import ErrorBoundary from '@/components/Shared/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>

// With error callback
<ErrorBoundary onError={(error, errorInfo) => logToSentry(error)}>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
- `children: ReactNode` - Components to wrap
- `fallback?: ReactNode` - Custom error UI
- `onError?: (error, errorInfo) => void` - Error callback

**Features:**
- Automatic error catching
- User-friendly error UI
- "Try Again" and "Go Home" buttons
- Development mode shows error stack traces
- Prevents entire app from crashing

### ErrorMessage

Location: `frontend/components/Shared/ErrorMessage.tsx`

Component for displaying error messages in two variants: inline alerts or full-page errors.

**Usage:**

```tsx
import ErrorMessage from '@/components/Shared/ErrorMessage';

// Inline alert variant
<ErrorMessage
  title="Failed to load"
  message="Unable to fetch data"
  onRetry={refetch}
  variant="alert"
/>

// Full page error
<ErrorMessage
  title="Something went wrong"
  message="An unexpected error occurred"
  error={error}
  onRetry={handleRetry}
  showHomeButton
  variant="page"
/>

// Simple inline error for forms
import { InlineError } from '@/components/Shared/ErrorMessage';
<InlineError message="This field is required" />
```

**Props:**
- `title?: string` - Error title
- `message?: string` - Error description
- `error?: Error | unknown` - Error object (shows stack in dev)
- `onRetry?: () => void` - Retry callback
- `showHomeButton?: boolean` - Show "Go Home" button
- `variant?: 'alert' | 'page'` - Display mode
- `severity?: 'error' | 'warning' | 'info'` - Alert severity

### Skeleton Loaders

Location: `frontend/components/Shared/SkeletonLoader.tsx`

Skeleton loaders for different content types, providing visual feedback during loading.

**Available Skeletons:**

```tsx
import {
  PropertyCardSkeleton,
  PropertyGridSkeleton,
  PropertyDetailSkeleton,
  ListItemSkeleton,
  TableRowSkeleton,
  StatsCardSkeleton,
} from '@/components/Shared/SkeletonLoader';

// Single property card
<PropertyCardSkeleton />

// Grid of property cards
<PropertyGridSkeleton count={6} />

// Property detail page
<PropertyDetailSkeleton />

// List items
<ListItemSkeleton />

// Table rows
<TableRowSkeleton columns={4} />

// Stats/dashboard cards
<StatsCardSkeleton />
```

**Features:**
- Wave animation for visual feedback
- Matches actual component layout
- Reduces perceived loading time
- Improves user experience

### Toast Notifications

Location: `frontend/lib/context/ToastContext.tsx`

Global toast notification system for showing success/error/info messages.

**Setup:**

Already configured in `app/layout.tsx`:

```tsx
<ToastProvider>
  <YourApp />
</ToastProvider>
```

**Usage:**

```tsx
'use client';
import { useToast } from '@/lib/context/ToastContext';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.showSuccess('Operation completed successfully!');
  };

  const handleError = () => {
    toast.showError('Something went wrong');
  };

  const handleCustom = () => {
    toast.showToast('Custom message', 'warning', 5000);
  };

  // Available methods:
  // - showSuccess(message, duration?)
  // - showError(message, duration?)
  // - showWarning(message, duration?)
  // - showInfo(message, duration?)
  // - showToast(message, severity, duration?)
}
```

**Features:**
- Multiple toasts stack vertically
- Auto-dismiss after configurable duration
- Manual close option
- Color-coded by severity
- Non-blocking (bottom-right position)

## Implementation Guidelines

### Loading States

1. **Always show loading feedback for async operations**:
   ```tsx
   if (isLoading) return <LoadingSpinner message="Loading data..." />;
   ```

2. **Use skeleton loaders for better UX**:
   ```tsx
   if (isLoading) {
     return <PropertyGridSkeleton count={6} />;
   }
   ```

3. **Show inline spinners for button actions**:
   ```tsx
   <Button disabled={isSubmitting}>
     {isSubmitting ? <InlineSpinner /> : 'Submit'}
   </Button>
   ```

### Error Handling

1. **Wrap page components in ErrorBoundary**:
   ```tsx
   export default function MyPage() {
     return (
       <ErrorBoundary>
         <PageContent />
       </ErrorBoundary>
     );
   }
   ```

2. **Display error messages for API failures**:
   ```tsx
   if (isError) {
     return (
       <ErrorMessage
         title="Failed to load"
         error={error}
         onRetry={refetch}
         variant="page"
       />
     );
   }
   ```

3. **Use inline errors for form validation**:
   ```tsx
   {errors.email && <InlineError message={errors.email} />}
   ```

### Toast Notifications

1. **Use for success confirmations**:
   ```tsx
   const handleSave = async () => {
     try {
       await saveData();
       toast.showSuccess('Saved successfully!');
     } catch {
       toast.showError('Failed to save');
     }
   };
   ```

2. **Don't overuse toasts**:
   - ✅ Good: "Property added to portfolio"
   - ❌ Bad: "Page loaded" (use loading states instead)

3. **Be specific and actionable**:
   - ✅ Good: "Email verification sent. Check your inbox."
   - ❌ Bad: "Success"

## Updated Pages

The following pages have been updated with the new UX components:

### Dashboard (`app/dashboard/page.tsx`)
- ✅ Skeleton loaders for property list
- ✅ Error message with retry
- ✅ Loading states for async data

### Property Detail (`app/properties/[id]/page.tsx`)
- ✅ Full skeleton for detail page
- ✅ Page-level error handling
- ✅ Retry functionality

### Portfolio (`app/portfolio/page.tsx`)
- ✅ Snackbar notifications for actions
- ✅ Loading states for mutations
- ✅ Error handling (already implemented)

### Root Layout (`app/layout.tsx`)
- ✅ Global ErrorBoundary
- ✅ ToastProvider for all pages

## Best Practices

### Loading States
- Show loading immediately when action starts
- Use appropriate loading indicator (spinner vs skeleton)
- Provide context ("Loading properties...")
- Never leave users guessing

### Error Handling
- Always handle errors gracefully
- Provide clear error messages
- Offer recovery options (retry, go home)
- Log errors in production (Sentry, etc.)
- Show stack traces only in development

### User Feedback
- Confirm successful actions with toasts
- Use appropriate severity levels
- Keep messages concise and actionable
- Auto-dismiss after 6 seconds (default)
- Allow manual dismissal

### Accessibility
- All components use semantic HTML
- Proper ARIA labels
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## Testing

```bash
# Test components in isolation
cd frontend
npm test -- LoadingSpinner.test.tsx
npm test -- ErrorBoundary.test.tsx
npm test -- ErrorMessage.test.tsx

# Test toast functionality
npm test -- ToastContext.test.tsx
```

## Future Enhancements

- [ ] Add progress bars for long operations
- [ ] Implement optimistic UI updates
- [ ] Add offline mode indicators
- [ ] Enhance error tracking (Sentry integration)
- [ ] Add accessibility testing
- [ ] Implement custom loading animations
- [ ] Add haptic feedback for mobile

## Resources

- [Material-UI Skeleton](https://mui.com/material-ui/react-skeleton/)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [UX Best Practices](https://www.nngroup.com/articles/progress-indicators/)

