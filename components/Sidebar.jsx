'use client'
import { Home, Search, Calendar, BarChart3, User, LogIn, UserPlus, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 min-h-full bg-base-100">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Navigation</h2>
        <ul className="menu">
          <li>
            <a href="/">
              <Home className="w-4 h-4" />
              Home
            </a>
          </li>
          <li>
            <a href="/search">
              <Search className="w-4 h-4" />
              Search Cars
            </a>
          </li>
          
          {user ? (
            <>
              <li>
                <a href="/bookings">
                  <Calendar className="w-4 h-4" />
                  My Bookings
                </a>
              </li>
              <li>
                <a href="/dashboard">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </a>
              </li>
              <div className="divider"></div>
              <li>
                <div className="flex items-center gap-2 px-4 py-2 text-sm">
                  <User className="w-4 h-4" />
                  {user.name || user.email}
                </div>
              </li>
              <li>
                <button onClick={logout} className="text-error">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <div className="divider"></div>
              <li>
                <a href="/login">
                  <LogIn className="w-4 h-4" />
                  Login
                </a>
              </li>
              <li>
                <a href="/register">
                  <UserPlus className="w-4 h-4" />
                  Register
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </aside>
  )
}