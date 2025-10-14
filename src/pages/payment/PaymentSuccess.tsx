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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando tu pago...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600 text-lg">
            Tu hosting se está configurando automáticamente
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-green-800 mb-4 flex items-center">
            <Server className="w-5 h-5 mr-2" />
            ¿Qué está pasando ahora?
          </h2>
          <div className="space-y-3 text-green-700">
            <div className="flex items-start">
              <div className="bg-green-200 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
              <span>Tu pago ha sido procesado correctamente</span>
            </div>
            <div className="flex items-start">
              <div className="bg-green-200 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
              <span>Se está creando tu cuenta de hosting automáticamente</span>
            </div>
            <div className="flex items-start">
              <div className="bg-green-200 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
              <span>Recibirás un email con todas las credenciales en breve</span>
            </div>
            <div className="flex items-start">
              <div className="bg-green-200 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
              <span>Tu sitio estará disponible en los próximos 5 minutos</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Revisa tu correo electrónico
          </h3>
          <p className="text-blue-700 mb-3">
            En los próximos minutos recibirás un email con:
          </p>
          <ul className="text-blue-700 space-y-1">
            <li>• URL de tu sitio web</li>
            <li>• Credenciales de acceso a cPanel</li>
            <li>• Usuario y contraseña</li>
            <li>• Instrucciones de configuración</li>
          </ul>
          <p className="text-sm text-blue-600 mt-3">
            💡 Revisa también tu carpeta de spam por si acaso
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Tiempo estimado
          </h3>
          <p className="text-amber-700">
            La configuración completa toma entre <strong>3-5 minutos</strong>. 
            Mientras tanto, puedes revisar nuestras guías de inicio rápido.
          </p>
        </div>

        {paymentInfo && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">Detalles del pago</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div><span className="font-medium">ID de pago:</span> {paymentInfo.id}</div>
              <div><span className="font-medium">Estado:</span> <span className="text-green-600 capitalize">{paymentInfo.status}</span></div>
              {paymentInfo.merchantOrder && (
                <div><span className="font-medium">Orden:</span> {paymentInfo.merchantOrder}</div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center"
          >
            Ir a mi Dashboard
          </Link>
          <Link
            to="/"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
          >
            Volver al inicio
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-gray-500 text-sm mb-2">¿Necesitas ayuda?</p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="mailto:soporte@lanzawebar.com" className="text-blue-500 hover:underline">
              Email: soporte@lanzawebar.com
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://wa.me/5491156177616" className="text-green-500 hover:underline flex items-center">
              WhatsApp: +54 9 11 5617-7616
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}