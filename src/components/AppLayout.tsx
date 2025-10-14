import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LogOut, 
  Settings, 
  User, 
  Home,
  Server,
  CreditCard,
  Bell,
  Search
} from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    // Redirect to main domain login
    window.location.href = process.env.NODE_ENV === 'production' 
      ? 'https://lanzawebar.com/login'
      : 'http://localhost:5173/login'
  }

  const goToMainSite = () => {
    window.location.href = process.env.NODE_ENV === 'production' 
      ? 'https://lanzawebar.com'
      : 'http://localhost:5173'
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* App Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-6">
              <button 
                onClick={goToMainSite}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img 
                  src="/logo.png" 
                  alt="LanzaWeb AR" 
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <div className="text-lg font-bold gradient-text">LanzaWeb AR</div>
                  <div className="text-xs text-gray-400 -mt-1">Dashboard</div>
                </div>
              </button>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  to="/services" 
                  className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
                >
                  <Server className="w-4 h-4" />
                  Servicios
                </Link>
                <Link 
                  to="/billing" 
                  className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  Facturación
                </Link>
              </nav>
            </div>

            {/* Search and User Menu */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center gap-3 p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-sm font-medium">{user?.name}</div>
                    <div className="text-xs text-gray-400">{user?.email}</div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
                    >
                      <User className="w-4 h-4" />
                      Mi Perfil
                    </Link>
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      Configuración
                    </Link>
                    <hr className="my-2 border-gray-800" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* App Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              © 2024 LanzaWeb AR. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={goToMainSite}
                className="text-green-400 hover:text-green-300 text-sm transition-colors"
              >
                Ir al sitio principal
              </button>
              <a 
                href="mailto:soporte@lanzawebar.com" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Soporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout