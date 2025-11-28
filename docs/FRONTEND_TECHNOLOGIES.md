# Frontend Technologies Guide

This guide explains the key frontend technologies used in Atlas Investor: **Redux**, **Axios**, and **React Router**.

---

## Table of Contents

1. [React Router](#react-router) - Navigation and routing
2. [Axios](#axios) - HTTP client for API calls
3. [Redux](#redux) - State management

---

## React Router

### What is React Router?

React Router is a library that enables **client-side routing** in React applications. It allows you to create a single-page application (SPA) where different URLs show different components, without full page reloads.

### Why Use It?

- **Better UX**: No page reloads when navigating
- **Bookmarkable URLs**: Users can bookmark specific pages
- **Browser history**: Back/forward buttons work correctly
- **Clean separation**: Each route maps to a specific page/component

### How It Works in Our Project

#### 1. Setting Up Routes (`App.tsx`)

```typescript
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
```

**Explanation:**
- `<Routes>`: Container that holds all route definitions
- `<Route>`: Defines a URL path and which component to render
- `path="/"`: The URL path (e.g., `http://localhost:3000/`)
- `element={<HomePage />}`: The component to render when that path matches

#### 2. Navigating Between Pages (`HomePage.tsx`)

```typescript
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  return (
    <Button onClick={() => navigate('/properties')}>
      Browse Properties
    </Button>
  );
};
```

**Key Concepts:**
- `useNavigate()`: Hook that returns a function to navigate programmatically
- `navigate('/properties')`: Changes the URL and renders the matching component
- You can also use `<Link>` component for navigation (see below)

#### 3. Alternative: Using `<Link>` Component

```typescript
import { Link } from 'react-router-dom';

// Instead of Button with onClick
<Link to="/properties">Browse Properties</Link>
```

**When to use:**
- `<Link>`: For navigation links (like `<a>` tags)
- `navigate()`: For programmatic navigation (after form submission, conditional logic, etc.)

#### 4. Getting Current Route Information

```typescript
import { useLocation, useParams } from 'react-router-dom';

// Get current URL path
const location = useLocation();
console.log(location.pathname); // e.g., "/properties"

// Get URL parameters (e.g., /properties/:id)
const { id } = useParams();
```

### Common Patterns

#### Protected Routes (Future Implementation)

```typescript
// Example: Only show if user is logged in
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = /* check auth */;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Usage
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

#### URL Parameters

```typescript
// Route definition
<Route path="/properties/:id" element={<PropertyDetailPage />} />

// In PropertyDetailPage component
const { id } = useParams(); // Gets the :id from URL
```

---

## Axios

### What is Axios?

Axios is a **promise-based HTTP client** for making API requests. It's easier to use than the built-in `fetch()` API and provides better defaults.

### Why Use It?

- **Simpler syntax**: Less boilerplate than `fetch()`
- **Automatic JSON parsing**: No need to call `.json()`
- **Request/Response interceptors**: Perfect for adding auth tokens
- **Better error handling**: Automatic error handling
- **Request cancellation**: Can cancel requests if needed

### How It Works in Our Project

#### 1. Creating an Axios Instance (`services/api.ts`)

```typescript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,  // All requests will start with this URL
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Explanation:**
- `axios.create()`: Creates a custom instance with default settings
- `baseURL`: Automatically prepends to all request URLs
- `headers`: Default headers for all requests

#### 2. Request Interceptor (Adding Auth Token)

```typescript
// Automatically add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**What this does:**
- Runs before every API request
- Checks if user has a token in localStorage
- Adds `Authorization: Bearer <token>` header if token exists
- No need to manually add token to each request!

#### 3. Making API Calls

```typescript
import api from './services/api';

// GET request
const fetchProperties = async () => {
  try {
    const response = await api.get('/properties/');
    console.log(response.data); // The actual data
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// POST request
const createProperty = async (propertyData) => {
  try {
    const response = await api.post('/properties/', propertyData);
    return response.data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

// PUT request (update)
const updateProperty = async (id, propertyData) => {
  const response = await api.put(`/properties/${id}/`, propertyData);
  return response.data;
};

// DELETE request
const deleteProperty = async (id) => {
  await api.delete(`/properties/${id}/`);
};
```

**Key Points:**
- `api.get('/properties/')` → `GET http://localhost:8000/api/properties/`
- `response.data`: Contains the actual response body
- Always use `try/catch` for error handling
- Axios automatically throws errors for HTTP error status codes (4xx, 5xx)

#### 4. Using in Components

```typescript
import React, { useEffect, useState } from 'react';
import api from './services/api';

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.get('/properties/');
        setProperties(data.data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Run once on mount

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {properties.map(property => (
        <div key={property.id}>{property.address}</div>
      ))}
    </div>
  );
};
```

### Common Patterns

#### Handling Errors

```typescript
try {
  const response = await api.get('/properties/');
} catch (error) {
  if (error.response) {
    // Server responded with error status
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  } else if (error.request) {
    // Request made but no response
    console.error('No response received');
  } else {
    // Something else went wrong
    console.error('Error:', error.message);
  }
}
```

#### Query Parameters

```typescript
// GET /api/properties/?property_type=apartment&region=1
const response = await api.get('/properties/', {
  params: {
    property_type: 'apartment',
    region: 1,
  },
});
```

---

## Redux

### What is Redux?

Redux is a **state management library** that helps you manage application-wide state in a predictable way. It's especially useful when:
- Multiple components need the same data
- State needs to be shared across the app
- You need to track state changes over time

### Why Use It?

- **Centralized state**: All app state in one place
- **Predictable updates**: State can only change through "actions"
- **Time-travel debugging**: Can see state at any point in time
- **Easy testing**: Pure functions are easy to test

### Core Concepts

1. **Store**: The single source of truth (like a database)
2. **Actions**: Plain objects describing what happened (like "USER_LOGGED_IN")
3. **Reducers**: Functions that update state based on actions
4. **Dispatch**: Function to send actions to the store

### How It Works in Our Project

#### 1. Store Setup (`store/store.ts`)

```typescript
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Add reducers here as we build features
    // Example: auth: authReducer,
    //          properties: propertiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Explanation:**
- `configureStore()`: Creates the Redux store (Redux Toolkit simplifies this)
- `reducer`: Object where each key is a "slice" of state
- `RootState`: TypeScript type for the entire state
- `AppDispatch`: TypeScript type for the dispatch function

#### 2. Providing Store to App (`index.tsx`)

```typescript
import { Provider } from 'react-redux';
import { store } from './store/store';

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

**What this does:**
- `<Provider>`: Makes the store available to all components
- Any component can now access the Redux store

#### 3. Typed Hooks (`store/hooks.ts`)

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Why?**
- TypeScript support: These hooks know about our state structure
- Use these instead of plain `useDispatch`/`useSelector`

### Example: Creating a Feature Slice

Let's create a simple example for managing properties:

#### Step 1: Create a Slice (`store/slices/propertiesSlice.ts`)

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async action to fetch properties
export const fetchProperties = createAsyncThunk(
  'properties/fetch',
  async () => {
    const response = await api.get('/properties/');
    return response.data;
  }
);

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Slice (reducer + actions)
const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    // Synchronous actions
    clearProperties: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // Handle async actions
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearProperties } = propertiesSlice.actions;
export default propertiesSlice.reducer;
```

#### Step 2: Add to Store

```typescript
// store/store.ts
import propertiesReducer from './slices/propertiesSlice';

export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
  },
});
```

#### Step 3: Use in Component

```typescript
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProperties } from '../store/slices/propertiesSlice';

const PropertiesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {items.map(property => (
        <div key={property.id}>{property.address}</div>
      ))}
    </div>
  );
};
```

### Redux Flow Diagram

```
Component
   │
   │ dispatch(action)
   ▼
