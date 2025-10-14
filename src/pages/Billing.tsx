import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AppLayout from '../components/AppLayout'
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
  ExternalLink
} from 'lucide-react'

interface Invoice {
  id: number
  invoice_number: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  due_date: string
  paid_date?: string | null
  description: string
  order_data?: any
}

interface BillingSummary {
  totalPaid: number
  totalPending: number
  totalInvoices: number
  year: number
}

interface PaymentMethod {
  id: number
  type: string
  display_name: string
  last_digits: string
  expiry: string | null
  is_primary: boolean
  icon: string
}

const Billing: React.FC = () => {
  const { user, token } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [summary, setSummary] = useState<BillingSummary | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && token) {
      loadBillingData()
    }
  }, [user, token])

  const loadBillingData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Cargar datos en paralelo
      const [summaryRes, invoicesRes, paymentMethodsRes] = await Promise.all([
        fetch('https://lanzawebar.com/api/billing/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://lanzawebar.com/api/billing/invoices', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://lanzawebar.com/api/billing/payment-methods', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (!summaryRes.ok || !invoicesRes.ok || !paymentMethodsRes.ok) {
        throw new Error('Error cargando datos de facturación')
      }

      const [summaryData, invoicesData, paymentMethodsData] = await Promise.all([
        summaryRes.json(),
        invoicesRes.json(),
        paymentMethodsRes.json()
      ])

      if (summaryData.success) setSummary(summaryData.summary)
      if (invoicesData.success) setInvoices(invoicesData.invoices)
      if (paymentMethodsData.success) setPaymentMethods(paymentMethodsData.paymentMethods)

    } catch (err) {
      console.error('Error cargando datos de facturación:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-900/20'
      case 'pending':
        return 'text-yellow-400 bg-yellow-900/20'
      case 'overdue':
        return 'text-red-400 bg-red-900/20'
      default:
        return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'mercadopago':
        return (
          <div className="w-12 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">MP</span>
          </div>
        )
      default:
        return (
          <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
        )
    }
  }

  const filteredInvoices = invoices.filter(invoice => 
    filter === 'all' || invoice.status === filter
  )

  if (loading && !summary) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando datos de facturación...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Error cargando facturación</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button 
              onClick={loadBillingData}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Facturación
          </h1>
          <p className="text-gray-400">
            Gestiona tus facturas y métodos de pago
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">
                {formatCurrency(summary?.totalPaid || 0)}
              </span>
            </div>
            <h3 className="text-gray-300 font-medium mb-1">Total Pagado</h3>
            <p className="text-gray-500 text-sm">Este año</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-white">
                {formatCurrency(summary?.totalPending || 0)}
              </span>
            </div>
            <h3 className="text-gray-300 font-medium mb-1">Pendiente</h3>
            <p className="text-gray-500 text-sm">Por pagar</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">
                {summary?.totalInvoices || 0}
              </span>
            </div>
            <h3 className="text-gray-300 font-medium mb-1">Total Facturas</h3>
            <p className="text-gray-500 text-sm">Este año</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-green-400" />
              Métodos de Pago
            </h2>
            
            {paymentMethods.length > 0 ? (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="bg-gray-800/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getPaymentMethodIcon(method.type)}
                        <div>
                          <p className="text-white font-medium">{method.display_name}</p>
                          <p className="text-gray-400 text-sm">
                            Método de pago principal
                          </p>
                        </div>
                      </div>
                      {method.is_primary && (
                        <span className="px-3 py-1 bg-green-900/20 text-green-400 text-xs rounded-full">
                          Principal
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No hay métodos de pago configurados</p>
              </div>
            )}
            
            <button className="text-green-400 hover:text-green-300 transition-colors text-sm font-medium mt-4">
              + Agregar método de pago
            </button>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              Historial de Facturas
            </h2>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Todas</option>
                  <option value="paid">Pagadas</option>
                  <option value="pending">Pendientes</option>
                  <option value="overdue">Vencidas</option>
                </select>
              </div>
            </div>
          </div>

          {filteredInvoices.length > 0 ? (
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{invoice.invoice_number}</h3>
                      <p className="text-gray-400 text-sm">{invoice.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-white font-medium">{formatCurrency(invoice.amount)}</p>
                      <p className="text-gray-400 text-sm">
                        {invoice.status === 'paid' && invoice.paid_date 
                          ? `Pagado: ${formatDate(invoice.paid_date)}`
                          : `Fecha: ${formatDate(invoice.due_date)}`
                        }
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status === 'paid' ? 'Pagada' :
                         invoice.status === 'pending' ? 'Pendiente' : 'Vencida'}
                      </span>
                      
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" title="Ver detalles">
                        <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">No hay facturas</h3>
              <p className="text-gray-400">
                {filter === 'all' ? 'Aún no tienes facturas generadas' : `No hay facturas ${filter}`}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Las facturas aparecerán aquí cuando contrates servicios de hosting
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default Billing
