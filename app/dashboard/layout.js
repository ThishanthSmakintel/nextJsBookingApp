'use client'
import { memo, useEffect, useState, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import DashboardNavbar from '@/components/admin/DashboardNavbar'
import DashboardSidebar from '@/components/admin/DashboardSidebar'
import { ToastProvider } from '@/components/Toast'
import { PermissionProvider } from '@/contexts/PermissionContext'
import { AbilityProvider } from '@/contexts/AbilityContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { SocketProvider } from '@/contexts/SocketContext'
import PermissionRefresh from '@/components/PermissionRefresh'
import RBACStatus from '@/components/RBACStatus'

const SidebarContext = createContext()
export const useSidebar = () => useContext(SidebarContext)

const MemoizedNavbar = memo(DashboardNavbar)
const MemoizedSidebar = memo(DashboardSidebar)

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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/staff-login')
        return
      }

      const decoded = decodeToken(token)
      if (decoded && (decoded.role === 'ADMIN' || decoded.role === 'STAFF' || decoded.role === 'DRIVER') && decoded.exp > Date.now() / 1000) {
        setIsAuthorized(true)
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/staff-login')
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
    <ThemeProvider>
      <LocaleProvider>
        <CurrencyProvider>
          <SocketProvider>
            <PermissionProvider>
              <AbilityProvider>
              <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
                <ToastProvider>
                  <div className="min-h-screen bg-base-200">
                    <MemoizedNavbar />
                    <div className="flex">
                      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
                        <MemoizedSidebar />
                      </div>
                      <main className="flex-1 p-6">
                        <PermissionRefresh />
                        {children}
                      </main>
                    </div>
                    <RBACStatus />
                  </div>
                </ToastProvider>
              </SidebarContext.Provider>
              </AbilityProvider>
            </PermissionProvider>
          </SocketProvider>
        </CurrencyProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}