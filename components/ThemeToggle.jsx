'use client'
import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const themeContext = useTheme()
  
  if (!themeContext) {
    return null
  }
  
  const { theme, toggleTheme } = themeContext

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  )
}