import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, Server, Mail, Clock, ExternalLink } from 'lucide-react'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const merchantOrder = searchParams.get('merchant_order_id')

  useEffect(() => {
    // Simular carga de información del pago
    setTimeout(() => {
      setPaymentInfo({
        id: paymentId,
        status,
        merchantOrder
      })
      setLoading(false)
    }, 1500)
  }, [paymentId, status, merchantOrder])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-neutral-300">Procesando tu pago...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Animated gradient blobs background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-500/20 via-cyan-500/15 to-sky-500/15" />
        <div className="blob absolute right-[-10%] top-[20%] h-72 w-72 rounded-full bg-gradient-to-tr from-sky-500/15 via-emerald-500/15 to-cyan-500/15 [animation-delay:1.5s]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(6,182,212,0.08)_0%,rgba(10,10,10,0)_60%)]" />
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 ring-1 ring-neutral-700/50">
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-3xl font-extrabold mb-2">
              🎉 ¡<span className="gradient-text">Pago Exitoso</span>!
            </h1>
            <p className="text-neutral-300 text-lg">
              Tu hosting se está configurando automáticamente
            </p>
          </div>

          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-white mb-4 flex items-center">
              <Server className="w-5 h-5 mr-2 text-emerald-500" />
              ¿Qué está pasando ahora?
            </h2>
            <div className="space-y-3 text-neutral-300">
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <span>Tu pago ha sido procesado correctamente</span>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <span>Se está creando tu cuenta de hosting automáticamente</span>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <span>Recibirás un email con todas las credenciales en breve</span>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <span>Tu sitio estará disponible en los próximos 5 minutos</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-cyan-500" />
              Revisa tu correo electrónico
            </h3>
            <p className="text-neutral-300 mb-3">
              En los próximos minutos recibirás un email con:
            </p>
            <ul className="text-neutral-300 space-y-1">
              <li>• URL de tu sitio web</li>
              <li>• Credenciales de acceso a cPanel</li>
              <li>• Usuario y contraseña</li>
              <li>• Instrucciones de configuración</li>
            </ul>
            <p className="text-sm text-neutral-400 mt-3">
              💡 Revisa también tu carpeta de spam por si acaso
            </p>
          </div>

          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-sky-500" />
              Tiempo estimado
            </h3>
            <p className="text-neutral-300">
              La configuración completa toma entre <strong className="text-white">3-5 minutos</strong>. 
              Mientras tanto, puedes revisar nuestras guías de inicio rápido.
            </p>
          </div>

          {paymentInfo && (
            <div className="bg-neutral-800/40 border border-neutral-700 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-white mb-3">Detalles del pago</h3>
              <div className="text-sm text-neutral-300 space-y-1">
                <div><span className="font-medium text-white">ID de pago:</span> {paymentInfo.id}</div>
                <div><span className="font-medium text-white">Estado:</span> <span className="text-emerald-400 capitalize">{paymentInfo.status}</span></div>
                {paymentInfo.merchantOrder && (
                  <div><span className="font-medium text-white">Orden:</span> {paymentInfo.merchantOrder}</div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="btn-gradient"
            >
              <span>Ir a mi Dashboard</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-700 text-center">
            <p className="text-neutral-400 text-sm mb-2">¿Necesitas ayuda?</p>
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
          </div>
        </div>
      </div>
    </div>
  )
}
