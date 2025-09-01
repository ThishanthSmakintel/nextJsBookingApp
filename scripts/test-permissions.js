import { defineAbilityFor } from '../lib/casl.js'

// Test staff permissions
const staffUser = { role: 'STAFF' }
const staffPermissions = [
  'bookings:create', 
  'bookings:read', 
  'bookings:update', 
  'bookings:delete',
  'cars:read'
]

const ability = defineAbilityFor(staffUser, staffPermissions)

console.log('Testing CASL permissions for STAFF user:')
console.log('Can create Booking:', ability.can('create', 'Booking'))
console.log('Can read Booking:', ability.can('read', 'Booking'))
console.log('Can update Booking:', ability.can('update', 'Booking'))
console.log('Can delete Booking:', ability.can('delete', 'Booking'))
console.log('Can read Car:', ability.can('read', 'Car'))
console.log('Can create Car:', ability.can('create', 'Car'))
console.log('Can update Car:', ability.can('update', 'Car'))
console.log('Can delete Customer:', ability.can('delete', 'Customer'))

console.log('\nAll permissions:', staffPermissions)
console.log('Ability rules:', ability.rules)