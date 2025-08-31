'use client'
import { useState, useEffect } from 'react'
import PermissionGuard from '@/components/PermissionGuard'
import { useToast } from '@/components/Toast'
import { Shield, Users, Settings, User, Lock, Check, X, Edit, Save, UserCheck, Calendar, Car, FileText, UserPlus, Trash2 } from 'lucide-react'

export default function StaffPage() {
  const [users, setUsers] = useState([])
  const [permissions, setPermissions] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', password: '' })
  const toast = useToast()

  useEffect(() => {
    fetchRBACData()
    
    // Listen for permission updates via Socket.IO
    if (window.socket) {
      window.socket.on('permissions-updated', (data) => {
        // Show notification
        console.log(`Permissions updated for ${data.userName}`)
        // Refresh data if needed
        fetchRBACData()
      })
      
      return () => {
        window.socket.off('permissions-updated')
      }
    }
  }, [])

  const fetchRBACData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/rbac', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setUsers(data.users || [])
      setPermissions(data.permissions || [])
    } catch (error) {
      console.error('Failed to fetch RBAC data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStaff = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStaff)
      })
      
      if (response.ok) {
        toast.success('Staff member added successfully')
        setShowAddModal(false)
        setNewStaff({ name: '', email: '', phone: '', password: '' })
        fetchRBACData()
      } else {
        toast.error('Failed to add staff member')
      }
    } catch (error) {
      console.error('Error adding staff:', error)
    }
  }

  const handleDeleteStaff = async (staffId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/staff/${staffId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        toast.success('Staff member deleted successfully')
        fetchRBACData()
        if (selectedUser?.id === staffId) setSelectedUser(null)
      } else {
        toast.error('Failed to delete staff member')
      }
    } catch (error) {
      toast.error('Error deleting staff member')
    }
  }

  const updatePermissions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/rbac', {
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
      
      if (response.ok) {
        // Force immediate permission update via localStorage
        localStorage.setItem(`permissions_${selectedUser.id}`, JSON.stringify(userPermissions))
        localStorage.setItem('permissions_updated', Date.now().toString())
        
        // Force immediate UI update
        window.dispatchEvent(new Event('permissions-changed'))
        
        // Emit socket event for real-time updates
        if (window.socket) {
          window.socket.emit('permissions-updated', {
            userId: selectedUser.id,
            permissions: userPermissions,
            userName: selectedUser.name
          })
        }
        
        fetchRBACData()
        setSelectedUser(null)
        
        toast.success(`Permissions updated for ${selectedUser.name}`)
      }
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
    <PermissionGuard resource="staff" action="read">
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Staff & Permissions Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage staff accounts and their CRUD permissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20"></div>
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0"></div>
            </div>
            <div className="text-sm text-base-content/70 animate-pulse">Loading...</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Staff List */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-primary mb-4">
                <Users className="w-5 h-5" />
                Staff ({users.filter(u => u.role !== 'ADMIN').length})
              </h2>
              
              <div className="space-y-2">
                {users.filter(u => u.role !== 'ADMIN').length === 0 ? (
                  <div className="text-center p-4">
                    <User className="w-12 h-12 mx-auto text-base-content/30 mb-2" />
                    <p className="text-sm text-base-content/70">No staff found</p>
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
                          <div className="flex items-center justify-between mt-1">
                            <span className={`badge badge-xs ${
                              user.role === 'STAFF' ? 'badge-warning' : 'badge-info'
                            }`}>
                              {user.role}
                            </span>
                            <button 
                              className="btn btn-xs btn-ghost text-error" 
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteStaff(user.id)
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
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
                </div>
              </div>
            </div>
          ) : (
            <div className="xl:col-span-3">
              <div className="card bg-base-100 shadow-xl h-full">
                <div className="card-body flex items-center justify-center text-center">
                  <Settings className="w-20 h-20 text-base-content/20 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Select Staff Member</h3>
                  <p className="text-base-content/70">Choose a staff member to manage their permissions</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add New Staff Member</h3>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                  required
                />
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </PermissionGuard>
  )
}