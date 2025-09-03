'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { clearSession } from '@/lib/session'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      if (token && userData) {
        try {
          return JSON.parse(userData)
        } catch (error) {
          clearSession()
          return null
        }
      }
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Auth state is already initialized synchronously
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    clearSession()
    setUser(null)
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}