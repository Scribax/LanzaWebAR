import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { RegisterForm } from '../components/auth/RegisterForm'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const Register: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Si el usuario ya está logueado, redirigir al dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSuccess = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-white hover:text-green-400 transition-all duration-200 group cursor-pointer select-none"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="p-2 bg-gray-800/50 rounded-xl group-hover:bg-gray-800 group-hover:shadow-lg transition-all duration-200">
              <ArrowLeft className="w-5 h-5 group-hover:text-green-400 transition-colors duration-200" />
            </div>
            <span className="text-sm font-medium group-hover:text-green-400 transition-colors duration-200">Volver al inicio</span>
          </Link>
          
          <Link 
            to="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <img src="/logo.png" alt="LanzaWebAR" className="h-8 w-8 rounded-full" />
            <span className="text-xl font-bold gradient-text">LanzaWebAR</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <RegisterForm onSuccess={handleSuccess} />
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 LanzaWebAR. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Register