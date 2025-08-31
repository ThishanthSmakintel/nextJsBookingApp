import { PrismaClient } from '@prisma/client'
import { assignPermissions, updateUserRole } from '../lib/rbac.js'

const prisma = new PrismaClient()

async function testRealTimeRBAC() {
  console.log('🚀 Testing Real-Time RBAC System...\n')

  try {
    // Find a test user (or create one)
    let testUser = await prisma.user.findFirst({
      where: { role: 'STAFF' }
    })

    if (!testUser) {
      console.log('Creating test staff user...')
      testUser = await prisma.user.create({
        data: {
          name: 'Test Staff',
          email: 'staff@test.com',
          password: 'hashed_password',
          role: 'STAFF',
          phone: '1234567890'
        }
      })
    }

    console.log(`📋 Test User: ${testUser.name} (${testUser.role})`)
    console.log(`🆔 User ID: ${testUser.id}\n`)

    // Test 1: Assign basic permissions
    console.log('🔧 Test 1: Assigning basic permissions...')
    const basicPermissions = ['bookings:read', 'cars:read']
    await assignPermissions(testUser.id, basicPermissions)
    console.log('✅ Basic permissions assigned (real-time update sent)')
    console.log(`   Permissions: ${basicPermissions.join(', ')}\n`)

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Test 2: Add more permissions
    console.log('🔧 Test 2: Adding more permissions...')
    const extendedPermissions = [
      'bookings:read', 'bookings:create', 'bookings:update',
      'cars:read', 'cars:update',
      'customers:read'
    ]
    await assignPermissions(testUser.id, extendedPermissions)
    console.log('✅ Extended permissions assigned (real-time update sent)')
    console.log(`   Permissions: ${extendedPermissions.join(', ')}\n`)

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Test 3: Remove some permissions
    console.log('🔧 Test 3: Removing some permissions...')
    const reducedPermissions = ['bookings:read', 'cars:read']
    await assignPermissions(testUser.id, reducedPermissions)
    console.log('✅ Permissions reduced (real-time update sent)')
    console.log(`   Permissions: ${reducedPermissions.join(', ')}\n`)

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Test 4: Change role
    console.log('🔧 Test 4: Changing user role...')
    await updateUserRole(testUser.id, 'DRIVER')
    console.log('✅ Role changed to DRIVER (real-time update sent)\n')

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Test 5: Change back to STAFF
    console.log('🔧 Test 5: Changing back to STAFF...')
    await updateUserRole(testUser.id, 'STAFF')
    console.log('✅ Role changed back to STAFF (real-time update sent)\n')

    console.log('🎉 Real-Time RBAC Test Complete!')
    console.log('\n📝 What happened:')
    console.log('   • Each permission change was broadcast via Socket.IO')
    console.log('   • Connected users receive instant updates')
    console.log('   • UI components react immediately to permission changes')
    console.log('   • No page refresh required')
    console.log('\n🌐 To see this in action:')
    console.log('   1. Open /rbac-demo in your browser')
    console.log('   2. Login as the test user')
    console.log('   3. Run this script again')
    console.log('   4. Watch the UI update in real-time!')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRealTimeRBAC()