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
│   │   ├── OrdersList.vue       # Orders listing with pagination and filtering
│   │   ├── OrderDetails.vue     # Detailed order view with status updates
│   │   └── TrackOrder.vue       # Public order tracking by tracking number
│   ├── stores/
│   │   ├── app.js               # Pinia store for global state management
│   │   └── orders.js            # Pinia store for order management (CRUD operations)
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

#### Action Buttons:
- **View Details**: Navigate to order details page
- **Update Status**: Navigate to status update form (for pending orders)
- **Cancel Order**: Delete order with confirmation dialog (for pending orders only)
  - Confirmation dialog prevents accidental cancellations
  - Loading state shows "Cancelling..." during API call
  - Comprehensive error handling with user-friendly messages
  - Automatic list refresh after successful cancellation

### 📦 OrderDetails Component

**Location**: `src/views/OrderDetails.vue`

Comprehensive order details view with integrated status update functionality:

#### Features:
- **Complete Order Information**: Full order details with visual timeline
- **Status Update Integration**: Dropdown to change order status with validation
- **Business Rules Enforcement**: Status transition validation and restrictions
- **Cancel Order Functionality**: Delete orders with confirmation (pending only)
- **Copy Tracking Number**: One-click clipboard copy functionality
- **Timeline Visualization**: Visual order progress and status history
- **Toast Notifications**: Success/error messages with auto-dismiss
- **Responsive Layout**: Sidebar actions on desktop, stacked on mobile

#### Business Rules:
- **Status Transitions**: 
  - Pending → In Transit, Canceled
  - In Transit → Delivered, Canceled
  - Delivered → (no changes allowed)
  - Canceled → (no changes allowed)
- **Cancellation**: Only pending orders can be canceled
- **Validation**: All status changes validated on both client and server

#### Route Parameters:
```javascript
// Access via /orders/:id
{ path: '/orders/:id', name: 'OrderDetails', component: OrderDetails, props: true }
```

### 🔍 TrackOrder Component

**Location**: `src/views/TrackOrder.vue`

Public order tracking component for customers to track shipments:

#### Features:
- **Public Access**: No authentication required for tracking
- **Tracking Number Input**: Large, user-friendly input with validation
- **Real-time Status**: Live order status with progress visualization
- **Delivery Progress**: Visual progress bar with status steps
- **Timeline Display**: Order creation and status update history
- **Copy Functionality**: Copy tracking number to clipboard
- **Refresh Capability**: Re-fetch latest order status
- **Error Handling**: User-friendly error messages for invalid tracking numbers

#### Progress Visualization:
- **Order Placed**: Initial status (yellow)
- **In Transit**: Shipping status (blue) 
- **Delivered**: Final status (green)
- **Canceled**: Canceled status (red)

#### Usage:
```javascript
// Access via /track
// User enters tracking number like: TRK123456ABCDEF
```

### 🏠 Home Component (Dashboard)

**Location**: `src/views/Home.vue`

Enhanced dashboard with logistics statistics and quick actions:

#### Features:
- **Statistics Cards**: Total shipments, delivered, in transit, pending
- **Delivery Rate**: Progress bar with color-coded performance
- **API Status**: Real-time API connection monitoring
- **Quick Actions**: Direct links to create order, view orders, and track orders

#### Quick Actions:
- **Create New Order**: Direct navigation to order form
- **View All Orders**: Navigate to orders listing page
- **Track Order**: Navigate to public tracking page

## 🗂️ State Management

The application uses **Pinia** for comprehensive state management with two main stores:

### Orders Store (Primary) - `src/stores/orders.js`

**The main store handling all order-related operations and state:**

#### State:
```javascript
{
  orders: [],                 // Array of all loaded orders
  currentOrder: null,         // Currently selected order details
  trackedOrder: null,         // Order being tracked publicly
  loading: {                  // Loading states for different operations
    orders: false,
    currentOrder: false,
    creating: false,
    updating: false,
    deleting: false,
    tracking: false
  },
  errors: {                   // Error states for different operations
    orders: null,
    currentOrder: null,
    creating: null,
    updating: null,
    deleting: null,
    tracking: null
  },
  pagination: {               // Pagination metadata
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    ordersPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  },
  filters: {                  // Current filters and sorting
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  }
}
```

#### Advanced Getters:
- `ordersByStatus(status)`: Filter orders by specific status
- `pendingOrders`: All pending orders
- `inTransitOrders`: All in-transit orders
- `deliveredOrders`: All delivered orders
- `canceledOrders`: All canceled orders
- `ordersCount`: Count of orders by status (used for dashboard stats)
- `isLoading`: True if any operation is loading
- `hasErrors`: True if any errors exist
- `getOrderById(id)`: Find order by ID
- `getOrderByTrackingNumber(trackingNumber)`: Find order by tracking number

#### Complete CRUD Actions:
- `fetchOrders(options)`: Fetch orders with pagination and filtering
- `fetchOrderById(id)`: Fetch single order details
- `createOrder(orderData)`: Create new order
- `updateOrderStatus(orderId, newStatus)`: Update order status
- `cancelOrder(orderId)`: Cancel/delete order
- `trackOrder(trackingNumber)`: Track order by tracking number
- `filterByStatus(status)`: Filter orders by status
- `sortOrders(sortBy, sortOrder)`: Sort orders
- `nextPage()` / `previousPage()` / `goToPage(page)`: Pagination navigation
- `refreshOrders()`: Re-fetch current page
- `initialize()`: Initialize store on app startup
- `reset()`: Reset store to initial state

#### Error Handling:
- Comprehensive error states for each operation type
- Automatic error clearing and message formatting
- Network error detection and user-friendly messages
- Centralized error management across all components

