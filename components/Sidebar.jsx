'use client'
import Link from 'next/link'
import { Home, Search, Calendar, BarChart3, User, LogIn, UserPlus, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 min-h-full bg-base-100">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Navigation</h2>
        <ul className="menu">
          {!user ? (
            <>
              <li>
                <Link href="/">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search">
                  <Search className="w-4 h-4" />
                  Search Cars
                </Link>
              </li>
              <div className="divider"></div>
              <li>
                <Link href="/login">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </li>
            </>
          ) : (user.role === 'CUSTOMER' || user.role === 'customer') ? (
            <>
              <li>
                <Link href="/customer-dashboard">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/search">
                  <Search className="w-4 h-4" />
                  Book a Car
                </Link>
              </li>
              <li>
                <Link href="/bookings">
                  <Calendar className="w-4 h-4" />
                  My Bookings
                </Link>
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
              <li>
                <Link href="/dashboard">
                  <BarChart3 className="w-4 h-4" />
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link href="/">
                  <Home className="w-4 h-4" />
                  Public Site
                </Link>
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
          )}
        </ul>
      </div>
    </aside>
  )
}