import { create } from 'zustand'

export const usePermissionStore = create((set, get) => ({
  permissions: [],
  loading: true,
  lastUpdate: 0,
  initialized: false,

  // Set permissions
  setPermissions: (newPermissions) => {
    console.log('PermissionStore: Setting permissions:', newPermissions.length, newPermissions)
    set({ 
      permissions: [...newPermissions], 
      lastUpdate: Date.now(),
      loading: false,
      initialized: true
    })
    // Force re-render
    window.dispatchEvent(new CustomEvent('permissions-updated', { detail: newPermissions }))
  },

  // Set loading state
  setLoading: (loading) => {
    set({ loading })
  },

  // Initialize permissions for user
  initializePermissions: async (userId) => {
    if (!userId) {
      set({ loading: false, initialized: true })
      return
    }
    
    const state = get()
    // Prevent multiple simultaneous initializations
    if (state.loading) {
      console.log('PermissionStore: Already loading, skipping initialization')
      return
    }
    
    if (state.initialized && state.permissions.length > 0) {
      console.log('PermissionStore: Already initialized with permissions, skipping')
      return
    }
    
    console.log('PermissionStore: Initializing for user:', userId)
    set({ loading: true })
    
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('PermissionStore: Initialization timeout, forcing stop')
      set({ loading: false, initialized: true })
    }, 8000)
    
    // Try cached first
    const cached = localStorage.getItem(`permissions_${userId}`)
    if (cached) {
      try {
        const permissions = JSON.parse(cached)
        console.log('PermissionStore: Loaded cached:', permissions.length)
        if (permissions.length > 0) {
          get().setPermissions(permissions)
        }
      } catch (error) {
        console.error('Error loading cached permissions:', error)
      }
    }
    
    // Always fetch fresh data
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/permissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        const permissions = data.permissions || []
        console.log('PermissionStore: Fetched fresh:', permissions.length, permissions)
        
        // Force update even if empty for ADMIN users (they get full access via CASL)
        const userRole = get().getUserRole(userId)
        if (permissions.length > 0 || userRole === 'ADMIN') {
          get().setPermissions(permissions)
          localStorage.setItem(`permissions_${userId}`, JSON.stringify(permissions))
        } else {
          console.warn('PermissionStore: No permissions returned for non-admin user')
          set({ loading: false, initialized: true })
        }
      } else {
        console.error('PermissionStore: API error:', response.status)
        set({ loading: false })
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
      set({ loading: false, initialized: true })
    } finally {
      clearTimeout(timeout)
    }
  },

  // Refresh permissions
  refreshPermissions: async (userId) => {
    if (!userId) return
    
    const state = get()
    // Prevent multiple simultaneous refreshes
    if (state.loading) {
      console.log('PermissionStore: Already loading, skipping refresh')
      return
    }
    
    console.log('PermissionStore: Refreshing permissions for user:', userId)
    set({ loading: true })
    
    const timeout = setTimeout(() => {
      console.warn('PermissionStore: Refresh timeout, forcing stop')
      set({ loading: false })
    }, 8000)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/permissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        const permissions = data.permissions || []
        get().setPermissions(permissions)
        localStorage.setItem(`permissions_${userId}`, JSON.stringify(permissions))
      } else {
        set({ loading: false })
      }
    } catch (error) {
      console.error('Error refreshing permissions:', error)
      set({ loading: false })
    } finally {
      clearTimeout(timeout)
    }
  },

  // Reset store
  reset: () => {
    console.log('PermissionStore: Resetting store')
    set({ permissions: [], loading: true, lastUpdate: 0, initialized: false })
  },

  // Get user role from localStorage
  getUserRole: (userId) => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        return user.role
      }
    } catch (error) {
      console.error('Error getting user role:', error)
    }
    return null
  },

  // Force refresh (bypass initialization check)
  forceRefresh: async (userId) => {
    if (!userId) return
    
    console.log('PermissionStore: Force refreshing for user:', userId)
    set({ loading: true, initialized: false })
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/permissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        const permissions = data.permissions || []
        console.log('PermissionStore: Force refresh result:', permissions.length, permissions)
        
        // Always set permissions, even if empty
        get().setPermissions(permissions)
        localStorage.setItem(`permissions_${userId}`, JSON.stringify(permissions))
      } else {
        console.error('PermissionStore: Force refresh API error:', response.status)
        set({ loading: false })
      }
    } catch (error) {
      console.error('Error in force refresh:', error)
      set({ loading: false })
    }
  }
}))