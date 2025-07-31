# 🚚 Logistics Tracking API - Backend

Node.js backend API built with Express.js and Sequelize for PostgreSQL.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Sequelize database configuration
│   ├── middleware/
│   │   └── index.js             # Custom middleware (CORS, error handling, logging)
│   ├── models/
│   │   └── index.js             # Sequelize models index
│   ├── routes/
│   │   ├── index.js             # Main API routes
│   │   └── health.js            # Health check routes
│   ├── utils/                   # Utility functions (placeholder)
│   └── server.js                # Main server entry point
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

```bash
pnpm dev        # Start development server with nodemon (auto-reload)
pnpm start      # Start production server
pnpm build      # Build command (placeholder)
pnpm test       # Run tests with Jest
pnpm lint       # Run ESLint
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

Database configuration is handled in `src/config/database.js`:

- **Connection pooling** with max 5 connections
- **Automatic retries** and timeout handling
- **Development logging** (when `DB_LOGGING=true`)
- **UTC timezone** by default
- **Underscored naming** for database fields

## 🔧 Development Features

### Middleware

- **CORS**: Configured for development and production origins
- **Security**: Helmet.js for security headers
- **Logging**: Request/response logging in development
- **Error Handling**: Centralized error handling with Sequelize error formatting
- **JSON Parsing**: 10MB limit for request bodies

### Database Integration

- **Sequelize ORM** with PostgreSQL
- **Connection testing** on server startup
- **Graceful shutdown** with connection cleanup
- **Model organization** ready for future models

### Development Tools

- **Nodemon**: Auto-restart on file changes
- **Environment detection**: Different behavior for dev/prod
- **Health checks**: Multiple endpoints for monitoring
- **Graceful shutdown**: Proper SIGTERM/SIGINT handling

## 🏃‍♂️ Next Steps

This backend foundation is ready for:

- ✅ Database models (User, Shipment, etc.)
- ✅ Authentication middleware
- ✅ Business logic routes
- ✅ Data validation
- ✅ Testing setup
- ✅ Additional middleware

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