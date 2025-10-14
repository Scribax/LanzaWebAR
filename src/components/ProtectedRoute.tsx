import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-green-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Guardar la ubicación actual para redirigir después del login
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return <>{children}</>
}