Action Creator
   │
   │ returns action object
   ▼
Reducer
   │
   │ updates state
   ▼
Store (State Updated)
   │
   │ notifies subscribers
   ▼
Component Re-renders
```

### Key Concepts Explained

#### 1. **Actions**
```typescript
// Action is just a plain object
{ type: 'properties/fetch', payload: [...] }
```

#### 2. **Reducers**
```typescript
// Pure function: (state, action) => newState
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'properties/fetch':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};
```

#### 3. **Selectors**
```typescript
// Get specific data from state
const properties = useAppSelector((state) => state.properties.items);
const loading = useAppSelector((state) => state.properties.loading);
```

### When to Use Redux vs Local State

**Use Redux for:**
- User authentication state
- Data fetched from API (properties, regions)
- Shopping cart, saved items
- Theme preferences
- Any data shared across multiple components

**Use Local State (`useState`) for:**
- Form inputs
- UI state (modals, dropdowns)
- Component-specific temporary data
- Data only used in one component

---

## Putting It All Together

Here's a complete example using all three technologies:

```typescript
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProperty } from '../store/slices/propertiesSlice';
import api from '../services/api';

const PropertyDetailPage: React.FC = () => {
  // React Router: Get ID from URL
  const { id } = useParams();
  const navigate = useNavigate();

  // Redux: Get state and dispatch
  const dispatch = useAppDispatch();
  const property = useAppSelector((state) => 
    state.properties.items.find(p => p.id === Number(id))
  );

  // Fetch property on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchProperty(id));
    }
  }, [id, dispatch]);

  // Axios: Delete property
  const handleDelete = async () => {
    try {
      await api.delete(`/properties/${id}/`);
      navigate('/properties'); // React Router: Navigate away
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (!property) return <div>Loading...</div>;

  return (
    <div>
      <h1>{property.address}</h1>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};
```

---

## Summary

| Technology | Purpose | Key Concept |
|------------|---------|-------------|
| **React Router** | Navigation | Routes map URLs to components |
| **Axios** | HTTP requests | Promise-based API client with interceptors |
| **Redux** | State management | Centralized store with actions and reducers |

---

## Next Steps

1. **React Router**: Try adding a new route and navigating to it
2. **Axios**: Make a test API call to see data in the console
3. **Redux**: Create a simple slice for a feature (start with something small like a counter)

## Resources

- [React Router Docs](https://reactrouter.com/)
- [Axios Docs](https://axios-http.com/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Redux Tutorial](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)

