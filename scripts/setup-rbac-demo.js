import { PrismaClient } from '@prisma/client'
import { assignPermissions } from '../lib/rbac.js'

const prisma = new PrismaClient()

async function setupRBACDemo() {
  try {
    console.log('🚀 Setting up RBAC Demo...\n')

    // Find staff user
    const staff = await prisma.user.findUnique({
      where: { email: 'staff@test.com' }
    })

    if (staff) {
      console.log('🔧 Assigning initial permissions to staff...')
      
      const initialPermissions = [
        'bookings:read',
        'cars:read'
      ]
      
      await assignPermissions(staff.id, initialPermissions)
      
      console.log('✅ Initial permissions assigned!')
      console.log(`   Permissions: ${initialPermissions.join(', ')}\n`)
    }

    console.log('🎉 RBAC Demo Setup Complete!\n')
    console.log('📝 Test Users Created:')
    console.log('   👤 Staff: staff@test.com / password123')
    console.log('   👑 Admin: admin@test.com / admin123\n')
    
    console.log('🌐 To test real-time RBAC:')
    console.log('   1. Start server: npm run dev')
    console.log('   2. Open two browser windows')
    console.log('   3. Login as staff in one window: /login')
    console.log('   4. Login as admin in another: /login')
    console.log('   5. Visit /rbac-demo in both windows')
    console.log('   6. Use admin to change staff permissions')
    console.log('   7. Watch staff UI update instantly!')

  } catch (error) {
    console.error('❌ Setup failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupRBACDemo()