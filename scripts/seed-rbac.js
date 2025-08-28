const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedRBAC() {
  // Create permissions
  const permissions = [
    'bookings:create', 'bookings:read', 'bookings:update', 'bookings:delete',
    'cars:create', 'cars:read', 'cars:update', 'cars:delete',
    'customers:create', 'customers:read', 'customers:update', 'customers:delete',
    'drivers:create', 'drivers:read', 'drivers:update', 'drivers:delete',
    'staff:create', 'staff:read', 'staff:update', 'staff:delete',
    'locations:create', 'locations:read', 'locations:update', 'locations:delete',
    'settings:create', 'settings:read', 'settings:update', 'settings:delete',
    'reports:read', 'rbac:create', 'rbac:read', 'rbac:update', 'rbac:delete'
  ]

  for (const perm of permissions) {
    const [resource, action] = perm.split(':')
    await prisma.permission.upsert({
      where: { resource_action: { resource, action } },
      update: {},
      create: { resource, action }
    })
  }

  // Create admin user if not exists
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'admin123',
      role: 'ADMIN'
    }
  })

  console.log('RBAC seeded successfully')
}

seedRBAC()
  .catch(console.error)
  .finally(() => prisma.$disconnect())