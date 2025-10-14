import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Clock, AlertTriangle, CreditCard, Mail, RefreshCw, ExternalLink } from 'lucide-react'

export default function PaymentPending() {
  const [searchParams] = useSearchParams()
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const merchantOrder = searchParams.get('merchant_order_id')
  const externalReference = searchParams.get('external_reference')

  useEffect(() => {
    // Simular carga de información del pago
    setTimeout(() => {
      setPaymentInfo({
        id: paymentId,
        status,
        merchantOrder,
        externalReference
      })
      setLoading(false)
    }, 1000)
  }, [paymentId, status, merchantOrder, externalReference])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-neutral-300">Verificando estado del pago...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Animated gradient blobs background - yellow/orange tones for pending state */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-gradient-to-tr from-yellow-500/15 via-amber-500/10 to-orange-500/10" />
        <div className="blob absolute right-[-10%] top-[20%] h-72 w-72 rounded-full bg-gradient-to-tr from-amber-500/10 via-yellow-500/10 to-emerald-500/10 [animation-delay:1.5s]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(245,158,11,0.04)_0%,rgba(10,10,10,0)_60%)]" />
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 ring-1 ring-neutral-700/50">
          <div className="text-center mb-8">
            <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-3xl font-extrabold mb-2">
              ⏳ <span className="text-yellow-400">Pago Pendiente</span>
            </h1>
            <p className="text-neutral-300 text-lg">
              Tu pago está siendo procesado
            </p>
          </div>

          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-white mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              ¿Qué significa "pendiente"?
            </h2>
            <div className="space-y-3 text-neutral-300">
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <span>El pago fue iniciado pero requiere confirmación adicional</span>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <span>Tu banco o entidad financiera está validando la transacción</span>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <span>Puede requerir autenticación 3D Secure o similar</span>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <span>El proceso puede tomar desde minutos hasta 24 horas</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-cyan-400" />
              Te mantendremos informado
            </h3>
            <div className="text-neutral-300 space-y-2">
              <p>• <strong className="text-white">Email de confirmación:</strong> Te avisaremos cuando el pago sea aprobado</p>
              <p>• <strong className="text-white">SMS (si aplicable):</strong> Notificación instantánea del resultado</p>
              <p>• <strong className="text-white">Dashboard actualizado:</strong> Podrás ver el estado en tiempo real</p>
            </div>
          </div>

          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-emerald-400" />
              ¿Qué pasa mientras tanto?
            </h3>
            <div className="text-neutral-300 space-y-2">
              <p>• <strong className="text-white">Tu orden está reservada:</strong> No perderás tu lugar</p>
              <p>• <strong className="text-white">Preparación del servicio:</strong> Ya comenzamos a preparar tu hosting</p>
              <p>• <strong className="text-white">Sin cargos duplicados:</strong> El pago solo se procesará una vez</p>
              <p>• <strong className="text-white">Soporte disponible:</strong> Nuestro equipo está listo para ayudarte</p>
            </div>
          </div>

          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-white mb-3">
              🕐 Tiempos estimados
            </h3>
            <div className="text-neutral-300">
              <p className="mb-2"><strong className="text-white">Tarjetas de crédito:</strong> 5-30 minutos</p>
              <p className="mb-2"><strong className="text-white">Débito automático:</strong> 1-2 horas</p>
              <p className="mb-2"><strong className="text-white">Transferencia bancaria:</strong> 2-24 horas</p>
              <p className="text-sm mt-3 text-neutral-400">
                * Los tiempos pueden variar según tu banco y el método de pago utilizado
              </p>
            </div>
          </div>

          {paymentInfo && (
            <div className="bg-neutral-800/40 border border-neutral-700 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-white mb-3">Información de la transacción</h3>
              <div className="text-sm text-neutral-300 space-y-1">
                {paymentInfo.id && (
                  <div><span className="font-medium text-white">ID de pago:</span> {paymentInfo.id}</div>
                )}
                <div><span className="font-medium text-white">Estado:</span> <span className="text-yellow-400 capitalize">Pendiente</span></div>
                {paymentInfo.externalReference && (
                  <div><span className="font-medium text-white">Referencia:</span> {paymentInfo.externalReference}</div>
                )}
                {paymentInfo.merchantOrder && (
                  <div><span className="font-medium text-white">Orden:</span> {paymentInfo.merchantOrder}</div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn-gradient"
            >
              <span className="flex items-center justify-center">
                <RefreshCw className="w-5 h-5 mr-2" />
                Actualizar Estado
              </span>
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors"
            >
              Ir a Dashboard
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-700 text-center">
            <p className="text-neutral-400 text-sm mb-2">¿Tienes dudas sobre tu pago pendiente?</p>
            <div className="flex justify-center space-x-4 text-sm">
              <a href="mailto:soporte@lanzawebar.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Email: soporte@lanzawebar.com
              </a>
              <span className="text-neutral-600">|</span>
              <a href="https://wa.me/5491156177616" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center">
                WhatsApp: +54 9 11 5617-7616
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Te ayudamos a resolver cualquier duda sobre el estado de tu pago
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
