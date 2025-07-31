# 🚚 Logistics Tracking API - Backend

Node.js backend API built with Express.js and Sequelize for PostgreSQL.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Sequelize database configuration (ES modules)
│   ├── middleware/
│   │   └── index.js             # Custom middleware (CORS, error handling, logging)
│   ├── models/
│   │   └── index.js             # Sequelize models index
│   ├── routes/
│   │   ├── index.js             # Main API routes
│   │   └── health.js            # Health check routes
│   ├── utils/                   # Utility functions (placeholder)
│   └── server.js                # Main server entry point
├── config/
│   └── config.cjs               # Sequelize CLI configuration (CommonJS)
├── database/
│   ├── migrations/              # Database migration files
│   └── seeders/                 # Database seeder files
├── .sequelizerc                 # Sequelize CLI paths configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🛠️ Tech Stack

- **Node.js 20** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - PostgreSQL ORM
- **PostgreSQL** - Database
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **dotenv** - Environment variable management

## 🚀 Getting Started

### Prerequisites
- Nix development environment (`nix develop`)
- PostgreSQL running (via Docker Compose)
- Node.js 20+ and pnpm

### Installation & Start

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
pnpm install

# Start development server
pnpm dev

# Or start production server
pnpm start
```

## 📋 Available Scripts

### Development Scripts
```bash
pnpm dev        # Start development server with nodemon (auto-reload)
pnpm start      # Start production server
pnpm build      # Build command (placeholder)
pnpm test       # Run tests with Jest
pnpm lint       # Run ESLint
```

### Database Scripts (Sequelize CLI)
```bash
# Database Management
pnpm db:create                # Create database
pnpm db:drop                  # Drop database
pnpm db:migrate               # Run pending migrations
pnpm db:migrate:undo          # Undo last migration
pnpm db:seed:all              # Run all seeders
pnpm db:seed:undo:all         # Undo all seeders

# Code Generation
pnpm migration:create <name>  # Create new migration
pnpm model:create <name>      # Create new model with migration
pnpm seed:create <name>       # Create new seeder
```

### Example Usage
```bash
# Create a new model and migration
pnpm model:create User --attributes firstName:string,lastName:string,email:string

# Create a standalone migration
pnpm migration:create add-indexes-to-users

# Run migrations
pnpm db:migrate

# Create and run a seeder
pnpm seed:create demo-users
pnpm db:seed:all
```

## 🌐 API Endpoints

### Root Health Check
- `GET /health` - Basic server health status

### API Routes (`/api`)
- `GET /api` - API information and available endpoints
- `GET /api/health` - Basic health check
- `GET /api/health/db` - Database connectivity check  
- `GET /api/health/detailed` - Detailed system health check

### Example Responses

**GET /health**
```json
{
  "status": "OK",
  "message": "Logistics Tracking API is running",
  "timestamp": "2025-07-31T15:17:19.389Z"
}
```

**GET /api/health/db**
```json
{
  "status": "OK",
  "message": "Database connection is healthy",
  "timestamp": "2025-07-31T15:17:19.459Z",
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "logistics_tracking"
  }
}
```

## ⚙️ Configuration

### Environment Variables

The backend reads configuration from environment variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=logistics_tracking
DB_USER=postgres
DB_PASSWORD=postgres
DB_LOGGING=true

# Server Configuration
NODE_ENV=development
PORT=3000
```

### Database Configuration

Database configuration is handled in two places:

**1. Application Config (`src/config/database.js`)**
- ES module format for the application
- Connection pooling with max 5 connections
- Automatic retries and timeout handling
- Development logging (when `DB_LOGGING=true`)
- UTC timezone by default
- Underscored naming for database fields

**2. Sequelize CLI Config (`config/config.cjs`)**
- CommonJS format for CLI commands
- Environment-specific configurations (development, test, production)
- Database creation and migration support
- Production SSL options

### Sequelize CLI Setup

