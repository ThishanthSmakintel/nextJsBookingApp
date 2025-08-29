'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Car, Wifi, WifiOff, Bell, RefreshCw, LogOut, X, Menu } from 'lucide-react'
import { useSocketStore } from '@/stores/socket'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useSidebar } from '@/app/admin/layout'
import ThemeToggle from '../ThemeToggle'
import LanguageSelector from '../LanguageSelector'

export default function AdminNavbar() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const { currency, changeCurrency, currencies } = useCurrency()
  const { connected, connect } = useSocketStore()
  const { sidebarOpen, setSidebarOpen } = useSidebar()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      connect(token)
    }
  }, [connect])



  const logout = () => {
    localStorage.removeItem('token')
    router.push('/admin-login')
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="navbar bg-primary text-primary-content shadow-lg">
      <div className="flex-none">
        <button 
          className="btn btn-ghost btn-square"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={20} />
        </button>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          <Car className="mr-2" size={24} /> Admin Dashboard
        </a>
      </div>
      <div className="flex-none gap-2">
        <div className="indicator">
          <span className={`indicator-item badge badge-xs ${connected ? 'badge-success' : 'badge-error'}`}></span>
          <div className="btn btn-ghost btn-sm">
            {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
          </div>
        </div>
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="badge badge-sm badge-primary indicator-item">{notifications.length}</span>
              )}
            </div>
          </div>
          <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-80 p-2 shadow">
            <div className="menu-title">
              <span>Notifications</span>
            </div>
            {notifications.length === 0 ? (
              <li><a className="text-base-content/60">No new notifications</a></li>
            ) : (
              notifications.map(notif => (
                <li key={notif.id}>
                  <div className="flex justify-between items-start p-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{notif.title}</div>
                      <div className="text-xs opacity-70">{notif.message}</div>
                    </div>
                    <button className="btn btn-xs btn-ghost" onClick={() => removeNotification(notif.id)}>
                      <X size={12} />
                    </button>
                  </div>
                </li>
              ))
            )}
          </div>
        </div>

        <select className="select select-sm" value={currency} onChange={(e) => changeCurrency(e.target.value)}>
          {Object.entries(currencies).map(([code, curr]) => (
            <option key={code} value={code}>{curr.symbol} {code}</option>
          ))}
        </select>
        
        <ThemeToggle />
        
        <button className="btn btn-ghost" onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}