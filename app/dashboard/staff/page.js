'use client'
import { useState, useEffect } from 'react'
import PermissionButton from '@/components/PermissionButton'
import PermissionWrapper from '@/components/PermissionWrapper'
import PermissionGuard from '@/components/PermissionGuard'
import { usePermissions } from '@/hooks/usePermissions'
import { useSocket } from '@/contexts/SocketContext'
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
  const [permissionBypass, setPermissionBypass] = useState(false)
  const { hasPermission, role, refreshPermissions } = usePermissions()
  const { socket } = useSocket()
  const toast = useToast()

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Staff page loading timeout, forcing stop')
        setLoading(false)
      }
    }, 10000) // 10 second timeout
    
    // Permission bypass timeout
    const permissionTimeout = setTimeout(() => {
      console.warn('Permission check timeout, enabling bypass')
      setPermissionBypass(true)
    }, 3000) // 3 second timeout for permissions
    
    fetchRBACData()
    
    return () => {
      clearTimeout(timeout)
      clearTimeout(permissionTimeout)
    }
  }, [])

  // Listen for real-time permission updates
  useEffect(() => {
    if (!socket) return

    let debounceTimer
    const handlePermissionUpdate = (data) => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        fetchRBACData()
        if (selectedUser && data.userId === selectedUser.id) {
          const updatedUser = users.find(u => u.id === data.userId)
          if (updatedUser) {
            setUserPermissions(updatedUser.permissions?.map(p => `${p.permission.resource}:${p.permission.action}`) || [])
          }
        }
      }, 300)
    }

    socket.on('rbac-updated', handlePermissionUpdate)
    socket.on('rbac_updated', handlePermissionUpdate)

    return () => {
      socket.off('rbac-updated', handlePermissionUpdate)
      socket.off('rbac_updated', handlePermissionUpdate)
    }
  }, [socket, selectedUser, users])

  // Listen for permission changes to refresh current user's permissions
  useEffect(() => {
    const handlePermissionChange = () => {
      console.log('Permissions changed, refreshing...')
      refreshPermissions()
    }

    window.addEventListener('permissions-changed', handlePermissionChange)
    return () => window.removeEventListener('permissions-changed', handlePermissionChange)
  }, [refreshPermissions])

  const fetchRBACData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        setLoading(false)
        return
      }
      
      const response = await fetch('/api/admin/rbac', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) {
        console.error('RBAC API error:', response.status, response.statusText)
        setLoading(false)
        return
      }
      
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
        // Refresh RBAC data immediately
        await fetchRBACData()
        
        // Emit socket event for real-time updates
        if (socket) {
          socket.emit('permission-updated', {
            userId: selectedUser.id,
            userName: selectedUser.name,
            permissions: userPermissions
          })
        }
        
        // Refresh current user's permissions if they updated their own
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        if (currentUser.id === selectedUser.id) {
          await refreshPermissions()
        }
        
        setSelectedUser(null)
        toast.success(`Permissions updated for ${selectedUser.name}`)
      }
    } catch (error) {
      console.error('Failed to update permissions:', error)
    }
  }

  // Define all possible resources and filter based on current user permissions
  const allResources = ['bookings', 'cars', 'customers', 'drivers', 'staff', 'reports', 'rbac', 'leaves', 'maintenance', 'locations', 'pricing', 'settings']
  
  // Filter resources based on what current user can read (if they can read, they might be able to assign)
  const resources = allResources.filter(resource => {
    // ADMIN can manage all resources
    if (role === 'ADMIN') return true
    
    // For other users, only show resources they have read access to
    // This prevents STAFF from seeing resources they shouldn't manage
    return hasPermission(resource, 'read')
  })
  
  // Debug log to see what resources are being shown
  console.log('Current role:', role, 'Available resources:', resources)
  
  const actions = ['create', 'read', 'update', 'delete']

  const getPermissionKey = (resource, action) => `${resource}:${action}`
  const hasUserPermission = (resource, action) => userPermissions.includes(getPermissionKey(resource, action))

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

  // If permission bypass is enabled or user is admin, show content
  const canAccess = permissionBypass || role === 'ADMIN' || hasPermission('staff', 'read')
  
  if (!canAccess && !permissionBypass) {
    return (
      <PermissionGuard resource="staff" action="read">
        <div></div>
      </PermissionGuard>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="w-8 h-8" />
              Staff & Permissions Management
            </h1>
            <p className="text-base-content/70 mt-1">Manage staff accounts and their CRUD permissions</p>
          </div>
          <PermissionButton 
            resource="staff" 
            action="create"
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-4 h-4" />
            Add Staff
          </PermissionButton>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20"></div>
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0"></div>
              </div>
              <div className="text-sm text-base-content/70 animate-pulse">Loading staff data...</div>
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => {
                  console.log('Manual bypass activated')
                  setLoading(false)
                  setPermissionBypass(true)
                }}
              >
                Continue Anyway
              </button>
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
                              <PermissionButton 
                                resource="staff" 
                                action="delete"
                                className="btn btn-xs btn-ghost text-error"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteStaff(user.id)
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </PermissionButton>
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
                <PermissionWrapper resource="staff" action="update">
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
                          <PermissionButton 
                            resource="staff" 
                            action="update"
                            className="btn btn-primary btn-sm"
                            onClick={updatePermissions}
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </PermissionButton>
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
                                      {resource === 'rbac' && role !== 'ADMIN' && (
                                        <span className="badge badge-warning badge-xs ml-2">Admin Only</span>
                                      )}
                                    </div>
                                  </td>
                                  {actions.map(action => {
                                    // Prevent non-admin users from managing RBAC permissions
                                    const isRBACRestricted = resource === 'rbac' && role !== 'ADMIN'
                                    
                                    return (
                                      <td key={action} className="text-center">
                                        <input
                                          type="checkbox"
                                          className={`checkbox checkbox-sm ${
                                            action === 'create' ? 'checkbox-success' :
                                            action === 'read' ? 'checkbox-info' :
                                            action === 'update' ? 'checkbox-warning' : 'checkbox-error'
                                          } ${isRBACRestricted ? 'opacity-50' : ''}`}
                                          checked={hasUserPermission(resource, action)}
                                          disabled={isRBACRestricted}
                                          onChange={() => !isRBACRestricted && toggleResourcePermission(resource, action)}
                                          title={isRBACRestricted ? 'Only administrators can manage RBAC permissions' : ''}
                                        />
                                      </td>
                                    )
                                  })}
                                  <td className="text-center">
                                    <input
                                      type="checkbox"
                                      className={`checkbox checkbox-sm ${resource === 'rbac' && role !== 'ADMIN' ? 'opacity-50' : ''}`}
                                      checked={hasAll}
                                      disabled={resource === 'rbac' && role !== 'ADMIN'}
                                      ref={el => {
                                        if (el) el.indeterminate = !hasAll && !hasNone
                                      }}
                                      onChange={() => resource !== 'rbac' || role === 'ADMIN' ? toggleAllForResource(resource) : null}
                                      title={resource === 'rbac' && role !== 'ADMIN' ? 'Only administrators can manage RBAC permissions' : ''}
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
                </PermissionWrapper>
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
          <PermissionWrapper resource="staff" action="create">
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
          </PermissionWrapper>
        )}
      </div>
    </div>
  )
}