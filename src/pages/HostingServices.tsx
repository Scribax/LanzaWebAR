import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Server, 
  Globe, 
  Activity, 
  Settings, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Shield,
  Database,
  Mail,
  Folder,
  BarChart3,
  RefreshCw,
  Plus,
  Calendar
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'

interface HostingService {
  id: number
  domain: string
  plan_name: string
  status: 'creating' | 'active' | 'suspended' | 'cancelled'
  created_at: string
  expires_at?: string
  cpanel_url?: string
}

interface ServiceStats {
  diskUsage: number
  diskTotal: number
  bandwidth: number
  bandwidthTotal: number
  uptime: number
  lastBackup: string
}

const HostingServices: React.FC = () => {
  const { user, token } = useAuth()
  const [services, setServices] = useState<HostingService[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<HostingService | null>(null)
  const [serviceStats, setServiceStats] = useState<ServiceStats | null>(null)

  useEffect(() => {
    if (user && token) {
      fetchServices()
    }
  }, [user, token])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/hosting/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        // Filtrar solo los servicios pagados/activos
        const activeServices = data.orders
          ?.filter((order: any) => order.status === 'paid' || order.status === 'completed')
          .map((order: any) => ({
            id: order.id,
            domain: order.domain_name,
            plan_name: order.plan_id,
            status: 'active',
            created_at: order.created_at,
            cpanel_url: 'https://blue106.dnsmisitio.net:2083'
          })) || []
        
        setServices(activeServices)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-900/20'
      case 'creating':
        return 'text-yellow-400 bg-yellow-900/20'
      case 'suspended':
        return 'text-red-400 bg-red-900/20'
      case 'cancelled':
        return 'text-gray-400 bg-gray-900/20'
      default:
        return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'creating':
        return <Clock className="w-4 h-4" />
      case 'suspended':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const mockStats: ServiceStats = {
    diskUsage: 1.2,
    diskTotal: 5,
    bandwidth: 15.5,
    bandwidthTotal: 50,
    uptime: 99.9,
    lastBackup: '2024-01-14T10:30:00Z'
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-green-400 animate-spin mx-auto mb-4" />
              <p className="text-white">Cargando servicios...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Mis Servicios de Hosting
            </h1>
            <p className="text-gray-400">
              Gestiona y monitorea todos tus servicios de hosting
            </p>
          </div>
          <Link
            to="/hosting"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl hover:from-green-600 hover:to-cyan-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Contratar Hosting
          </Link>
        </div>

        {services.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <Server className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">
              No tienes servicios de hosting aún
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              ¡Comienza tu presencia en línea! Contrata tu primer plan de hosting y lanza tu sitio web al mundo.
            </p>
            <Link
              to="/hosting"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl hover:from-green-600 hover:to-cyan-600 transition-all font-semibold"
            >
              <Server className="w-5 h-5" />
              Contratar Mi Primer Hosting
            </Link>
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Services List */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 transition-all duration-200 cursor-pointer hover:border-green-500/30 hover:shadow-green-500/10 hover:shadow-lg ${
                      selectedService?.id === service.id ? 'border-green-500/50 shadow-green-500/20 shadow-lg' : ''
                    }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <Server className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            {service.domain}
                            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                          </h3>
                          <p className="text-gray-400 text-sm">Plan {service.plan_name}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                        {service.status === 'active' ? 'Activo' : 
                         service.status === 'creating' ? 'Configurando' :
                         service.status === 'suspended' ? 'Suspendido' : 'Inactivo'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-800/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Database className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300 text-xs">Almacenamiento</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                              style={{ width: `${(mockStats.diskUsage / mockStats.diskTotal) * 100}%` }}
                            />
                          </div>
                          <span className="text-white text-xs font-medium">
                            {mockStats.diskUsage}GB / {mockStats.diskTotal}GB
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-800/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart3 className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-300 text-xs">Transferencia</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${(mockStats.bandwidth / mockStats.bandwidthTotal) * 100}%` }}
                            />
                          </div>
                          <span className="text-white text-xs font-medium">
                            {mockStats.bandwidth}GB / {mockStats.bandwidthTotal}GB
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Activity className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">Uptime: </span>
                          <span className="text-green-400 font-medium">{mockStats.uptime}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">Creado: {formatDate(service.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {service.cpanel_url && (
                          <a
                            href={service.cpanel_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Abrir cPanel"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white" />
                          </a>
                        )}
                        <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                          <Settings className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Details Sidebar */}
            <div className="space-y-6">
              {selectedService ? (
                <>
                  {/* Service Info */}
                  <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-green-400" />
                      Detalles del Servicio
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dominio:</span>
                        <span className="text-white font-medium">{selectedService.domain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Plan:</span>
                        <span className="text-white">{selectedService.plan_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estado:</span>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedService.status)}`}>
                          {getStatusIcon(selectedService.status)}
                          {selectedService.status === 'active' ? 'Activo' : selectedService.status}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Creado:</span>
                        <span className="text-white">{formatDate(selectedService.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-cyan-400" />
                      Acciones Rápidas
                    </h3>
                    <div className="space-y-3">
                      {selectedService.cpanel_url && (
                        <a
                          href={selectedService.cpanel_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300">Abrir cPanel</span>
                        </a>
                      )}
                      <button className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left">
                        <Mail className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">Gestionar Emails</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left">
                        <Folder className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-300">Administrador de Archivos</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left">
                        <Shield className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-300">Configurar SSL</span>
                      </button>
                    </div>
                  </div>

                  {/* Support */}
                  <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">
                      ¿Necesitas ayuda?
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Nuestro equipo de soporte técnico está disponible 24/7 para ayudarte.
                    </p>
                    <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors">
                      Contactar Soporte
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center">
                  <Server className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">Selecciona un servicio</h3>
                  <p className="text-gray-400 text-sm">
                    Haz clic en cualquier servicio de la izquierda para ver sus detalles y opciones.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default HostingServices