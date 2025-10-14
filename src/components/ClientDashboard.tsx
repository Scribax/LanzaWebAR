import React, { useState, useEffect } from 'react'
import { 
  ServerIcon, 
  DocumentTextIcon, 
  CreditCardIcon, 
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { 
  PlayIcon, 
  StopIcon, 
  ArrowPathIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/solid'
import type { HostingService, Invoice } from '../types/hosting'

interface ClientDashboardProps {
  clientEmail: string
}

// Mock data - En producción esto vendría de tu API
const mockHostingServices: HostingService[] = [
  {
    id: '1',
    orderId: 'ord_123',
    planName: 'Business',
    domain: 'miempresa.com',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2025-01-15'),
    cpanelUrl: 'https://cpanel.miempresa.com',
    cpanelUsername: 'miempresa',
    ftpCredentials: {
      host: 'ftp.miempresa.com',
      username: 'miempresa',
      password: 'encrypted_password'
    },
    specs: {
      storage: '50 GB SSD',
      bandwidth: '500 GB',
      databases: '25',
      emails: '25',
      domains: '5',
      ssl: true,
      backup: true,
      support: '24/7'
    }
  }
]

const mockInvoices: Invoice[] = [
  {
    id: 'inv_001',
    orderId: 'ord_123',
    amount: 239.88,
    status: 'paid',
    dueDate: new Date('2024-01-15'),
    paidAt: new Date('2024-01-10'),
    paymentMethod: 'MercadoPago',
    downloadUrl: '/invoices/inv_001.pdf'
  },
  {
    id: 'inv_002',
    orderId: 'ord_123',
    amount: 19.99,
    status: 'pending',
    dueDate: new Date('2024-12-15'),
    paymentMethod: 'MercadoPago'
  }
]

export default function ClientDashboard({ clientEmail }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'invoices' | 'support'>('overview')
  const [hostingServices, setHostingServices] = useState<HostingService[]>(mockHostingServices)
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [loading, setLoading] = useState(false)
  const [showCredentials, setShowCredentials] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    // Aquí cargarías los datos reales desde tu API
    // fetchClientData(clientEmail)
  }, [clientEmail])

  const handleServiceAction = async (serviceId: string, action: 'start' | 'stop' | 'restart') => {
    setLoading(true)
    try {
      // Aquí llamarías a tu API para realizar la acción
      console.log(`Performing ${action} on service ${serviceId}`)
      
      // Simular actualización del estado
      setTimeout(() => {
        setLoading(false)
        // Actualizar el estado del servicio
      }, 2000)
    } catch (error) {
      console.error('Error performing service action:', error)
      setLoading(false)
    }
  }

  const toggleCredentials = (serviceId: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, text: 'Activo' },
      suspended: { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon, text: 'Suspendido' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: StopIcon, text: 'Cancelado' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    )
  }

  const getInvoiceStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', text: 'Pagada' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      overdue: { color: 'bg-red-100 text-red-800', text: 'Vencida' },
      cancelled: { color: 'bg-gray-100 text-gray-800', text: 'Cancelada' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const calculateUsagePercentage = (used: string, total: string) => {
    // Esta función calcularía el porcentaje real basado en los datos del servidor
    return Math.floor(Math.random() * 70) + 10 // Mock data
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-neutral-950 text-white rounded-xl border border-neutral-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Panel de Cliente</h1>
        <p className="text-neutral-300">Gestiona tus servicios de hosting y dominios</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Resumen', icon: ChartBarIcon },
            { id: 'services', name: 'Mis Hostings', icon: ServerIcon },
            { id: 'invoices', name: 'Facturas', icon: DocumentTextIcon },
            { id: 'support', name: 'Soporte', icon: Cog6ToothIcon }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`mr-2 h-5 w-5 ${
                  activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ServerIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Servicios Activos</p>
                  <p className="text-2xl font-semibold text-gray-900">{hostingServices.filter(s => s.status === 'active').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Facturas Pendientes</p>
                  <p className="text-2xl font-semibold text-gray-900">{invoices.filter(i => i.status === 'pending').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GlobeAltIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Dominios</p>
                  <p className="text-2xl font-semibold text-gray-900">{hostingServices.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  <li className="relative pb-8">
                    <div className="relative flex space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 ring-8 ring-white">
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="text-sm text-gray-500">
                            Hosting <span className="font-medium text-gray-900">miempresa.com</span> fue activado
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">Hace 2 días</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="relative pb-8">
                    <div className="relative flex space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 ring-8 ring-white">
                        <CreditCardIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="text-sm text-gray-500">
                            Factura <span className="font-medium text-gray-900">#INV-001</span> fue pagada
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">Hace 5 días</p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {hostingServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{service.domain}</h3>
                      <p className="text-sm text-gray-500">Plan {service.planName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(service.status)}
                    <div className="text-sm text-gray-500">
                      Expira: {service.expiresAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Service Actions */}
                <div className="flex items-center space-x-3 mb-6">
                  <button
                    onClick={() => handleServiceAction(service.id, 'restart')}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                    Reiniciar
                  </button>
                  
                  {service.cpanelUrl && (
                    <a
                      href={service.cpanelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-1" />
                      cPanel
                    </a>
                  )}
                  
                  <button
                    onClick={() => toggleCredentials(service.id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {showCredentials[service.id] ? 'Ocultar' : 'Ver'} Credenciales
                  </button>
                </div>

                {/* Service Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{service.specs.storage}</p>
                    <p className="text-xs text-gray-500">Almacenamiento</p>
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${calculateUsagePercentage('used', service.specs.storage)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{service.specs.bandwidth}</p>
                    <p className="text-xs text-gray-500">Transferencia</p>
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${calculateUsagePercentage('used', service.specs.bandwidth)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{service.specs.emails}</p>
                    <p className="text-xs text-gray-500">Cuentas Email</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{service.specs.databases}</p>
                    <p className="text-xs text-gray-500">Bases de Datos</p>
                  </div>
                </div>

                {/* Credentials Panel */}
                {showCredentials[service.id] && service.ftpCredentials && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-3">Credenciales de Acceso</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-yellow-800">FTP/SFTP:</p>
                        <p className="text-yellow-700">Host: {service.ftpCredentials.host}</p>
                        <p className="text-yellow-700">Usuario: {service.ftpCredentials.username}</p>
                        <p className="text-yellow-700">Contraseña: ••••••••</p>
                      </div>
                      {service.cpanelUsername && (
                        <div>
                          <p className="font-medium text-yellow-800">cPanel:</p>
                          <p className="text-yellow-700">URL: {service.cpanelUrl}</p>
                          <p className="text-yellow-700">Usuario: {service.cpanelUsername}</p>
                          <p className="text-yellow-700">Contraseña: ••••••••</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-xs text-yellow-600">
                      <ShieldCheckIcon className="inline h-4 w-4 mr-1" />
                      Las credenciales completas fueron enviadas a tu email de registro.
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Historial de Facturas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getInvoiceStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.dueDate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {invoice.status === 'pending' && (
                          <button className="text-blue-600 hover:text-blue-900">
                            Pagar
                          </button>
                        )}
                        {invoice.downloadUrl && (
                          <a
                            href={invoice.downloadUrl}
                            className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                            Descargar
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Support Tab */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Centro de Ayuda</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contactar Soporte</h4>
                <div className="space-y-3">
                  <a 
                    href="mailto:soporte@lanzawebar.com"
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-xs text-gray-500">soporte@lanzawebar.com</p>
                    </div>
                  </a>
                  
                  <a 
                    href="https://wa.me/1234567890"
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <CreditCardIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                      <p className="text-xs text-gray-500">Respuesta en menos de 1 hora</p>
                    </div>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recursos Útiles</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                    → Cómo configurar mi dominio
                  </a>
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                    → Crear cuentas de email
                  </a>
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                    → Configurar FTP
                  </a>
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                    → Base de conocimiento completa
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}