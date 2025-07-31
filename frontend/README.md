# Frontend - Logistics Tracking App

A modern Vue.js 3 frontend application for the logistics tracking system, built with composition API, Tailwind CSS, and comprehensive form handling.

## 🛠️ Tech Stack

- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **Vue Router 4** - Official router for Vue.js
- **Pinia** - State management for Vue.js
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client
- **Vite** - Fast build tool and development server

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── OrderForm.vue        # Order creation form component
│   ├── views/
│   │   ├── Home.vue             # Dashboard with stats and quick actions
│   │   └── OrdersList.vue       # Orders listing with pagination and filtering
│   ├── stores/
│   │   └── app.js               # Pinia store for global state management
│   ├── App.vue                  # Main app component with navigation
│   ├── main.js                  # App entry point with router and store setup
│   └── style.css                # Global styles with Tailwind CSS
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies and scripts
```

## 🎨 Components & Features

### 🚚 OrderForm Component

**Location**: `src/components/OrderForm.vue`

A comprehensive order creation form with the following features:

#### Features:
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Validation**: Client-side validation with instant feedback
- **API Integration**: Axios-based API calls with error handling
- **Loading States**: Visual feedback during form submission
- **Success Handling**: Success messages with auto-redirect
- **Route Preview**: Live preview of shipping route

#### Validation Rules:
- **Sender Name**: Required, 2-100 characters
- **Recipient Name**: Required, 2-100 characters  
- **Origin Address**: Required, 2-200 characters
- **Destination Address**: Required, 2-200 characters
- **Cross-field**: Origin and destination cannot be the same

#### Form States:
- **Idle**: Ready for input
- **Validating**: Real-time validation feedback
- **Submitting**: Loading spinner and disabled inputs
- **Success**: Green success message with tracking number
- **Error**: Red error message with retry option

#### Usage:
```vue
<template>
  <OrderForm />
</template>

<script>
import OrderForm from '@/components/OrderForm.vue'

export default {
  components: { OrderForm }
}
</script>
```

### 📦 OrdersList Component

**Location**: `src/views/OrdersList.vue`

A full-featured orders listing page with advanced functionality:

#### Features:
- **Responsive Layout**: Table view on desktop, card view on mobile
- **Filtering**: Filter by order status
- **Sorting**: Sort by created date, updated date, status, tracking number
- **Pagination**: Smart pagination with page navigation
- **Loading States**: Skeleton loading and error states
- **Empty States**: User-friendly empty state messaging
- **Status Badges**: Color-coded status indicators

#### Filter Options:
- **Status**: All, Pending, In Transit, Delivered, Canceled
- **Per Page**: 5, 10, 25, 50 items
- **Sort By**: Created Date, Updated Date, Status, Tracking Number
- **Sort Order**: Newest First, Oldest First

#### Pagination Features:
- Smart page number display with ellipsis
- Previous/Next navigation buttons
- Current page highlighting
- Results count display

### 🏠 Home Component (Dashboard)

**Location**: `src/views/Home.vue`

Enhanced dashboard with logistics statistics and quick actions:

#### Features:
- **Statistics Cards**: Total shipments, delivered, in transit, pending
- **Delivery Rate**: Progress bar with color-coded performance
- **API Status**: Real-time API connection monitoring
- **Quick Actions**: Direct links to create order and view orders

#### Quick Actions:
- **Create New Order**: Direct navigation to order form
- **View All Orders**: Navigate to orders listing page

## 🗂️ State Management

### App Store (Pinia)

**Location**: `src/stores/app.js`

Centralized state management for:

#### State:
```javascript
{
  isLoading: false,           // Global loading state
  apiConnected: false,        // API connection status
  apiMessage: '',             // API status message
  stats: {                    // Dashboard statistics
    totalShipments: 0,
    delivered: 0,
    inTransit: 0,
    pending: 0
  },
  settings: {                 // App settings
    theme: 'light',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30000
  }
}
```

#### Getters:
- `deliveryRate`: Calculated delivery percentage
- `isApiHealthy`: Boolean API health status
- `loading`: Global loading state

#### Actions:
- `checkApiHealth()`: Test API connectivity
- `updateMockStats()`: Update dashboard statistics
- `initializeApp()`: Initialize app state

## 🎨 Styling & Design

### Tailwind CSS Configuration

Custom color palette and component classes:

#### Primary Colors:
- `primary-50` to `primary-700`: Blue color scale
- `secondary-50` to `secondary-700`: Gray color scale

#### Custom Components:
```css
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
```

### Responsive Design

- **Mobile-first**: Designed for mobile, enhanced for desktop
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Layout**: Flexible grid system with Tailwind CSS

## 🛣️ Routing

### Route Configuration

```javascript
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/orders', name: 'OrdersList', component: OrdersList },
  { path: '/orders/create', name: 'CreateOrder', component: OrderForm }
]
```

### Navigation

Enhanced navigation with:
- **Active State**: Visual indicators for current page
- **Icons**: Emoji and SVG icons for better UX
- **CTA Button**: Prominent "Create Order" button

### Protected Routes (Future)

Ready for authentication integration:
```javascript
// Future implementation
{
  path: '/orders/:id',
  name: 'OrderDetails',
  component: OrderDetails,
  meta: { requiresAuth: true }
}
```

## 🔌 API Integration

### HTTP Client Configuration

Axios configuration with Vite proxy:

**vite.config.js**:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

### Error Handling

Comprehensive error handling patterns:

```javascript
try {
  const response = await axios.post('/api/orders', orderData)
  // Success handling
} catch (error) {
  if (error.response?.data?.details) {
    // Validation errors from backend
  } else if (error.response?.status === 500) {
    // Server errors
  } else if (error.request) {
    // Network errors
  } else {
    // Unexpected errors
  }
}
```

### API Endpoints Used

- `POST /api/orders` - Create new order
- `GET /api/orders` - List orders with filtering/pagination
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/track/:tracking_number` - Track order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order
- `GET /api/health` - API health check

