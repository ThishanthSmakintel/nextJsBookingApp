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
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('AuthContext: Initializing auth state')
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    console.log('AuthContext: Token exists:', !!token, 'User data exists:', !!userData)
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        console.log('AuthContext: Setting user:', parsedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('AuthContext: Error parsing user data:', error)
        clearSession()
      }
    }
    setIsLoading(false)
    console.log('AuthContext: Loading set to false')
  }, [])

  const login = (userData, token) => {
    console.log('AuthContext: Logging in user:', userData)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    clearSession()
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}