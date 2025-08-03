# 🚚 Logistics Tracking App

A modern logistics tracking application built with Node.js, Express, Vue.js 3, and PostgreSQL. This project uses Nix flakes for reproducible development environments and pnpm workspaces for efficient monorepo management.

## 🏗️ Project Structure

```
logistics-tracking-app/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   └── index.js        # Server entry point
│   └── package.json        # Backend dependencies
├── frontend/               # Vue.js 3 + Tailwind CSS
│   ├── src/
│   │   ├── views/         # Vue views/pages
│   │   ├── App.vue        # Main Vue component
│   │   ├── main.js        # Vue app entry point
│   │   └── style.css      # Tailwind CSS styles
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   └── package.json       # Frontend dependencies
├── flake.nix              # Nix development environment
├── package.json           # Root workspace configuration
├── env.example            # Environment variables template
└── README.md              # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js 20** - Runtime environment
- **Express.js** - Web application framework
- **Sequelize** - PostgreSQL ORM
- **PostgreSQL** - Database
- **JWT** - Authentication

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client

### Development Tools
- **Nix Flakes** - Reproducible development environment
- **pnpm** - Fast, efficient package manager
- **Docker** - Containerization
- **ESLint** - Code linting

## 🚀 Getting Started

### Prerequisites

- [Nix](https://nixos.org/download.html) with flakes enabled
- Git
- or if you are not using nix, install the dependencies below
  - Node.js 20
  - pnpm
  - Docker Desktop

### 1. Clone the Repository

```bash
git clone <repository-url>
cd logistics-tracking-app
```

### 2. Enter Development Environment

**YOU CAN SKIP THIS IF YOU ARE NOT USING NIX**

```bash
nix develop
```

This will automatically set up:
- Node.js 20
- pnpm
- PostgreSQL client
- Docker
- All necessary development tools

### 3. Set Up Environment Variables

```bash
# Copy the environment template
cp env.example .env

# Edit the .env file with your configuration
# Update database credentials, JWT secrets, etc.
```

### 4. Start PostgreSQL Database

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Verify the database is running
docker-compose ps
```

### 5. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

### 6. Set Up Database Schema

```bash
# Run database migrations to create tables
cd backend && pnpm db:migrate
```

### 7. Start Development Servers

```bash
# Start both backend and frontend in parallel
pnpm dev

# Or start them individually in separate terminals:
# Backend (runs on http://localhost:3000)
cd backend && pnpm dev

# Frontend (runs on http://localhost:5173)
cd frontend && pnpm dev
```

## 📋 Available Scripts

### Root Level Commands
```bash
pnpm dev      # Start both backend and frontend
pnpm build    # Build both applications
pnpm test     # Run tests for both applications
pnpm lint     # Lint both applications
pnpm clean    # Clean node_modules and build artifacts
```

### Backend Commands
```bash
cd backend
pnpm dev      # Start development server with nodemon (auto-reload)
pnpm start    # Start production server
pnpm test     # Run Jest tests
pnpm lint     # Run ESLint

# Database Management
pnpm db:migrate        # Run database migrations
pnpm db:migrate:undo   # Undo last migration
pnpm db:seed:all       # Run all seeders
pnpm db:seed:undo:all  # Undo all seeders
pnpm db:create         # Create database
pnpm db:drop           # Drop database
```

## 🔧 Backend Architecture

The backend follows a clean, organized structure:

### Directory Structure
- **`config/`** - Database and application configuration
- **`middleware/`** - Custom Express middleware (CORS, error handling, logging)
- **`models/`** - Sequelize database models
- **`routes/`** - API route definitions
- **`utils/`** - Shared utility functions

### Key Features
- **Express.js** server with organized middleware
- **Sequelize ORM** for PostgreSQL integration
- **Health check endpoints** for monitoring
- **Environment-based configuration**
- **Graceful shutdown** handling
- **Request/response logging** in development
- **Centralized error handling**

### Frontend Commands
```bash
cd frontend
pnpm dev      # Start Vite development server (http://localhost:5173)
pnpm build    # Build for production
pnpm preview  # Preview production build
pnpm test     # Run Vitest tests
pnpm lint     # Run ESLint for Vue files
```

## 🎨 Frontend Architecture

The frontend is built with modern Vue.js 3 and includes:

### Core Features
- **Vue.js 3** with Composition API
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Vue Router** for client-side routing
- **Pinia** for state management
- **Axios** for HTTP requests

### Directory Structure
- **`src/views/`** - Vue page components
- **`src/stores/`** - Pinia state management stores
- **`src/components/`** - Reusable Vue components (future)
- **`src/assets/`** - Static assets (future)

### State Management
The app uses Pinia for centralized state management:
- **API connectivity status**
- **Logistics statistics** (shipments, delivery rates)
- **Application settings** (theme, notifications)
- **Loading states** and error handling

### Styling System
- **Tailwind CSS** with custom design tokens
- **Responsive design** (mobile-first approach)
- **Custom component classes** for consistency
- **Dark mode ready** (in store settings)

### API Integration
- **Proxy configuration** in Vite for seamless development
- **Automatic API health checking**
- **Error handling** and retry logic
- **Mock data generation** for development

## 🐳 Docker PostgreSQL Setup

The project includes a simple Docker Compose configuration for PostgreSQL:

### Database Configuration
- **Image**: `postgres:15-alpine`
- **Container name**: `logistics-postgres`
- **Port**: `5432` (configurable via `DB_PORT`)
- **Database**: `logistics_tracking` (configurable via `DB_NAME`)
- **Username**: `postgres` (configurable via `DB_USER`)
- **Password**: `postgres` (configurable via `DB_PASSWORD`)

### Docker Commands
```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Stop PostgreSQL container
docker-compose stop postgres

# View container logs
docker-compose logs postgres

# Remove container and volumes (⚠️ this will delete all data)
docker-compose down -v
```

### Database Connection
```bash
# Connect using psql from Nix shell
PGPASSWORD=postgres psql -h localhost -U postgres -d logistics_tracking

# Test connection
PGPASSWORD=postgres psql -h localhost -U postgres -d logistics_tracking -c "SELECT version();"
```

### Data Persistence
- Database data is persisted in a Docker volume: `postgres_data`
- Data survives container restarts and updates
- Automatic database initialization on first startup

## 🌐 API Endpoints

### Health Check Endpoints
- `GET /health` - Basic server health status
- `GET /api` - API information and available endpoints  
- `GET /api/health` - Enhanced health check
- `GET /api/health/db` - Database connectivity check
- `GET /api/health/detailed` - Detailed system health (memory, uptime, etc.)

### Example API Response
```json
{
  "message": "Welcome to Logistics Tracking API",
  "version": "1.0.0", 
  "timestamp": "2025-07-31T15:17:19.417Z",
  "endpoints": {
    "health": "/api/health"
  }
}
```

*More business logic endpoints will be added as the application develops.*

## 🔧 Development Environment

The Nix flake provides a complete development environment with:

- **Node.js 20** - Latest LTS version
- **pnpm** - Package manager
- **PostgreSQL** client tools
- **Docker** and Docker Compose
- **Git**, **curl**, **jq** - Development utilities

### Shell Features

When you run `nix develop`, you'll see:
- Environment information display
- Tool versions
- Quick start commands

## 📝 Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=logistics_tracking
DB_USER=postgres
DB_PASSWORD=your_password

# Backend API
PORT=3000
JWT_SECRET=your_jwt_secret

# Frontend
VITE_API_BASE_URL=http://localhost:3000
```
---

**Happy coding! 🚀** 