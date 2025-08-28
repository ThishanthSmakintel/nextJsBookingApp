import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Create permissions
    const permissions = [
      'bookings:create', 'bookings:read', 'bookings:update', 'bookings:delete',
      'cars:create', 'cars:read', 'cars:update', 'cars:delete',
      'customers:create', 'customers:read', 'customers:update', 'customers:delete',
      'drivers:create', 'drivers:read', 'drivers:update', 'drivers:delete',
      'staff:create', 'staff:read', 'staff:update', 'staff:delete',
      'rbac:create', 'rbac:read', 'rbac:update', 'rbac:delete'
    ]

    for (const perm of permissions) {
      const [resource, action] = perm.split(':')
      await prisma.permission.upsert({
        where: { resource_action: { resource, action } },
        update: {},
        create: { resource, action }
      })
    }

    // Create admin user
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

    return NextResponse.json({ success: true, message: 'Setup complete' })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}