'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function RealTimePermissionManager() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [permissions, setPermissions] = useState([])
  const { token } = useAuth()

  const availablePermissions = [
    'bookings:create', 'bookings:read', 'bookings:update', 'bookings:delete',
    'cars:create', 'cars:read', 'cars:update', 'cars:delete',
    'customers:create', 'customers:read', 'customers:update', 'customers:delete',
    'drivers:create', 'drivers:read', 'drivers:update', 'drivers:delete',
    'reports:read', 'rbac:manage'
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const updatePermissions = async (userId, newPermissions, role = null) => {
    try {
      const response = await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          permissions: newPermissions,
          ...(role && { role })
        })
      })

      if (response.ok) {
        alert('Permissions updated! User will see changes instantly.')
      } else {
        alert('Failed to update permissions')
      }
    } catch (error) {
      console.error('Permission update error:', error)
      alert('Error updating permissions')
    }
  }

  const handlePermissionToggle = (permission) => {
    const newPermissions = permissions.includes(permission)
      ? permissions.filter(p => p !== permission)
      : [...permissions, permission]
    
    setPermissions(newPermissions)
  }

  const handleRoleChange = (userId, newRole) => {
    updatePermissions(userId, permissions, newRole)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Real-Time Permission Manager</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Users</h3>
          <div className="space-y-2">
            {users.map(user => (
              <div 
                key={user.id}
                className={`p-3 border rounded cursor-pointer ${
                  selectedUser?.id === user.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedUser(user)
                  setPermissions(user.permissions?.map(p => p.permission) || [])
                }}
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-xs text-blue-600">{user.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Editor */}
        <div>
          {selectedUser ? (
            <>
              <h3 className="text-lg font-semibold mb-4">
                Permissions for {selectedUser.name}
              </h3>
              
              {/* Role Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Role</label>
                <select 
                  value={selectedUser.role}
                  onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="DRIVER">Driver</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {/* Permission Checkboxes */}
              <div className="space-y-2 mb-4">
                {availablePermissions.map(permission => (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={permissions.includes(permission)}
                      onChange={() => handlePermissionToggle(permission)}
                      className="mr-2"
                    />
                    <span className="text-sm">{permission}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => updatePermissions(selectedUser.id, permissions)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Update Permissions (Real-Time)
              </button>
            </>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Select a user to manage permissions
            </div>
          )}
        </div>
      </div>
    </div>
  )
}