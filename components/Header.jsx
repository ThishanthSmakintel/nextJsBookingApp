'use client'
import { Car, Search, LogIn, LogOut, Menu, User } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="navbar bg-primary text-primary-content shadow-lg">
        <div className="flex-1">
          <a href="/" className="btn btn-ghost text-xl">
            <Car className="w-6 h-6 mr-2" />
            CarBook
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="navbar bg-primary text-primary-content shadow-lg">
      {user && (
        <div className="flex-none">
          <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
            <Menu className="w-6 h-6" />
          </label>
        </div>
      )}
      
      <div className="flex-1">
        <a href="/" id="logo" className="btn btn-ghost text-xl">
          <Car className="w-6 h-6 mr-2" />
          CarBook
        </a>
      </div>
      
      <div className="flex-none gap-2">
        <ThemeToggle />
        
        {user ? (
          <button onClick={logout} className="btn btn-ghost">
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </button>
        ) : (
          <a href="/login" id="login-btn" className="btn btn-ghost">
            <LogIn className="w-4 h-4 mr-1" />
            Login
          </a>
        )}
      </div>
    </div>
  )
}