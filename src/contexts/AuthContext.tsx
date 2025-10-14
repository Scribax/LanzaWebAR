import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
  phone?: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE = 'https://lanzawebar.com/api'

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }
    setLoading(false)
  }, [])

  const clearError = () => setError(null)

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        setLoading(false)
        return true
      } else {
        setError(data.error || 'Error en el login')
        setLoading(false)
        return false
      }
    } catch (error) {
      setError('Error de conexión')
      setLoading(false)
      return false
    }
  }

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        setLoading(false)
        return true
      } else {
        setError(data.error || 'Error en el registro')
        setLoading(false)
        return false
      }
    } catch (error) {
      setError('Error de conexión')
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setError(null)
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
    clearError
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}