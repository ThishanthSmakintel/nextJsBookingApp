# Admin Login Guide

## How to Login as Admin

### Step 1: Create Admin User
First, run the admin creation script to create an admin user in the database:

```bash
npm run admin:create
```

This will create an admin user with:
- **Email**: `admin@carbook.com`
- **Password**: `admin123`

### Step 2: Admin Login (Password-Based)
1. Go to `/admin-login` page in your browser
2. Enter admin credentials:
   - Email: `admin@carbook.com`
   - Password: `admin123`
3. Click Login

### Step 3: Access Admin Dashboard
After successful login, you will be redirected to `/admin` dashboard

### Alternative: OTP Login
Admins can also use the regular `/login` page with OTP authentication using the same email.

## Admin Features
- View system statistics (bookings, cars, customers, drivers)
- Manage bookings (confirm, cancel, complete)
- View car fleet status
- Real-time updates via Socket.IO

## Security Notes
- ⚠️ **OTP-based login is more secure** than password-based login
- The admin role is automatically determined by the email `admin@carbook.com`
- Admin users have full access to all system resources via CASL permissions
- OTP codes expire after 10 minutes for security

## API Access
Admin users can access protected admin endpoints:
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/bookings` - All bookings
- `GET /api/admin/cars` - All cars
- `PATCH /api/admin/bookings/:id` - Update booking status

## Troubleshooting
- If admin user already exists, the script will notify you
- Make sure the database is running and accessible
- Check that all environment variables are properly set