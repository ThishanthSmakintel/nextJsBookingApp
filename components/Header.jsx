'use client'
import Link from 'next/link'
import { Car, Search, LogIn, LogOut, Menu, User } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'

export default function Header() {
  const { user, isLoading, logout } = useAuth()
  const { t } = useLocale()

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
        <Link href="/" id="logo" className="btn btn-ghost text-xl" prefetch={true}>
          <Car className="w-6 h-6 mr-2" />
          CarBook
        </Link>
      </div>
      
      <div className="flex-none gap-2">
        <ThemeToggle />
        
        {user ? (
          <button onClick={logout} className="btn btn-ghost">
            <LogOut className="w-4 h-4 mr-1" />
            {t('logout')}
          </button>
        ) : (
          <Link href="/login" id="login-btn" className="btn btn-ghost" prefetch={true}>
            <LogIn className="w-4 h-4 mr-1" />
            {t('login')}
          </Link>
        )}
      </div>
    </div>
  )
}