The project includes a fully configured Sequelize CLI setup:

**Configuration Files:**
- `.sequelizerc` - Defines file paths for CLI
- `config/config.cjs` - Database configurations for different environments

**Directory Structure:**
- `database/migrations/` - Database schema changes
- `database/seeders/` - Sample/test data
- `src/models/` - Sequelize model definitions

**Environment Support:**
- **Development** - Local PostgreSQL with logging
- **Test** - Separate test database
- **Production** - Production database with SSL support

**Key Features:**
- Automatic database creation
- Migration tracking and rollback
- Model and migration generation
- Environment-specific configurations
- CommonJS/ES module compatibility

## 🔧 Development Features

### Middleware

- **CORS**: Configured for development and production origins
- **Security**: Helmet.js for security headers
- **Logging**: Request/response logging in development
- **Error Handling**: Centralized error handling with Sequelize error formatting
- **JSON Parsing**: 10MB limit for request bodies

### Database Integration

- **Sequelize ORM** with PostgreSQL
- **Sequelize CLI** for migrations and model generation
- **Connection testing** on server startup
- **Graceful shutdown** with connection cleanup
- **Model organization** ready for future models
- **Database migrations** with version control
- **Database seeders** for test data

### Development Tools

- **Nodemon**: Auto-restart on file changes
- **Environment detection**: Different behavior for dev/prod
- **Health checks**: Multiple endpoints for monitoring
- **Graceful shutdown**: Proper SIGTERM/SIGINT handling

## 📊 Database Models

### Order Model

The Order model represents shipment orders in the logistics system:

**Attributes:**
- `id` - Primary key (auto-increment)
- `trackingNumber` - Unique tracking identifier (6-20 chars)
- `senderName` - Name of the sender (2-100 chars)
- `recipientName` - Name of the recipient (2-100 chars)
- `origin` - Pickup location (2-200 chars)
- `destination` - Delivery location (2-200 chars)
- `status` - Order status enum: 'Pending', 'In Transit', 'Delivered', 'Canceled'
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

**Features:**
- ✅ Status enum with default 'Pending'
- ✅ Comprehensive validation rules
- ✅ Unique tracking number constraint
- ✅ Custom validation (origin ≠ destination)
- ✅ Instance methods: `getFullRoute()`, `isPending()`, `isDelivered()`
- ✅ Database indexes for performance
- ✅ Underscored field names in database

**Usage Example:**
```javascript
import { Order } from './src/models/index.js';

// Create a new order
const order = await Order.create({
  trackingNumber: 'TRK12345678',
  senderName: 'John Doe',
  recipientName: 'Jane Smith',
  origin: 'New York, NY',
  destination: 'Los Angeles, CA'
  // status defaults to 'Pending'
});

// Use instance methods
console.log(order.getFullRoute()); // "New York, NY → Los Angeles, CA"
console.log(order.isPending());    // true
```

## 🏃‍♂️ Next Steps

This backend foundation is ready for:

- ✅ **Order Model** - Complete with validation and enum
- ✅ Authentication middleware
- ✅ Business logic routes
- ✅ Data validation
- ✅ Testing setup
- ✅ Additional models (User, Location, etc.)

## 🐛 Troubleshooting

### Common Issues

1. **Database connection failed**
   - Ensure PostgreSQL is running: `docker-compose ps`
   - Check environment variables in `.env`
   - Verify database credentials

2. **Port already in use**
   - Change `PORT` in `.env` file
   - Kill existing process: `pkill -f "node src/server.js"`

3. **Module not found errors**
   - Run `pnpm install` to install dependencies
   - Ensure you're in the Nix development shell

### Logs

The server provides detailed logging:
- 🚀 Server startup information
- 📡 Database connection status
- 🗄️ Database synchronization
- 📊 Request/response logging (development)
- ❌ Error details with stack traces (development)

---

**Backend API ready for logistics tracking! 🚀** 