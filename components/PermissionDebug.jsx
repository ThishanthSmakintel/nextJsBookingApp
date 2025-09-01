'use client'
import { useRealTimePermissions } from '@/contexts/RealTimePermissionContext'
import { useAuth } from '@/contexts/AuthContext'

export default function PermissionDebug() {
  const { permissions, can, loading } = useRealTimePermissions()
  const { user } = useAuth()

  if (loading) return <div>Loading permissions...</div>

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-sm">
      <h3 className="font-bold mb-2">Permission Debug</h3>
      <p><strong>User:</strong> {user?.name} ({user?.role})</p>
      <p><strong>Raw Permissions:</strong> {JSON.stringify(permissions)}</p>
      <div className="mt-2">
        <strong>Permission Tests:</strong>
        <ul className="ml-4">
          <li>Can create Booking: {can('create', 'Booking') ? '✅' : '❌'}</li>
          <li>Can update Car: {can('update', 'Car') ? '✅' : '❌'}</li>
          <li>Can delete Customer: {can('delete', 'Customer') ? '✅' : '❌'}</li>
        </ul>
      </div>
    </div>
  )
}