# VPS-Based Event-Driven Car Booking System

## Architecture Overview

- **Frontend**: Next.js 14 with App Router, TailwindCSS + DaisyUI
- **Backend**: Node.js API with Fastify, PostgreSQL, Redis
- **Real-time**: Socket.IO with role-based access control
- **Workers**: Event-driven microservices for notifications, driver assignment, admin updates, analytics, cleanup

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with your database and service URLs
```

3. **Database Setup**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

4. **Start Services**
```bash
# Development
npm run dev

# Start workers (separate terminal)
npm run workers:all

# Production with PM2
pm2 start ecosystem.config.js
```

## Key Features

- **Redis Locking**: 10-minute car reservations with countdown
- **Event-Driven**: Redis pub/sub for all booking events
- **Real-time Updates**: Socket.IO rooms for customers, drivers, admins
- **Role-Based Access**: CASL for granular permissions
- **Caching**: Redis for search results and availability
- **Auto Assignment**: Intelligent driver allocation
- **Cleanup Workers**: Automatic expired booking/lock cleanup

## API Endpoints

- `GET /api/cars` - Search available cars
- `POST /api/bookings/precheck` - Lock car for booking
- `POST /api/bookings/confirm` - Confirm booking with lock
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/bookings` - User's bookings
- `GET /api/admin/stats` - Admin statistics

## Worker Services

- **Notifications**: SMS/WhatsApp/Email alerts
- **Driver Assignment**: Automatic driver allocation
- **Admin**: Real-time dashboard updates
- **Analytics**: Event logging and metrics
- **Cleanup**: Expired lock and booking cleanup

## Pages

- `/` - Home page with search
- `/search` - Car search results
- `/book` - Booking form with countdown
- `/bookings` - User booking history
- `/dashboard` - User dashboard
- `/login` - User login
- `/register` - User registration

## Deployment

Designed for VPS deployment with Nginx reverse proxy, Let's Encrypt SSL, and PM2 process management.

### Production Setup

1. **Install Node.js, PostgreSQL, Redis, Nginx**
2. **Clone repository and install dependencies**
3. **Setup environment variables**
4. **Configure Nginx with provided config**
5. **Start with PM2**: `pm2 start ecosystem.config.js`

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/carbooking"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secure-jwt-secret"
NEXT_PUBLIC_SOCKET_URL="ws://your-domain.com"
```

## Development

```bash
# Start development server
npm run dev

# Start all workers
npm run workers:all

# Database operations
npm run db:setup    # Setup and seed database
npm run db:reset    # Reset database
npm run db:seed     # Seed with sample data
```

The system is now fully functional with all components working together for a complete car booking experience.