import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { 
  Server, 
  Plus, 
  Activity, 
  Users, 
  Globe, 
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  BarChart3,
  Zap,
  Shield,
  HelpCircle
} from 'lucide-react'

interface Order {
  id: number
  plan_id: string
  domain_name: string
  total_amount: number
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  created_at: string
}

interface HostingService {
  id: number
  domain: string
  plan_name: string
  status: 'creating' | 'active' | 'suspended' | 'cancelled'
  created_at: string
  expires_at?: string
}

interface DashboardStats {
  totalServices: number
  activeServices: number
  totalSpent: number
  uptime: number
}

const Dashboard: React.FC = () => {
  const { user, token, loading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [services, setServices] = useState<HostingService[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    activeServices: 0,
    totalSpent: 0,
    uptime: 99.9
  })
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (user && token) {
      fetchUserData()
    }
  }, [user, token])

  const fetchUserData = async () => {
    try {
      setIsLoadingData(true)
      
      // Fetch orders
      const ordersResponse = await fetch('https://lanzawebar.com/api/hosting/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setOrders(ordersData.orders || [])
        
        // Calculate stats
        const totalSpent = ordersData.orders?.reduce((sum: number, order: Order) => 
          sum + (order.status === 'paid' ? order.total_amount : 0), 0) || 0
        
        const activeServices = ordersData.orders?.filter((order: Order) => 
          order.status === 'paid').length || 0
        
        setStats({
          totalServices: ordersData.orders?.length || 0,
          activeServices,
          totalSpent,
          uptime: 99.9
        })
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'active':
        return 'text-green-400 bg-green-900/20'
      case 'pending':
      case 'creating':
        return 'text-yellow-400 bg-yellow-900/20'
      case 'failed':
      case 'cancelled':
      case 'suspended':
        return 'text-red-400 bg-red-900/20'
      default:
        return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado'
      case 'pending': return 'Pendiente'
      case 'failed': return 'Fallido'
      case 'cancelled': return 'Cancelado'
      case 'active': return 'Activo'
      case 'creating': return 'Creando'
      case 'suspended': return 'Suspendido'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                ¡Bienvenido, {user.name}! 👋
              </h1>
              <p className="text-gray-400">
                Gestiona tus servicios de hosting desde tu panel de control
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors">
                <HelpCircle className="w-4 h-4" />
                Ayuda
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Server className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.totalServices}</span>
            </div>
            <h3 className="text-gray-300 font-medium mb-1">Servicios Totales</h3>
            <p className="text-gray-500 text-sm">Todos tus servicios</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/10 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.activeServices}</span>
            </div>
            <h3 className="text-gray-300 font-medium mb-1">Servicios Activos</h3>
            <p className="text-gray-500 text-sm">Funcionando correctamente</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-white">{formatCurrency(stats.totalSpent)}</span>
            </div>
            <h3 className="text-gray-300 font-medium mb-1">Gasto Total</h3>
            <p className="text-gray-500 text-sm">Inversión total</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-cyan-500/10 rounded-xl">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.uptime}%</span>
            </div>
            <h3 className="text-gray-300 font-medium mb-1">Uptime</h3>
            <p className="text-gray-500 text-sm">Disponibilidad promedio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                  Historial de Órdenes
                </h2>
                <button className="text-green-400 hover:text-green-300 transition-colors text-sm font-medium">
                  Ver todas
                </button>
              </div>

              {isLoadingData ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Cargando órdenes...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <Server className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{order.domain_name}</h3>
                          <p className="text-gray-400 text-sm">Plan {order.plan_id} • {formatDate(order.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium">{formatCurrency(order.total_amount)}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Server className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">No hay órdenes aún</h3>
                  <p className="text-gray-400 mb-6">¡Crea tu primer servicio de hosting!</p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl hover:from-green-600 hover:to-cyan-600 transition-all">
                    <Plus className="w-4 h-4" />
                    Contratar Hosting
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Acciones Rápidas
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left">
                  <Plus className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Contratar Hosting</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Configurar Dominio</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">Configurar SSL</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-300">Contactar Soporte</span>
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Información de Cuenta
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white text-sm">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Teléfono:</span>
                  <span className="text-white text-sm">{user.phone || 'No configurado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Miembro desde:</span>
                  <span className="text-white text-sm">
                    {user.created_at ? formatDate(user.created_at) : 'Hoy'}
                  </span>
                </div>
              </div>
              
              <button className="w-full mt-4 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-gray-300 text-sm">
                Actualizar Perfil
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" />
                Actividad Reciente
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-gray-300 text-sm">Cuenta creada exitosamente</p>
                    <p className="text-gray-500 text-xs">Hace unos minutos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-gray-300 text-sm">Perfil actualizado</p>
                    <p className="text-gray-500 text-xs">Hoy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Dashboard