'use client'
import { useState, useEffect } from 'react'
import { Shield, Users, Settings } from 'lucide-react'

export default function RBACPage() {
  const [users, setUsers] = useState([])
  const [permissions, setPermissions] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRBACData()
  }, [])

  const fetchRBACData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/rbac', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      console.log('RBAC data:', data)
      setUsers(data.users || [])
      setPermissions(data.permissions || [])
    } catch (error) {
      console.error('Failed to fetch RBAC data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePermissions = async () => {
    try {
      const token = localStorage.getItem('token')
      await fetch('/api/admin/rbac', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          permissions: userPermissions
        })
      })
      fetchRBACData()
      setSelectedUser(null)
    } catch (error) {
      console.error('Failed to update permissions:', error)
    }
  }

  const togglePermission = (permission) => {
    const permKey = `${permission.resource}:${permission.action}`
    setUserPermissions(prev => 
      prev.includes(permKey) 
        ? prev.filter(p => p !== permKey)
        : [...prev, permKey]
    )
  }

  // Temporarily allow access for testing
  // if (!user || user.role !== 'ADMIN') {
  //   return <div className="text-center p-8">Access Denied</div>
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Role-Based Access Control</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Users ({users.length})</h2>
            {loading ? (
              <div className="flex justify-center p-4">
                <span className="loading loading-spinner"></span>
              </div>
            ) : (
              <div className="space-y-2">
                {users.length === 0 ? (
                  <p className="text-center text-base-content/70 p-4">No users found</p>
                ) : (
                  users.map(user => (
                    <div key={user.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-base-content/70">{user.email} - {user.role}</div>
                      </div>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setSelectedUser(user)
                          setUserPermissions(user.permissions?.map(p => `${p.permission.resource}:${p.permission.action}`) || [])
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {selectedUser && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Permissions for {selectedUser.name}</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {permissions.map(permission => {
                  const permKey = `${permission.resource}:${permission.action}`
                  const isChecked = userPermissions.includes(permKey)
                  
                  return (
                    <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={isChecked}
                        onChange={() => togglePermission(permission)}
                      />
                      <span className="capitalize">{permission.resource}:{permission.action}</span>
                    </label>
                  )
                })}
              </div>
              <div className="card-actions justify-end">
                <button className="btn btn-ghost" onClick={() => setSelectedUser(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={updatePermissions}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}