## 🚀 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Lint code
pnpm lint

# Clean build artifacts
pnpm clean
```

### Development Server

- **URL**: http://localhost:5173
- **Hot Reload**: Automatic reloading on file changes
- **API Proxy**: Requests to `/api/*` proxied to backend

### Environment Variables

```env
# Future environment variables
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=Logistics Tracking App
```

## 📱 Mobile Support

### Responsive Features:
- **Touch-friendly**: Large touch targets
- **Mobile Navigation**: Optimized mobile menu
- **Card Layout**: Mobile-optimized order cards
- **Swipe Support**: Ready for gesture integration

### Progressive Web App (Future):
- Service worker ready
- Offline support capability
- App install prompts

## 🧪 Testing (Future Implementation)

### Test Setup:
- **Unit Tests**: Vitest for component testing
- **E2E Tests**: Cypress for end-to-end testing
- **Component Tests**: Vue Test Utils

### Test Coverage Goals:
- Form validation logic
- API integration
- Error handling
- Responsive behavior

## 🔒 Security Features

### Input Sanitization:
- XSS protection with proper escaping
- Input validation and trimming
- CSRF protection ready

### API Security:
- Axios interceptors for auth tokens
- Request/response validation
- Error message sanitization

## 🎯 Performance Optimizations

### Bundle Optimization:
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Route-based lazy loading
- **Asset Optimization**: Automatic image optimization

### Runtime Performance:
- **Reactive Refs**: Efficient Vue reactivity
- **Computed Properties**: Memoized calculations
- **Event Debouncing**: Optimized user interactions

## 🛠️ Browser Support

### Supported Browsers:
- **Chrome**: 90+
- **Firefox**: 90+
- **Safari**: 14+
- **Edge**: 90+

### Polyfills:
- ES6+ features via Vite
- CSS Grid and Flexbox support
- Automatic vendor prefixing

## 🚀 Future Enhancements

### Planned Features:
- **Real-time Updates**: WebSocket integration
- **Advanced Filtering**: Search and multiple filters
- **Bulk Operations**: Multiple order selection
- **Data Export**: CSV/PDF export functionality
- **Dark Mode**: Theme switching capability
- **Offline Support**: PWA with offline caching

### Component Improvements:
- **Order Details View**: Detailed order tracking page
- **Status Update Form**: In-line status management
- **Batch Actions**: Multi-select operations
- **Advanced Charts**: Data visualization with Chart.js

This frontend provides a solid foundation for a production-ready logistics tracking application with modern development practices and comprehensive user experience design. 