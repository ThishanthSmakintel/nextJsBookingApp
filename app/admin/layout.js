'use client'
import { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { PermissionProvider } from '@/contexts/PermissionContext'

const MemoizedNavbar = memo(AdminNavbar)
const MemoizedSidebar = memo(AdminSidebar)

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export default function AdminLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/admin-login')
        return
      }

      const decoded = decodeToken(token)
      if (decoded && decoded.role === 'admin' && decoded.exp > Date.now() / 1000) {
        setIsAuthorized(true)
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/admin-login')
      }
      
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <PermissionProvider>
      <div className="min-h-screen bg-base-200">
        <MemoizedNavbar />
        <div className="flex">
          <MemoizedSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </PermissionProvider>
  )
}