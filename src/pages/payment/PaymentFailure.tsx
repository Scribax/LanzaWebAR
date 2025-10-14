import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { XCircle, AlertCircle, CreditCard, RefreshCw, ExternalLink } from 'lucide-react'

export default function PaymentFailure() {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-neutral-300">Verificando información del pago...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Animated gradient blobs background - more red/orange tones for error state */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-gradient-to-tr from-red-500/15 via-orange-500/10 to-yellow-500/10" />
        <div className="blob absolute right-[-10%] top-[20%] h-72 w-72 rounded-full bg-gradient-to-tr from-orange-500/10 via-red-500/10 to-pink-500/10 [animation-delay:1.5s]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(239,68,68,0.04)_0%,rgba(10,10,10,0)_60%)]" />
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 ring-1 ring-neutral-700/50">
          <div className="text-center mb-8">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-extrabold mb-2">
              <span className="text-red-400">Pago No Completado</span>
            </h1>
            <p className="text-neutral-300 text-lg">
              Tu pago no pudo ser procesado en este momento
            </p>
          </div>

          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-white mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
              ¿Qué puede haber pasado?
            </h2>
            <div className="space-y-3 text-neutral-300">
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <span>El pago fue cancelado por el usuario</span>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <span>Problemas con la tarjeta de crédito o débito</span>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <span>Fondos insuficientes en la cuenta</span>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <span>Error temporal en el procesamiento</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-sky-400" />
              ¿Qué puedes hacer?
            </h3>
            <div className="text-neutral-300 space-y-2">
              <p>• <strong className="text-white">Intentar nuevamente:</strong> Muchas veces es un error temporal</p>
              <p>• <strong className="text-white">Verificar los datos:</strong> Asegúrate de que toda la información sea correcta</p>
              <p>• <strong className="text-white">Contactar a tu banco:</strong> Por si hay restricciones en tu tarjeta</p>
              <p>• <strong className="text-white">Probar otro método de pago:</strong> Tarjeta diferente o medios alternativos</p>
            </div>
          </div>

          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-white mb-3">
              💡 Tip: No se realizó ningún cargo
            </h3>
            <p className="text-neutral-300">
              Como el pago no se completó, no se efectuó ningún cargo a tu tarjeta. 
              Puedes intentar nuevamente sin preocuparte por cobros duplicados.
            </p>
          </div>

          {paymentInfo && (
            <div className="bg-neutral-800/40 border border-neutral-700 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-white mb-3">Información de la transacción</h3>
              <div className="text-sm text-neutral-300 space-y-1">
                {paymentInfo.id && (
                  <div><span className="font-medium text-white">ID de pago:</span> {paymentInfo.id}</div>
                )}
                <div><span className="font-medium text-white">Estado:</span> <span className="text-red-400 capitalize">Fallido</span></div>
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
            <Link
              to="/hosting"
              className="btn-gradient"
            >
              <span className="flex items-center justify-center">
                <RefreshCw className="w-5 h-5 mr-2" />
                Intentar Nuevamente
              </span>
            </Link>
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
            <p className="text-neutral-400 text-sm mb-2">¿Necesitas ayuda con tu pago?</p>
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
              Nuestro equipo de soporte está disponible para ayudarte con cualquier problema de pago
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