### App Store (General) - `src/stores/app.js`

**General application state and API connectivity:**

#### State:
```javascript
{
  isLoading: false,           // Global loading state
  apiConnected: false,        // API connection status
  apiMessage: '',             // API status message
  settings: {                 // App settings
    theme: 'light',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30000
  }
}
```

#### Getters:
- `isApiHealthy`: Boolean API health status
- `loading`: Global loading state

#### Actions:
- `checkApiHealth()`: Test API connectivity
- `initializeApp()`: Initialize app state

### Complete Store Integration

**All components are fully integrated with the stores:**

- **OrdersList**: Uses orders store for listing, filtering, pagination, and cancellation
- **OrderDetails**: Uses orders store for fetching details, status updates, and cancellation  
- **OrderForm**: Uses orders store for order creation
- **TrackOrder**: Uses orders store for public tracking
- **Home**: Uses orders store for real-time statistics and app store for API status

#### Usage Example:
```javascript
import { useOrdersStore } from '../stores/orders.js'

export default {
  setup() {
    const ordersStore = useOrdersStore()
    
    // Access reactive state
    const orders = computed(() => ordersStore.orders)
    const loading = computed(() => ordersStore.loading.orders)
    const error = computed(() => ordersStore.errors.orders)
    
    // Use store actions
    const fetchOrders = () => ordersStore.fetchOrders()
    const createOrder = (data) => ordersStore.createOrder(data)
    
    return { orders, loading, error, fetchOrders, createOrder }
  }
}
```

### Benefits of Store Architecture:

✅ **Centralized State**: All order data managed in one place  
✅ **Consistent Loading States**: Unified loading indicators across components  
✅ **Error Handling**: Centralized error management with user-friendly messages  
✅ **Data Synchronization**: Automatic updates across all components  
✅ **Performance**: Efficient data fetching and caching  
✅ **Real-time Stats**: Dashboard uses actual order data instead of mock data  
✅ **Developer Experience**: Clean, predictable state management patterns

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
  { path: '/orders/create', name: 'CreateOrder', component: OrderForm },
  { path: '/orders/:id', name: 'OrderDetails', component: OrderDetails, props: true },
  { path: '/track', name: 'TrackOrder', component: TrackOrder }
]
```

#### Route Details:
- **`/`** - Dashboard with statistics and quick actions
- **`/orders`** - Complete orders listing with filtering and pagination
- **`/orders/create`** - Order creation form
- **`/orders/:id`** - Detailed order view with status update functionality  
- **`/track`** - Public order tracking by tracking number

### Navigation

Enhanced navigation with:
- **Active State**: Visual indicators for current page  
- **Icons**: Emoji and SVG icons for better UX
- **CTA Button**: Prominent "Create Order" button
- **Public Access**: Track page accessible without authentication

#### Navigation Structure:
- **📊 Dashboard** - Home page with statistics and quick actions
- **📦 Orders** - Orders management (active for both list and details)
- **🔍 Track** - Public order tracking
- **Create Order** - Prominent call-to-action button

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
- `DELETE /api/orders/:id` - Cancel order (pending orders only)
- `GET /api/health` - API health check

#### Cancel Order Implementation:
```javascript
const cancelOrder = async (order) => {
  if (!confirm(`Are you sure you want to cancel order ${order.trackingNumber}?`)) {
    return
  }
  
  cancellingOrders.value.push(order.id)
  
  try {
    await axios.delete(`/api/orders/${order.id}`)
    alert(`Order ${order.trackingNumber} has been cancelled successfully.`)
    await fetchOrders() // Refresh list
  } catch (error) {
    // Comprehensive error handling
    handleCancelError(error)
  } finally {
    cancellingOrders.value = cancellingOrders.value.filter(id => id !== order.id)
  }
}
```

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
- **Batch Actions**: Multi-select operations for orders
- **Advanced Charts**: Data visualization with Chart.js  
- **Real-time Updates**: WebSocket integration for live status updates
- **Advanced Search**: Full-text search across orders
- **Export Functionality**: PDF/CSV export for order data

## 🔒 Business Rules Implementation

### Status Transition Rules:
```javascript
const transitions = {
  'Pending': ['In Transit', 'Canceled'],
  'In Transit': ['Delivered', 'Canceled'], 
  'Delivered': [], // Terminal state
  'Canceled': []   // Terminal state
}

// Validation function
const isValidStatusTransition = (currentStatus, newStatus) => {
  return transitions[currentStatus]?.includes(newStatus) || false
}
```

### Order Cancellation Rules:
- Only orders with **"Pending"** status can be canceled
- Confirmation dialog required for all cancellations
- Successful cancellation removes order from database
- Failed cancellations show appropriate error messages

### Tracking Number Validation:
- Format: `TRK` + 6-digit timestamp + 6-character hex string
- Example: `TRK859243AB7D2F`
- Client-side format validation before API calls
- Server-side validation for additional security

## 🎯 Component Integration

### Complete User Workflows:

**1. Order Creation Flow:**
```
Dashboard → Create Order → Form Validation → API Call → Success → Redirect to Orders
```

**2. Order Management Flow:**
```
Dashboard → Orders List → View Details → Update Status → Confirmation → Refresh
```

**3. Public Tracking Flow:**
```
Dashboard/Direct → Track Order → Enter Tracking # → API Call → Display Status
```

**4. Order Cancellation Flow:**
```
Orders List → View Details → Cancel Order → Confirmation → API Delete → Redirect
```

This frontend provides a comprehensive, production-ready logistics tracking application with modern development practices, robust business rule enforcement, and exceptional user experience design. 