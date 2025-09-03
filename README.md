# Enterprise Car Booking System

## Architecture Overview

- **Frontend**: Next.js 14 with App Router, TypeScript, TailwindCSS + DaisyUI
- **Backend**: Node.js API with Fastify, PostgreSQL, Redis
- **Real-time**: Socket.IO with role-based access control
- **RBAC**: CASL-based permissions with real-time updates
- **Workers**: Event-driven microservices for notifications, driver assignment, admin updates, analytics, cleanup
- **Authentication**: JWT with OTP verification and email confirmation

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
npm run db:setup
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

### Core Booking System
- **Redis Locking**: 10-minute car reservations with countdown
- **Event-Driven**: Redis pub/sub for all booking events
- **Real-time Updates**: Socket.IO rooms for customers, drivers, admins
- **Auto Assignment**: Intelligent driver allocation
- **Cleanup Workers**: Automatic expired booking/lock cleanup

### Advanced RBAC System
- **Dynamic Permissions**: Real-time permission updates
- **Role Management**: Customer, Driver, Staff, Admin roles
- **Resource-Level Access**: Granular permissions per booking/car
- **Permission Caching**: Redis-cached permissions for performance
- **Live Permission Updates**: Socket.IO-based permission broadcasting

### Multi-Currency Support
- **Dynamic Rates**: Real-time currency conversion
- **Localized Pricing**: Currency-specific pricing display
- **Rate Management**: Admin currency rate configuration

### Enhanced Authentication
- **OTP Verification**: Email-based OTP for secure login
- **Email Confirmation**: Account verification system
- **Staff Login**: Separate authentication for staff members
- **Session Management**: Secure JWT-based sessions

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/login-otp` - OTP-based login
- `POST /api/auth/staff-login` - Staff authentication
- `POST /api/auth/verify-email` - Email verification
- `GET /api/auth/permissions` - User permissions

### Booking System
- `GET /api/cars` - Search available cars
- `POST /api/bookings/precheck` - Lock car for booking
- `POST /api/bookings/confirm` - Confirm booking with lock
- `POST /api/bookings/release-lock` - Release car lock
- `GET /api/user/bookings` - User's bookings

### Admin Management
- `GET /api/admin/stats` - Admin statistics
- `GET /api/admin/bookings` - All bookings management
- `GET /api/admin/cars` - Car fleet management
- `GET /api/admin/drivers` - Driver management
- `GET /api/admin/customers` - Customer management
- `GET /api/admin/staff` - Staff management
- `GET /api/admin/reports` - Analytics reports
- `POST /api/admin/rbac` - Permission management

### Driver Operations
- `GET /api/driver/bookings` - Driver's assigned bookings
- `GET /api/driver/schedule` - Driver schedule management

### System
- `GET /api/locations` - Available locations
- `GET /api/currency/rates` - Currency exchange rates
- `GET /api/health` - System health check
- `GET /api/debug` - Debug information

## Dashboard Pages

### Customer Portal
- `/` - Home page with search
- `/search` - Car search results
- `/book` - Booking form with countdown
- `/bookings` - User booking history
- `/payment` - Payment processing
- `/booking-success` - Booking confirmation

### Authentication
- `/login` - Customer login
- `/register` - Customer registration
- `/auth/verify` - Email verification
- `/staff-login` - Staff authentication

### Admin Dashboard (`/dashboard`)
- `/dashboard` - Main admin overview
- `/dashboard/bookings` - Booking management
- `/dashboard/cars` - Fleet management
- `/dashboard/drivers` - Driver management
- `/dashboard/customers` - Customer management
- `/dashboard/staff` - Staff management
- `/dashboard/locations` - Location management
- `/dashboard/pricing` - Pricing configuration
- `/dashboard/maintenance` - Vehicle maintenance
- `/dashboard/leave-management` - Driver leave management
- `/dashboard/reports` - Analytics and reports
- `/dashboard/rbac` - Permission management
- `/dashboard/settings` - System settings
- `/dashboard/profile` - User profile

### Driver Portal
- `/dashboard/my-bookings` - Driver's bookings
- `/dashboard/my-schedule` - Driver's schedule
- `/dashboard/create-booking` - Create new booking

### Demo & Testing
- `/rbac-demo` - Real-time RBAC demonstration

## Worker Services

- **Notifications**: Email/SMS alerts for bookings
- **Driver Assignment**: Automatic driver allocation
- **Admin**: Real-time dashboard updates
- **Analytics**: Event logging and metrics
- **Cleanup**: Expired lock and booking cleanup

## Scripts & Utilities

### Database Management
```bash
npm run db:setup      # Complete database setup
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run migrations
npm run db:seed       # Seed database
npm run db:reset      # Reset and reseed
```

### User Management
```bash
npm run admin:create           # Create admin user
npm run create:test-staff      # Create test staff
npm run create:test-admin      # Create test admin
npm run list:users             # List all users
npm run cleanup:test-users     # Remove test users
```

### RBAC Management
```bash
npm run test:rbac                    # Test RBAC system
npm run setup:rbac-demo              # Setup RBAC demo
npm run assign:staff-permissions     # Assign staff permissions
npm run assign:driver-permissions    # Assign driver permissions
```

### Development
```bash
npm run demo:rbac     # RBAC demo instructions
npm run cache:clear   # Clear Next.js cache
```

## Deployment

### Production Setup

1. **Install Dependencies**
   - Node.js 18+
   - PostgreSQL 14+
   - Redis 6+
   - Nginx
   - PM2

2. **Application Setup**
```bash
git clone <repository>
cd nextJsBookingApp
npm install
npm run build
```

3. **Database Setup**
```bash
npm run db:setup
npm run admin:create
```

4. **Start Services**
```bash
pm2 start ecosystem.config.js
```

5. **Configure Nginx** (use provided nginx.conf)

### PM2 Process Management

The ecosystem.config.js manages:
- Main application server
- 5 worker processes (notifications, driver-assignment, admin, analytics, cleanup)

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:root@localhost:5432/carbooking"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-jwt-secret-key"
NEXT_PUBLIC_SOCKET_URL="ws://localhost:3000"

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=CarBook Platform
```

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, DaisyUI
- **Backend**: Fastify, Prisma ORM
- **Database**: PostgreSQL
- **Cache/Queue**: Redis, IORedis
- **Real-time**: Socket.IO
- **Authentication**: JWT, bcryptjs
- **Permissions**: CASL
- **State Management**: Zustand, React Query
- **Email**: Nodemailer
- **Process Management**: PM2
- **Validation**: Zod

The system provides a complete enterprise-grade car booking platform with advanced RBAC, real-time updates, and comprehensive admin management capabilities.