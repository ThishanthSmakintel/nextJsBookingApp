'use client'
import { useState, useEffect } from 'react'
import { Shield, Users, Settings, User, Lock, Check, X, Edit, Save, UserCheck, Calendar, Car, FileText } from 'lucide-react'

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

  const resources = ['bookings', 'cars', 'customers', 'drivers', 'staff', 'reports', 'rbac']
  const actions = ['create', 'read', 'update', 'delete']

  const getPermissionKey = (resource, action) => `${resource}:${action}`
  const hasPermission = (resource, action) => userPermissions.includes(getPermissionKey(resource, action))

  const toggleResourcePermission = (resource, action) => {
    const permKey = getPermissionKey(resource, action)
    setUserPermissions(prev => 
      prev.includes(permKey) 
        ? prev.filter(p => p !== permKey)
        : [...prev, permKey]
    )
  }

  const toggleAllForResource = (resource) => {
    const resourcePerms = actions.map(action => getPermissionKey(resource, action))
    const hasAll = resourcePerms.every(perm => userPermissions.includes(perm))
    
    if (hasAll) {
      setUserPermissions(prev => prev.filter(p => !resourcePerms.includes(p)))
    } else {
      setUserPermissions(prev => [...new Set([...prev, ...resourcePerms])])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg text-white">
        <div className="flex items-center gap-3">
          <Shield className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold">Role-Based Access Control</h1>
            <p className="opacity-90">Manage user permissions with granular CRUD access</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Users List */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-primary mb-4">
                <Users className="w-5 h-5" />
                Users ({users.filter(u => u.role !== 'ADMIN').length})
              </h2>
              
              <div className="space-y-2">
                {users.filter(u => u.role !== 'ADMIN').length === 0 ? (
                  <div className="text-center p-4">
                    <User className="w-12 h-12 mx-auto text-base-content/30 mb-2" />
                    <p className="text-sm text-base-content/70">No users found</p>
                  </div>
                ) : (
                  users.filter(user => user.role !== 'ADMIN').map(user => (
                    <div 
                      key={user.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedUser?.id === user.id ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setSelectedUser(user)
                        setUserPermissions(user.permissions?.map(p => `${p.permission.resource}:${p.permission.action}`) || [])
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-8">
                            <span className="text-xs font-semibold">
                              {user.name?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2) || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{user.name}</div>
                          <div className="text-xs text-base-content/70 truncate">{user.email}</div>
                          <span className={`badge badge-xs mt-1 ${
                            user.role === 'STAFF' ? 'badge-warning' : 'badge-info'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Permissions Matrix */}
          {selectedUser ? (
            <div className="xl:col-span-3">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-secondary text-secondary-content rounded-full w-10">
                          <span className="text-sm font-semibold">
                            {selectedUser.name?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2) || 'U'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                        <p className="text-sm text-base-content/70">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedUser(null)}>
                        <X className="w-4 h-4" />
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={updatePermissions}>
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>

                  {/* CRUD Matrix */}
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th className="font-bold">Resource</th>
                          <th className="text-center font-bold text-success">Create</th>
                          <th className="text-center font-bold text-info">Read</th>
                          <th className="text-center font-bold text-warning">Update</th>
                          <th className="text-center font-bold text-error">Delete</th>
                          <th className="text-center font-bold">All</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.map(resource => {
                          const resourcePerms = actions.map(action => getPermissionKey(resource, action))
                          const hasAll = resourcePerms.every(perm => userPermissions.includes(perm))
                          const hasNone = !resourcePerms.some(perm => userPermissions.includes(perm))
                          
                          return (
                            <tr key={resource} className="hover">
                              <td className="font-semibold capitalize">
                                <div className="flex items-center gap-2">
                                  {resource === 'bookings' && <Calendar className="w-4 h-4" />}
                                  {resource === 'cars' && <Car className="w-4 h-4" />}
                                  {resource === 'customers' && <Users className="w-4 h-4" />}
                                  {resource === 'drivers' && <UserCheck className="w-4 h-4" />}
                                  {resource === 'staff' && <Users className="w-4 h-4" />}
                                  {resource === 'reports' && <FileText className="w-4 h-4" />}
                                  {resource === 'rbac' && <Shield className="w-4 h-4" />}
                                  {resource}
                                </div>
                              </td>
                              {actions.map(action => (
                                <td key={action} className="text-center">
                                  <input
                                    type="checkbox"
                                    className={`checkbox checkbox-sm ${
                                      action === 'create' ? 'checkbox-success' :
                                      action === 'read' ? 'checkbox-info' :
                                      action === 'update' ? 'checkbox-warning' : 'checkbox-error'
                                    }`}
                                    checked={hasPermission(resource, action)}
                                    onChange={() => toggleResourcePermission(resource, action)}
                                  />
                                </td>
                              ))}
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-sm"
                                  checked={hasAll}
                                  ref={el => {
                                    if (el) el.indeterminate = !hasAll && !hasNone
                                  }}
                                  onChange={() => toggleAllForResource(resource)}
                                />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 p-4 bg-base-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-success rounded"></div>
                        <span>Create</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-info rounded"></div>
                        <span>Read</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-warning rounded"></div>
                        <span>Update</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-error rounded"></div>
                        <span>Delete</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="xl:col-span-3">
              <div className="card bg-base-100 shadow-xl h-full">
                <div className="card-body flex items-center justify-center text-center">
                  <Settings className="w-20 h-20 text-base-content/20 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Select a User</h3>
                  <p className="text-base-content/70">Choose a user from the left panel to manage their CRUD permissions</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}