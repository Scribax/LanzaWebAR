import React, { useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { User, LogOut, Settings, Package, ChevronDown, Bell, Plus, Server } from 'lucide-react'
import useSectionSpy from '../hooks/useSectionSpy'
import { useAuth } from '../contexts/AuthContext'

const Navbar: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const userMenuRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setUserMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Cerrar dropdown del usuario al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  const location = useLocation()
  const isHome = location.pathname === '/'
  const active = isHome ? useSectionSpy(['services', 'projects', 'testimonials', 'contact']) : ''

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            <img src="/logo.png" alt="LanzaWebAR" className="h-7 w-7 rounded-full" />
            <span className="gradient-text">LanzaWebAR</span>
          </Link>
          
          <nav aria-label="Principal" className="hidden gap-8 text-sm text-neutral-300 md:flex">
            <Link to={{ pathname: '/', hash: '#services' }} className={`hover:text-white transition-colors ${active==='services' ? 'text-white' : ''}`}>Servicios</Link>
            <Link to="/hosting" className={`hover:text-white transition-colors ${location.pathname === '/hosting' ? 'text-white' : ''}`}>Hosting</Link>
            <Link to="/precios" className={`hover:text-white transition-colors ${location.pathname === '/precios' ? 'text-white' : ''}`}>Precios</Link>
            <Link to={{ pathname: '/', hash: '#projects' }} className={`hover:text-white transition-colors ${active==='projects' ? 'text-white' : ''}`}>Proyectos</Link>
            <Link to={{ pathname: '/', hash: '#testimonials' }} className={`hover:text-white transition-colors ${active==='testimonials' ? 'text-white' : ''}`}>Testimonios</Link>
            <Link to={{ pathname: '/', hash: '#contact' }} className={`hover:text-white transition-colors ${active==='contact' ? 'text-white' : ''}`}>Contacto</Link>
          </nav>

          {/* Authentication Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-neutral-300 hover:text-white transition-colors rounded-md hover:bg-neutral-800/50">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full text-xs flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  </span>
                </button>

                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 text-neutral-300 hover:text-white transition-colors rounded-md hover:bg-neutral-800/50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          <span>Panel de Control</span>
                        </Link>
                        
                        <Link
                          to="/services"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                        >
                          <Server className="w-4 h-4" />
                          <span>Mis Servicios</span>
                        </Link>
                        
                        <Link
                          to="/hosting"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Contratar Hosting</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Configuración</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-800 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-neutral-300 hover:text-white transition-colors text-sm"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-md bg-gradient-to-r from-green-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-green-600 hover:to-cyan-600 transition-all"
                >
                  Crear Cuenta
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md border border-neutral-800 p-2 text-neutral-300 hover:bg-neutral-900 md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Panel */}
      <div
        className={`md:hidden fixed top-16 inset-x-0 z-50 origin-top border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-xl transition-transform duration-200 ${
          open ? 'scale-y-100' : 'scale-y-0'
        }`}
      >
        <nav aria-label="Móvil" className="mx-auto max-w-6xl px-4 py-4 text-sm text-neutral-300">
          <div className="grid gap-3">
            <Link onClick={() => setOpen(false)} to={{ pathname: '/', hash: '#services' }} className={`rounded-md px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors ${active==='services' ? 'text-white bg-neutral-800' : ''}`}>Servicios</Link>
            <Link onClick={() => setOpen(false)} to="/hosting" className={`rounded-md px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors ${location.pathname === '/hosting' ? 'text-white bg-neutral-800' : ''}`}>Hosting</Link>
            <Link onClick={() => setOpen(false)} to="/precios" className={`rounded-md px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors ${location.pathname === '/precios' ? 'text-white bg-neutral-800' : ''}`}>Precios</Link>
            <Link onClick={() => setOpen(false)} to={{ pathname: '/', hash: '#projects' }} className={`rounded-md px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors ${active==='projects' ? 'text-white bg-neutral-800' : ''}`}>Proyectos</Link>
            <Link onClick={() => setOpen(false)} to={{ pathname: '/', hash: '#testimonials' }} className={`rounded-md px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors ${active==='testimonials' ? 'text-white bg-neutral-800' : ''}`}>Testimonios</Link>
            <Link onClick={() => setOpen(false)} to={{ pathname: '/', hash: '#contact' }} className={`rounded-md px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors ${active==='contact' ? 'text-white bg-neutral-800' : ''}`}>Contacto</Link>
            
            {user ? (
              <>
                <hr className="border-neutral-800 my-2" />
                <Link onClick={() => setOpen(false)} to="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors">
                  <Package className="w-4 h-4" />
                  Panel de Control
                </Link>
                <Link onClick={() => setOpen(false)} to="/services" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors">
                  <Server className="w-4 h-4" />
                  Mis Servicios
                </Link>
                <Link onClick={() => setOpen(false)} to="/settings" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                  Configuración
                </Link>
                <button onClick={() => { handleLogout(); setOpen(false) }} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-red-900/20 hover:text-red-300 text-red-400 transition-colors w-full text-left">
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <hr className="border-neutral-800 my-2" />
                <Link onClick={() => setOpen(false)} to="/login" className="rounded-md px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors block">Iniciar Sesión</Link>
                <Link onClick={() => setOpen(false)} to="/register" className="rounded-md px-3 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-medium transition-all block text-center">Crear Cuenta</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
